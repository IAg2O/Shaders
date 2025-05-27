#version 120

uniform sampler2D inTexture, textureToCheck;
uniform vec2 offset, halfpixel, iResolution;
uniform int check;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 texCoordOffset = halfpixel * offset;

    vec4 sum = texture2D(inTexture, uv + vec2(-2.0, 0.0) * texCoordOffset);
    sum += texture2D(inTexture, uv + vec2(0.0, 1.0) * texCoordOffset) * 4.0;
    sum += texture2D(inTexture, uv + vec2(0.0, 2.0) * texCoordOffset);
    sum += texture2D(inTexture, uv + vec2(2.0, 0.0) * texCoordOffset);
    sum += texture2D(inTexture, uv + vec2(0.0, -1.0) * texCoordOffset) * 4.0;
    sum += texture2D(inTexture, uv + vec2(0.0, -2.0) * texCoordOffset);

    float alpha = check != 0 ? texture2D(textureToCheck, uv).a : 1.0;
    gl_FragColor = vec4(sum.rgb / 12.0, alpha);
}