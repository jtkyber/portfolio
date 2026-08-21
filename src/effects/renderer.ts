import { Renderer } from 'ogl';
import { Stars } from './layers/stars/stars';
import { Campfire } from './layers/campfire/campfire';
import { isWebkit } from '../utils';
import { Sparks } from './layers/sparks/sparks';

export function render() {
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;
    let lastFrameTime = 0;
    {
        const root = document.documentElement;
        const body = document.body;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const starRenderer = new Renderer({
            alpha: true,
            premultipliedAlpha: true,
            webgl: 2,
            dpr,
        });

        const campfireRenderer = new Renderer({
            alpha: true,
            premultipliedAlpha: true,
            webgl: 2,
            dpr,
        });

        const sparksRenderer = new Renderer({
            alpha: true,
            premultipliedAlpha: true,
            webgl: 2,
            dpr,
        });

        const starLayer = new Stars(body, starRenderer);
        const campfireLayer = new Campfire(body, campfireRenderer);
        const sparksLayer = new Sparks(body, sparksRenderer);

        const forceLayoutPass = () => {
            document.documentElement.style.width = 'calc(100% - 1px)';
            void document.documentElement.offsetHeight;
            document.documentElement.style.width = '';
        };

        const hasDarkClass = () => root.classList.contains('dark');

        const setIsLightMode = () => {
            const isLightModeValue = hasDarkClass() ? 0.0 : 1.0;

            starLayer.uniforms.isLightMode.value = isLightModeValue;
            campfireLayer.uniforms.isLightMode.value = isLightModeValue;
            sparksLayer.uniforms.isLightMode.value = isLightModeValue;

            if (isWebkit()) forceLayoutPass();
        };
        setIsLightMode();

        const mutationObserver = new MutationObserver((mutationList) => {
            for (const item of mutationList) {
                if (item.attributeName === 'class') {
                    setIsLightMode();
                    break;
                }
            }
        });

        mutationObserver.observe(root, { attributes: true });

        function update(t: number) {
            requestAnimationFrame(update);

            if (t - lastFrameTime < FRAME_INTERVAL) return;
            lastFrameTime = t;

            starLayer.uniforms.iTime.value = t * 0.001;
            campfireLayer.uniforms.iTime.value = t * 0.001;
            sparksLayer.uniforms.iTime.value = t * 0.001;

            if (hasDarkClass()) starLayer.render();
            campfireLayer.render();
            if (campfireLayer.uniforms.isPerformanceMode.value === 0.0)
                sparksLayer.render();
        }
        requestAnimationFrame(update);
    }
}
