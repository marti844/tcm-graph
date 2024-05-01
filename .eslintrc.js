module.exports = {
    plugins: ["prettier"],
    parser: "babel-eslint",
    rules: {
    "prettier/prettier": "error",
    },
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
    },
    "extends": ["standard", "plugin:vue/recommended"],
    "plugins": ["html"],
};
