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
      "ts-node/register",
      "tsconfig-paths/register"
    ]
};

module.exports = config;