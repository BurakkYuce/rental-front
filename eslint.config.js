import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "dist/**", // Global ignore (applies to all configs)
      "public/js/plugins.js", // Specific ignore for JS/JSX files
    ],
  },
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs["recommended-latest"],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },
  {
    files: ["public/js/plugins.js"],
    languageOptions: {
      ecmaVersion: 5,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.amd,
        jQuery: "readonly",
        $: "readonly",
        global: "readonly",
        module: "readonly",
        exports: "readonly",
        require: "readonly",
        define: "readonly",
        ActiveXObject: "readonly",
        XMLHttpRequest: "readonly",
        window: "readonly",
        document: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
      parserOptions: {
        ecmaVersion: 5,
        sourceType: "script",
      },
    },
    rules: {
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-redeclare": "off",
      "no-func-assign": "off",
      "no-empty": "off",
      "no-unreachable": "off",
      "prefer-const": "off",
      "no-var": "off",
      "no-inner-declarations": "off",
      "no-useless-escape": "off",
    },
  },
]);
