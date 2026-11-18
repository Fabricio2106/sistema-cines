-- Clasificación de las películas: solo se admiten estas cuatro (las del panel de administración):
--   APT        Apto para todos.
--   +14        Mayores de 14 años; los menores entran generalmente con un adulto.
--   +14 c/DNI  Mayores de 14 con DNI en la puerta; no entra ningún menor de 14.
--   +18        Solo mayores de 18 años (violencia explícita, contenido sexual fuerte o lenguaje adulto).
-- La columna puede quedar vacía: entonces la web no muestra insignia.
-- Va DESPUÉS de cartelera.sql. Se pega completo en Supabase → SQL Editor → Run.
-- Se puede ejecutar más de una vez.
--
-- Primero pasa los valores antiguos a los nuevos (ATP → APT, 14+ → +14, 16+ → +14 c/DNI,
-- 18+ → +18) y después agrega la regla. Si la regla falla, hay una película con un valor que
-- no está en la lista: corrígelo (select id, clasificacion from public.peliculas) y vuelve a ejecutar.

update public.peliculas
set clasificacion = case
  when trim(clasificacion) = '' then null
  when upper(clasificacion) like '%DNI%' then '+14 c/DNI'
  when upper(trim(clasificacion)) in ('APT', 'ATP', 'TODOS') then 'APT'
  when upper(trim(clasificacion)) in ('16+', '+16', '16') then '+14 c/DNI'
  when upper(trim(clasificacion)) in ('14+', '+14', '14') then '+14'
  when upper(trim(clasificacion)) in ('18+', '+18', '18', 'M14', 'M18') then '+18'
  else clasificacion
end
where clasificacion is not null;

alter table public.peliculas drop constraint if exists peliculas_clasificacion_valida;
alter table public.peliculas
  add constraint peliculas_clasificacion_valida
  check (clasificacion is null or clasificacion in ('APT', '+14', '+14 c/DNI', '+18'));
