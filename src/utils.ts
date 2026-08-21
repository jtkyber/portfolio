import type { Renderer } from 'ogl';

export function isWebkit() {
    const ua = navigator.userAgent;
    return (
        (/AppleWebKit/.test(ua) && !/Chrome/.test(ua)) ||
        /\b(iPad|iPhone|iPod)\b/.test(ua)
    );
}

export function cloneRenderer(instance: Renderer) {
    const clone = Object.create(Object.getPrototypeOf(instance));
    return Object.assign(clone, instance);
}
