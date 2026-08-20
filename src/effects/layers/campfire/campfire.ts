import {
    Mesh,
    Program,
    Renderer,
    Triangle,
    Vec3,
    type OGLRenderingContext,
} from 'ogl';
import { Layer } from '../layer';
import type { CSSProperties } from 'react';
import vertexShader from '../../shader.vert';
import fragmentShader from './shader.frag';

export class Campfire extends Layer {
    gl: OGLRenderingContext;
    maxDim: number = 0;
    uniforms = {
        iTime: { value: 0 },
        iResolution: { value: new Vec3() },
        isLightMode: { value: 0 },
        isPerformanceMode: { value: 0 },
    };
    mesh: Mesh;
    canvasStyles: CSSProperties = {
        inset: '0',
        position: 'absolute',
        width: '100vw',
        height: '100%',
        zIndex: '0',
        pointerEvents: 'none',
    };

    constructor(parentEl: HTMLElement, renderer: Renderer) {
        super(parentEl, renderer);

        this.gl = this.renderer.gl;
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
        Object.assign(this.gl.canvas.style, this.canvasStyles);
        this.parentEl.appendChild(this.gl.canvas);

        this.maxDim = Math.min(
            this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE),
            this.gl.getParameter(this.gl.MAX_RENDERBUFFER_SIZE),
            this.gl.getParameter(this.gl.MAX_VIEWPORT_DIMS)[1],
        );

        const geometry = new Triangle(this.gl);

        const program = new Program(this.gl, {
            vertex: vertexShader,
            fragment: fragmentShader,
            uniforms: this.uniforms,
        });

        this.mesh = new Mesh(this.gl, { geometry, program });

        const ro = new ResizeObserver(this.resize);
        ro.observe(this.rootEl);
        this.resize();
    }

    render = () => {
        this.renderer.render({ scene: this.mesh });
    };

    resize = () => {
        const { clientWidth, clientHeight } = this.parentEl;

        this.renderer.dpr = Math.min(window.devicePixelRatio || 1, 2);
        if (clientHeight * this.renderer.dpr > this.maxDim)
            this.renderer.dpr = this.maxDim / clientHeight;

        this.renderer.setSize(clientWidth, clientHeight);

        this.uniforms.iResolution.value.set(
            this.gl.canvas.width,
            this.gl.canvas.height,
            this.renderer.dpr,
        );
    };
}
