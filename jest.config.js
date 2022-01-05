module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      babelConfig: true,
    }
  },
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.js$": "babel-jest",
    "^.+\\.(svg|png)$": "<rootDir>/scripts/jest/raw-loader.js"
  },
  moduleFileExtensions: ["vue", "js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    "@common/(.*)": "<rootDir>/packages/common/$1",
    "@dongls/xform": "<rootDir>/packages/core/index.ts"
  },
  setupFiles: [
    '<rootDir>/scripts/jest/setup.js'
  ],
  testEnvironment: "jsdom"
}