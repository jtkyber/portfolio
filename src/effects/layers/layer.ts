import type { Renderer } from 'ogl';

export class Layer {
    rootEl: HTMLElement = document.documentElement;
    parentEl: HTMLElement;
    renderer: Renderer;

    constructor(parentEl: HTMLElement, renderer: Renderer) {
        this.parentEl = parentEl;
        this.renderer = renderer;
    }
}
