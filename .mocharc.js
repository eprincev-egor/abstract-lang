"use strict";

const config = {
    recursive: true,
    exit: true,
    spec: [
        "lib/**/*.spec.ts",
        "example/**/*.spec.ts"
    ],
    require: [
      "source-map-support/register",
      "tsconfig-paths/register",
      "ts-node/register"
    ]
};

module.exports = config;