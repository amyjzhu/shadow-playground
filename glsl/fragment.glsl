#version 300 es

precision highp float;
precision highp int;
out vec4 out_FragColor;

in vec3 interpolatedNormal;
in vec3 lightDirection;
in vec3 colour;
in vec2 vUv;
in float z;
uniform sampler2D colorMap;

uniform vec3 lightColor;
uniform float kAmbient;
uniform float kDiffuse;

in vec3 normalizedNormal;
in vec3 pos;
in vec3 cameraPos;

void main() {

    //float intensity = dot(normalize(lightDirection), interpolatedNormal);
    //if (intensity < 0.0) {
    //    intensity = 0.0;
    //}
    
    vec3 mainColor = texture(colorMap, vUv).rgb;
    //out_FragColor = vec4(mainColor, intensity);
    //out_FragColor = vec4(colour, 1.0);

	vec3 lightDir = normalize(lightDirection);
	vec3 normal = normalize(normalizedNormal);
	vec3 viewDir = normalize(cameraPos - pos);

	//AMBIENT
	vec3 light_AMB = kAmbient * mainColor;

	//DIFFUSE
	float intensity = max(0.0, dot(normal, lightDir)) * kDiffuse;
	vec3 light_DFF = intensity * lightColor;

	//TOTAL
	vec3 TOTAL = light_AMB + light_DFF;
	out_FragColor = vec4(TOTAL, 1.0);
	
}
