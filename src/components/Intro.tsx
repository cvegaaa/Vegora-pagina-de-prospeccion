import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { intro } from '@/data/quiz';

interface IntroProps {
  onStart: () => void;
}

export function Intro({ onStart }: IntroProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span data-reveal className="eyebrow justify-center text-v-turquesa">
        <span className="h-px w-8 bg-v-turquesa" />
        Diagnóstico de Madurez Digital
        <span className="h-px w-8 bg-v-turquesa" />
      </span>
      <h1
        data-reveal
        className="mt-6 max-w-2xl text-4xl font-semibold leading-[1.1] text-v-blanco md:text-6xl"
      >
        {intro.title}
      </h1>
      <p data-reveal className="mt-6 max-w-lg text-base leading-relaxed text-v-gris md:text-lg">
        {intro.subtitle}
      </p>
      <button data-reveal onClick={onStart} className="btn-primary group mt-10">
        {intro.button}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
    </div>
  );
}
