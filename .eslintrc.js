module.exports = {
    parser: "babel-eslint",
    plugins: ["react", "flowtype"],
    env: {
        node: true,
        browser: true,
        es6: true,
        mocha: true,
    },
    extends: "eslint:recommended",
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            jsx: true,
            modules: true,
            classes: true,
        },
        sourceType: "module",
    },
    globals: {
        global: true,
        module: true,
        AWS: true,
        sinon: true,
        expect: true,
        getTargetName: true,
        setupTest: true,
        testHelpers: true,
        // BABYLON: true,
    },
    rules: {
        "flowtype/define-flow-type": 1,
        indent: [
            "error",
            4,
            {
                SwitchCase: 1,
            },
        ],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "react/jsx-uses-vars": [2],
        strict: [2, "safe"],
        "react/jsx-uses-react": 2,
        "react/react-in-jsx-scope": 2,
    },
};
