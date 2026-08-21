#version 300 es
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float isLightMode;

out vec4 fragColor;

const float PI = 3.1415926535897932384626433832795;

float prng(vec2 seed) {
    seed = fract(seed * vec2(5.3983, 5.4427));
    seed += dot(seed.yx, seed.xy + vec2(21.5351, 14.3137));
    return fract(seed.x * seed.y * 95.4337);
}

float falloffFromCenter(float distFromCenter, float width) {
    return clamp(1.0 - abs(2.0 * distFromCenter / width), 0.0, 1.0);
}

void main() {
    float pixelRatio = iResolution.z > 0.0 ? iResolution.z : 1.0;
    vec2  fragCoord   = gl_FragCoord.xy / pixelRatio;

    float fireBaseOffset = 110.0;
    fragCoord.y -= fireBaseOffset;
    if (fragCoord.y < 0.0) {
        fragColor = vec4(0.0);
        return;
    }

    vec2  resolution = iResolution.xy / pixelRatio;
    float time = iTime;
    float effectiveHeight = resolution.y - fireBaseOffset;
    float heightFrac = fragCoord.y / effectiveHeight;

    float fadeHeight = max(mix(275.0, 0.0, isLightMode), 1e-4);
    float yFade          = fragCoord.y / fadeHeight;
    float yFadeClamped   = min(yFade, 1.0);
    float yFadeRemaining = 1.0 - yFadeClamped;

    float fireWidthPx    = 200.0;
    float fireCenterX    = resolution.x * 0.5;
    float distFromCenter = fragCoord.x - fireCenterX;
    float fireXFuel = falloffFromCenter(distFromCenter, fireWidthPx);

    float driftTimeSpeed = 0.6;
    float scaledTime     = driftTimeSpeed * time;

    float noiseScale = 0.32;
    vec2  noiseFragCoord = fragCoord * noiseScale;
    float fireXPos = 0.5 + distFromCenter / fireWidthPx;

    float yr2  = yFadeRemaining * yFadeRemaining;
    float yr4  = yr2 * yr2;
    float yr8  = yr4 * yr4;
    float yr16 = yr8 * yr8;
    float yr32 = yr16 * yr16;
    float yr64 = yr32 * yr32;

    vec3 flow = vec3(
        4.1 * (0.5 - fireXPos) * yr4,
       -2.0 * fireXFuel        * yr64,
        0.0
    );

    vec3 sparks = vec3(0.0);
    float sparkSpeed    = 100.0;
    float sparkGridSize = 13.0;
    vec2  sparkFlow  = vec2(flow.x * 0.35, flow.y);
    vec2  sparkCoord = noiseFragCoord - vec2(0.0, sparkSpeed * scaledTime);

    // Step timeline: each spark jumps between two random states per time-step
    // and blends smoothly between them, instead of drifting continuously.
    float sparkStepTime  = 6.0 * time;
    float sparkStepIndex = floor(sparkStepTime);
    float sparkStepBlend = smoothstep(0.0, 1.0, fract(sparkStepTime));

    vec2 sparkCellId = floor(sparkCoord / sparkGridSize); // stable per-spark identity for hashing

    vec2 jitterA = vec2(
        prng(sparkCellId + vec2(sparkStepIndex,       0.0)),
        prng(sparkCellId + vec2(sparkStepIndex,       91.7))
    );
    vec2 jitterB = vec2(
        prng(sparkCellId + vec2(sparkStepIndex + 1.0, 0.0)),
        prng(sparkCellId + vec2(sparkStepIndex + 1.0, 91.7))
    );
    vec2 sparkJitter = mix(jitterA, jitterB, sparkStepBlend) * 2.0 - 1.0;

    sparkCoord -= 0.5 * sparkJitter;
    sparkCoord += 50.0 * sparkFlow;
    // Stagger alternate rows so sparks don't line up in a visible grid.
    if (mod(sparkCoord.y / sparkGridSize, 2.0) < 1.0) sparkCoord.x += 0.5 * sparkGridSize;

    vec2  sparkGridIndex = floor(sparkCoord / sparkGridSize);
    float sparkRandom    = prng(sparkGridIndex);
    float sparkLife = min(
        10.0 * (1.0 - min(
            (sparkGridIndex.y + (sparkSpeed * scaledTime / sparkGridSize)) / (30.0 - 20.0 * sparkRandom),
            1.0)),
        1.0);

    float sparkSpread  = mix(1.0, 20.0, heightFrac); // sparks fan out as they rise
    float sparkWidthPx = fireWidthPx * sparkSpread;
    float sparkXFuel = falloffFromCenter(distFromCenter, sparkWidthPx);

    float sparkChanceDark  = 0.30; // normal spark rate at night
    float sparkChanceLight = 0.15; // fewer sparks when put out in daytime
    float sparkSpawnChance = mix(sparkChanceDark, sparkChanceLight, isLightMode);

    if (sparkLife > 0.0 && prng(sparkGridIndex + 13.37) < sparkSpawnChance) {
        float sparkSize     = sparkXFuel * sparkXFuel * sparkRandom * 0.08;
        float sparkRadians  = 999.0 * sparkRandom * 2.0 * PI + 2.0 * time;
        vec2  sparkCircular = vec2(sin(sparkRadians), cos(sparkRadians));
        vec2  sparkOffset   = (0.5 - sparkSize) * sparkGridSize * sparkCircular;
        vec2  sparkModulus  = mod(sparkCoord + sparkOffset, sparkGridSize) - 0.5 * vec2(sparkGridSize);
        float sparkLength   = length(sparkModulus);
        float sparksGray    = max(0.0, 1.0 - sparkLength / (sparkSize * sparkGridSize));
        sparks = sparkLife * sparksGray * vec3(1.0, 0.3, 0.0);
    }

    float alpha = clamp(max(sparks.r, max(sparks.g, sparks.b)), 0.0, 1.0);
    vec3  color = sparks;

    fragColor = vec4(color, alpha);
}
