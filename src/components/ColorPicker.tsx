'use client';

import { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const PRESETS = [
  '7c9a82', '3b82f6', 'ef4444', 'f59e0b', '8b5cf6', 'ec4899', '2c2825', 'f0ece6',
  '10b981', '06b6d4', 'f97316', '84cc16', 'a855f7', 'e11d48', '64748b', 'ffffff',
];

function hexToHsl(hex: string): [number, number, number] {
  let r = parseInt(hex.slice(0, 2), 16) / 255;
  let g = parseInt(hex.slice(2, 4), 16) / 255;
  let b = parseInt(hex.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100;
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1/3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1/3) * 255),
  ];
}

function rgbToHex(r: number, g: number, b: number): string {
  return [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

function drawGrid(canvas: HTMLCanvasElement, hue: number) {
  const ctx = canvas.getContext('2d')!;
  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.createImageData(w, h);
  const data = imageData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const s = (x / (w - 1)) * 100;
      const l = (1 - y / (h - 1)) * 100;
      const [r, g, b] = hslToRgb(hue, s, l);
      const i = (y * w + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hueRef = useRef(0);
  const satRef = useRef(50);
  const lightRef = useRef(50);
  const draggingRef = useRef(false);

  useEffect(() => {
    if (!draggingRef.current) {
      const [h, s, l] = hexToHsl(value);
      if (s > 0) hueRef.current = h;
      satRef.current = s;
      lightRef.current = l;
    }
    setHexInput(value);
  }, [value]);

  useEffect(() => {
    if (open && canvasRef.current) {
      drawGrid(canvasRef.current, hueRef.current);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const onSatLightMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    draggingRef.current = true;

    const update = (clientX: number, clientY: number) => {
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      satRef.current = Math.round(x * 100);
      lightRef.current = Math.round((1 - y) * 100);
      onChange(rgbToHex(...hslToRgb(hueRef.current, satRef.current, lightRef.current)));
    };

    update(e.clientX, e.clientY);

    const onMove = (ev: MouseEvent) => update(ev.clientX, ev.clientY);
    const onUp = () => {
      draggingRef.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const onHueMouseDown = (e: React.MouseEvent) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    draggingRef.current = true;

    const update = (clientX: number) => {
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      hueRef.current = Math.round(x * 360);
      if (canvasRef.current) drawGrid(canvasRef.current, hueRef.current);
      onChange(rgbToHex(...hslToRgb(hueRef.current, satRef.current, lightRef.current)));
    };

    update(e.clientX);

    const onMove = (ev: MouseEvent) => update(ev.clientX);
    const onUp = () => {
      draggingRef.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const onSatLightTouchStart = (e: React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    draggingRef.current = true;

    const update = (clientX: number, clientY: number) => {
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      satRef.current = Math.round(x * 100);
      lightRef.current = Math.round((1 - y) * 100);
      onChange(rgbToHex(...hslToRgb(hueRef.current, satRef.current, lightRef.current)));
    };

    const onTouchMove = (ev: TouchEvent) => { ev.preventDefault(); update(ev.touches[0].clientX, ev.touches[0].clientY); };
    const onTouchEnd = () => { draggingRef.current = false; document.removeEventListener('touchmove', onTouchMove); document.removeEventListener('touchend', onTouchEnd); };
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);

    update(e.touches[0].clientX, e.touches[0].clientY);
  };

  const onHueTouchStart = (e: React.TouchEvent) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    draggingRef.current = true;

    const update = (clientX: number) => {
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      hueRef.current = Math.round(x * 360);
      if (canvasRef.current) drawGrid(canvasRef.current, hueRef.current);
      onChange(rgbToHex(...hslToRgb(hueRef.current, satRef.current, lightRef.current)));
    };

    const onTouchMove = (ev: TouchEvent) => { ev.preventDefault(); update(ev.touches[0].clientX); };
    const onTouchEnd = () => { draggingRef.current = false; document.removeEventListener('touchmove', onTouchMove); document.removeEventListener('touchend', onTouchEnd); };
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);

    update(e.touches[0].clientX);
  };

  const hue = hueRef.current;
  const curSat = satRef.current;
  const curLight = lightRef.current;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-lg border-2 border-border-primary cursor-pointer overflow-hidden hover:border-accent transition-colors relative group"
        style={{ background: `#${value}` }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
          <svg className="w-4 h-4 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-bg-card border border-border-primary rounded-xl shadow-2xl z-50 w-64">
          {/* Sat/Light canvas */}
          <div className="relative w-full mb-3 select-none" style={{ aspectRatio: '16/10' }}>
            <canvas
              ref={canvasRef}
              width={320}
              height={200}
              className="absolute inset-0 w-full h-full rounded-lg cursor-crosshair"
              onMouseDown={onSatLightMouseDown}
              onTouchStart={onSatLightTouchStart}
            />
            <div
              className="absolute w-3 h-3 border-2 border-white rounded-full shadow pointer-events-none"
              style={{
                left: `${curSat}%`,
                top: `${100 - curLight}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>

          {/* Hue bar */}
          <div
            className="relative w-full h-3 rounded-full cursor-pointer mb-3 select-none"
            style={{ background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }}
            onMouseDown={onHueMouseDown}
            onTouchStart={onHueTouchStart}
          >
            <div
              className="absolute w-4 h-4 border-2 border-white rounded-full shadow pointer-events-none"
              style={{
                left: `${(hue / 360) * 100}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: `hsl(${hue}, 100%, 50%)`,
              }}
            />
          </div>

          {/* Hex input */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-md border border-border-primary shrink-0" style={{ background: `#${value}` }} />
            <span className="text-xs text-text-muted">#</span>
            <input
              type="text"
              value={hexInput}
              onChange={(e) => {
                const raw = e.target.value;
                const clean = raw.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
                setHexInput(clean);
                if (/^[0-9a-fA-F]{6}$/.test(clean)) {
                  const [h, s, l] = hexToHsl(clean);
                  if (s > 0) hueRef.current = h;
                  satRef.current = s;
                  lightRef.current = l;
                  if (canvasRef.current) drawGrid(canvasRef.current, hueRef.current);
                  onChange(clean);
                }
              }}
              className="flex-1 px-2 py-1 text-xs font-mono bg-bg-secondary border border-border-primary rounded-md text-text-primary focus:outline-none focus:border-accent uppercase"
              placeholder="EFBF04"
            />
          </div>

          <div className="flex gap-1 flex-wrap">
            {PRESETS.map(c => (
              <button
                key={c}
                onClick={() => {
                  const [h, s, l] = hexToHsl(c);
                  if (s > 0) hueRef.current = h;
                  satRef.current = s;
                  lightRef.current = l;
                  onChange(c);
                }}
                className={`w-5 h-5 rounded-full border transition-all ${
                  value === c ? 'border-accent scale-125 ring-1 ring-accent/30' : 'border-transparent hover:scale-110'
                }`}
                style={{ background: `#${c}` }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
