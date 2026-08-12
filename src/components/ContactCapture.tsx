import { useState, type FormEvent } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { contactCapture } from '@/data/quiz';
import { saveLead } from '@/lib/supabase';

interface ContactCaptureProps {
  score: number;
  level: string;
  answers: number[];
  onSubmitted: (lead: { nombre: string; whatsapp: string }) => void;
}

function normalizeDigits(value: string) {
  return value.replace(/[^\d]/g, '');
}

export function ContactCapture({ score, level, answers, onSubmitted }: ContactCaptureProps) {
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ nombre?: string; whatsapp?: string; email?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!nombre.trim()) next.nombre = 'Cuéntanos tu nombre.';
    const digits = normalizeDigits(whatsapp);
    if (digits.length < 7) next.whatsapp = 'Ingresa un número de WhatsApp válido.';
    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email.trim())) next.email = 'Ese correo no parece válido.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const { error } = await saveLead({
      nombre: nombre.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim() || undefined,
      score,
      nivel: level,
      respuestas: answers,
    });
    if (error) {
      console.error('No se pudo guardar el lead en Supabase:', error);
    }
    // El resultado ya está calculado localmente: nunca bloqueamos al
    // visitante por un fallo de red al guardar su contacto.
    onSubmitted({ nombre: nombre.trim(), whatsapp: whatsapp.trim() });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="container-v max-w-lg text-center">
        <h2 className="text-2xl font-semibold text-v-blanco md:text-3xl">{contactCapture.title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-v-gris md:text-base">{contactCapture.text}</p>

        <form onSubmit={handleSubmit} noValidate className="mt-10 flex flex-col gap-4 text-left">
          <div>
            <label htmlFor="nombre" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-v-gris">
              Nombre
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              autoComplete="name"
              className="min-h-[52px] w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500 focus:border-v-azul focus:outline-none focus:ring-1 focus:ring-v-azul"
            />
            {errors.nombre && <p className="mt-1.5 text-xs text-red-400">{errors.nombre}</p>}
          </div>

          <div>
            <label htmlFor="whatsapp" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-v-gris">
              WhatsApp
            </label>
            <input
              id="whatsapp"
              type="tel"
              inputMode="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+57 300 000 0000"
              autoComplete="tel"
              className="min-h-[52px] w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500 focus:border-v-azul focus:outline-none focus:ring-1 focus:ring-v-azul"
            />
            {errors.whatsapp && <p className="mt-1.5 text-xs text-red-400">{errors.whatsapp}</p>}
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-v-gris">
              Email <span className="normal-case text-slate-500">(opcional)</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@empresa.com"
              autoComplete="email"
              className="min-h-[52px] w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-slate-500 focus:border-v-azul focus:outline-none focus:ring-1 focus:ring-v-azul"
            />
            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary group mt-4 self-center">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando…
              </>
            ) : (
              <>
                {contactCapture.button}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
