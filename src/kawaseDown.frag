#version 120

uniform sampler2D inTexture;
uniform vec2 offset, halfpixel, iResolution;

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 texCoordOffset = halfpixel * offset;
    vec2 diagonalOffset = vec2(texCoordOffset.x, -texCoordOffset.y);

    vec4 sum = texture2D(inTexture, uv) * 4.0;
    sum += texture2D(inTexture, uv - texCoordOffset);
    sum += texture2D(inTexture, uv + texCoordOffset);
    sum += texture2D(inTexture, uv + diagonalOffset);
    sum += texture2D(inTexture, uv - diagonalOffset);

    gl_FragColor = vec4(sum.rgb * 0.125, 1.0);
}