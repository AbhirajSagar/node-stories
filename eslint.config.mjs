import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

const eslintConfig = defineConfig([
    ...nextVitals,
    prettier,
    globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
    {
        plugins: {
            prettier: prettierPlugin,
        },
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
            "prettier/prettier": "error",
            curly: ["error", "all"],
            "brace-style": ["error", "allman", { allowSingleLine: false }],
            "arrow-body-style": ["error", "always"],
            semi: ["error", "always"],
            quotes: ["error", "double"],
            indent: ["error", 4],
            "comma-dangle": ["error", "always-multiline"],
            "no-trailing-spaces": "error",
            "space-before-function-paren": ["error", "never"],
        },
    },
]);

export default eslintConfig;
