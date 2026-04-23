module.exports = {
  plugins: [
    "@babel/plugin-syntax-jsx",
    ["./compiler/babel-plugin.cjs", { "runtimeSource": "../index.js" }]
  ]
};
