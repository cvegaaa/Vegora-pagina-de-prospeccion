import { ParticleBackground } from '@/components/ParticleBackground';
import { Intro } from '@/components/Intro';
import { QuestionScreen } from '@/components/QuestionScreen';
import { ContactCapture } from '@/components/ContactCapture';
import { ResultScreen } from '@/components/ResultScreen';
import { useQuizState } from '@/hooks/useQuizState';
import { quizQuestions } from '@/data/quiz';

function App() {
  const quiz = useQuizState();

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-v-negro text-v-blanco">
      <ParticleBackground progress={quiz.orderProgress} />
      <div className="relative z-10">
        {quiz.stage === 'intro' && <Intro onStart={quiz.start} />}
        {quiz.stage === 'quiz' && (
          <QuestionScreen
            step={quiz.step}
            total={quiz.total}
            question={quizQuestions[quiz.step]}
            onAnswer={quiz.answerQuestion}
          />
        )}
        {quiz.stage === 'contact' && (
          <ContactCapture
            score={quiz.score}
            level={quiz.result.level}
            answers={quiz.answers}
            onSubmitted={quiz.goToResult}
          />
        )}
        {quiz.stage === 'result' && <ResultScreen result={quiz.result} onReset={quiz.reset} />}
      </div>
    </div>
  );
}

export default App;
