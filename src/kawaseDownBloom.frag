#version 120

uniform sampler2D inTexture;
uniform vec2 offset, halfpixel, iResolution;

vec4 bloomSample(vec2 baseUV, vec2 direction) {
    vec4 smpl = texture2D(inTexture, baseUV + direction);
    smpl.rgb *= smpl.a;
    return smpl;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 texCoordOffset = halfpixel * offset;


    vec2[4] offsets = vec2[4](
    -texCoordOffset,
    texCoordOffset,
    vec2(texCoordOffset.x, -texCoordOffset.y),
    vec2(-texCoordOffset.x, texCoordOffset.y)
    );

    vec4 sum = bloomSample(uv, vec2(0.0)) * 4.0;
    for(int i = 0; i < 4; i++) {
        sum += bloomSample(uv, offsets[i]);
    }

    vec4 result = sum / 8.0;
    gl_FragColor = vec4(result.rgb / result.a, result.a);
}