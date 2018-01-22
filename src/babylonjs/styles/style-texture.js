const createComponent = ({ BABYLON, scene }, props) => {
    const component = new BABYLON.Texture(props.url, scene);
    return component;
};

const props = {
    url: { newComponentRequired: true },
};

const texture = {
    superTypes: ["texture"],
    type: "texture",
    createComponent,
    props,
};

module.exports = texture;
