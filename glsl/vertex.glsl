#version 300 es

// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 knitPosition;
uniform vec3 lightPosition;
uniform float xRange;
uniform float zRange;

// HINT: YOU WILL NEED AN ADDITIONAL UNIFORM VARIABLE TO MAKE THE BUNNY HOP

// Create shared variable for the vertex and fragment shaders

out vec2 vUv;
out vec3 interpolatedNormal;
out vec3 lightDirection;
out vec3 colour;
out float z;

out vec3 normalizedNormal;
out vec3 cameraPos;
out vec3 pos;

void main() {
    interpolatedNormal = normal;
    vec4 worldLightPosition = modelMatrix * vec4(lightPosition, 1.0);
    vec4 worldVertexPosition = (modelMatrix * vec4(position, 1.0)) + modelMatrix * vec4(knitPosition,1.0);

    // assuming this is the correct direction of light
    vec4 dir = worldVertexPosition - worldLightPosition;
    lightDirection = dir.xyz;

    normalizedNormal = normalize(normal);
    
    cameraPos = cameraPosition;
    pos = (modelMatrix * vec4(position, 1.0)).xyz;

    // Multiply each vertex by the model matrix to get the world position of each vertex, then the view matrix to get the position in the camera coordinate system, 
    // and finally the projection matrix to get final vertex position
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vUv = vec2(position.x / xRange, position.z / zRange);
    //vUv = uv;
    colour = position;
}