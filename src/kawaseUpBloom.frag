#version 120

uniform sampler2D inTexture, textureToCheck;
uniform vec2 halfpixel, offset, iResolution;
uniform int check;

vec4 bloomSample(vec2 baseUV, vec2 direction) {
    vec4 smpl = texture2D(inTexture, baseUV + direction);
    smpl.rgb *= smpl.a;
    return smpl;
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution;
    vec2 texCoordOffset = halfpixel * offset;


    vec2[8] offsets = vec2[8](
    vec2(-2.0, 0.0) * texCoordOffset,
    vec2(-1.0, 1.0) * texCoordOffset,
    vec2(0.0, 2.0) * texCoordOffset,
    vec2(1.0, 1.0) * texCoordOffset,
    vec2(2.0, 0.0) * texCoordOffset,
    vec2(1.0, -1.0) * texCoordOffset,
    vec2(0.0, -2.0) * texCoordOffset,
    vec2(-1.0, -1.0) * texCoordOffset
    );

    vec4 sum = bloomSample(uv, offsets[0]);
    sum += bloomSample(uv, offsets[1]) * 2.0;
    sum += bloomSample(uv, offsets[2]);
    sum += bloomSample(uv, offsets[3]) * 2.0;
    sum += bloomSample(uv, offsets[4]);
    sum += bloomSample(uv, offsets[5]) * 2.0;
    sum += bloomSample(uv, offsets[6]);
    sum += bloomSample(uv, offsets[7]) * 2.0;

    vec4 result = sum / 12.0;
    float maskAlpha = texture2D(textureToCheck, gl_TexCoord[0].st).a;
    gl_FragColor = vec4(result.rgb / result.a, mix(result.a, result.a * (1.0 - maskAlpha), check));
}