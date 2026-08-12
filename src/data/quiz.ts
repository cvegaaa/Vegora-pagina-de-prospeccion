export interface QuizOption {
  text: string;
  score: number;
}

export interface QuizQuestion {
  dimension: string;
  question: string;
  options: QuizOption[];
}

export interface QuizResult {
  min: number;
  max: number;
  level: string;
  title: string;
  text: string;
  opportunity: string;
  cta: string;
}

export const intro = {
  title: '¿Qué tan digitalizado está tu negocio?',
  subtitle:
    'Responde 8 preguntas rápidas y descubre tu nivel de madurez digital en 2 minutos.',
  button: 'Comenzar diagnóstico',
};

export const contactCapture = {
  title: 'Ya casi está listo tu diagnóstico',
  text: 'Ingresa tu WhatsApp para ver tu resultado y tu nivel de madurez digital.',
  button: 'Ver mi resultado',
};

export const quizQuestions: QuizQuestion[] = [
  {
    dimension: 'Digitalización básica',
    question: '¿Cómo gestionan actualmente la información de tu negocio?',
    options: [
      { text: 'En papel o en Excel muy disperso', score: 1 },
      { text: 'En Excel, pero centralizado', score: 2 },
      { text: 'En un software específico para una parte del negocio', score: 3 },
      { text: 'En un sistema integrado que conecta varias áreas', score: 4 },
    ],
  },
  {
    dimension: 'Digitalización básica',
    question: '¿Tus procesos dependen de una persona específica para funcionar?',
    options: [
      { text: 'Sí, si esa persona falta, el proceso se detiene', score: 1 },
      { text: 'Parcialmente, hay algo de respaldo pero es informal', score: 2 },
      { text: 'Poco, la mayoría de procesos están documentados', score: 3 },
      { text: 'No, están sistematizados y cualquiera puede seguirlos', score: 4 },
    ],
  },
  {
    dimension: 'Automatización',
    question: '¿Cuántas tareas repetitivas hace tu equipo manualmente cada semana?',
    options: [
      { text: 'Muchas — copiar datos, responder lo mismo, agendar a mano', score: 1 },
      { text: 'Varias, pero ya intentamos reducir algunas', score: 2 },
      { text: 'Pocas, casi todo lo rutinario ya está resuelto', score: 3 },
      { text: 'Casi ninguna, están automatizadas', score: 4 },
    ],
  },
  {
    dimension: 'Automatización',
    question: '¿Cómo haces seguimiento a clientes o prospectos?',
    options: [
      { text: 'No hay un seguimiento formal, se pierde información', score: 1 },
      { text: 'Manual, de memoria o en notas sueltas', score: 2 },
      { text: 'En Excel o agenda, con algo de disciplina', score: 3 },
      { text: 'Con un sistema que avisa y organiza automáticamente', score: 4 },
    ],
  },
  {
    dimension: 'Indicadores y decisiones',
    question: '¿Tienes acceso a números actualizados de tu negocio cuando los necesitas?',
    options: [
      { text: 'Casi nunca, toca armarlos desde cero', score: 1 },
      { text: 'A veces, con esfuerzo y tiempo', score: 2 },
      { text: 'Sí, pero suelen estar desactualizados', score: 3 },
      { text: 'Sí, en tiempo real', score: 4 },
    ],
  },
  {
    dimension: 'Indicadores y decisiones',
    question: '¿Cómo tomas las decisiones importantes del negocio?',
    options: [
      { text: 'Por intuición, sin datos de respaldo', score: 1 },
      { text: 'Con datos parciales o incompletos', score: 2 },
      { text: 'Con reportes periódicos', score: 3 },
      { text: 'Con dashboards actualizados en vivo', score: 4 },
    ],
  },
  {
    dimension: 'Integración de canales',
    question: '¿Tus canales de contacto (WhatsApp, redes, web) están conectados entre sí?',
    options: [
      { text: 'No, cada uno funciona por separado', score: 1 },
      { text: 'Algo conectados, pero de forma manual', score: 2 },
      { text: 'Mayormente conectados', score: 3 },
      { text: 'Sí, todo fluye a un panel unificado', score: 4 },
    ],
  },
  {
    dimension: 'Integración de canales',
    question: 'Si un cliente te escribe hoy, ¿cuánto tiempo toma responderle en promedio?',
    options: [
      { text: 'Horas, o a veces no se responde a tiempo', score: 1 },
      { text: '1 a 2 horas', score: 2 },
      { text: 'Minutos', score: 3 },
      { text: 'Respuesta inmediata o automatizada', score: 4 },
    ],
  },
];

export const quizResults: QuizResult[] = [
  {
    min: 8,
    max: 13,
    level: 'Nivel 1 — Operación Manual',
    title: 'Tu negocio está en la base de la transformación digital.',
    text: 'Tu negocio depende fuertemente de procesos manuales y de personas específicas. Esto genera riesgo operativo y limita tu capacidad de crecer sin aumentar proporcionalmente el esfuerzo.',
    opportunity: 'Digitalizar y sistematizar tus procesos base.',
    cta: 'Agenda tu diagnóstico gratuito con Vegora',
  },
  {
    min: 14,
    max: 19,
    level: 'Nivel 2 — Operación Digital Básica',
    title: 'Ya diste el primer paso, pero hay fricción oculta.',
    text: 'Ya usas herramientas digitales, pero de forma dispersa y sin automatización real. Estás perdiendo tiempo conectando manualmente lo que podría fluir solo.',
    opportunity: 'Automatizar el seguimiento de clientes y centralizar tu información.',
    cta: 'Agenda tu diagnóstico gratuito con Vegora',
  },
  {
    min: 20,
    max: 26,
    level: 'Nivel 3 — Organización Integrada',
    title: 'Tu negocio ya opera con estructura.',
    text: 'Tus procesos están mayormente conectados y tomas decisiones con datos, no solo con intuición. El riesgo en este nivel es estancarte: lo que hoy funciona puede quedarse corto cuando el negocio crezca.',
    opportunity: 'Integrar los canales que aún funcionan por separado y avanzar hacia indicadores en tiempo real.',
    cta: 'Agenda tu diagnóstico gratuito con Vegora',
  },
  {
    min: 27,
    max: 32,
    level: 'Nivel 4 — Organización Inteligente',
    title: 'Tu negocio opera con inteligencia real.',
    text: 'Tienes procesos automatizados, canales integrados y decisiones basadas en datos en vivo. Estás en el grupo minoritario de negocios que realmente ha hecho la transición digital completa.',
    opportunity: 'Explorar inteligencia artificial aplicada para anticipar decisiones, no solo reportarlas.',
    cta: 'Hablemos de cómo llevar tu operación al siguiente nivel',
  },
];

export const WHATSAPP_NUMBER = '573007239216';

export function buildWhatsappMessage(level: string) {
  return `Hola, hice el diagnóstico de madurez digital de Vegora y saqué ${level}.\nQuiero agendar mi diagnóstico gratuito.`;
}

export function buildWhatsappUrl(level: string) {
  const text = encodeURIComponent(buildWhatsappMessage(level));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export function getResultForScore(score: number): QuizResult {
  return (
    quizResults.find((r) => score >= r.min && score <= r.max) ??
    quizResults[quizResults.length - 1]
  );
}

export const SCORE_MIN = quizQuestions.length * 1;
export const SCORE_MAX = quizQuestions.length * 4;
