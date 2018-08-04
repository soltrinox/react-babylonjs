const fromPairs = arr =>
    arr.reduce((obj, [key, value]) => Object.assign(obj, { [key]: value }), {});

module.exports = { fromPairs };
