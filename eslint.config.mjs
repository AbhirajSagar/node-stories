import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    env: {
      browser: true,
      node: true,
    },
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
      },
    },
    rules: {
      "curly": ["error", "all"], // require braces on all blocks
      "brace-style": ["error", "allman", { "allowSingleLine": false }], // C# style braces
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "indent": ["error", 4], // 4 spaces
      "comma-dangle": ["error", "always-multiline"],
      "no-trailing-spaces": "error",
      "space-before-function-paren": ["error", "never"]
    },
  },
]);

export default eslintConfig;
