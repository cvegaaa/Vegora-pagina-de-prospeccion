-- Tabla de leads capturados en el diagnóstico de madurez digital.
create table if not exists public.leads_diagnostico (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text not null,
  whatsapp text not null,
  email text,
  score integer not null,
  nivel text not null,
  respuestas jsonb not null
);

alter table public.leads_diagnostico enable row level security;

-- El formulario público solo necesita poder insertar su propio lead, nunca leer los demás.
-- Se usa "to public" (no "to anon"): con las API keys nuevas de Supabase
-- (sb_publishable_...) las solicitudes no siempre resuelven al rol "anon"
-- clásico, y "public" cubre cualquier cliente sin sesión de todas formas.
drop policy if exists "public can insert leads" on public.leads_diagnostico;
create policy "public can insert leads"
  on public.leads_diagnostico
  for insert
  to public
  with check (true);

-- Crear la tabla por SQL directo (fuera del editor visual de Supabase) no
-- otorga privilegios a "anon"/"authenticated" automáticamente: sin este
-- GRANT, la policy de arriba nunca llega a evaluarse y Postgres devuelve el
-- mismo error 42501 como si fuera un rechazo de RLS.
grant insert on public.leads_diagnostico to anon, authenticated;
