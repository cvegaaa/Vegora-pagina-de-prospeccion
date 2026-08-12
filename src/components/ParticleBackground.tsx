import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ParticleField } from '@/engine/particleField';

interface ParticleBackgroundProps {
  /** 0 = caos inicial, 1 = sistema totalmente estructurado (resultado). */
  progress: number;
}

export function ParticleBackground({ progress }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<ParticleField | null>(null);
  const orderState = useRef({ value: 0 });
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const field = new ParticleField(canvasRef.current, { reducedMotion });
    fieldRef.current = field;

    const resize = () => {
      const el = containerRef.current;
      if (!el) return;
      field.resize(el.clientWidth, el.clientHeight);
    };
    resize();
    field.start();

    const observer = new ResizeObserver(resize);
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      field.destroy();
      fieldRef.current = null;
    };
  }, []);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      orderState.current.value = progress;
      field.setOrder(progress);
      return;
    }

    tweenRef.current?.kill();
    tweenRef.current = gsap.to(orderState.current, {
      value: progress,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => field.setOrder(orderState.current.value),
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [progress]);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
