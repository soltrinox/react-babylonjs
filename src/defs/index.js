const _definitions = [
    require('./def-cameras'),
    require('./def-lights'),
    require('./def-material'),
    require('./def-meshes'),
    require('./def-parents'),
    require('./def-textures'),
];

const R = require('ramda');
module.exports = R.reduce(R.concat, [], _definitions);
