// compiler/helpers.js
var addNamed;
try {
  const mod = await import("@babel/helper-module-imports");
  addNamed = mod.addNamed;
} catch (e) {
  addNamed = (path, importName, source) => {
    const programPath = path.findParent((p) => p.isProgram());
    const existingBinding = programPath.scope.getBinding(importName);
    if (existingBinding && existingBinding.kind === "module") {
      return existingBinding.identifier;
    }
    const body = programPath.node.body;
    let existingDeclaration = null;
    for (const node of body) {
      if (node.type === "ImportDeclaration" && node.source.value === source) {
        existingDeclaration = node;
        for (const specifier of node.specifiers) {
          const isMatch = specifier.type === "ImportSpecifier" && (specifier.imported.name === importName || specifier.imported.type === "StringLiteral" && specifier.imported.value === importName);
          if (isMatch) {
            return specifier.local;
          }
        }
      }
    }
    const localId = programPath.scope.generateUidIdentifier(importName);
    const newSpecifier = {
      type: "ImportSpecifier",
      imported: { type: "Identifier", name: importName },
      local: localId
    };
    if (existingDeclaration) {
      existingDeclaration.specifiers.push(newSpecifier);
    } else {
      const newImport = {
        type: "ImportDeclaration",
        specifiers: [newSpecifier],
        source: { type: "StringLiteral", value: source }
      };
      body.unshift(newImport);
    }
    return localId;
  };
}
var getMemberName = (t, node) => {
  if (t.isJSXIdentifier(node)) return node.name;
  if (t.isJSXMemberExpression(node)) {
    return `${getMemberName(t, node.object)}.${getMemberName(t, node.property)}`;
  }
  return "";
};
var getImportHelper = (t, path, state) => (importName, source) => {
  const key = `${importName}:${source}`;
  if (!state.importsNeeded.has(key)) {
    state.importsNeeded.set(key, addNamed(path, importName, source));
  }
  return state.importsNeeded.get(key);
};
var createIdGenerator = () => {
  let counter = 0;
  return (t, prefix = "el") => t.identifier(`${prefix}${counter++}`);
};

// core/constants.js
var IS_PROPERTY = [
  "className",
  "style",
  "value",
  "checked",
  "id",
  "title",
  "href",
  "src",
  "key",
  "disabled",
  "readOnly"
];

// compiler/constants.js
var SVG_TAGS = ["svg", "path", "polyline", "line", "circle", "rect", "ellipse", "polygon", "g", "text", "tspan", "defs", "lineargradient", "stop"];
var SVG_CAMEL_CASE = [
  "allowReorder",
  "attributeName",
  "attributeType",
  "autoReverse",
  "baseFrequency",
  "baseProfile",
  "calcMode",
  "clipPathUnits",
  "contentScriptType",
  "contentStyleType",
  "cursor",
  "cx",
  "cy",
  "d",
  "diffuseConstant",
  "direction",
  "display",
  "divisor",
  "dominantBaseline",
  "dur",
  "dx",
  "dy",
  "edgeMode",
  "elevation",
  "enableBackground",
  "externalResourcesRequired",
  "fill",
  "fillOpacity",
  "fillRule",
  "filter",
  "filterRes",
  "filterUnits",
  "floodColor",
  "floodOpacity",
  "focusable",
  "fontFamily",
  "fontSize",
  "fontSizeAdjust",
  "fontStretch",
  "fontStyle",
  "fontVariant",
  "fontWeight",
  "format",
  "from",
  "fx",
  "fy",
  "g1",
  "g2",
  "glyphName",
  "glyphOrientationHorizontal",
  "glyphOrientationVertical",
  "glyphRef",
  "gradientTransform",
  "gradientUnits",
  "hanging",
  "horizAdvX",
  "horizOriginX",
  "ideographic",
  "imageRendering",
  "in",
  "in2",
  "intercept",
  "k",
  "k1",
  "k2",
  "k3",
  "k4",
  "kernelMatrix",
  "kernelUnitLength",
  "kerning",
  "keyPoints",
  "keySplines",
  "keyTimes",
  "lengthAdjust",
  "letterSpacing",
  "lightingColor",
  "limitingConeAngle",
  "local",
  "markerEnd",
  "markerMid",
  "markerStart",
  "markerHeight",
  "markerUnits",
  "markerWidth",
  "mask",
  "maskContentUnits",
  "maskUnits",
  "mathematical",
  "mode",
  "numOctaves",
  "offset",
  "opacity",
  "operator",
  "order",
  "orient",
  "orientation",
  "origin",
  "overflow",
  "overlinePosition",
  "overlineThickness",
  "panose1",
  "paintOrder",
  "pathLength",
  "patternContentUnits",
  "patternTransform",
  "patternUnits",
  "pointerEvents",
  "points",
  "pointsAtX",
  "pointsAtY",
  "pointsAtZ",
  "preserveAlpha",
  "preserveAspectRatio",
  "primitiveUnits",
  "r",
  "radius",
  "refX",
  "refY",
  "renderingIntent",
  "repeatCount",
  "repeatDur",
  "requiredExtensions",
  "requiredFeatures",
  "restart",
  "result",
  "rotate",
  "rx",
  "ry",
  "scale",
  "seed",
  "shapeRendering",
  "slope",
  "spacing",
  "specularConstant",
  "specularExponent",
  "speed",
  "spreadMethod",
  "startOffset",
  "stdDeviation",
  "stemh",
  "stemv",
  "stitchTiles",
  "stopColor",
  "stopOpacity",
  "strikethroughPosition",
  "strikethroughThickness",
  "string",
  "stroke",
  "strokeDasharray",
  "strokeDashoffset",
  "strokeLinecap",
  "strokeLinejoin",
  "strokeMiterlimit",
  "strokeOpacity",
  "strokeWidth",
  "surfaceScale",
  "systemLanguage",
  "tableValues",
  "targetX",
  "targetY",
  "textAnchor",
  "textDecoration",
  "textLength",
  "textRendering",
  "to",
  "transform",
  "u1",
  "u2",
  "underlinePosition",
  "underlineThickness",
  "unicode",
  "unicodeBidi",
  "unicodeRange",
  "unitsPerEm",
  "vAlphabetic",
  "vHanging",
  "vIdeographic",
  "vMathematical",
  "values",
  "version",
  "vertAdvY",
  "vertOriginX",
  "vertOriginY",
  "viewBox",
  "viewTarget",
  "visibility",
  "widths",
  "wordSpacing",
  "writingMode",
  "x",
  "x1",
  "x2",
  "xChannelSelector",
  "xHeight",
  "xlinkActuate",
  "xlinkArcrole",
  "xlinkHref",
  "xlinkRole",
  "xlinkShow",
  "xlinkTitle",
  "xlinkType",
  "xmlBase",
  "xmlLang",
  "xmlSpace",
  "y",
  "y1",
  "y2",
  "yChannelSelector",
  "z",
  "zoomAndPan"
];
var STANDARD_TAGS = ["div", "span", "p", "a", "ul", "li", "button", "input", "img", "h1", "h2", "h3", "h4", "h5", "h6", "section", "article", "nav", "header", "footer", "main", "aside", "form", "label", "select", "option", "textarea", "table", "tr", "td", "th", "thead", "tbody", "tfoot", "canvas", "video", "audio", "svg"];

// compiler/visitor.js
function getHelpers(t, getImport, runtimeSource) {
  return {
    h: getImport("_element", runtimeSource),
    t: getImport("_text", runtimeSource),
    s: getImport("_svg", runtimeSource),
    f: getImport("_fragment", runtimeSource)
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
  const mapParams = /* @__PURE__ */ new Set();
  path.traverse({
    CallExpression(p) {
      const { callee, arguments: args } = p.node;
      if (t.isMemberExpression(callee) && t.isIdentifier(callee.property, { name: "map" }) && args.length > 0 && t.isFunction(args[0])) {
        args[0].params.forEach((param) => {
          if (t.isIdentifier(param)) mapParams.add(param.name);
          else if (t.isObjectPattern(param)) {
            param.properties.forEach((prop) => {
              if (t.isObjectProperty(prop) && t.isIdentifier(prop.value))
                mapParams.add(prop.value.name);
            });
          } else if (t.isArrayPattern(param)) {
            param.elements.forEach((el) => {
              if (t.isIdentifier(el)) mapParams.add(el.name);
            });
          }
        });
      }
    }
  });
  return mapParams;
}
function extractPropsInfo(t, node) {
  const propNames = /* @__PURE__ */ new Set();
  let propsId = t.identifier("props");
  const param = node.params[0];
  if (!param) return { propNames, propsId };
  if (t.isIdentifier(param)) {
    propsId = param;
    const name = param.name;
    if (t.isBlockStatement(node.body)) {
      node.body.body.forEach((stmt) => {
        if (t.isVariableDeclaration(stmt)) {
          stmt.declarations.forEach((decl) => {
            if (t.isVariableDeclarator(decl) && t.isObjectPattern(decl.id) && t.isIdentifier(decl.init, { name })) {
              decl.id.properties.forEach((prop) => {
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
    param.properties.forEach((prop) => {
      if (t.isObjectProperty(prop) && t.isIdentifier(prop.key))
        propNames.add(prop.key.name);
      if (t.isObjectProperty(prop) && t.isIdentifier(prop.value) && prop.value.name !== prop.key.name)
        propNames.add(prop.value.name);
    });
  }
  return { propNames, propsId };
}
function handleJSXVisitor(path, state, t) {
  if (path.node._processed) return;
  const runtimeSource = state.runtimeSource || "@opentf/web";
  const getImport = getImportHelper(t, path, state);
  const helpers = getHelpers(t, getImport, runtimeSource);
  const mapParams = collectMapParams(path, t);
  const { statements, rootId, signals } = transformJSX(
    path.node,
    t,
    state,
    getImport,
    path,
    helpers,
    null,
    mapParams,
    runtimeSource,
    /* @__PURE__ */ new Set()
  );
  const parentFunc = path.findParent(
    (p) => p.isFunctionDeclaration() && (/^[A-Z]/.test(p.node.id?.name) || p.parentPath.isExportDefaultDeclaration() && state.isPageFile)
  );
  if (parentFunc) {
    const compName = parentFunc.node.id?.name || (parentFunc.parentPath.isExportDefaultDeclaration() ? "_default" : null);
    if (compName) {
      const info = state.components.get(compName);
      if (info) {
        if (!info.observedAttributes) info.observedAttributes = /* @__PURE__ */ new Set();
        signals.forEach((s) => {
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
function transformComponent(componentPath2, name, isRenderFn, t, state) {
  let node = componentPath2.node;
  if (t.isVariableDeclarator(node)) node = node.init;
  const body = node.body;
  const runtimeSource = state.runtimeSource || "@opentf/web";
  const getImport = getImportHelper(t, componentPath2, state);
  let jsxNode = null;
  const originalStatements = [];
  if (t.isBlockStatement(body)) {
    body.body.forEach((stmt) => {
      if (t.isReturnStatement(stmt)) jsxNode = stmt.argument;
      else originalStatements.push(stmt);
    });
  } else {
    jsxNode = body;
  }
  if (!jsxNode) return;
  const { propNames, propsId } = extractPropsInfo(t, node);
  if (propNames.size > 0) {
    componentPath2.traverse({
      Identifier(p) {
        if (!propNames.has(p.node.name) || p.node._processed) return;
        if (p.parentPath.isObjectProperty({ key: p.node }) && !p.parentPath.node.computed) return;
        if (p.parentPath.isMemberExpression({ property: p.node }) && !p.parentPath.node.computed) return;
        if (p.parentPath.isVariableDeclarator({ id: p.node })) return;
        if (p.parentPath.isAssignmentPattern({ left: p.node })) return;
        if (p.parentPath.isObjectProperty({ value: p.node }) && p.parentPath.parentPath.isObjectPattern()) return;
        if (p.parentPath.isRestElement()) return;
        const isEvent = p.node.name.startsWith("on");
        const isChildren = p.node.name === "children";
        const hasValue = p.parentPath.isMemberExpression() && !p.parentPath.node.computed && t.isIdentifier(p.parentPath.node.property, { name: "value" });
        const inner = t.memberExpression(t.identifier("_waf_props"), t.identifier(p.node.name));
        inner._processed = true;
        const repl = isEvent || isChildren || hasValue ? inner : t.memberExpression(inner, t.identifier("value"));
        repl._processed = true;
        p.replaceWith(repl);
      }
    });
  }
  const mapParams = collectMapParams(componentPath2, t);
  const helpers = getHelpers(t, getImport, runtimeSource);
  const res = transformJSX(
    jsxNode,
    t,
    state,
    getImport,
    componentPath2,
    helpers,
    isRenderFn ? t.identifier("root") : t.thisExpression(),
    mapParams,
    runtimeSource,
    propNames
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
        ...node.params.length > 0 && t.isObjectPattern(node.params[0]) ? [t.variableDeclaration("const", [t.variableDeclarator(node.params[0], t.identifier("_waf_props"))])] : node.params.length > 0 && t.isIdentifier(node.params[0]) && node.params[0].name !== "_waf_props" ? [t.variableDeclaration("const", [t.variableDeclarator(node.params[0], t.identifier("_waf_props"))])] : [],
        ...originalStatements,
        ...statements,
        makeAppendStatement(t, t.identifier("root"), rootId)
      ])
    );
    const parent2 = componentPath2.parentPath;
    if (parent2.isExportDefaultDeclaration()) {
      parent2.replaceWith(t.exportNamedDeclaration(renderFn));
    } else {
      componentPath2.replaceWith(renderFn);
    }
    return;
  }
  const tagName = "web-" + name.toLowerCase();
  const finalSignals = /* @__PURE__ */ new Set([...signals, ...propNames, ...componentInfo?.observedAttributes || []]);
  const observedAttributes = Array.from(finalSignals).filter(
    (s) => s.toLowerCase() !== "children" && !s.startsWith("on")
  );
  const signalId = getImport("signal", runtimeSource);
  const createPropsProxy = getImport("createPropsProxy", runtimeSource);
  const classId = t.identifier(name + "Element");
  const classDecl = t.classDeclaration(
    classId,
    t.identifier("HTMLElement"),
    t.classBody([
      t.classProperty(
        t.identifier("observedAttributes"),
        t.arrayExpression(observedAttributes.map((s) => t.stringLiteral(s))),
        null,
        null,
        false,
        true
      ),
      ...observedAttributes.map(
        (s) => t.classMethod(
          "set",
          t.identifier(s),
          [t.identifier("_val")],
          t.blockStatement([
            t.ifStatement(
              t.unaryExpression("!", t.memberExpression(t.memberExpression(t.thisExpression(), t.identifier("_propsSignals")), t.stringLiteral(s), true)),
              t.expressionStatement(
                t.assignmentExpression(
                  "=",
                  t.memberExpression(t.memberExpression(t.thisExpression(), t.identifier("_propsSignals")), t.stringLiteral(s), true),
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
            )
          ])
        )
      ),
      ...observedAttributes.map(
        (s) => t.classMethod(
          "get",
          t.identifier(s),
          [],
          t.blockStatement([
            t.variableDeclaration("const", [
              t.variableDeclarator(t.identifier("_sig"), t.memberExpression(t.memberExpression(t.thisExpression(), t.identifier("_propsSignals")), t.stringLiteral(s), true))
            ]),
            t.returnStatement(
              t.conditionalExpression(
                t.identifier("_sig"),
                t.memberExpression(t.identifier("_sig"), t.identifier("value")),
                t.identifier("undefined")
              )
            )
          ])
        )
      ),
      t.classMethod(
        "constructor",
        t.identifier("constructor"),
        [],
        t.blockStatement([
          t.expressionStatement(t.callExpression(t.super(), [])),
          t.expressionStatement(
            t.callExpression(getImport("_initInternalState", runtimeSource), [
              t.thisExpression(),
              t.objectExpression(
                observedAttributes.map((s) => t.objectProperty(t.identifier(s), t.callExpression(signalId, [t.nullLiteral()])))
              )
            ])
          )
        ])
      ),
      t.classMethod(
        "method",
        t.identifier("attributeChangedCallback"),
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
          )
        ])
      ),
      t.classMethod(
        "method",
        t.identifier("connectedCallback"),
        [],
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
            )
          ]),
          t.variableDeclaration("const", [
            t.variableDeclarator(
              t.identifier("_isHydrating"),
              t.callExpression(t.memberExpression(t.thisExpression(), t.identifier("hasAttribute")), [t.stringLiteral("data-ssg")])
            )
          ]),
          t.ifStatement(
            t.unaryExpression("!", t.identifier("_isHydrating")),
            t.blockStatement([
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
              )
            ])
          ),
          t.expressionStatement(
            t.callExpression(
              getImport("withInstance", runtimeSource),
              [
                t.thisExpression(),
                t.arrowFunctionExpression([], t.blockStatement([
                  ...node.params.length > 0 && t.isObjectPattern(node.params[0]) ? [t.variableDeclaration("const", [t.variableDeclarator(node.params[0], t.identifier("_waf_props"))])] : node.params.length > 0 && t.isIdentifier(node.params[0]) && node.params[0].name !== "_waf_props" ? [t.variableDeclaration("const", [t.variableDeclarator(node.params[0], t.identifier("_waf_props"))])] : [],
                  ...originalStatements,
                  ...statements,
                  t.ifStatement(
                    t.unaryExpression("!", t.identifier("_isHydrating")),
                    makeAppendStatement(t, t.thisExpression(), rootId)
                  )
                ]))
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
          )
        ])
      ),
      t.classMethod(
        "method",
        t.identifier("disconnectedCallback"),
        [],
        t.blockStatement([
          t.expressionStatement(
            t.callExpression(getImport("_disconnectWafComponent", runtimeSource), [t.thisExpression()])
          )
        ])
      )
    ])
  );
  const defineCall = t.ifStatement(
    t.unaryExpression("!", t.callExpression(t.memberExpression(t.identifier("customElements"), t.identifier("get")), [t.stringLiteral(tagName)])),
    t.expressionStatement(
      t.callExpression(
        t.memberExpression(t.identifier("customElements"), t.identifier("define")),
        [t.stringLiteral(tagName), classId]
      )
    )
  );
  const parent = componentPath2.parentPath;
  if (parent.isExportDefaultDeclaration()) {
    parent.insertBefore(classDecl);
    parent.insertBefore(defineCall);
    parent.replaceWith(t.exportDefaultDeclaration(classId));
  } else if (parent.isExportNamedDeclaration()) {
    const exportedClass = t.classDeclaration(
      t.identifier(name),
      t.identifier("HTMLElement"),
      classDecl.body
    );
    parent.replaceWith(t.exportNamedDeclaration(exportedClass, []));
    parent.insertAfter(
      t.ifStatement(
        t.unaryExpression("!", t.callExpression(t.memberExpression(t.identifier("customElements"), t.identifier("get")), [t.stringLiteral(tagName)])),
        t.expressionStatement(
          t.callExpression(
            t.memberExpression(t.identifier("customElements"), t.identifier("define")),
            [t.stringLiteral(tagName), t.identifier(name)]
          )
        )
      )
    );
  } else {
    let targetPath = componentPath2;
    if (componentPath2.isVariableDeclarator() && componentPath2.parentPath.isVariableDeclaration())
      targetPath = componentPath2.parentPath;
    targetPath.insertBefore(classDecl);
    targetPath.insertBefore(defineCall);
    if (componentPath2.isVariableDeclarator()) {
      componentPath2.get("init").replaceWith(classId);
    } else {
      targetPath.remove();
    }
  }
}
function transformJSX(node, t, state, getImport, path, helpers, rootIdentifier, mapParams, runtimeSource, propNames) {
  if (node._processed) return { statements: [], rootId: node, signals: /* @__PURE__ */ new Set() };
  node._processed = true;
  const statements = [];
  const signals = /* @__PURE__ */ new Set();
  const nextId = createIdGenerator();
  const toKebabCase = (str) => str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  const { h: hId, t: tId, s: sId, f: fId } = helpers;
  function collectSignals(exprNode) {
    if (!exprNode || typeof exprNode !== "object") return;
    if (Array.isArray(exprNode)) {
      exprNode.forEach(collectSignals);
      return;
    }
    if (t.isMemberExpression(exprNode) && t.isIdentifier(exprNode.object, { name: "props" }) && t.isIdentifier(exprNode.property)) {
      signals.add(exprNode.property.name);
    }
    Object.keys(exprNode).forEach((key) => {
      if (key === "property" && t.isMemberExpression(exprNode) && !exprNode.computed) return;
      collectSignals(exprNode[key]);
    });
  }
  function transformNoValue(exprNode) {
    if (!exprNode || typeof exprNode !== "object") return;
    if (Array.isArray(exprNode)) {
      exprNode.forEach(transformNoValue);
      return;
    }
    Object.keys(exprNode).forEach((key) => {
      const child = exprNode[key];
      if (!child || typeof child !== "object") return;
      if (t.isIdentifier(child) && !child._processed && (mapParams.has(child.name) || propNames.has(child.name) || state.stateVars?.has(child.name) || state.refVars?.has(child.name)) || t.isMemberExpression(child) && !child._processed && t.isIdentifier(child.object, { name: "props" }) && t.isIdentifier(child.property) && child.property.name !== "children") {
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
        const isFunction = binding && (t.isFunctionDeclaration(binding.path.node) || t.isFunctionExpression(binding.path.node) || t.isArrowFunctionExpression(binding.path.node));
        const isImport = binding && binding.kind === "module";
        const isVariable = binding && t.isVariableDeclarator(binding.path.node);
        if (isFunction || isImport || state.components.has(tagName) || !binding && !isStandardTag) {
          statements.push(t.variableDeclaration("const", [
            t.variableDeclarator(elId, t.callExpression(hId, [t.stringLiteral(componentTagName)]))
          ]));
        } else if (isVariable) {
          statements.push(t.variableDeclaration("const", [
            t.variableDeclarator(elId, t.callExpression(hId, [t.identifier(tagName)]))
          ]));
        } else {
          statements.push(t.variableDeclaration("const", [
            t.variableDeclarator(elId, t.callExpression(hId, [t.stringLiteral(componentTagName)]))
          ]));
        }
        n.openingElement.attributes.forEach((attr) => {
          if (t.isJSXSpreadAttribute(attr)) {
            const effectId = getImport("hookEffect", runtimeSource);
            const applySpread = getImport("applySpread", runtimeSource);
            statements.push(t.expressionStatement(
              t.callExpression(effectId, [
                t.arrowFunctionExpression([], t.callExpression(applySpread, [elId, attr.argument, t.booleanLiteral(true)]))
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
                ]))
              ])
            ));
          } else {
            const setProperty = getImport("setProperty", runtimeSource);
            statements.push(t.expressionStatement(
              t.callExpression(setProperty, [elId, t.stringLiteral(attrName), value, t.booleanLiteral(true)])
            ));
          }
        });
        n.children.forEach((child) => {
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
          isSvg ? t.callExpression(sId, [t.stringLiteral(tagName)]) : t.callExpression(hId, [t.stringLiteral(tagName)])
        )
      ]));
      n.openingElement.attributes.forEach((attr) => {
        if (t.isJSXSpreadAttribute(attr)) {
          const effectId = getImport("hookEffect", runtimeSource);
          const applySpread = getImport("applySpread", runtimeSource);
          statements.push(t.expressionStatement(
            t.callExpression(effectId, [
              t.arrowFunctionExpression([], t.callExpression(applySpread, [elId, attr.argument, t.booleanLiteral(false)]))
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
          const attrProp = nameLower === "class" || nameLower === "classname" ? "className" : nameLower;
          const isStyle = attrProp === "style";
          const isProperty = IS_PROPERTY.includes(attrProp);
          const isSvgCamel = isSvg && SVG_CAMEL_CASE.includes(originalName);
          const finalAttrName = isSvgCamel ? originalName : attrProp === "className" ? "class" : toKebabCase(originalName);
          const effectId = getImport("hookEffect", runtimeSource);
          if (attrProp === "key") {
            statements.push(t.expressionStatement(
              t.assignmentExpression("=", t.memberExpression(elId, t.identifier("_key")), value.expression)
            ));
          } else {
            let assignment;
            const valExpr = t.isArrowFunctionExpression(value.expression) || t.isFunctionExpression(value.expression) ? t.callExpression(value.expression, []) : value.expression;
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
          const attrProp = nameLower === "class" || nameLower === "classname" ? "className" : nameLower;
          const isProperty = IS_PROPERTY.includes(attrProp);
          const isSvgCamel = isSvg && SVG_CAMEL_CASE.includes(originalName);
          const finalAttrName = isSvgCamel ? originalName : attrProp === "className" ? "class" : toKebabCase(originalName);
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
      n.children.forEach((child) => {
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
        t.variableDeclarator(textId, t.callExpression(tId, [t.stringLiteral(text)]))
      ]));
      return textId;
    }
    if (t.isJSXFragment(n)) {
      const fragId = nextId(t, "frag");
      statements.push(t.variableDeclaration("const", [
        t.variableDeclarator(fragId, t.callExpression(fId, []))
      ]));
      n.children.forEach((child) => {
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
      const transformExpression = (exprNode) => {
        if (!exprNode || typeof exprNode !== "object") return;
        if (Array.isArray(exprNode)) {
          exprNode.forEach(transformExpression);
          return;
        }
        Object.keys(exprNode).forEach((key) => {
          const child = exprNode[key];
          if (!child || typeof child !== "object") return;
          if (t.isJSXElement(child) || t.isJSXFragment(child)) {
            if (child._processed) return;
            const inner = transformJSX(child, t, state, getImport, path, helpers, rootIdentifier, mapParams, runtimeSource, propNames);
            inner.signals.forEach((s) => signals.add(s));
            const iife = t.callExpression(
              t.arrowFunctionExpression([], t.blockStatement([...inner.statements, t.returnStatement(inner.rootId)])),
              []
            );
            iife._processed = true;
            exprNode[key] = iife;
          } else if (t.isCallExpression(child) && t.isMemberExpression(child.callee) && t.isIdentifier(child.callee.property, { name: "map" })) {
            const mappedHelper = getImport("_mapped", runtimeSource);
            const sourceArray = child.callee.object;
            const mapFn = child.arguments[0];
            const mappedId = nextId(t, "mapped");
            statements.push(t.variableDeclaration("const", [
              t.variableDeclarator(
                mappedId,
                t.callExpression(mappedHelper, [t.arrowFunctionExpression([], sourceArray), mapFn])
              )
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
            t.isArrowFunctionExpression(wrapper.expr) || t.isFunctionExpression(wrapper.expr) ? wrapper.expr : t.arrowFunctionExpression([], wrapper.expr)
          ])
        ));
      } else {
        throw componentPath?.buildCodeFrameError ? componentPath.buildCodeFrameError(
          "WAF: A root-level JSX expression container has no parent element. Wrap your component's return value in a single element or fragment."
        ) : new Error(
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

// compiler/index.js
function compiler_default(babel) {
  const { types: t } = babel;
  return {
    name: "web-compiler",
    visitor: {
      Program: {
        enter(p, state) {
          state.runtimeSource = state.opts.runtimeSource || "@opentf/web";
          state.importsNeeded = /* @__PURE__ */ new Map();
          state.importSources = /* @__PURE__ */ new Map();
          state.components = /* @__PURE__ */ new Map();
          state.macroSignals = /* @__PURE__ */ new Set();
          state.wrapperSignals = /* @__PURE__ */ new Set();
          state.refVars = /* @__PURE__ */ new Set();
          const filename = state.filename || "";
          const pagePatterns = ["page.jsx", "page.tsx", "layout.jsx", "layout.tsx", "404.jsx", "404.tsx"];
          state.isPageFile = pagePatterns.some((p2) => filename.endsWith(p2));
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
          JSXElement() {
            hasJSX = true;
          },
          JSXFragment() {
            hasJSX = true;
          }
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
            JSXElement() {
              hasJSX = true;
            },
            JSXFragment() {
              hasJSX = true;
            }
          });
          if (!hasJSX) return;
          const propsNode = path.node.params[0];
          const observedAttributes = /* @__PURE__ */ new Set();
          if (t.isObjectPattern(propsNode)) {
            propsNode.properties.forEach((prop) => {
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
            JSXElement() {
              hasJSX = true;
            },
            JSXFragment() {
              hasJSX = true;
            }
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
        const macros = ["$state", "$derived", "$effect", "$ref", "$signal", "$expose"];
        path.node.specifiers = path.node.specifiers.filter((spec) => {
          if (t.isImportSpecifier(spec) && macros.includes(spec.imported.name)) {
            return false;
          }
          if (t.isImportDefaultSpecifier(spec) || t.isImportSpecifier(spec)) {
            state.importSources.set(spec.local.name, source);
          }
          return true;
        });
        if (path.node.specifiers.length === 0) {
          path.remove();
        }
      },
      CallExpression(path, state) {
        if (t.isIdentifier(path.node.callee)) {
          const name = path.node.callee.name;
          const getImport = getImportHelper(t, path, state);
          if (name === "$state" || name === "$derived" || name === "$ref") {
            const parent = path.findParent((p) => p.isVariableDeclarator());
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
              const parent2 = path.findParent((p) => p.isVariableDeclarator());
              if (parent2 && t.isIdentifier(parent2.node.id)) {
                state.refVars.add(parent2.node.id.name);
                state.macroSignals.add(parent2.node.id.name);
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
              path.replaceWith(
                t.conditionalExpression(
                  t.unaryExpression("!", isSSGId),
                  effectCall,
                  t.identifier("undefined")
                )
              );
            }
          } else if (name === "$signal") {
            const arg = path.node.arguments[0];
            if (arg) {
              path.replaceWith(arg);
              const parent = path.findParent((p) => p.isVariableDeclarator());
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
            path.node.params.forEach((param) => {
              if (t.isIdentifier(param)) {
                state.macroSignals.add(param.name);
              }
            });
          }
        },
        exit(path, state) {
          if (path.node._isMapCallback) {
            path.node.params.forEach((param) => {
              if (t.isIdentifier(param)) {
                state.macroSignals.delete(param.name);
              }
            });
          }
        }
      },
      MemberExpression(path, state) {
        if (path.node._processed) return;
        if (t.isIdentifier(path.node.object, { name: "props" }) && t.isIdentifier(path.node.property) && path.node.property.name !== "children" && !path.node.property.name.startsWith("on")) {
          if (t.isMemberExpression(path.parentPath.node) && t.isIdentifier(path.parentPath.node.property, { name: "value" })) return;
          path.node._processed = true;
          const newNode = t.memberExpression(path.node, t.identifier("value"));
          newNode._processed = true;
          path.replaceWith(newNode);
          return;
        }
        if (t.isIdentifier(path.node.object) && state.wrapperSignals.has(path.node.object.name) && t.isIdentifier(path.node.property)) {
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
        if (path.parentPath.isJSXExpressionContainer() && path.parentPath.parentPath.isJSXAttribute() && path.parentPath.parentPath.node.name.name === "ref") return;
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
        if (path.findParent((p) => (p.isFunctionDeclaration() || p.isVariableDeclarator()) && /^[A-Z]/.test(p.node.id?.name || p.node.name))) return;
        handleJSXVisitor(path, state, t);
      },
      JSXFragment(path, state) {
        if (path.findParent((p) => (p.isFunctionDeclaration() || p.isVariableDeclarator()) && /^[A-Z]/.test(p.node.id?.name || p.node.name))) return;
        handleJSXVisitor(path, state, t);
      }
    }
  };
}
export {
  compiler_default as default
};
if (typeof module !== "undefined" && module.exports && module.exports.default) module.exports = module.exports.default;
