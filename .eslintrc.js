module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ["eslint:recommended", "plugin:vue/strongly-recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    parser: "babel-eslint",
    ecmaVersion: 2018,
    sourceType: "module"
  },
  plugins: ["vue"],
  rules: {
    //Best Practices
    "no-else-return": ["error"],
    "no-empty-function": "error",

    // Possible Errors
    "require-atomic-updates": "off",

    // Variables
    "no-unused-vars": ["error", { "argsIgnorePattern": "h|event"}],
    "no-multi-spaces": "off",
    "no-use-before-define": ["error", { "functions": false }],

    // Stylistic Issues
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "spaced-comment": ["warn", "always"], // 注释之前 跟一个空格
    "comma-spacing": ["error", { "before": false, "after": true }], // 逗号间距
    "computed-property-spacing": ["error", "never"], // 禁止属性内的空格
    "brace-style": ["error", "1tbs", { "allowSingleLine": true }],
    "comma-spacing": "warn",
    "key-spacing": "warn",

    // ECMAScript 6
    "no-duplicate-imports": "error",

    // Vue
    "vue/max-attributes-per-line": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/name-property-casing": ["error", "kebab-case"],
    "vue/html-closing-bracket-spacing": "off"
  }
};
