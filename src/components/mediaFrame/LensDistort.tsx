import React, { useEffect, useRef } from "react";
import { AbsoluteFill, continueRender, delayRender } from "remotion";

export type LensDistortProps = {
  width: number;
  height: number;
  /** 1 = strong barrel, 0 = identity sampling */
  amount: number;
  /** Optional image/video URL; procedural stand-in if omitted */
  src?: string;
};

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_amount;
uniform vec2 u_res;

void main() {
  vec2 uv = v_uv;
  vec2 c = uv * 2.0 - 1.0;
  c.x *= u_res.x / u_res.y;
  float r2 = dot(c, c);
  // barrel / fisheye; amount=0 → neutral
  float k = 1.0 + u_amount * 0.45 * r2;
  c *= k;
  c.x *= u_res.y / u_res.x;
  uv = c * 0.5 + 0.5;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
    gl_FragColor = vec4(0.07, 0.07, 0.07, 1.0);
    return;
  }
  gl_FragColor = texture2D(u_tex, uv);
}
`;

const createShader = (gl: WebGLRenderingContext, type: number, src: string) => {
  const sh = gl.createShader(type);
  if (!sh) {
    throw new Error("shader alloc failed");
  }
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(String(gl.getShaderInfoLog(sh)));
  }
  return sh;
};

const paintProcedural = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#3a3a3a");
  g.addColorStop(0.45, "#8a8a8a");
  g.addColorStop(1, "#1c1c1c");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.ellipse(w * 0.5, h * 0.42, w * 0.22, h * 0.28, 0, 0, Math.PI * 2);
  ctx.fill();
};

/**
 * Barrel / fisheye UV warp via WebGL fragment (not CSS filter:url).
 * amount=0 → neutral frame sampling.
 */
export const LensDistort: React.FC<LensDistortProps> = ({
  width,
  height,
  amount,
  src,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const progRef = useRef<WebGLProgram | null>(null);
  const texRef = useRef<WebGLTexture | null>(null);
  const sourceRef = useRef<HTMLCanvasElement | HTMLVideoElement | null>(null);
  const handleRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const gl = canvas.getContext("webgl", {
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) {
      return;
    }
    glRef.current = gl;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!prog) {
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    progRef.current = prog;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const tex = gl.createTexture();
    texRef.current = tex;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    sourceRef.current = off;
    const ctx = off.getContext("2d");
    if (ctx) {
      paintProcedural(ctx, width, height);
    }

    let cancelled = false;
    const handle = delayRender("LensDistort texture");
    handleRef.current = handle;

    const finish = () => {
      if (!cancelled) {
        continueRender(handle);
      }
    };

    if (src) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        if (cancelled || !ctx) {
          finish();
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        finish();
      };
      img.onerror = () => finish();
      img.src = src;
    } else {
      finish();
    }

    return () => {
      cancelled = true;
      if (handleRef.current !== null) {
        continueRender(handleRef.current);
      }
    };
  }, [width, height, src]);

  useEffect(() => {
    const gl = glRef.current;
    const prog = progRef.current;
    const tex = texRef.current;
    const source = sourceRef.current;
    const canvas = canvasRef.current;
    if (!gl || !prog || !tex || !source || !canvas) {
      return;
    }

    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    gl.useProgram(prog);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    gl.uniform1f(gl.getUniformLocation(prog, "u_amount"), amount);
    gl.uniform2f(gl.getUniformLocation(prog, "u_res"), width, height);
    gl.uniform1i(gl.getUniformLocation(prog, "u_tex"), 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, [amount, width, height]);

  return (
    <AbsoluteFill>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </AbsoluteFill>
  );
};
