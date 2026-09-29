"use client";

import React, { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/utils/motion";
import { Chakra, Mandala } from "./Motifs";

// CSS 3D wireframe cube (§5.1) inside a Canvas-2D projected point-cloud sphere (§5.2). No WebGL.
export const Hero3D = () => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const wrap = wrapRef.current!, cv = canvasRef.current!, ctx = cv.getContext("2d")!;
        const reduced = prefersReducedMotion();
        const fine = window.matchMedia("(pointer: fine)").matches && window.innerWidth >= 768;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const N = window.innerWidth < 768 ? 300 : 600;

        // Fibonacci sphere + 3 nearest neighbours per point, computed once.
        const pts = Array.from({ length: N }, (_, i) => {
            const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * Math.PI * (3 - Math.sqrt(5));
            return [Math.cos(th) * r, y, Math.sin(th) * r];
        });
        const nbrs = pts.map((p, i) =>
            pts.map((q, j) => [j, (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2])
                .filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 3).map(([j]) => j)
        );

        let size = 0;
        const resize = () => { size = wrap.clientWidth; cv.width = cv.height = size * dpr; };
        resize();
        window.addEventListener("resize", resize);

        let ax = 0.3, ay = 0, vx = 0.0015, vy = 0.004;
        const draw = () => {
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, size, size);
            const R = size * 0.4, c = size / 2, fov = 2.4;
            const sy = Math.sin(ay), cy = Math.cos(ay), sx = Math.sin(ax), cx = Math.cos(ax);
            const proj = pts.map(([x, y, z]) => {
                const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
                const y1 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
                const s = fov / (fov + z2);
                return [c + x1 * R * s, c + y1 * R * s, z2, s];
            });
            ctx.globalAlpha = 1;
            ctx.strokeStyle = "rgba(34,224,127,.15)";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            nbrs.forEach((ns, i) => ns.forEach((j) => {
                if (j > i) { ctx.moveTo(proj[i][0], proj[i][1]); ctx.lineTo(proj[j][0], proj[j][1]); }
            }));
            ctx.stroke();
            // Depth colour: near white, mid marigold, far saffron (dim).
            for (const [x, y, z, s] of proj) {
                const near = 1 - (z + 1) / 2;
                ctx.fillStyle = near > 0.66 ? "#ffffff" : near > 0.33 ? "#ffc21a" : "#ff9933";
                ctx.globalAlpha = 0.15 + 0.85 * near;
                const d = 1.8 * s;
                ctx.fillRect(x - d / 2, y - d / 2, d, d);
            }
        };

        if (reduced) { draw(); return () => window.removeEventListener("resize", resize); }

        let tx = 0, ty = 0, lx = 0, ly = 0, visible = true, raf = 0;
        const onMove = (e: PointerEvent) => {
            tx = (e.clientY / window.innerHeight - 0.5) * -30;
            ty = (e.clientX / window.innerWidth - 0.5) * 30;
            vy += e.movementX * 0.00004;
            vx += e.movementY * 0.00004;
        };
        if (fine) window.addEventListener("pointermove", onMove);
        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
        io.observe(wrap);

        const loop = () => {
            raf = requestAnimationFrame(loop);
            if (!visible || document.hidden) return;
            vy += (0.004 - vy) * 0.02;   // damp back to base spin
            vx += (0.0015 - vx) * 0.02;
            ay += vy; ax += vx;
            lx += (tx - lx) * 0.08; ly += (ty - ly) * 0.08;
            wrap.style.setProperty("--tx", `${lx}deg`);
            wrap.style.setProperty("--ty", `${ly}deg`);
            draw();
        };
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            window.removeEventListener("resize", resize);
            window.removeEventListener("pointermove", onMove);
        };
    }, []);

    return (
        <div ref={wrapRef} aria-hidden className="relative mx-auto aspect-square w-full max-w-[520px]">
            <Mandala spin className="absolute -inset-[12%] h-[124%] w-[124%]" />
            <Chakra strokeWidth={0.4} className="spin-40 absolute inset-[3%] h-[94%] w-[94%] opacity-40" />
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
            <div className="cube-stage absolute inset-0 flex items-center justify-center">
                <div className="cube-tilt">
                    <div className="cube">
                        <i /><i /><i /><i /><i /><i />
                        <div className="cube cube--inner"><i /><i /><i /><i /><i /><i /></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
