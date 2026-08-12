interface ProgressBarProps {
  step: number;
  total: number;
}

export function ProgressBar({ step, total }: ProgressBarProps) {
  const pct = Math.round((step / total) * 100);

  return (
    <div className="mb-10 w-full">
      <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-widest text-v-gris">
        <span>
          Pregunta {Math.min(step + 1, total)} de {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-v-azul to-v-turquesa transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
