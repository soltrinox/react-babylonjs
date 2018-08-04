const path = require("path");
const R = require("ramda");
const findIndexOfTwoSequence = (folder1, folder2, array) => {
    let i = 0;
    let found = undefined;
    R.zipWith(
        (a, b) => {
            if (found === undefined && a === folder1 && b === folder2) {
                found = i;
            }
            i++;
        },
        R.dropLast(1, array),
        R.drop(1, array)
    );
    return found;
};

const getTargetName = unitTestName => {
    const arr = unitTestName.split(path.sep);
    const indexOfTests = findIndexOfTwoSequence("tests", "unit", arr);

    if (indexOfTests === undefined) {
        throw new Error(
            `The test [${unitTestName}] should be within "tests/unit" folder.`
        );
    }

    const fullPath = arr
        .slice(0, indexOfTests)
        .concat(arr.slice(indexOfTests + 2, arr.length))
        .join(path.sep)
        .replace(/\.spec\.js$/, "");

    const caption = arr
        .slice(indexOfTests + 2, arr.length)
        .join(" -> ")
        .replace(/\.spec\.js$/, "");

    return { fullPath, caption };
};

global.expect = require("chai").expect;
global.sinon = require("sinon");
global.getTargetName = getTargetName;
global.setupTest = require("./setup-test");
global.testHelpers = require("./test-helpers");
