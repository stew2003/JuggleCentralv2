module.exports = {
    root: true,
    env: {
      node: true
    },
    extends: [
      'airbnb',
      'prettier',
    ],
    plugins: [
      'prettier'
    ],
    // add your custom rules here
    rules: {
      'prettier/prettier': ['error'],
      "no-console": "off",
      "no-plusplus": "off"
    }
  }
