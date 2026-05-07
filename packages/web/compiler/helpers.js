let addNamed;
try {
  // Use require for sync loading in Node/Bun environments
  const mod = require("@babel/helper-module-imports");
  addNamed = mod.addNamed;
} catch (e) {
  addNamed = (path, importName, source) => {
    const programPath = path.findParent((p) => p.isProgram());
    // In standalone, we construct the AST nodes manually.
    // Babel's Program body accepts plain objects as nodes.
    
    // 1. Check if it's already in scope and is an import
    const existingBinding = programPath.scope.getBinding(importName);
    if (existingBinding && existingBinding.kind === "module") {
      return existingBinding.identifier;
    }

    // 2. Search through body for existing import from the same source
    const body = programPath.node.body;
    let existingDeclaration = null;
    
    for (const node of body) {
      if (node.type === "ImportDeclaration" && node.source.value === source) {
        existingDeclaration = node;
        for (const specifier of node.specifiers) {
          const isMatch = (specifier.type === "ImportSpecifier" && 
                          (specifier.imported.name === importName || 
                           (specifier.imported.type === "StringLiteral" && specifier.imported.value === importName)));
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
      // 3. If no declaration found, add it to the top
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

export const getMemberName = (t, node) => {
  if (t.isJSXIdentifier(node)) return node.name;
  if (t.isJSXMemberExpression(node)) {
    return `${getMemberName(t, node.object)}.${getMemberName(t, node.property)}`;
  }
  return "";
};

export const getImportHelper = (t, path, state) => (importName, source) => {
  const key = `${importName}:${source}`;
  if (!state.importsNeeded.has(key)) {
    state.importsNeeded.set(key, addNamed(path, importName, source));
  }
  return state.importsNeeded.get(key);
};

export const createIdGenerator = () => {
  let counter = 0;
  return (t, prefix = "el") => t.identifier(`${prefix}${counter++}`);
};
