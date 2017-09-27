precision highp float;
#define EDGE_WIDTH 0.02

uniform sampler2D tileTex;
uniform sampler2D edgeTex;
uniform sampler2D cornerTex;

varying vec2 vUVS;
varying vec2 vUV;
varying vec4 vEdgeColor;
varying vec4 vHue;
varying float vWidth;
varying float vHeight;

void main(void) {

  if(vUV.y * vHeight < EDGE_WIDTH
  || vUV.x * vHeight < EDGE_WIDTH
  || vHeight - (vUV.y * vHeight) <= EDGE_WIDTH
  || vWidth - (vUV.x * vWidth) <= EDGE_WIDTH){
    gl_FragColor = vEdgeColor;
  }else{
    glFragColor = texture2D(tileTex, vUVS) * vHue;
  }
}
