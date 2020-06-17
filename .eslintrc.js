module.exports = {
    root: true,
    env: {
        node: true,
        jquery: true
    },
    extends: [
        "plugin:vue/essential",
        // "eslint:recommended",
        // "@vue/prettier"
    ],
    rules: {
        "indent":[1,4],

        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
        "semi": 0,
        "comma-dangle":0
        // "quotes": ["error", "double"],
    },
    parserOptions: {
        parser: "babel-eslint"
    }
};
