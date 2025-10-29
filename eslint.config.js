import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import localPlugin from "./eslint-plugin-local/index.js";

export default [
  {
    ignores: [
      "dist",
      "convex/_generated",
      "node_modules",
      "blueprint-templates",
      "eslint-plugin-local",
      "*.config.js",
      "*.config.ts",
      "*.config.mts",
      "*.config.cjs",
      "coverage",
      ".vite",
      ".convex",
      "build",
      "e2e"
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      local: localPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-empty-pattern": "off",
      curly: ["error", "multi"],
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-unused-vars": [
        "off",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "prefer-const": ["error", { destructuring: "all" }],
      "no-var": "error",
      "no-negated-condition": "warn",
      "no-extra-boolean-cast": "error",
      "no-unneeded-ternary": "error",


      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/consistent-type-imports": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector: "SwitchStatement",
          message:
            "Switch statements are not allowed. Use if-else with early returns instead.",
        },
      ],

      // Custom local rules
      "local/no-hoisted-single-use-handlers": "error",
    },
  },
  // Apply max-lines-per-function only to React component files (.tsx)
  {
    files: ["**/*.tsx"],
    ignores: ["**/Houses.tsx"],
    rules: {
      "max-lines-per-function": [
        "warn",
        { max: 150, skipBlankLines: true, skipComments: true },
      ],
    },
  },
];
