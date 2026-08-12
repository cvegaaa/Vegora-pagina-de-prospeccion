import { useMemo, useState } from 'react';
import { quizQuestions, getResultForScore } from '@/data/quiz';

export type Stage = 'intro' | 'quiz' | 'contact' | 'result';

const TOTAL = quizQuestions.length;

export function useQuizState() {
  const [stage, setStage] = useState<Stage>('intro');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const score = useMemo(() => answers.reduce((acc, s) => acc + s, 0), [answers]);
  const result = useMemo(() => getResultForScore(score), [score]);

  const start = () => setStage('quiz');

  const answerQuestion = (optionScore: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = optionScore;
      return next;
    });
    if (step + 1 < TOTAL) {
      setStep(step + 1);
    } else {
      setStage('contact');
    }
  };

  const goToResult = () => setStage('result');

  const reset = () => {
    setStage('intro');
    setStep(0);
    setAnswers([]);
  };

  // 0 = hero, ~0.85 mientras se responde, 0.92 en captura de contacto, 1 en resultado.
  const orderProgress = useMemo(() => {
    if (stage === 'intro') return 0;
    if (stage === 'quiz') return (step / TOTAL) * 0.85;
    if (stage === 'contact') return 0.92;
    return 1;
  }, [stage, step]);

  return {
    stage,
    step,
    total: TOTAL,
    answers,
    score,
    result,
    orderProgress,
    start,
    answerQuestion,
    goToResult,
    reset,
  };
}
