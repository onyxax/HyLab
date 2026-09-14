'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { hexToHsl, hslToRgb, drawColorGrid } from '@/lib/color/color';
import { useColorPickerLogic } from '@/hooks/useColorPickerLogic';

const PRESETS = [
  '7c9a82', '3b82f6', 'ef4444', 'f59e0b', '8b5cf6', 'ec4899', '2c2825', 'f0ece6',
  '10b981', '06b6d4', 'f97316', '84cc16', 'a855f7', 'e11d48', '64748b', 'ffffff',
];

export function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { hexInput, setHexInput, pos, updatePos, canvasRef, buttonRef, hueRef, satRef, lightRef, draggingRef, handleSatLight, handleHue } = useColorPickerLogic(value, onChange);

  useEffect(() => {
    if (open) {
      updatePos();
      const onScroll = () => updatePos();
      window.addEventListener('scroll', onScroll, true);
      window.addEventListener('resize', updatePos);
      return () => { window.removeEventListener('scroll', onScroll, true); window.removeEventListener('resize', updatePos); };
    }
  }, [open, updatePos]);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (containerRef.current && !containerRef.current.contains(e.target as Node) && !(e.target as Element)?.closest('[data-color-portal]')) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const onSatLightMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    draggingRef.current = true;
    const upd = (x: number, y: number) => handleSatLight(x, y, rect);
    upd(e.clientX, e.clientY);
    const move = (ev: MouseEvent) => upd(ev.clientX, ev.clientY);
    const up = () => { draggingRef.current = false; document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  const onHueMouseDown = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    draggingRef.current = true;
    const upd = (x: number) => handleHue(x, rect);
    upd(e.clientX);
    const move = (ev: MouseEvent) => upd(ev.clientX);
    const up = () => { draggingRef.current = false; document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up); };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  };

  const hue = hueRef.current;
  const curSat = satRef.current;
  const curLight = lightRef.current;

  return (
    <div ref={containerRef} className="relative">
      <button ref={buttonRef} onClick={() => { if (!open) setTimeout(updatePos, 0); setOpen(!open); }} className="w-9 h-9 rounded-lg border-2 border-border-primary overflow-hidden hover:border-accent transition-colors relative group shrink-0" style={{ background: `#${value}` }} aria-label="Pick color">
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20"><svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></div>
      </button>
      {open && typeof document !== 'undefined' && createPortal(
        <div data-color-portal className="p-3 bg-bg-card border border-border-primary rounded-xl shadow-2xl z-[100]" style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width }} onMouseDown={e => e.stopPropagation()}>
          <div className="relative w-full mb-3 select-none" style={{ aspectRatio: '16/10' }}>
            <canvas ref={canvasRef} width={320} height={200} className="absolute inset-0 w-full h-full rounded-lg cursor-crosshair" onMouseDown={onSatLightMouseDown} />
            <div className="absolute w-3 h-3 border-2 border-white rounded-full shadow pointer-events-none" style={{ left: `${curSat}%`, top: `${100 - curLight}%`, transform: 'translate(-50%, -50%)' }} />
          </div>
          <div className="relative w-full h-3 rounded-full cursor-pointer mb-3 select-none" style={{ background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)' }} onMouseDown={onHueMouseDown}>
            <div className="absolute w-4 h-4 border-2 border-white rounded-full shadow pointer-events-none" style={{ left: `${(hue / 360) * 100}%`, top: '50%', transform: 'translate(-50%, -50%)', backgroundColor: `hsl(${hue}, 100%, 50%)` }} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-md border border-border-primary shrink-0" style={{ background: `#${value}` }} />
            <span className="text-xs text-text-muted">#</span>
            <input type="text" value={hexInput} onChange={e => { const c = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6); setHexInput(c); if (/^[0-9a-fA-F]{6}$/.test(c)) { const [h, s, l] = hexToHsl(c); if (s > 0) hueRef.current = h; satRef.current = s; lightRef.current = l; if (canvasRef.current) drawColorGrid(canvasRef.current, hueRef.current); onChange(c); } }} className="flex-1 px-2 py-1 text-xs font-mono bg-bg-secondary border border-border-primary rounded-md focus:outline-none focus:border-accent uppercase" placeholder="EFBF04" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {PRESETS.map(c => (<button key={c} onClick={() => { const [h, s, l] = hexToHsl(c); if (s > 0) hueRef.current = h; satRef.current = s; lightRef.current = l; if (canvasRef.current) drawColorGrid(canvasRef.current, hueRef.current); onChange(c); }} className={`w-5 h-5 rounded-full border ${value === c ? 'border-accent scale-125 ring-1 ring-accent/30' : 'border-transparent hover:scale-110'}`} style={{ background: `#${c}` }} />))}
          </div>
        </div>, document.body)}
    </div>
  );
}
