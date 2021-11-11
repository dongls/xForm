module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    es2020: true,
    node: true,
    jest: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: { 
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended'
  ],
  ignorePatterns: [
    '__private__',
    'dist/',
    'docs/',
    'types/',
    'node_modules/',
    'babel.config.js',
    'jest.config.js',
    'postcss.config.js',
  ],
  rules: {
    // Best Practices
    'no-else-return': 'error',
    'no-empty-function': 'error',

    // Possible Errors
    'require-atomic-updates': 'off',
    'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

    // Variables
    'no-use-before-define': ['error', { 'functions': false }],

    // Stylistic Issues
    'semi': ['warn', 'never'],
    'indent': 'off',
    'quotes': ['error', 'single'],
    'spaced-comment': ['warn', 'always'], // 注释之前 跟一个空格
    'comma-spacing': ['error', { 'before': false, 'after': true }], // 逗号间距
    'computed-property-spacing': ['error', 'never'], // 禁止属性内的空格
    'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
    'key-spacing': 'warn',
    'object-curly-spacing': ['warn', 'always'],

    // ECMAScript 6
    'no-duplicate-imports': 'error',

    // typescript
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': 'h|event' }],
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { 'functions': false, 'classes': true, 'variables': true }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/indent': ['error', 2],
    
    // Vue
    'vue/component-definition-name-casing': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/order-in-components': ['error', {
      'order': [
        'name',
        'inheritAttrs',
        'el',
        'parent',
        ['delimiters', 'comments'],
        'extends',
        'mixins',
        'model',
        ['props', 'propsData'],
        'fetch',
        'asyncData',
        'data',
        'computed',
        'watch',
        'methods',
        'LIFECYCLE_HOOKS',
        'head',
        ['template', 'render'],
        'renderError',
        ['components', 'directives', 'filters'],
      ]
    }],
    'vue/max-attributes-per-line': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/no-v-html': 'off',
    'vue/one-component-per-file': 'off',
    'vue/attributes-order': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'vue/multi-word-component-names': 'off'
  },
  overrides: [
    {
      files: ['scripts/**/*'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'no-console': 'off'
      }
    },
    {
      files: ['**.d.ts'],
      rules: {
        'no-var': 'off'
      }
    }
  ]
}