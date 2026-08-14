#version 300 es
precision highp float;

// Converted from Shadertoy for WebGL2 / GLSL ES 3.0. #version must be the
// literal first line for strict ES-profile compilers (some mobile WebViews
// enforce this even where desktop browsers are lenient), so this note lives
// here instead of above it.
// For desktop OpenGL 3.3: use "#version 330 core" in place of the two lines
// above, and drop the "precision highp float;" line.

uniform float iTime;       // elapsed time, seconds
uniform vec3  iResolution; // x/y: canvas size in device pixels, z: device pixel ratio
uniform float isLightMode; // 0 = dark mode (roaring fire), 1 = light mode (put out, smoking)

out vec4 fragColor;

const float PI = 3.1415926535897932384626433832795;

// ---------------------------------------------------------------------------
// Simplex noise (Ashima Arts / McEwan). Standard implementation, treat as a
// black box — the interesting tuning happens in main() below.
// ---------------------------------------------------------------------------
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3  ns  = n_ * D.wyz - D.xzx;

    vec4 j  = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = inversesqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// 2D hash -> [0,1]. From https://www.shadertoy.com/view/4djSRW
float prng(vec2 seed) {
    seed = fract(seed * vec2(5.3983, 5.4427));
    seed += dot(seed.yx, seed.xy + vec2(21.5351, 14.3137));
    return fract(seed.x * seed.y * 95.4337);
}

// Fractal noise: blends up to 4 progressively finer, weaker octaves of
// simplex noise. Returns [0, 1] (raw snoise is [-1, 1]).
float noiseStack(vec3 pos, int octaves, float falloff) {
    float n = snoise(pos);
    float amp = 1.0;
    for (int i = 1; i < octaves; i++) {
        pos *= 2.0;
        amp *= falloff;
        n = mix(n, snoise(pos), amp);
    }
    return n * 0.5 + 0.5;
}

// Triangular falloff: 1.0 at the centerline, 0.0 at +/- half of `width`.
// Used to fade the fire, smoke, and sparks out horizontally.
float falloffFromCenter(float distFromCenter, float width) {
    return clamp(1.0 - abs(2.0 * distFromCenter / width), 0.0, 1.0);
}

// Sparse twinkling starfield, confined to the sky by skyMask.
vec3 stars(vec2 fragCoord, float time, float skyMask) {
    float starGridSize = 10.0; // px — spacing between star cells; smaller = denser
    float starCoverage = 0.15; // fraction of cells that contain a star

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

        float brightness = starCore * mix(0.1, 0.6, twinkle);
        brightness *= mix(0.7, 1.0, sizeRandom); // bigger stars shine a bit brighter
        return vec3(brightness) * skyMask;
    }
    return vec3(0.0);
}

void main() {
    // ---- Device-pixel-ratio-independent coordinates ------------------------
    // gl_FragCoord is in physical/device pixels, which differ a lot between a
    // 1x desktop monitor and a 3x retina phone. Dividing by iResolution.z (the
    // device pixel ratio) puts everything below into CSS-pixel-like units, so
    // every pixel-based tunable in this file means the same physical size on
    // any screen.
    float pixelRatio = iResolution.z > 0.0 ? iResolution.z : 1.0; // guard against an unset uniform
    vec2  fragCoord   = gl_FragCoord.xy / pixelRatio;

    // Shift the fire's base up so it sits on top of a campfire graphic;
    // pixels below the new base are fully transparent.
    float fireBaseOffset = 110.0; // px — tune to line up with your background art
    fragCoord.y -= fireBaseOffset;
    if (fragCoord.y < 0.0) {
        fragColor = vec4(0.0);
        return;
    }

    vec2  resolution = iResolution.xy / pixelRatio;
    float time = iTime;
    float effectiveHeight = resolution.y - fireBaseOffset;
    float heightFrac = fragCoord.y / effectiveHeight; // 0 at the base, 1 at the canvas top

    // Vertical fade: in dark mode the flame reaches ~300px before fading; in
    // light mode ("put out") it's suppressed almost to nothing at the base.
    float fadeHeight = max(mix(300.0, 0.0, isLightMode), 1e-4); // px; epsilon avoids /0
    float yFade          = fragCoord.y / fadeHeight;
    float flameFalloff   = clamp(2.0 - yFade, 0.0, 1.0); // soft ceiling above the fade band
    float yFadeClamped   = min(yFade, 1.0);
    float yFadeRemaining = 1.0 - yFadeClamped;

    // Horizontal falloff: 1.0 on the fire's centerline, 0.0 past its width.
    float fireWidthPx    = 200.0; // px — desired fire width, tune to taste
    float fireCenterX    = resolution.x * 0.5; // or any fixed screen position
    float distFromCenter = fragCoord.x - fireCenterX;
    float fireXFuel = falloffFromCenter(distFromCenter, fireWidthPx);

    float driftTimeSpeed = 0.6; // speed of coordinate drift through the noise field
    float flowTimeSpeed  = 1.0; // speed of the turbulent flow field
    float scaledTime     = driftTimeSpeed * time;

    float noiseScale = 0.32; // px -> noise-space units; controls the turbulence's zoom level
    vec2  noiseFragCoord = fragCoord * noiseScale;
    vec2  noiseXY  = 0.07 * noiseFragCoord - 0.02;
    vec3  position = vec3(noiseXY, 0.0) + vec3(1223.0, 6434.0, 8425.0); // offset away from noise(0,0,0)

    float fireXPos = 0.5 + distFromCenter / fireWidthPx; // 0..1 across the fire's own width

    // Powers of yFadeRemaining via repeated squaring — cheaper than pow().
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
    vec3 timing = (flowTimeSpeed * time) * vec3(0.0, -1.7, 1.1) + flow;

    vec3  noiseCoord = vec3(2.0, 1.0, 1.0) * position + timing + 0.4;
    float fireNoise  = noiseStack(noiseCoord, 2, 0.4);

    float flames = pow(yFadeClamped * fireNoise, 0.3 * fireXFuel);

    // (1 - flames^3)^8, again via repeated squaring.
    float flamesTerm  = 1.0 - flames * flames * flames;
    float flamesTerm2 = flamesTerm  * flamesTerm;
    float flamesTerm4 = flamesTerm2 * flamesTerm2;
    float flamesTerm8 = flamesTerm4 * flamesTerm4;

    // Colour grading: raising the same shape value to higher powers lights up
    // only the hottest pixels, giving a red -> orange -> white-hot gradient.
    float flameShape  = flameFalloff * flamesTerm8;
    float flameShape3 = flameShape * flameShape * flameShape;
    vec3 fire = 1.5 * vec3(flameShape, flameShape3, flameShape3 * flameShape3);
    fire *= mix(1.0, 0.15, isLightMode); // dim to embers instead of a full flame

    // Jagged base mask: breaks up the flame's bottom edge into flickering
    // tongues, confined to a thin band near the fire's base.
    float baseTongueScale  = 0.015;
    float baseFlickerSpeed = 0.6;
    float baseBandHeight   = 90.0; // px — height of the jagged zone

    float baseMask = 1.0;
    if (fragCoord.y < baseBandHeight) {
        float baseNoise = noiseStack(
            vec3(fragCoord.x * baseTongueScale, 50.0, scaledTime * baseFlickerSpeed),
            1, 0.5
        );
        baseMask = smoothstep(0.0, baseBandHeight * baseNoise, fragCoord.y);
    }
    fire *= baseMask;

    // Smoke
    float smokeSpeedY = 0.4;
    float smokeNoise1 = snoise(0.3 * position + timing * vec3(1.4, 1.4 * smokeSpeedY, 0.6));
    float smokeNoise2 = snoise(0.8 * position + timing * vec3(2.2, 2.0 * smokeSpeedY, 1.0) + 50.0);
    float smokeNoise  = 0.5 + (0.7 * smokeNoise1 + 0.3 * smokeNoise2) / 2.0;

    float smokeSpread  = 2.0 + 15.0 * heightFrac; // widens with height
    float smokeWidthPx = fireWidthPx * smokeSpread;
    float smokeXFuel    = falloffFromCenter(distFromCenter, smokeWidthPx);
    float smokeXFuel3   = smokeXFuel * smokeXFuel * smokeXFuel;

    float smokeFade        = 1.0 - smoothstep(0.7, 1.0, heightFrac); // fades out near the top
    float smokeModeBoost   = mix(0.7, 1.0, isLightMode); // thicker smoke when "put out"
    float smokeHeightCurve = mix(1.0, 1.0, sqrt(heightFrac)); // no-op at these values; spread the two mix() ends apart to fade smoke differently near the base vs higher up
    float smokeBaseIntensity = 0.39; // was 0.3 * 1.3 (base amount * boost) in the original
    float smokeIntensity = smokeModeBoost * smokeBaseIntensity * smokeXFuel3 * smokeHeightCurve * smokeFade * smokeNoise;

    vec3 smokeColorLowDark   = vec3(0.420, 0.341, 0.278);
    vec3 smokeColorHighDark  = vec3(0.243, 0.290, 0.361);
    vec3 smokeColorLowLight  = vec3(0.612, 0.553, 0.490);
    vec3 smokeColorHighLight = vec3(0.780, 0.824, 0.851);

    vec3 smokeColorLow  = mix(smokeColorLowDark,  smokeColorLowLight,  isLightMode);
    vec3 smokeColorHigh = mix(smokeColorHighDark, smokeColorHighLight, isLightMode);
    vec3 smokeColor     = mix(smokeColorLow, smokeColorHigh, heightFrac);

    vec3  smoke      = smokeIntensity * smokeColor;
    float smokeAlpha = clamp(smokeIntensity, 0.0, 1.0);

    // Sparks
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

    vec3 sparks = vec3(0.0);
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

    // Confine stars to the upper sky, fading out near the fire.
    float skyMask   = smoothstep(100.0, 360.0, noiseFragCoord.y);
    vec3  starLayer = stars(fragCoord, time, skyMask);

    vec3  fireSparksStars = max(fire, sparks) + mix(starLayer, vec3(0.0), isLightMode);
    float fireSparksAlpha = clamp(max(fireSparksStars.r, max(fireSparksStars.g, fireSparksStars.b)), 0.0, 1.0);

    float alpha = max(fireSparksAlpha, smokeAlpha);
    vec3  color = fireSparksStars + smoke;

    fragColor = vec4(color, alpha);
}
