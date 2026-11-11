-- Libro de Reclamaciones virtual. Los reclamos se guardan en la tabla `reclamos`,
-- que nadie puede leer ni escribir directamente desde el navegador: se registran
-- solo con la función `registrar_reclamo`, que valida los datos. Se leen desde
-- Table Editor en Supabase. Se puede ejecutar más de una vez.

create table if not exists public.reclamos (
  id bigint generated always as identity primary key,
  creado_en timestamptz not null default now(),
  tipo text not null check (tipo in ('reclamo', 'queja')),
  nombre text not null check (char_length(nombre) between 2 and 120),
  tipo_documento text not null check (tipo_documento in ('DNI', 'CE', 'Pasaporte', 'RUC')),
  numero_documento text not null check (char_length(numero_documento) between 5 and 20),
  correo text not null check (char_length(correo) between 5 and 120),
  telefono text check (telefono is null or char_length(telefono) <= 20),
  direccion text check (direccion is null or char_length(direccion) <= 200),
  detalle text not null check (char_length(detalle) between 10 and 2000),
  pedido text not null check (char_length(pedido) between 5 and 1000),
  usuario_id uuid references auth.users (id) on delete set null
);

alter table public.reclamos enable row level security;
-- Sin políticas: ningún rol puede leer ni escribir directamente.

create or replace function public.registrar_reclamo(
  p_tipo text,
  p_nombre text,
  p_tipo_documento text,
  p_numero_documento text,
  p_correo text,
  p_telefono text,
  p_direccion text,
  p_detalle text,
  p_pedido text
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id bigint;
begin
  insert into public.reclamos (
    tipo, nombre, tipo_documento, numero_documento, correo,
    telefono, direccion, detalle, pedido, usuario_id
  ) values (
    p_tipo, trim(p_nombre), p_tipo_documento, trim(p_numero_documento), trim(p_correo),
    nullif(trim(p_telefono), ''), nullif(trim(p_direccion), ''), trim(p_detalle), trim(p_pedido),
    auth.uid()
  )
  returning id into v_id;
  return v_id;
end;
$$;

grant execute on function public.registrar_reclamo(text, text, text, text, text, text, text, text, text)
  to anon, authenticated;
