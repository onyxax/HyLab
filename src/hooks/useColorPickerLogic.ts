'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { hexToHsl, hslToRgb, rgbToHex, drawColorGrid } from '@/lib/color/color';

export function useColorPickerLogic(value: string, onChange: (c: string) => void) {
  const [hexInput, setHexInput] = useState(value);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 256 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hueRef = useRef(0);
  const satRef = useRef(50);
  const lightRef = useRef(50);
  const draggingRef = useRef(false);

  const updatePos = useCallback(() => {
    if (buttonRef.current) {
      const r = buttonRef.current.getBoundingClientRect();
      const w = 256;
      let left = r.left;
      if (left + w > window.innerWidth - 8) left = window.innerWidth - w - 8;
      if (left < 8) left = 8;
      setPos({ top: r.bottom + 8, left, width: w });
    }
  }, []);

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
    if (canvasRef.current) drawColorGrid(canvasRef.current, hueRef.current);
  }, [value]);

  const handleSatLight = useCallback((clientX: number, clientY: number, rect: DOMRect) => {
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    satRef.current = Math.round(x * 100);
    lightRef.current = Math.round((1 - y) * 100);
    onChange(rgbToHex(...hslToRgb(hueRef.current, satRef.current, lightRef.current)));
  }, [onChange]);

  const handleHue = useCallback((clientX: number, rect: DOMRect) => {
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    hueRef.current = Math.round(x * 360);
    if (canvasRef.current) drawColorGrid(canvasRef.current, hueRef.current);
    onChange(rgbToHex(...hslToRgb(hueRef.current, satRef.current, lightRef.current)));
  }, [onChange]);

  return { hexInput, setHexInput, pos, updatePos, canvasRef, buttonRef, hueRef, satRef, lightRef, draggingRef, handleSatLight, handleHue };
}
