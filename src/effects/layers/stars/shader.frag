#version 300 es
precision highp float;

uniform float iTime;       // elapsed time, seconds
uniform vec3  iResolution; // x/y: canvas size in device pixels, z: device pixel ratio
uniform float isLightMode; // 0 = dark mode (roaring fire), 1 = light mode (put out, smoking)

out vec4 fragColor;

const float PI = 3.1415926535897932384626433832795;

// 2D hash -> [0,1]. From https://www.shadertoy.com/view/4djSRW
float prng(vec2 seed) {
    seed = fract(seed * vec2(5.3983, 5.4427));
    seed += dot(seed.yx, seed.xy + vec2(21.5351, 14.3137));
    return fract(seed.x * seed.y * 95.4337);
}

// Sparse twinkling starfield, confined to the sky by skyMask.
vec3 stars(vec2 fragCoord, float time, float skyMask) {
    float starGridSize = 10.0; // px — spacing between star cells; smaller = denser
    float starCoverage = 0.25; // fraction of cells that contain a star

    vec2 starCell    = floor(fragCoord / starGridSize);
    vec2 starLocalUV = fract(fragCoord / starGridSize);

    if (prng(starCell) > 1.0 - starCoverage) {
        vec2  starOffset = vec2(prng(starCell + 4.7), prng(starCell + 9.3));
        float dist        = length(starLocalUV - starOffset);

        float sizeRandom = prng(starCell + 1.1);
        float starSize   = mix(0.015, 0.25, pow(sizeRandom, 3.0)); // most stars small, a few large
        float starCore   = 1.0 - smoothstep(0.0, starSize, dist);

        // Per-star pulse: unique speed + phase so stars don't twinkle in sync.
        float pulseSpeed = mix(0.5, 2.0, prng(starCell + 2.3));
        float pulsePhase = 2.0 * PI * prng(starCell + 7.1);
        float twinkle    = 0.5 + 0.5 * sin(time * pulseSpeed + pulsePhase);

        float brightness = starCore * mix(0.05, 0.5, twinkle);
        brightness *= mix(0.7, 1.0, sizeRandom); // bigger stars shine a bit brighter
        return vec3(brightness) * skyMask;
    }
    return vec3(0.0);
}

void main() {
    float pixelRatio = iResolution.z > 0.0 ? iResolution.z : 1.0; // guard against an unset uniform
    vec2  fragCoord   = gl_FragCoord.xy / pixelRatio;

    vec2  resolution = iResolution.xy / pixelRatio;
    float time = iTime;
    float effectiveHeight = resolution.y;
    float heightFrac = fragCoord.y / effectiveHeight; // 0 at the base, 1 at the canvas top

    float skyMask   = 1.0;
    vec3  starLayer = stars(fragCoord, time, skyMask);

    // float alpha = mix(starLayer, vec3(0.0), isLightMode)
    vec3 color = mix(starLayer, vec3(0.0), 0.0);
    float alpha = max(starLayer.r, max(starLayer.g, starLayer.b));

    fragColor = vec4(color, alpha);
}
