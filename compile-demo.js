import { compile } from "./packages/web/compiler/index.js";
import { readFileSync } from "fs";
const code = readFileSync("playground/app/reconnect-demo/page.jsx", "utf-8");
console.log(compile(code));
