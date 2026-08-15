import { Mesh, Program, Renderer, Triangle, Vec3 } from 'ogl';
import vertexShader from './shader.vert';
import fragmentShader from './shader.frag';

export function render() {
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    let lastFrameTime = 0;
    {
        const reduceMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        const body = document.body;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const renderer = new Renderer({
            alpha: true,
            premultipliedAlpha: true,
            webgl: 2,
            dpr,
        });
        const gl = renderer.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        body.appendChild(gl.canvas);

        const uniforms = {
            iTime: { value: 0 },
            iResolution: { value: new Vec3() },
            isLightMode: { value: 0 },
        };

        const geometry = new Triangle(gl);

        const program = new Program(gl, {
            vertex: vertexShader,
            fragment: fragmentShader,
            uniforms: uniforms,
        });

        const mesh = new Mesh(gl, { geometry, program });

        const maxDim = Math.min(
            gl.getParameter(gl.MAX_TEXTURE_SIZE),
            gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
            gl.getParameter(gl.MAX_VIEWPORT_DIMS)[1],
        );

        function resize() {
            const { clientWidth, clientHeight } = body;

            renderer.dpr = Math.min(window.devicePixelRatio || 1, 2);
            if (clientHeight * renderer.dpr > maxDim)
                renderer.dpr = maxDim / clientHeight;

            renderer.setSize(clientWidth, clientHeight);

            uniforms.iResolution.value.set(
                gl.canvas.width,
                gl.canvas.height,
                renderer.dpr,
            );
        }

        const ro = new ResizeObserver(resize);
        ro.observe(body);
        resize();

        const html = document.documentElement;
        const hasDarkClass = html.classList.contains('dark');
        uniforms.isLightMode.value = hasDarkClass ? 0.0 : 1.0;

        const mutationObserver = new MutationObserver((mutationList) => {
            for (const item of mutationList) {
                if (item.attributeName === 'class') {
                    const hasDarkClass = html.classList.contains('dark');
                    uniforms.isLightMode.value = hasDarkClass ? 0.0 : 1.0;
                    break;
                }
            }
        });

        mutationObserver.observe(html, { attributes: true });

        function update(t: number) {
            requestAnimationFrame(update);

            if (t - lastFrameTime < FRAME_INTERVAL) return;
            lastFrameTime = t;

            uniforms.iTime.value = t * 0.001 * (reduceMotion ? 0.1 : 1);
            renderer.render({ scene: mesh });
        }
        requestAnimationFrame(update);
    }
}
