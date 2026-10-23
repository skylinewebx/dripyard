"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;
// Domain-warped fractal noise: slow, soft smoke drifting upward. Procedural, so it never "loops" visibly.
const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){ v += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = vec2(uv.x * uRes.x / uRes.y, uv.y) * 2.4;
  float t = uTime * 0.1;
  vec2 q = vec2(fbm(p + vec2(0.0, -t * 1.6)), fbm(p + vec2(5.2, 1.3) - t));
  float n = fbm(p + 1.8 * q + vec2(t * 0.5, -t * 1.2));
  float smoke = smoothstep(0.34, 0.86, n);
  // a little denser near the floor and the sides, thinner overhead
  float shape = mix(1.0, 0.55, smoothstep(0.0, 1.0, uv.y)) * (0.75 + 0.25 * abs(uv.x - 0.5) * 2.0);
  float a = smoke * shape * 0.85;
  vec3 col = mix(vec3(0.42, 0.04, 0.07), vec3(0.88, 0.24, 0.22), n);
  gl_FragColor = vec4(col * a, a);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

/**
 * Cinematic atmosphere for the hero: gentle red/maroon smoke (WebGL, low resolution, ~30fps), a slow
 * light beam, and a barely-there camera drift on the parent. The layer is masked so it only shows on
 * the background, never over the model or the sneaker. Pauses off-screen / in a hidden tab, is off for
 * reduced motion, and falls back to a CSS-only haze if WebGL is unavailable.
 */
export default function HeroAtmosphere() {
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);
  // Server and first client render are identical; reduced motion only hides the layer after mount.
  const [off, setOff] = useState(false);
  useEffect(() => setOff(!!reduced), [reduced]);

  useEffect(() => {
    if (reduced) return;
    const host = wrap.current;
    if (!host) return;
    // A fresh canvas per run: a context that was lost by a previous cleanup can never be reused.
    const el = document.createElement("canvas");
    el.className = "absolute inset-0 h-full w-full opacity-90";
    host.prepend(el);

    const gl = el.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "low-power" });
    const vs = gl && compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = gl && compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!gl || !vs || !fs) {
      el.remove();
      setFallback(true);
      return;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");

    const resize = () => {
      const w = Math.min(640, Math.max(160, Math.round(host.clientWidth * 0.32)));
      const h = Math.max(90, Math.round((w * host.clientHeight) / Math.max(1, host.clientWidth)));
      if (el.width !== w || el.height !== h) {
        el.width = w;
        el.height = h;
        gl.viewport(0, 0, w, h);
        gl.uniform2f(uRes, w, h);
      }
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let visible = true;
    let raf = 0;
    let last = 0;
    const t0 = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden || now - last < 32) return; // ~30fps is plenty for slow smoke
      last = now;
      gl.uniform1f(uTime, (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      host.closest(".hero-camera")?.classList.toggle("is-paused", !visible);
    });
    io.observe(host);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      el.remove();
    };
  }, [reduced]);

  return (
    <div ref={wrap} aria-hidden className={`hero-bgmask pointer-events-none absolute inset-0 ${off ? "hidden" : ""}`}>
      {fallback && (
        <>
          <div className="hero-haze hero-haze-a" />
          <div className="hero-haze hero-haze-b" />
        </>
      )}
      <div className="hero-beam absolute inset-y-0 -left-1/3 w-2/3" />
    </div>
  );
}
