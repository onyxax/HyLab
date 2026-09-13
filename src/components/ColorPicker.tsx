'use client';

import { useState, useRef, useEffect } from 'react';
import { hexToHsl, hslToRgb, rgbToHex, drawColorGrid } from '@/lib/color/color';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const PRESETS = [
  '7c9a82', '3b82f6', 'ef4444', 'f59e0b', '8b5cf6', 'ec4899', '2c2825', 'f0ece6',
  '10b981', '06b6d4', 'f97316', '84cc16', 'a855f7', 'e11d48', '64748b', 'ffffff',
];

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
      drawColorGrid(canvasRef.current, hueRef.current);
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
      if (canvasRef.current) drawColorGrid(canvasRef.current, hueRef.current);
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
      if (canvasRef.current) drawColorGrid(canvasRef.current, hueRef.current);
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
                  if (canvasRef.current) drawColorGrid(canvasRef.current, hueRef.current);
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
                  if (canvasRef.current) drawColorGrid(canvasRef.current, hueRef.current);
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
