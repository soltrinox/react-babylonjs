const _definitions = [
    require('./def-cameras'),
    require('./def-lights'),
    require('./def-materials'),
    require('./def-meshes'),
    require('./def-parents'),
    require('./def-textures'),
    require('./def-scene'),
];

const R = require('ramda');
module.exports = R.reduce(R.concat, [], _definitions);
