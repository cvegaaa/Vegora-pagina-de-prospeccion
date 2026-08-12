import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export interface LeadPayload {
  nombre: string;
  whatsapp: string;
  email?: string;
  score: number;
  nivel: string;
  respuestas: number[];
}

export async function saveLead(lead: LeadPayload) {
  if (!supabase) {
    console.warn('Supabase no está configurado — lead no guardado.', lead);
    return { error: new Error('Supabase no configurado') };
  }

  const { error } = await supabase.from('leads_diagnostico').insert({
    nombre: lead.nombre,
    whatsapp: lead.whatsapp,
    email: lead.email || null,
    score: lead.score,
    nivel: lead.nivel,
    respuestas: lead.respuestas,
  });

  return { error };
}
