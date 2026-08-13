// fire.glsl — converted from Shadertoy
// Target: #version 300 es (WebGL 2 / OpenGL ES 3.0)
// For desktop OpenGL 3.3 replace the first two lines with:
//   #version 330 core
//   (remove "precision highp float;")

#version 300 es
precision highp float;

// ---------------------------------------------------------------------------
// Shadertoy uniforms — bind these from your host application
// ---------------------------------------------------------------------------
uniform float iTime;        // elapsed time in seconds
uniform vec3  iResolution;  // viewport: x = width, y = height, z = pixel ratio
uniform float isLightMode; // 0.0 = dark mode (roaring fire), 1.0 = light mode (put out, smoking)

out vec4 fragColor;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const float PI = 3.1415926535897932384626433832795;

// ---------------------------------------------------------------------------
// Simplex noise — helper functions
// ---------------------------------------------------------------------------

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
}

// Kept for reference (original uses inversesqrt directly below)
vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;       // -1.0+3.0*C.x = -0.5 = -D.y

    // Permutations
    i = mod289(i);
    vec4 p = permute(permute(permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns  = n_ * D.wyz - D.xzx;

    vec4 j  = p - 49.0 * floor(p * ns.z * ns.z); // mod(p, 7*7)
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);               // mod(j, N)

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

    // Normalise gradients
    vec4 norm = inversesqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// ---------------------------------------------------------------------------
// PRNG — From https://www.shadertoy.com/view/4djSRW
// Note: 'seed' is an 'in' (value-copy) parameter; local mutation is valid.
// ---------------------------------------------------------------------------
float prng(in vec2 seed) {
    seed = fract(seed * vec2(5.3983, 5.4427));
    seed += dot(seed.yx, seed.xy + vec2(21.5351, 14.3137));
    return fract(seed.x * seed.y * 95.4337);
}

// ---------------------------------------------------------------------------
// Noise stack helpers
// ---------------------------------------------------------------------------

float noiseStack(vec3 pos, int octaves, float falloff) {
    float noise = snoise(pos);
    float off   = 1.0;
    if (octaves > 1) { pos *= 2.0; off *= falloff; noise = (1.0 - off) * noise + off * snoise(pos); }
    if (octaves > 2) { pos *= 2.0; off *= falloff; noise = (1.0 - off) * noise + off * snoise(pos); }
    if (octaves > 3) { pos *= 2.0; off *= falloff; noise = (1.0 - off) * noise + off * snoise(pos); }
    return (1.0 + noise) / 2.0;
}

vec2 noiseStackUV(vec3 pos, int octaves, float falloff, float diff) {
    float displaceA = noiseStack(pos, octaves, falloff);
    float displaceB = noiseStack(pos + vec3(3984.293, 423.21, 5235.19), octaves, falloff);
    return vec2(displaceA, displaceB);
}

vec3 stars(vec2 fragCoord, float time, float skyMask) {
    float starGridSize = 10.0; // bigger = fewer, more sparse stars
    vec2  starCell      = floor(fragCoord / starGridSize);
    vec2  starLocalUV   = fract(fragCoord / starGridSize);

    float starExists = prng(starCell);
    // Only ~15% of cells contain a star — tune threshold for density
    if (starExists > 0.85) {
        vec2  starOffset = vec2(prng(starCell + 4.7), prng(starCell + 9.3)); // position within cell
        float dist       = length(starLocalUV - starOffset);

        float sizeRandom = prng(starCell + 1.1);
        float starSize = mix(0.015, 0.25, pow(sizeRandom, 3.0)); // varied sizes
        float starCore = 1.0 - smoothstep(0.0, starSize, dist);

        // Per-star pulse: unique speed + phase from hash, so stars don't sync up
        float pulseSpeed = mix(0.5, 2.0, prng(starCell + 2.3));
        float pulsePhase = 6.28 * prng(starCell + 7.1);
        float twinkle    = 0.5 + 0.5 * sin(time * pulseSpeed + pulsePhase);

        float brightness = starCore * mix(0.1, 0.6, twinkle);
        brightness *= mix(0.7, 1.0, sizeRandom); // larger stars (from sizeRandom) are also a bit brighter
        return vec3(brightness) * skyMask;
    }
    return vec3(0.0);
}

// ---------------------------------------------------------------------------
// Fragment entry point (replaces Shadertoy's mainImage)
// gl_FragCoord replaces the fragCoord parameter.
// ---------------------------------------------------------------------------
void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    // --- Shift the fire's base upward (e.g. to sit on a campfire png) ---
    float fireBaseOffset = 110.0; // pixels — tune until it lines up with your png's logs
    fragCoord.y -= fireBaseOffset;

    // Pixels below the new base: fully transparent, let the png/background show through
    if (fragCoord.y < 0.0) {
        fragColor = vec4(0.0);
        return;
    }
    
    float refHeight = 2500.0;
    // float pixelScale = refHeight / iResolution.y;
    float pixelScale = 0.32;
    vec2 fragCoordFixed = fragCoord * pixelScale;

    float time       = iTime;
    vec2  resolution = iResolution.xy;

    float effectiveHeight = resolution.y - fireBaseOffset;
    float xpart = fragCoord.x / resolution.x;
    float ypart = fragCoord.y / effectiveHeight;

    float clip = mix(300.0, 0.0, isLightMode);
    float ypartClip           = fragCoord.y / clip;
    float ypartClippedFalloff = clamp(2.0 - ypartClip, 0.0, 1.0);
    float ypartClipped        = min(ypartClip, 1.0);
    float ypartClippedn       = 1.0 - ypartClipped;

    float fireWidthPx    = 200.0;                  // desired fire width in pixels — tune to taste
    float fireCenterX    = resolution.x * 0.5;      // or any fixed screen position you want
    float distFromCenter = fragCoord.x - fireCenterX;
    float xfuel = clamp(1.0 - abs(2.0 * distFromCenter / fireWidthPx), 0.0, 1.0);

    float timeSpeed = 0.6;
    float fireTimeSpeed = 1.0;
    float realTime  = timeSpeed * time;

    vec2 coordScaled = 0.07 * fragCoordFixed - 0.02;
    vec3 position    = vec3(coordScaled, 0.0) + vec3(1223.0, 6434.0, 8425.0);
    float xpartFire = 0.5 + distFromCenter / fireWidthPx; // 0..1 across the fire's own width
    float ypc2  = ypartClippedn * ypartClippedn;
    float ypc4  = ypc2 * ypc2;
    float ypc8  = ypc4 * ypc4;
    float ypc16 = ypc8 * ypc8;
    float ypc32 = ypc16 * ypc16;
    float ypc64 = ypc32 * ypc32;

    vec3 flow = vec3(
        4.1 * (0.5 - xpartFire) * ypc4,
       -2.0 * xfuel          * ypc64,
        0.0
    );
    vec3 timing = (fireTimeSpeed * time) * vec3(0.0, -1.7, 1.1) + flow;

    // Displacement
    vec3 displacePos = vec3(1.0, 0.5, 1.0) * 2.4 * position + realTime * vec3(0.01, -0.7, 1.3);
    // vec3 displace3   = vec3(noiseStackUV(displacePos, 1, 0.4, 0.1), 0.0);

    // Fire noise
    vec3  noiseCoord = vec3(2.0, 1.0, 1.0) * position + timing + 0.4;
    float noise      = noiseStack(noiseCoord, 2, 0.4);

    float flames = pow(ypartClipped * noise, 0.3 * xfuel);

    float flamesTerm  = 1.0 - flames * flames * flames;
    float flamesTerm2 = flamesTerm  * flamesTerm;
    float flamesTerm4 = flamesTerm2 * flamesTerm2;
    float flamesTerm8 = flamesTerm4 * flamesTerm4;
    float f = ypartClippedFalloff * flamesTerm8;
    float fff = f * f * f;
    vec3 fire = 1.5 * vec3(f, fff, fff * fff);
    fire *= mix(1.0, 0.15, isLightMode); // dim embers instead of a full flame

    // --- Jagged base mask: only affects a thin band near fragCoord.y == 0 ---
    float baseTongueScale  = 0.015;
    float baseFlickerSpeed = 0.6;
    float baseBandHeight   = 90.0;  // how tall the jagged zone is, in pixels

    float baseMask = 1.0;
    if (fragCoord.y < baseBandHeight) {
        float baseNoise = noiseStack(
            vec3(fragCoord.x * baseTongueScale, 50.0, realTime * baseFlickerSpeed),
            1, 0.5   // also dropped to 1 octave — see step 5
        );
        baseMask = smoothstep(0.0, baseBandHeight * baseNoise, fragCoord.y);
    }
    fire *= baseMask;

    // Smoke
    float smokeSpeedY = 0.4;
    float smokeNoise1 = snoise(0.3 * position + timing * vec3(1.4, 1.4 * smokeSpeedY, 0.6));
    float smokeNoise2 = snoise(0.8 * position + timing * vec3(2.2, 2.0 * smokeSpeedY, 1.0) + 50.0);
    float smokeNoise  = 0.5 + (0.7 * smokeNoise1 + 0.3 * smokeNoise2) / 2.0;
    // smokeNoise = mix(0.5, smokeNoise, 0.6); // compress contrast — lower = flatter/thicker, higher = more blotchy
    float smokeSpread      = 2.0 + 15.0 * ypart;                 // widen with height — tune 1.5
    float smokeWidthPx     = fireWidthPx * smokeSpread;
    float smokeXfuelSpread = clamp(1.0 - abs(2.0 * distFromCenter) / smokeWidthPx, 0.0, 1.0);
    float smokeXfuel3      = smokeXfuelSpread * smokeXfuelSpread * smokeXfuelSpread;

    float smokeFade = 1.0 - smoothstep(0.7, 1.0, ypart); // fully visible below 30% height, fades to 0 at top
    float smokeIntensityBoost = mix(0.7, 1.0, isLightMode); // thicker smoke when "put out"
    float smokeHeightCurve = mix(1.0, 1.0, sqrt(ypart)); // starts at 0.6 near the fire, ramps to 1.0 higher up
float smokeIntensity = smokeIntensityBoost * 0.3 * smokeXfuel3 * smokeHeightCurve * smokeFade * smokeNoise * 1.3;
    vec3 smokeColorLowDark   = vec3(0.420, 0.341, 0.278);
    vec3 smokeColorHighDark  = vec3(0.243, 0.290, 0.361);

    vec3 smokeColorLowLight  = vec3(0.612, 0.553, 0.490);
    vec3 smokeColorHighLight = vec3(0.780, 0.824, 0.851);

    vec3 smokeColorLow  = mix(smokeColorLowDark,  smokeColorLowLight,  isLightMode);
    vec3 smokeColorHigh = mix(smokeColorHighDark, smokeColorHighLight, isLightMode);
    vec3 smokeColor     = mix(smokeColorLow, smokeColorHigh, ypart);

    vec3  smoke      = smokeIntensity * smokeColor;
    float smokeAlpha = clamp(smokeIntensity, 0.0, 1.0); // density-based, independent of color darkness

    // Sparks
    float sparkSpeed = 100.0;
    float sparkGridSize = 13.0;
    vec2 sparkFlow = vec2(flow.x * 0.35, flow.y);
    vec2 sparkCoord = fragCoordFixed - vec2(0.0, sparkSpeed * realTime);

    float tScaled = 6.0 * time;
    float tFloor  = floor(tScaled);
    float tFrac   = smoothstep(0.0, 1.0, fract(tScaled));

    // Hash on both spatial cell AND time step
    vec2 sparkGridIndexPre = floor(sparkCoord / sparkGridSize); // identity before jitter is applied
    vec2 cellSeed = sparkGridIndexPre; // one hash per spark, not per pixel
    vec2 jitterA = vec2(
        prng(cellSeed + vec2(tFloor,       0.0)),
        prng(cellSeed + vec2(tFloor,       91.7))
    );
    vec2 jitterB = vec2(
        prng(cellSeed + vec2(tFloor + 1.0, 0.0)),
        prng(cellSeed + vec2(tFloor + 1.0, 91.7))
    );

    vec2 sparkJitter = mix(jitterA, jitterB, tFrac) * 2.0 - 1.0;

    sparkCoord -= 0.5 * sparkJitter;
    sparkCoord += 50.0 * sparkFlow;
    if (mod(sparkCoord.y / sparkGridSize, 2.0) < 1.0) sparkCoord.x += 0.5 * sparkGridSize;

    vec2  sparkGridIndex = floor(sparkCoord / sparkGridSize);
    float sparkRandom    = prng(sparkGridIndex);
    float sparkLife      = min(
        10.0 * (1.0 - min(
            (sparkGridIndex.y + (sparkSpeed * realTime / sparkGridSize)) / (30.0 - 20.0 * sparkRandom),
            1.0)),
        1.0);

    // Sparks start narrow near the base (1.2x fire width) and expand as they rise (up to 3.5x fire width)
    float sparkSpread  = mix(1.0, 20.0, ypart); 
    float sparkWidthPx = fireWidthPx * sparkSpread;
    float sparkXfuel   = clamp(1.0 - abs(2.0 * distFromCenter) / sparkWidthPx, 0.0, 1.0);

    float chanceDark  = 0.30; // normal amount of sparks at night
    float chanceLight = 0.15; // very few sparks when put out in daytime

    float sparkSpawnChance = mix(chanceDark, chanceLight, isLightMode);

    vec3 sparks = vec3(0.0);
    if (sparkLife > 0.0 && prng(sparkGridIndex + 13.37) < sparkSpawnChance) {
        // ... rest of spark math unchanged
        float sparkSize     = sparkXfuel * sparkXfuel * sparkRandom * 0.08;
        float sparkRadians  = 999.0 * sparkRandom * 2.0 * PI + 2.0 * time;
        vec2  sparkCircular = vec2(sin(sparkRadians), cos(sparkRadians));
        vec2  sparkOffset   = (0.5 - sparkSize) * sparkGridSize * sparkCircular;
        vec2  sparkModulus  = mod(sparkCoord + sparkOffset, sparkGridSize) - 0.5 * vec2(sparkGridSize);
        float sparkLength   = length(sparkModulus);
        float sparksGray    = max(0.0, 1.0 - sparkLength / (sparkSize * sparkGridSize));
        sparks = sparkLife * sparksGray * vec3(1.0, 0.3, 0.0);
    }

    // Confine stars to the upper sky area, fading out near the horizon/fire zone
    float skyMask = smoothstep(100.0, 360.0, fragCoordFixed.y); // adjust range: stars only above 30-60% height
    vec3 starLayer = stars(fragCoord, time, skyMask);


    vec3 fireSparksStars = max(fire, sparks) + mix(starLayer, vec3(0.0, 0.0, 0.0), isLightMode);
    float fireSparksAlpha = clamp(max(fireSparksStars.r, max(fireSparksStars.g, fireSparksStars.b)), 0.0, 1.0);

    float alpha = max(fireSparksAlpha, smokeAlpha);
    vec3  result = fireSparksStars + smoke;

    fragColor = vec4(result, alpha);
}
