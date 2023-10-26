module.exports = {
    root: true,
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    parserOptions: {
        project: true
    },
    rules: {
        // Preset rules to disable entirely.
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "prefer-const": "off",
        "no-case-declarations": "off",
        "no-empty": "off",
        "no-extra-boolean-cast": "off",
        "@typescript-eslint/ban-types": "off",

        // Additional or modified rules.
        "semi": ["warn", "always"],
    },
    ignorePatterns: [
        "build/",
        ".eslintrc.cjs",
        "build.js",
        "gulpfile.js",
        "vite.config.ts"
    ]
};
