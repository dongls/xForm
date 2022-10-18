module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.js$": "babel-jest",
    "^.+\\.(svg|png)$": "<rootDir>/scripts/jest/raw-loader.js",
    '^.+\\.tsx?$': ['ts-jest', { babelConfig: true }]
  },
  moduleFileExtensions: ["vue", "js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    "@common/(.*)": "<rootDir>/packages/common/$1",
    "@dongls/xform": "<rootDir>/packages/core/index.ts",
    "\\.module.css$": "identity-obj-proxy"
  },
  setupFiles: [
    '<rootDir>/scripts/jest/setup.js'
  ],
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    customExportConditions: [
      'node',
      'node-addons'
    ]
  },
}