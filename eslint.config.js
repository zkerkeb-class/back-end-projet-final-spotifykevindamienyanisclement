const pluginJs = require("@eslint/js");
const pluginNode = require("eslint-plugin-node");
const pluginPrettier = require("eslint-plugin-prettier");
const pluginTypescript = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");

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
      "no-underscore-dangle": "off",
      "no-param-reassign": "off",
      "no-return-assign": "off",
      "node/no-unpublished-require": "off",
      "node/no-missing-require": "off",
      "node/exports-style": "off", // Disable this rule
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
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
  }
];
