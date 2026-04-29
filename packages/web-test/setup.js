import "./init-dom.js";
import { plugin } from "bun";
import babel from "@babel/core";
import fs from "fs";
import { cleanup } from "./index.js";
import { afterEach } from "bun:test";

plugin({
  name: "webapp-jsx-compiler",
  setup(build) {
    build.onLoad({ filter: /\.jsx$/ }, async (args) => {
      // Dynamically import inside the callback so we don't delay onLoad registration
      const { default: frameworkPlugin } = await import("@opentf/web/compiler");
      
      const source = await fs.promises.readFile(args.path, "utf8");
      
      const result = babel.transformSync(source, {
        plugins: ["@babel/plugin-syntax-jsx", [frameworkPlugin]],
        filename: args.path,
        configFile: false,
        babelrc: false,
      });

      return {
        contents: result.code,
        loader: "js",
      };
    });
  },
});

afterEach(() => {
  cleanup();
});
