const transformers = require("../helpers/property-transformers");
const setters = require("../helpers/property-setters");

const createComponent = ({ scene }) => {
    return scene;
};

const props = {
    clearColor: {
        setter: setters.property("clearColor"),
        transformer: transformers.color3,
    },
    ambientColor: {
        setter: setters.property("ambientColor"),
        transformer: transformers.color3,
    },

};

const scene = { type: "scene", createComponent, props };

module.exports = scene;
