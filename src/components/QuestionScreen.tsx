import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import type { QuizQuestion } from '@/data/quiz';
import { ProgressBar } from './ProgressBar';

interface QuestionScreenProps {
  step: number;
  total: number;
  question: QuizQuestion;
  onAnswer: (score: number) => void;
}

export function QuestionScreen({ step, total, question, onAnswer }: QuestionScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);
  const [displayed, setDisplayed] = useState(question);
  const [displayedStep, setDisplayedStep] = useState(step);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.from(el, { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' });
      return;
    }

    // The state swap runs on a plain timer, not inside a GSAP callback: GSAP's
    // ticker rides on requestAnimationFrame, which browsers can stall while a
    // tab is backgrounded. If that happened mid-transition, gating the actual
    // question swap on the tween finishing would leave the quiz stuck on the
    // old question with its options disabled until the tab regained focus.
    gsap.to(el, { opacity: 0, y: -16, duration: 0.25, ease: 'power2.in' });
    const timer = window.setTimeout(() => {
      setDisplayed(question);
      setDisplayedStep(step);
      setSelected(null);
      gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    }, 260);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const handleSelect = (score: number, index: number) => {
    if (selected !== null) return;
    setSelected(index);
    window.setTimeout(() => onAnswer(score), 320);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-16">
      <div className="container-v">
        <ProgressBar step={displayedStep} total={total} />
        <div ref={containerRef}>
          <span className="eyebrow text-v-turquesa">{displayed.dimension}</span>
          <h2 className="mt-3 text-xl font-semibold leading-snug text-v-blanco md:text-2xl">
            {displayed.question}
          </h2>
          <div className="mt-8 flex flex-col gap-3">
            {displayed.options.map((opt, i) => {
              const isSelected = selected === i;
              return (
                <button
                  key={i}
                  onClick={() => handleSelect(opt.score, i)}
                  disabled={selected !== null}
                  className={`group flex min-h-[56px] items-center justify-between rounded-xl border px-5 py-4 text-left transition-all duration-300 disabled:cursor-default ${
                    isSelected
                      ? 'border-v-azul bg-v-azul/15 text-white'
                      : 'border-white/10 bg-white/[0.03] text-slate-200 hover:border-v-azul/40 hover:bg-v-azul/10 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-medium md:text-base">{opt.text}</span>
                  <ArrowRight
                    className={`h-4 w-4 flex-shrink-0 transition-all duration-300 ${
                      isSelected
                        ? 'translate-x-1 text-v-azul'
                        : 'text-slate-500 group-hover:translate-x-1 group-hover:text-v-azul'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
