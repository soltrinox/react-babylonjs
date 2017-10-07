precision highp float;
#define EDGE_WIDTH 0.01

// Varying
varying vec3 vPosition;
varying vec2 vUV;
varying vec2 vUVR;
varying vec3 vNrm;
varying vec4 vColor;
varying vec4 vEdgeColor;

uniform sampler2D textureSampler;

void main(void) {
  if(vUV.y < EDGE_WIDTH
  || EDGE_WIDTH > 1.0 - vUV.y
  || vUV.x < EDGE_WIDTH
  || EDGE_WIDTH > 1.0 - vUV.x){
    gl_FragColor = vEdgeColor;
  }else{
    if(vNrm.y > 0.){
      gl_FragColor = texture2D(textureSampler, vUVR);
    }else{
      gl_FragColor = vColor;
    }
  }
}
