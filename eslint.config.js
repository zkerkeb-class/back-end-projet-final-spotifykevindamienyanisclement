const pluginJs = require("@eslint/js");
const pluginNode = require("eslint-plugin-node");
const pluginPrettier = require("eslint-plugin-prettier");
const pluginTypescript = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: false
        }
      }
    },
    plugins: {
      node: pluginNode,
      prettier: pluginPrettier,
      "@typescript-eslint": pluginTypescript
    },
    rules: {
      "no-console": "off",
      "no-undef": "error",
      "no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_"
        }
      ],
      "no-underscore-dangle": "off",
      "no-param-reassign": "off",
      "no-return-assign": "off",
      "node/no-unpublished-require": "off",
      "node/no-missing-require": "error",
      "node/exports-style": ["error", "module.exports"],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/ban-ts-comment": "off"
    },
    ignores: [
      "dist",
      "build",
      "node_modules",
      ".husky",
      ".vscode",
      ".github",
      "eslint.config.js",
      "**/*.d.ts"
    ]
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      parserOptions: {
        sourceType: "module"
      }
    },
    plugins: {
      node: pluginNode,
      prettier: pluginPrettier
    },
    rules: {
      "no-console": "off",
      "no-undef": "error",
      "no-unused-vars": "error",
      "no-underscore-dangle": "off",
      "no-param-reassign": "off",
      "no-return-assign": "off",
      "node/no-unpublished-require": "off",
      "node/no-missing-require": "warn",
      "node/exports-style": ["error", "module.exports"]
    },
    ignores: [
      "dist",
      "build",
      "node_modules",
      ".husky",
      ".vscode",
      ".github",
      "eslint.config.js",
      "commitlint.config.js"
    ]
  }
];
