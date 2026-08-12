import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MessageCircle, RotateCcw } from 'lucide-react';
import type { QuizResult } from '@/data/quiz';
import { buildWhatsappUrl } from '@/data/quiz';

interface ResultScreenProps {
  result: QuizResult;
  onReset: () => void;
}

export function ResultScreen({ result, onReset }: ResultScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.4 })
        .from('[data-reveal-level]', { opacity: 0, y: 16, duration: 0.7, ease: 'power3.out' })
        .from(
          '[data-reveal]',
          { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out', stagger: 0.12 },
          '-=0.35'
        );
    }, rootRef);
    return () => ctx.revert();
  }, [result]);

  return (
    <div ref={rootRef} className="flex min-h-dvh flex-col items-center justify-center px-6 py-16 text-center">
      <div className="container-v max-w-xl">
        <p data-reveal-level className="eyebrow justify-center text-v-turquesa">
          Tu resultado
        </p>
        <h1
          data-reveal-level
          className="mt-4 bg-gradient-to-r from-v-blanco via-v-azul to-v-turquesa bg-clip-text text-3xl font-semibold leading-tight text-transparent md:text-5xl"
        >
          {result.level}
        </h1>

        <h2 data-reveal className="mt-8 text-xl font-semibold text-v-blanco md:text-2xl">
          {result.title}
        </h2>
        <p data-reveal className="mt-5 text-sm leading-relaxed text-v-gris md:text-base">
          {result.text}
        </p>

        <div data-reveal className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-v-turquesa">Mayor oportunidad</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200 md:text-base">{result.opportunity}</p>
        </div>

        <div data-reveal className="mt-10 flex flex-col items-center gap-4">
          <a
            href={buildWhatsappUrl(result.level)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary group"
          >
            <MessageCircle className="h-4 w-4" />
            {result.cta}
          </a>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors duration-300 hover:text-slate-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Repetir diagnóstico
          </button>
        </div>
      </div>
    </div>
  );
}
