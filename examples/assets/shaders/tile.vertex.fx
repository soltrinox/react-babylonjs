precision highp float;

// Attributes
attribute vec3 position;
attribute vec2 uv;

// Uniforms
uniform mat4 worldViewProjection;
uniform float boxSize;
uniform float width;
uniform float height;
uniform vec4 edgeColor;
uniform vec4 hue;

// Varying
varying vec2 vUV;
varying vec2 vUVS;
varying vec4 vEdgeColor;
varying vec4 vHue;
varying float vWidth;
varying float vHeight;

void main(void) {
  gl_Position = worldViewProjection * vec4(position, 1.0);
  vUV = uv;
  vUVS = uv * vec2(width / boxSize, height / boxSize);
  vEdgeColor = edgeColor;
  vHue = hue;
  vWidth = width;
  vHeight = height;
}
