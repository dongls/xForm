module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      babelConfig: true,
      tsConfig: {
        module: 'commonjs'
      }
    }
  },
  transform: {
    "^.+\\.vue$": "vue-jest",
    "^.+\\.js$": "babel-jest",
    "^.+\\.(svg|png)$": "<rootDir>/scripts/jest/raw-loader.js"
  },
  moduleFileExtensions: ["vue", "js", "jsx", "ts", "tsx"],
  moduleNameMapper: {
    "@core/(.*)": "<rootDir>/packages/core/$1",
    "@common/(.*)": "<rootDir>/packages/common/$1",
  },
  setupFiles: [
    '<rootDir>/scripts/jest/setup.js'
  ]
}