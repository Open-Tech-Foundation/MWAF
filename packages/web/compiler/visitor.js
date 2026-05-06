import { SVG_TAGS, SVG_CAMEL_CASE, IS_PROPERTY, STANDARD_TAGS } from "./constants.js";
import { getMemberName, getImportHelper, createIdGenerator } from "./helpers.js";

function getHelpers(t) {
  return {
    h: t.memberExpression(t.identifier("document"), t.identifier("createElement")),
    t: t.memberExpression(t.identifier("document"), t.identifier("createTextNode")),
    s: t.memberExpression(t.identifier("document"), t.identifier("createElementNS")),
    f: t.memberExpression(t.identifier("document"), t.identifier("createDocumentFragment")),
  };
}

function makeAppendStatement(t, targetExpr, rootIdExpr) {
  return t.expressionStatement(
    t.callExpression(
      t.memberExpression(targetExpr, t.identifier("appendChild")),
      [rootIdExpr]
    )
  );
}

function collectMapParams(path, t) {
  const mapParams = new Set();
  path.traverse({
    CallExpression(p) {
      const { callee, arguments: args } = p.node;
      if (
        t.isMemberExpression(callee) &&
        t.isIdentifier(callee.property, { name: "map" }) &&
        args.length > 0 &&
        t.isFunction(args[0])
      ) {
        args[0].params.forEach(param => {
          if (t.isIdentifier(param)) mapParams.add(param.name);
          else if (t.isObjectPattern(param)) {
            param.properties.forEach(prop => {
              if (t.isObjectProperty(prop) && t.isIdentifier(prop.value))
                mapParams.add(prop.value.name);
            });
          } else if (t.isArrayPattern(param)) {
            param.elements.forEach(el => {
              if (t.isIdentifier(el)) mapParams.add(el.name);
            });
          }
        });
      }
    },
  });
  return mapParams;
}

function extractPropsInfo(t, node) {
  const propNames = new Set();
  let propsId = t.identifier("props");
  const param = node.params[0];
  if (!param) return { propNames, propsId };

  if (t.isIdentifier(param)) {
    propsId = param;
    const name = param.name;
    if (t.isBlockStatement(node.body)) {
      node.body.body.forEach(stmt => {
        if (t.isVariableDeclaration(stmt)) {
          stmt.declarations.forEach(decl => {
            if (t.isVariableDeclarator(decl) && t.isObjectPattern(decl.id) && t.isIdentifier(decl.init, { name })) {
              decl.id.properties.forEach(prop => {
                if (t.isObjectProperty(prop) && t.isIdentifier(prop.key))
                  propNames.add(prop.key.name);
                if (t.isObjectProperty(prop) && t.isIdentifier(prop.value) && prop.value.name !== prop.key.name)
                  propNames.add(prop.value.name);
              });
            }
          });
        }
      });
    }
  } else if (t.isObjectPattern(param)) {
    param.properties.forEach(prop => {
      if (t.isObjectProperty(prop) && t.isIdentifier(prop.key))
        propNames.add(prop.key.name);
      if (t.isObjectProperty(prop) && t.isIdentifier(prop.value) && prop.value.name !== prop.key.name)
        propNames.add(prop.value.name);
    });
  }
  return { propNames, propsId };
}

export function handleJSXVisitor(path, state, t) {
  if (path.node._processed) return;

  const runtimeSource = state.runtimeSource || "@opentf/web";
  const getImport = getImportHelper(t, path, state);
  const helpers = getHelpers(t);
  const mapParams = collectMapParams(path, t);

  const { statements, rootId, signals } = transformJSX(
    path.node, t, state, getImport, path, helpers,
    null, mapParams, runtimeSource, new Set()
  );

  const parentFunc = path.findParent(p =>
    p.isFunctionDeclaration() &&
    (
      /^[A-Z]/.test(p.node.id?.name) ||
      (p.parentPath.isExportDefaultDeclaration() && state.isPageFile)
    )
  );
  if (parentFunc) {
    const compName =
      parentFunc.node.id?.name ||
      (parentFunc.parentPath.isExportDefaultDeclaration() ? "_default" : null);
    if (compName) {
      const info = state.components.get(compName);
      if (info) {
        if (!info.observedAttributes) info.observedAttributes = new Set();
        signals.forEach(s => {
          if (!s.startsWith("on")) info.observedAttributes.add(s);
        });
      }
    }
  }

  if (!parentFunc) {
    const fn = t.arrowFunctionExpression([], t.blockStatement([...statements, t.returnStatement(rootId)]));
    fn._processed = true;
    path.replaceWith(fn);
    return;
  }

  const iife = t.callExpression(
    t.arrowFunctionExpression([], t.blockStatement([...statements, t.returnStatement(rootId)])),
    []
  );
  iife._processed = true;
  path.replaceWith(iife);
}

export function transformComponent(componentPath, name, isRenderFn, t, state) {
  let node = componentPath.node;
  if (t.isVariableDeclarator(node)) node = node.init;

  const body = node.body;
  const runtimeSource = state.runtimeSource || "@opentf/web";
  const getImport = getImportHelper(t, componentPath, state);

  let jsxNode = null;
  const originalStatements = [];
  if (t.isBlockStatement(body)) {
    body.body.forEach(stmt => {
      if (t.isReturnStatement(stmt)) jsxNode = stmt.argument;
      else originalStatements.push(stmt);
    });
  } else {
    jsxNode = body;
  }
  if (!jsxNode) return;

  const { propNames, propsId } = extractPropsInfo(t, node);

  if (propNames.size > 0) {
    componentPath.traverse({
      Identifier(p) {
        if (!propNames.has(p.node.name) || p.node._processed) return;
        if (p.parentPath.isObjectProperty({ key: p.node }) && !p.parentPath.node.computed) return;
        if (p.parentPath.isMemberExpression({ property: p.node }) && !p.parentPath.node.computed) return;

        // Skip if it's a binding identifier (declaration/pattern)
        if (p.parentPath.isVariableDeclarator({ id: p.node })) return;
        if (p.parentPath.isAssignmentPattern({ left: p.node })) return;
        if (p.parentPath.isObjectProperty({ value: p.node }) && p.parentPath.parentPath.isObjectPattern()) return;
        if (p.parentPath.isRestElement()) return;

        const isEvent = p.node.name.startsWith("on");
        const isChildren = p.node.name === "children";
        const hasValue = p.parentPath.isMemberExpression() && !p.parentPath.node.computed && t.isIdentifier(p.parentPath.node.property, { name: "value" });

        const inner = t.memberExpression(t.identifier("_waf_props"), t.identifier(p.node.name));
        inner._processed = true;
        const repl = (isEvent || isChildren || hasValue)
          ? inner
          : t.memberExpression(inner, t.identifier("value"));
        repl._processed = true;
        p.replaceWith(repl);
      },
    });
  }

  const mapParams = collectMapParams(componentPath, t);
  const helpers = getHelpers(t);
  const res = transformJSX(
    jsxNode, t, state, getImport, componentPath, helpers,
    isRenderFn ? t.identifier("root") : t.thisExpression(),
    mapParams, runtimeSource, propNames
  );
  const statements = res.statements;
  const signals = res.signals;

  const rootVar = t.identifier("rootElement");
  statements.push(t.variableDeclaration("const", [t.variableDeclarator(rootVar, res.rootId)]));
  const rootId = rootVar;

  const componentInfo = state.components.get(name);

  if (isRenderFn) {
    const renderFn = t.functionDeclaration(
      t.identifier("render"),
      [t.identifier("root"), t.identifier("_props")],
      t.blockStatement([
        t.variableDeclaration("const", [
          t.variableDeclarator(t.identifier("_holder"), t.objectExpression([
            t.objectProperty(t.identifier("_children"), t.logicalExpression("||", t.memberExpression(t.identifier("_props"), t.identifier("children")), t.arrayExpression([])))
          ]))
        ]),
        t.variableDeclaration("const", [
          t.variableDeclarator(t.identifier("_waf_props"), t.callExpression(getImport("createPropsProxy", runtimeSource), [t.identifier("_holder")]))
        ]),
        t.expressionStatement(t.callExpression(t.memberExpression(t.identifier("Object"), t.identifier("assign")), [t.identifier("_waf_props"), t.identifier("_props")])),
        ...(node.params.length > 0 && t.isObjectPattern(node.params[0])
          ? [t.variableDeclaration("const", [t.variableDeclarator(node.params[0], t.identifier("_waf_props"))])]
          : node.params.length > 0 && t.isIdentifier(node.params[0]) && node.params[0].name !== "_waf_props"
            ? [t.variableDeclaration("const", [t.variableDeclarator(node.params[0], t.identifier("_waf_props"))])]
            : []),
        ...originalStatements,
        ...statements,
        makeAppendStatement(t, t.identifier("root"), rootId),
      ])
    );

    const parent = componentPath.parentPath;
    if (parent.isExportDefaultDeclaration()) {
      parent.replaceWith(t.exportNamedDeclaration(renderFn));
    } else {
      componentPath.replaceWith(renderFn);
    }
    return;
  }

  const tagName = "web-" + name.toLowerCase();
  const finalSignals = new Set([...signals, ...propNames, ...(componentInfo?.observedAttributes || [])]);
  const observedAttributes = Array.from(finalSignals).filter(
    s => s.toLowerCase() !== "children" && !s.startsWith("on")
  );

  const signalId = getImport("signal", runtimeSource);
  const createPropsProxy = getImport("createPropsProxy", runtimeSource);
  const classId = t.identifier(name + "Element");

  // Helper to define internal properties as non-enumerable with an initial value
  const defineInternalProp = (prop, value) => t.expressionStatement(t.callExpression(
    t.memberExpression(t.identifier("Object"), t.identifier("defineProperty")),
    [
      t.thisExpression(),
      t.stringLiteral(prop),
      t.objectExpression([
        t.objectProperty(t.identifier("value"), value),
        t.objectProperty(t.identifier("enumerable"), t.booleanLiteral(false)),
        t.objectProperty(t.identifier("writable"), t.booleanLiteral(true)),
        t.objectProperty(t.identifier("configurable"), t.booleanLiteral(true))
      ])
    ]
  ));

  const classDecl = t.classDeclaration(
    classId,
    t.identifier("HTMLElement"),
    t.classBody([
      t.classProperty(
        t.identifier("observedAttributes"),
        t.arrayExpression(observedAttributes.map(s => t.stringLiteral(s))),
        null, null, false, true
      ),
      ...observedAttributes.map(s =>
        t.classMethod("set", t.identifier(s), [t.identifier("_val")],
          t.blockStatement([
            t.ifStatement(
              t.unaryExpression("!", t.memberExpression(t.memberExpression(t.thisExpression(), t.identifier("_propsSignals")), t.stringLiteral(s), true)),
              t.expressionStatement(
                t.assignmentExpression("=", t.memberExpression(t.memberExpression(t.thisExpression(), t.identifier("_propsSignals")), t.stringLiteral(s), true),
                  t.callExpression(signalId, [t.identifier("_val")])
                )
              )
            ),
            t.expressionStatement(
              t.assignmentExpression(
                "=",
                t.memberExpression(t.memberExpression(t.memberExpression(t.thisExpression(), t.identifier("_propsSignals")), t.stringLiteral(s), true), t.identifier("value")),
                t.identifier("_val")
              )
            ),
          ])
        )
      ),
      ...observedAttributes.map(s =>
        t.classMethod("get", t.identifier(s), [],
          t.blockStatement([
            t.variableDeclaration("const", [
              t.variableDeclarator(t.identifier("_sig"), t.memberExpression(t.memberExpression(t.thisExpression(), t.identifier("_propsSignals")), t.stringLiteral(s), true)),
            ]),
            t.returnStatement(
              t.conditionalExpression(
                t.identifier("_sig"),
                t.memberExpression(t.identifier("_sig"), t.identifier("value")),
                t.identifier("undefined")
              )
            ),
          ])
        )
      ),
      t.classMethod("constructor", t.identifier("constructor"), [],
        t.blockStatement([
          t.expressionStatement(t.callExpression(t.super(), [])),
          defineInternalProp("_propsSignals", t.objectExpression(
            observedAttributes.map(s => t.objectProperty(t.identifier(s), t.callExpression(signalId, [t.nullLiteral()])))
          )),
          defineInternalProp("_onMounts", t.arrayExpression([])),
          defineInternalProp("_onCleanups", t.arrayExpression([])),
          defineInternalProp("_children", t.arrayExpression([])),
          defineInternalProp("_mounted", t.booleanLiteral(false))
        ])
      ),
      t.classMethod(
        "method", t.identifier("attributeChangedCallback"),
        [t.identifier("name"), t.identifier("_"), t.identifier("value")],
        t.blockStatement([
          t.ifStatement(
            t.memberExpression(
              t.memberExpression(t.thisExpression(), t.identifier("_propsSignals")),
              t.identifier("name"),
              true
            ),
            t.expressionStatement(
              t.assignmentExpression(
                "=",
                t.memberExpression(
                  t.memberExpression(
                    t.memberExpression(t.thisExpression(), t.identifier("_propsSignals")),
                    t.identifier("name"),
                    true
                  ),
                  t.identifier("value")
                ),
                t.identifier("value")
              )
            )
          ),
        ])
      ),
      t.classMethod("method", t.identifier("connectedCallback"), [],
        t.blockStatement([
          t.ifStatement(
            t.memberExpression(t.thisExpression(), t.identifier("_mounted")),
            t.blockStatement([
              t.expressionStatement(t.callExpression(getImport("_reconnectWafComponent", runtimeSource), [t.thisExpression()])),
              t.returnStatement()
            ])
          ),
          t.expressionStatement(
            t.assignmentExpression(
              "=",
              t.memberExpression(t.thisExpression(), t.identifier("_mounted")),
              t.booleanLiteral(true)
            )
          ),
          t.variableDeclaration("const", [
            t.variableDeclarator(
              t.identifier("_waf_props"),
              t.callExpression(createPropsProxy, [t.thisExpression()])
            ),
          ]),
          t.expressionStatement(
            t.assignmentExpression(
              "=",
              t.memberExpression(t.thisExpression(), t.identifier("_children")),
              t.callExpression(
                t.memberExpression(t.identifier("Array"), t.identifier("from")),
                [t.memberExpression(t.thisExpression(), t.identifier("childNodes"))]
              )
            )
          ),
          t.expressionStatement(
            t.callExpression(getImport("_clearChildren", runtimeSource), [t.thisExpression()])
          ),
          t.expressionStatement(
            t.callExpression(
              getImport("withInstance", runtimeSource),
              [
                t.thisExpression(),
                t.arrowFunctionExpression([], t.blockStatement([
                  ...(node.params.length > 0 && t.isObjectPattern(node.params[0])
                    ? [t.variableDeclaration("const", [t.variableDeclarator(node.params[0], t.identifier("_waf_props"))])]
                    : node.params.length > 0 && t.isIdentifier(node.params[0]) && node.params[0].name !== "_waf_props"
                      ? [t.variableDeclaration("const", [t.variableDeclarator(node.params[0], t.identifier("_waf_props"))])]
                      : []),
                  ...originalStatements,
                  ...statements,
                  makeAppendStatement(t, t.thisExpression(), rootId),
                ])),
              ]
            )
          ),
          t.expressionStatement(
            t.callExpression(
              getImport("withInstance", runtimeSource),
              [
                t.thisExpression(),
                t.arrowFunctionExpression([], t.blockStatement([
                  t.expressionStatement(
                    t.callExpression(
                      t.memberExpression(
                        t.memberExpression(t.thisExpression(), t.identifier("_onMounts")),
                        t.identifier("forEach")
                      ),
                      [t.arrowFunctionExpression([t.identifier("fn")], t.callExpression(t.identifier("fn"), []))]
                    )
                  )
                ]))
              ]
            )
          ),
        ])
      ),
      t.classMethod("method", t.identifier("disconnectedCallback"), [],
        t.blockStatement([
          t.expressionStatement(
            t.callExpression(getImport("_disconnectWafComponent", runtimeSource), [t.thisExpression()])
          )
        ])
      ),
    ])
  );

  const defineCall = t.expressionStatement(
    t.callExpression(
      t.memberExpression(t.identifier("customElements"), t.identifier("define")),
      [t.stringLiteral(tagName), classId]
    )
  );

  const parent = componentPath.parentPath;
  if (parent.isExportDefaultDeclaration()) {
    parent.insertBefore(classDecl);
    parent.insertBefore(defineCall);
    parent.replaceWith(t.exportDefaultDeclaration(classId));
  } else if (parent.isExportNamedDeclaration()) {
    const exportedClass = t.classDeclaration(
      t.identifier(name), t.identifier("HTMLElement"), classDecl.body
    );
    parent.replaceWith(t.exportNamedDeclaration(exportedClass, []));
    parent.insertAfter(
      t.expressionStatement(
        t.callExpression(
          t.memberExpression(t.identifier("customElements"), t.identifier("define")),
          [t.stringLiteral(tagName), t.identifier(name)]
        )
      )
    );
  } else {
    let targetPath = componentPath;
    if (componentPath.isVariableDeclarator() && componentPath.parentPath.isVariableDeclaration())
      targetPath = componentPath.parentPath;

    targetPath.insertBefore(classDecl);
    targetPath.insertBefore(defineCall);

    if (componentPath.isVariableDeclarator()) {
      componentPath.get("init").replaceWith(classId);
    } else {
      targetPath.remove();
    }
  }
}

function transformJSX(node, t, state, getImport, path, helpers, rootIdentifier, mapParams, runtimeSource, propNames) {
  if (node._processed) return { statements: [], rootId: node, signals: new Set() };
  node._processed = true;

  const statements = [];
  const signals = new Set();
  const nextId = createIdGenerator();
  const toKebabCase = str => str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  const { h: hId, t: tId, s: sId, f: fId } = helpers;

  function collectSignals(exprNode) {
    if (!exprNode || typeof exprNode !== "object") return;
    if (Array.isArray(exprNode)) { exprNode.forEach(collectSignals); return; }
    if (
      t.isMemberExpression(exprNode) &&
      t.isIdentifier(exprNode.object, { name: "props" }) &&
      t.isIdentifier(exprNode.property)
    ) {
      signals.add(exprNode.property.name);
    }
    Object.keys(exprNode).forEach(key => {
      if (key === "property" && t.isMemberExpression(exprNode) && !exprNode.computed) return;
      collectSignals(exprNode[key]);
    });
  }

  function transformNoValue(exprNode) {
    if (!exprNode || typeof exprNode !== "object") return;
    if (Array.isArray(exprNode)) { exprNode.forEach(transformNoValue); return; }
    Object.keys(exprNode).forEach(key => {
      const child = exprNode[key];
      if (!child || typeof child !== "object") return;
      if (
        (t.isIdentifier(child) && !child._processed && (mapParams.has(child.name) || propNames.has(child.name) || state.stateVars?.has(child.name) || state.refVars?.has(child.name))) ||
        (t.isMemberExpression(child) && !child._processed && t.isIdentifier(child.object, { name: "props" }) && t.isIdentifier(child.property) && child.property.name !== "children")
      ) {
        if (t.isFunction(exprNode) && exprNode.params.includes(child)) return;
        if (t.isMemberExpression(exprNode) && t.isIdentifier(exprNode.property, { name: "value" }) && !exprNode.computed) return;
        if (t.isObjectProperty(exprNode) && key === "key" && !exprNode.computed) return;
        if (t.isMemberExpression(exprNode) && key === "property" && !exprNode.computed) return;

        child._processed = true;
        const newNode = t.memberExpression(child, t.identifier("value"));
        newNode._processed = true;
        exprNode[key] = newNode;
      } else {
        transformNoValue(child);
      }
    });
  }

  function processNode(n, parentElId) {
    if (t.isJSXElement(n)) {
      const tagNameNode = n.openingElement.name;
      let tagName = "";
      if (t.isJSXIdentifier(tagNameNode)) tagName = tagNameNode.name;
      else if (t.isJSXMemberExpression(tagNameNode)) tagName = getMemberName(t, tagNameNode);

      const isComponent = /^[A-Z]/.test(tagName) || tagName.includes(".");
      const elId = nextId(t);

      if (isComponent) {
        const binding = path.scope.getBinding(tagName);
        const isStandardTag = /^[a-z]/.test(tagName) && STANDARD_TAGS.includes(tagName.toLowerCase());

        let componentTagName = tagName;
        if (tagName.includes("."))
          componentTagName = "web-" + tagName.replace(/\./g, "-").toLowerCase();
        else if (!isStandardTag)
          componentTagName = "web-" + tagName.toLowerCase();

        const isFunction = binding && (
          t.isFunctionDeclaration(binding.path.node) ||
          t.isFunctionExpression(binding.path.node) ||
          t.isArrowFunctionExpression(binding.path.node)
        );
        const isImport = binding && binding.kind === "module";
        const isVariable = binding && t.isVariableDeclarator(binding.path.node);

        if (isFunction || isImport || state.components.has(tagName) || (!binding && !isStandardTag)) {
          statements.push(t.variableDeclaration("const", [
            t.variableDeclarator(elId, t.callExpression(hId, [t.stringLiteral(componentTagName)])),
          ]));
        } else if (isVariable) {
          statements.push(t.variableDeclaration("const", [
            t.variableDeclarator(elId, t.callExpression(hId, [t.identifier(tagName)])),
          ]));
        } else {
          statements.push(t.variableDeclaration("const", [
            t.variableDeclarator(elId, t.callExpression(hId, [t.stringLiteral(componentTagName)])),
          ]));
        }

        n.openingElement.attributes.forEach(attr => {
          if (t.isJSXSpreadAttribute(attr)) {
            const effectId = getImport("hookEffect", runtimeSource);
            const applySpread = getImport("applySpread", runtimeSource);
            statements.push(t.expressionStatement(
              t.callExpression(effectId, [
                t.arrowFunctionExpression([], t.callExpression(applySpread, [elId, attr.argument, t.booleanLiteral(true)])),
              ])
            ));
            return;
          }

          const attrName = attr.name.name;
          const value = attr.value || t.booleanLiteral(true);

          if (t.isJSXExpressionContainer(value)) {
            if (attrName === "ref" && t.isIdentifier(value.expression) && state.refVars?.has(value.expression.name)) {
              const innerId = t.identifier(value.expression.name);
              innerId._processed = true;
              statements.push(t.expressionStatement(
                t.assignmentExpression("=", t.memberExpression(innerId, t.identifier("value")), elId)
              ));
              return;
            }
            transformNoValue(value);
            const setProperty = getImport("setProperty", runtimeSource);
            const effectId = getImport("hookEffect", runtimeSource);
            statements.push(t.expressionStatement(
              t.callExpression(effectId, [
                t.arrowFunctionExpression([], t.callExpression(setProperty, [
                  elId,
                  t.stringLiteral(attrName),
                  value.expression,
                  t.booleanLiteral(true)
                ])),
              ])
            ));
          } else {
            const setProperty = getImport("setProperty", runtimeSource);
            statements.push(t.expressionStatement(
              t.callExpression(setProperty, [elId, t.stringLiteral(attrName), value, t.booleanLiteral(true)])
            ));
          }
        });

        n.children.forEach(child => {
          const childId = processNode(child, elId);
          if (childId) statements.push(t.expressionStatement(
            t.callExpression(t.memberExpression(elId, t.identifier("appendChild")), [childId])
          ));
        });
        return elId;
      }

      const isSvg = SVG_TAGS.includes(tagName.toLowerCase());
      statements.push(t.variableDeclaration("const", [
        t.variableDeclarator(
          elId,
          isSvg
            ? t.callExpression(sId, [t.stringLiteral("http://www.w3.org/2000/svg"), t.stringLiteral(tagName)])
            : t.callExpression(hId, [t.stringLiteral(tagName)])
        ),
      ]));

      n.openingElement.attributes.forEach(attr => {
        if (t.isJSXSpreadAttribute(attr)) {
          const effectId = getImport("hookEffect", runtimeSource);
          const applySpread = getImport("applySpread", runtimeSource);
          statements.push(t.expressionStatement(
            t.callExpression(effectId, [
              t.arrowFunctionExpression([], t.callExpression(applySpread, [elId, attr.argument, t.booleanLiteral(false)])),
            ])
          ));
          return;
        }

        const originalName = attr.name.name;
        const nameLower = originalName.toLowerCase();
        const value = attr.value || t.booleanLiteral(true);

        if (nameLower.startsWith("on")) {
          if (t.isJSXExpressionContainer(value)) {
            if (t.isJSXEmptyExpression(value.expression)) return;
            transformNoValue(value);
          }
          statements.push(t.expressionStatement(
            t.assignmentExpression(
              "=",
              t.memberExpression(elId, t.identifier(nameLower)),
              t.isJSXExpressionContainer(value) ? value.expression : value
            )
          ));
          return;
        }

        if (t.isJSXExpressionContainer(value)) {
          if (t.isJSXEmptyExpression(value.expression)) return;

          if (originalName === "ref" && t.isIdentifier(value.expression) && state.refVars?.has(value.expression.name)) {
            const innerId = t.identifier(value.expression.name);
            innerId._processed = true;
            statements.push(t.expressionStatement(
              t.assignmentExpression("=", t.memberExpression(innerId, t.identifier("value")), elId)
            ));
            return;
          }
          transformNoValue(value);

          collectSignals(value.expression);

          const attrProp = (nameLower === "class" || nameLower === "classname") ? "className" : nameLower;
          const isStyle = attrProp === "style";
          const isProperty = IS_PROPERTY.includes(attrProp);
          const isSvgCamel = isSvg && SVG_CAMEL_CASE.includes(originalName);
          const finalAttrName = isSvgCamel
            ? originalName
            : (attrProp === "className" ? "class" : toKebabCase(originalName));
          const effectId = getImport("hookEffect", runtimeSource);

          if (attrProp === "key") {
            statements.push(t.expressionStatement(
              t.assignmentExpression("=", t.memberExpression(elId, t.identifier("_key")), value.expression)
            ));
          } else {
            let assignment;
            const valExpr = (t.isArrowFunctionExpression(value.expression) || t.isFunctionExpression(value.expression))
              ? t.callExpression(value.expression, [])
              : value.expression;

            if (isStyle) {
              assignment = t.callExpression(
                t.memberExpression(t.identifier("Object"), t.identifier("assign")),
                [t.memberExpression(elId, t.identifier("style")), valExpr]
              );
            } else if (isProperty && (!isSvg || attrProp !== "className")) {
              const setProperty = getImport("setProperty", runtimeSource);
              assignment = t.callExpression(setProperty, [elId, t.stringLiteral(attrProp), valExpr, t.booleanLiteral(false)]);
            } else {
              assignment = t.callExpression(
                t.memberExpression(elId, t.identifier("setAttribute")),
                [t.stringLiteral(finalAttrName), valExpr]
              );
            }
            statements.push(t.expressionStatement(
              t.callExpression(effectId, [t.arrowFunctionExpression([], assignment)])
            ));
          }
        } else {
          const attrProp = (nameLower === "class" || nameLower === "classname") ? "className" : nameLower;
          const isProperty = IS_PROPERTY.includes(attrProp);
          const isSvgCamel = isSvg && SVG_CAMEL_CASE.includes(originalName);
          const finalAttrName = isSvgCamel
            ? originalName
            : (attrProp === "className" ? "class" : toKebabCase(originalName));

          if (isProperty && (!isSvg || attrProp !== "className")) {
            const setProperty = getImport("setProperty", runtimeSource);
            statements.push(t.expressionStatement(
              t.callExpression(setProperty, [elId, t.stringLiteral(attrProp === "key" ? "_key" : attrProp), value, t.booleanLiteral(false)])
            ));
          } else {
            statements.push(t.expressionStatement(
              t.callExpression(
                t.memberExpression(elId, t.identifier("setAttribute")),
                [t.stringLiteral(finalAttrName), value]
              )
            ));
          }
        }
      });

      n.children.forEach(child => {
        const childId = processNode(child, elId);
        if (childId) statements.push(t.expressionStatement(
          t.callExpression(t.memberExpression(elId, t.identifier("appendChild")), [childId])
        ));
      });
      return elId;
    }

    if (t.isJSXText(n)) {
      if (n.value.includes("\n") && n.value.trim() === "") return null;
      const text = n.value.replace(/\n\s*/g, " ");
      if (!text) return null;
      const textId = nextId(t, "text");
      statements.push(t.variableDeclaration("const", [
        t.variableDeclarator(textId, t.callExpression(tId, [t.stringLiteral(text)])),
      ]));
      return textId;
    }

    if (t.isJSXFragment(n)) {
      const fragId = nextId(t, "frag");
      statements.push(t.variableDeclaration("const", [
        t.variableDeclarator(fragId, t.callExpression(fId, [])),
      ]));
      n.children.forEach(child => {
        const childId = processNode(child, fragId);
        if (childId) statements.push(t.expressionStatement(
          t.callExpression(t.memberExpression(fragId, t.identifier("appendChild")), [childId])
        ));
      });
      return fragId;
    }

    if (t.isJSXExpressionContainer(n)) {
      if (t.isJSXEmptyExpression(n.expression)) return null;

      collectSignals(n.expression);

      const transformExpression = exprNode => {
        if (!exprNode || typeof exprNode !== "object") return;
        if (Array.isArray(exprNode)) { exprNode.forEach(transformExpression); return; }

        Object.keys(exprNode).forEach(key => {
          const child = exprNode[key];
          if (!child || typeof child !== "object") return;

          if (t.isJSXElement(child) || t.isJSXFragment(child)) {
            if (child._processed) return;
            const inner = transformJSX(child, t, state, getImport, path, helpers, rootIdentifier, mapParams, runtimeSource, propNames);
            inner.signals.forEach(s => signals.add(s));
            const iife = t.callExpression(
              t.arrowFunctionExpression([], t.blockStatement([...inner.statements, t.returnStatement(inner.rootId)])),
              []
            );
            iife._processed = true;
            exprNode[key] = iife;
          } else if (
            t.isCallExpression(child) &&
            t.isMemberExpression(child.callee) &&
            t.isIdentifier(child.callee.property, { name: "map" })
          ) {
            const mappedHelper = getImport("_mapped", runtimeSource);
            const sourceArray = child.callee.object;
            const mapFn = child.arguments[0];
            const mappedId = nextId(t, "mapped");

            statements.push(t.variableDeclaration("const", [
              t.variableDeclarator(
                mappedId,
                t.callExpression(mappedHelper, [t.arrowFunctionExpression([], sourceArray), mapFn])
              ),
            ]));
            exprNode[key] = t.callExpression(mappedId, []);
            transformExpression(mapFn);
          } else {
            transformNoValue(child);
            transformExpression(child);
          }
        });
      };

      const wrapper = { expr: n.expression };
      transformExpression(wrapper);

      const renderDynamic = getImport("renderDynamic", runtimeSource);
      const parentNode = parentElId || rootIdentifier;

      if (parentNode) {
        statements.push(t.expressionStatement(
          t.callExpression(renderDynamic, [
            parentNode,
            (t.isArrowFunctionExpression(wrapper.expr) || t.isFunctionExpression(wrapper.expr)) ? wrapper.expr : t.arrowFunctionExpression([], wrapper.expr),
          ])
        ));
      } else {
        throw componentPath?.buildCodeFrameError
          ? componentPath.buildCodeFrameError(
            "WAF: A root-level JSX expression container has no parent element. " +
            "Wrap your component's return value in a single element or fragment."
          )
          : new Error(
            "WAF: Root-level dynamic expression has no parent element context."
          );
      }
      return null;
    }

    if (t.isExpression(n)) return n;
    return null;
  }

  const resRootId = processNode(node, rootIdentifier);
  transformNoValue(statements);
  return { statements, rootId: resRootId, signals };
}