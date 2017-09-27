precision highp float;
#define M_PI 3.1415926535897932384626433832795

// Attributes
attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

// Uniforms
uniform mat4 worldViewProjection;
uniform vec4 boxColor;
uniform vec4 edgeColor;
uniform float rotateTex;

// Varying
varying vec3 vPosition;
varying vec2 vUVR;
varying vec2 vUV;
varying vec3 vNrm;
varying vec4 vColor;
varying vec4 vEdgeColor;

void main(void) {
    gl_Position = worldViewProjection * vec4(position, 1.0);
    float angle = rotateTex * M_PI / 180.0;
    vUV = uv;
    vUVR = uv + vec2(-0.5, -0.5);
    vUVR = vUVR * mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
    vUVR = vUVR + vec2(0.5, 0.5);
    vNrm = normal;
    vPosition = position;
    vColor = boxColor;
    vEdgeColor = edgeColor;
}
