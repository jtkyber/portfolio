import { Renderer } from 'ogl';
import { Stars } from './layers/stars';

export function render() {
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    let lastFrameTime = 0;
    {
        const body = document.body;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const starRenderer = new Renderer({
            alpha: true,
            premultipliedAlpha: true,
            webgl: 2,
            dpr,
        });

        const starLayer = new Stars(body, starRenderer);

        function update(t: number) {
            requestAnimationFrame(update);

            if (t - lastFrameTime < FRAME_INTERVAL) return;
            lastFrameTime = t;

            starLayer.uniforms.iTime.value = t * 0.001;
            starLayer.render();
        }
        requestAnimationFrame(update);
    }
}
