import { getImportHelper } from "./helpers.js";
import { handleJSXVisitor, transformComponent } from "./visitor.js";

export default function (babel) {
  const { types: t } = babel;

  return {
    name: "web-compiler",
    visitor: {
      Program: {
        enter(p, state) {
          state.runtimeSource = state.opts.runtimeSource || "@opentf/web";
          state.importsNeeded = new Map();
          state.importSources = new Map();
          state.components = new Map();
          state.macroSignals = new Set();
          state.wrapperSignals = new Set();
          state.refVars = new Set();

          const filename = state.filename || "";
          const pagePatterns = ["page.jsx", "page.tsx", "layout.jsx", "layout.tsx", "404.jsx", "404.tsx"];
          state.isPageFile = pagePatterns.some(p => filename.endsWith(p));
        },
        exit(p, state) {
          state.components.forEach((info, name) => {
            const isRenderFn = state.isPageFile && info.isDefault;
            transformComponent(info.path, name, isRenderFn, t, state);
          });
        }
      },

      VariableDeclarator(path, state) {
        if (!t.isIdentifier(path.node.id) || !/^[A-Z]/.test(path.node.id.name)) return;
        const name = path.node.id.name;

        let hasJSX = false;
        path.traverse({
          JSXElement() { hasJSX = true; },
          JSXFragment() { hasJSX = true; }
        });

        if (hasJSX) {
          state.components.set(name, { path, isDefault: false });
        }
      },

      FunctionDeclaration(path, state) {
        if (!path.node.id) return;
        const name = path.node.id.name;
        if (/^[A-Z]/.test(name)) {
          let hasJSX = false;
          path.traverse({
            JSXElement() { hasJSX = true; },
            JSXFragment() { hasJSX = true; }
          });

          if (!hasJSX) return;

          const propsNode = path.node.params[0];
          const observedAttributes = new Set();

          if (t.isObjectPattern(propsNode)) {
            propsNode.properties.forEach(prop => {
              if (t.isObjectProperty(prop) && t.isIdentifier(prop.key) && !prop.key.name.startsWith("on")) {
                observedAttributes.add(prop.key.name);
              }
            });
          }

          if (state.components.has(name)) {
            const info = state.components.get(name);
            info.observedAttributes = observedAttributes;
            info.path = path;
          } else {
            state.components.set(name, { path, isDefault: false, observedAttributes });
          }
        }
      },

      ExportDefaultDeclaration(path, state) {
        const decl = path.node.declaration;
        if (t.isFunctionDeclaration(decl)) {
          let hasJSX = false;
          path.traverse({
            JSXElement() { hasJSX = true; },
            JSXFragment() { hasJSX = true; }
          });

          if (!hasJSX) return;

          if (decl.id) {
            const name = decl.id.name;
            if (state.components.has(name)) {
              state.components.get(name).isDefault = true;
            } else {
              state.components.set(name, { path: path.get("declaration"), isDefault: true });
            }
          } else {
            state.components.set("_default", { path: path.get("declaration"), isDefault: true });
          }
        } else if (t.isIdentifier(decl)) {
          const name = decl.name;
          if (state.components.has(name)) {
            state.components.get(name).isDefault = true;
          }
        }
      },

      ImportDeclaration(path, state) {
        const source = path.node.source.value;
        path.node.specifiers.forEach(spec => {
          if (t.isImportDefaultSpecifier(spec) || t.isImportSpecifier(spec)) {
            state.importSources.set(spec.local.name, source);
          }
        });
      },

      CallExpression(path, state) {
        if (t.isIdentifier(path.node.callee)) {
          const name = path.node.callee.name;
          const getImport = getImportHelper(t, path, state);

          if (name === "$state" || name === "$derived" || name === "$ref") {
            const parent = path.findParent(p => p.isVariableDeclarator());
            if (parent && t.isIdentifier(parent.node.id)) {
              state.macroSignals.add(parent.node.id.name);
            }
            if (name === "$state") {
              path.get("callee").replaceWith(getImport("signal", state.runtimeSource));
            } else if (name === "$derived") {
              path.get("callee").replaceWith(getImport("computed", state.runtimeSource));
              const arg = path.node.arguments[0];
              if (arg && !t.isArrowFunctionExpression(arg) && !t.isFunctionExpression(arg)) {
                path.node.arguments[0] = t.arrowFunctionExpression([], arg);
              }
            } else if (name === "$ref") {
              const parent = path.findParent(p => p.isVariableDeclarator());
              if (parent && t.isIdentifier(parent.node.id)) {
                state.refVars.add(parent.node.id.name);
                state.macroSignals.add(parent.node.id.name);
              }
              path.get("callee").replaceWith(getImport("signal", state.runtimeSource));
            }
          } else if (name === "$effect") {
            const effectId = getImport("hookEffect", state.runtimeSource);
            const isSSGId = getImport("isSSG", state.runtimeSource);
            const parent = path.parentPath;
            const effectCall = t.callExpression(effectId, path.node.arguments);
            
            if (parent.isExpressionStatement()) {
              parent.replaceWith(
                t.ifStatement(
                  t.unaryExpression("!", isSSGId),
                  t.expressionStatement(effectCall)
                )
              );
            } else {
              // For nested expressions, use a conditional: !isSSG ? hookEffect(...) : undefined
              path.replaceWith(
                t.conditionalExpression(
                  t.unaryExpression("!", isSSGId),
                  effectCall,
                  t.identifier("undefined")
                )
              );
            }
          } else if (name === "$signal") {
            // $signal is a compiler hint, it should be removed at runtime
            // const x = $signal(obj) -> const x = obj
            const arg = path.node.arguments[0];
            if (arg) {
              path.replaceWith(arg);
              // Mark the variable as a signal for the identifier visitor
              const parent = path.findParent(p => p.isVariableDeclarator());
              if (parent && t.isIdentifier(parent.node.id)) {
                state.wrapperSignals.add(parent.node.id.name);
              }
            }
          } else if (name === "$expose") {
            path.get("callee").replaceWith(t.memberExpression(t.identifier("Object"), t.identifier("assign")));
            path.node.arguments.unshift(t.thisExpression());
          } else if (name === "onMount") {
            path.get("callee").replaceWith(getImport("onMount", state.runtimeSource));
          } else if (name === "onCleanup") {
            path.get("callee").replaceWith(getImport("onCleanup", state.runtimeSource));
          } else if (name === "$renderDynamic") {
            path.get("callee").replaceWith(getImport("renderDynamic", state.runtimeSource));
          }
        }
      },

      Function: {
        enter(path, state) {
          if (path.node._isMapCallback) {
            path.node.params.forEach(param => {
              if (t.isIdentifier(param)) {
                state.macroSignals.add(param.name);
              }
            });
          }
        },
        exit(path, state) {
          if (path.node._isMapCallback) {
            path.node.params.forEach(param => {
              if (t.isIdentifier(param)) {
                state.macroSignals.delete(param.name);
              }
            });
          }
        }
      },

      MemberExpression(path, state) {
        if (path.node._processed) return;
        
        // 1. First-Access Rule for 'props'
        if (t.isIdentifier(path.node.object, { name: "props" }) && t.isIdentifier(path.node.property) && path.node.property.name !== "children" && !path.node.property.name.startsWith("on")) {
          // Skip if already has .value
          if (t.isMemberExpression(path.parentPath.node) && t.isIdentifier(path.parentPath.node.property, { name: "value" })) return;

          path.node._processed = true;
          const newNode = t.memberExpression(path.node, t.identifier("value"));
          newNode._processed = true;
          path.replaceWith(newNode);
          return;
        }

        // 2. First-Access Rule for wrapperSignals ($signal)
        if (t.isIdentifier(path.node.object) && state.wrapperSignals.has(path.node.object.name) && t.isIdentifier(path.node.property)) {
           // Skip if already has .value
           if (t.isMemberExpression(path.parentPath.node) && t.isIdentifier(path.parentPath.node.property, { name: "value" })) return;

           path.node._processed = true;
           const newNode = t.memberExpression(path.node, t.identifier("value"));
           newNode._processed = true;
           path.replaceWith(newNode);
        }
      },

      Identifier(path, state) {
        if (!state.macroSignals.has(path.node.name)) return;
        if (path.node._processed) return;

        // Skip if it's a parameter of the function we are currently in
        if (path.parentPath.isFunction() && path.parentPath.node.params.includes(path.node)) return;

        if (path.parentPath.isMemberExpression() && !path.parentPath.node.computed) {
          if (t.isIdentifier(path.parentPath.node.property, { name: "value" })) {
            throw path.parentPath.buildCodeFrameError(
              `Manual .value access is forbidden for variables declared with $state. The Web App Framework compiler handles this automatically. Remove the .value from '${path.node.name}.value'.`
            );
          }
          if (path.parentPath.node.property === path.node) return;
        }

        if (path.parentPath.isVariableDeclarator({ id: path.node })) return;
        if (path.parentPath.isAssignmentPattern({ left: path.node })) return;
        if (path.parentPath.isObjectProperty({ value: path.node }) && path.parentPath.parentPath.isObjectPattern()) return;
        if (path.parentPath.isRestElement()) return;
        if (path.parentPath.isObjectProperty() && path.parentPath.node.key === path.node && !path.parentPath.node.computed) return;
        if (path.parentPath.isClassProperty() && path.parentPath.node.key === path.node) return;
        if (path.parentPath.isClassMethod() && path.parentPath.node.key === path.node) return;

        // Skip if it's a 'ref' attribute in JSX
        if (path.parentPath.isJSXExpressionContainer() &&
          path.parentPath.parentPath.isJSXAttribute() &&
          path.parentPath.parentPath.node.name.name === "ref") return;

        const innerId = t.identifier(path.node.name);
        innerId._processed = true;
        const newNode = t.memberExpression(innerId, t.identifier("value"));
        newNode._processed = true;
        path.replaceWith(newNode);
      },

      AssignmentExpression(path, state) {
        if (t.isIdentifier(path.node.left) && state.macroSignals.has(path.node.left.name)) {
          const innerId = t.identifier(path.node.left.name);
          innerId._processed = true;
          path.node.left = t.memberExpression(innerId, t.identifier("value"));
        }
      },

      UpdateExpression(path, state) {
        if (t.isIdentifier(path.node.argument) && state.macroSignals.has(path.node.argument.name)) {
          const innerId = t.identifier(path.node.argument.name);
          innerId._processed = true;
          path.node.argument = t.memberExpression(innerId, t.identifier("value"));
        }
      },

      JSXElement(path, state) {
        if (path.findParent(p => (p.isFunctionDeclaration() || p.isVariableDeclarator()) && /^[A-Z]/.test(p.node.id?.name || p.node.name))) return;
        handleJSXVisitor(path, state, t);
      },

      JSXFragment(path, state) {
        if (path.findParent(p => (p.isFunctionDeclaration() || p.isVariableDeclarator()) && /^[A-Z]/.test(p.node.id?.name || p.node.name))) return;
        handleJSXVisitor(path, state, t);
      }
    }
  };
}
