"use strict";

const path = require("path");

const getTargetName = unitTestName => {
    const arr = unitTestName.split(path.sep);
    let lastWasTests = false;
    for (let i = 0; i < arr.length; i++) {
        const folder = arr[i];
        if (folder === "tests") {
            lastWasTests = true;
            continue;
        }

        if (lastWasTests) {
            if (folder !== "unit") {
                break;
            }

            const fullPath = arr
                .slice(0, i - 1)
                .concat(["src"])
                .concat(arr.slice(i + 1, arr.length))
                .join(path.sep)
                .replace(/\.spec\.js$/, "");

            const caption = arr
                .slice(i + 1, arr.length)
                .join(" -> ")
                .replace(/\.spec\.js$/, "");

            return { fullPath, caption };
        }
    }
    throw new Error(
        `The test [${unitTestName}] should within "tests/unit" folder.`
    );
};

global.expect = require("chai").expect;
global.sinon = require("sinon");
global.getTargetName = getTargetName;
global.setupTest = require("./setup-test");
global.testHelpers = require("./test-helpers");
