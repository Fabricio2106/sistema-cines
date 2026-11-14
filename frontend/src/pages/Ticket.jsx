import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { buscarCompra } from "../services/compras";
import { useCartelera } from "../context/CarteleraContext";
import PaginaCargando from "../components/PaginaCargando/PaginaCargando";
import letras from "../assets/cinerama-letras.png";
import { textoFecha } from "../utils/fechas";

// Color de fondo de la página: los recortes laterales del ticket lo imitan para parecer perforados.
const FONDO = "bg-[rgb(26,0,0)]";

const Dato = ({ etiqueta, children, ancho }) => (
  <div className={ancho ? "col-span-2" : ""}>
    <dt className="text-[11px] font-bold uppercase tracking-widest text-primary-100/50">{etiqueta}</dt>
    <dd className="mt-0.5 font-semibold text-white">{children}</dd>
  </div>
);

const Ticket = () => {
  const { id } = useParams();
  const { buscarPelicula } = useCartelera();
  const sinMovimiento = useReducedMotion();
  const [compra, setCompra] = useState(undefined); // undefined = cargando, null = no existe

  useEffect(() => {
    let activo = true;
    buscarCompra(id).then((c) => activo && setCompra(c));
    return () => {
      activo = false;
    };
  }, [id]);

  if (compra === undefined) {
    return <PaginaCargando />;
  }

  // La base solo devuelve compras del usuario con sesión, así que ajena = no existe
  if (compra === null) {
    return (
      <main className="min-h-screen pt-32 px-6 text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Entrada no encontrada</h1>
        <Link to="/perfil?tab=compras" className="text-accent-400 hover:underline">
          Ir a mis compras
        </Link>
      </main>
    );
  }

  const pelicula = buscarPelicula(compra.peliculaId);
  const imagen = pelicula?.banner ?? pelicula?.poster;
  const entradas = compra.asientos.length;

  return (
    <main className="min-h-screen px-4 pb-16 pt-24 text-white">
      <div className="mx-auto max-w-md">
        <motion.div
          initial={sinMovimiento ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="mb-6 text-center print:hidden"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 text-3xl text-green-400">
            <i className="bi bi-check-lg" aria-hidden="true" />
          </span>
          <h2 className="mt-3 text-xl font-bold">¡Compra confirmada!</h2>
          <p className="text-sm text-primary-100/60">
            Tienes {entradas} {entradas === 1 ? "entrada" : "entradas"}. Muestra el QR en la puerta de la sala.
          </p>
        </motion.div>

        <motion.article
          initial={sinMovimiento ? false : { y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-primary-700/50 bg-primary-900 shadow-2xl shadow-black/60"
        >
          {/* Cabecera con la imagen de la película */}
          <header className="relative overflow-hidden px-6 pb-5 pt-6">
            {imagen && (
              <img
                src={imagen}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-sm"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-700/70 to-primary-900" aria-hidden="true" />
            <div className="relative flex items-start gap-4">
              {pelicula?.poster && (
                <img
                  src={pelicula.poster}
                  alt={`Póster de ${compra.titulo}`}
                  className="w-20 shrink-0 rounded-lg shadow-xl shadow-black/50"
                />
              )}
              <div className="min-w-0">
                <img src={letras} alt="Cinerama" className="mb-3 w-24" />
                <h1 className="text-xl font-bold leading-tight">{compra.titulo}</h1>
              </div>
            </div>
          </header>

          {/* Datos de la función */}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 px-6 py-5">
            <Dato etiqueta="Fecha" ancho>
              <span className="inline-block text-lg first-letter:uppercase">{textoFecha(compra.fecha)}</span>
            </Dato>
            <Dato etiqueta="Hora">{compra.hora}</Dato>
            <Dato etiqueta="Sala">{compra.sala}</Dato>
            <Dato etiqueta="Butacas" ancho>
              <span className="flex flex-wrap gap-1.5">
                {compra.asientos.map((a) => (
                  <span key={a} className="rounded-md bg-accent-400 px-2 py-0.5 text-sm font-bold text-black">
                    {a}
                  </span>
                ))}
              </span>
            </Dato>
            <Dato etiqueta="Total pagado">
              <span className="text-lg text-accent-400">S/ {compra.total}</span>
            </Dato>
          </dl>

          {/* Línea de corte con muescas */}
          <div className="relative" aria-hidden="true">
            <div className="border-t-2 border-dashed border-primary-600/60" />
            <span className={`absolute -left-4 -top-4 h-8 w-8 rounded-full border border-primary-700/50 ${FONDO}`} />
            <span className={`absolute -right-4 -top-4 h-8 w-8 rounded-full border border-primary-700/50 ${FONDO}`} />
          </div>

          {/* Talón con el QR */}
          <footer className="px-6 pb-7 pt-6 text-center">
            <div className="mx-auto w-fit rounded-2xl bg-white p-4 shadow-lg">
              <QRCodeSVG value={compra.codigo} size={168} level="M" title={`Código QR de la entrada ${compra.codigo}`} />
            </div>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-widest text-primary-100/50">Código de entrada</p>
            <p className="font-mono text-3xl font-bold tracking-[0.3em] text-accent-400">{compra.codigo}</p>
            <p className="mt-2 text-xs text-primary-100/50">Muestra este código QR en la puerta de la sala</p>
          </footer>
        </motion.article>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary-600 px-6 py-3 font-semibold transition-colors hover:bg-primary-600"
          >
            <i className="bi bi-printer-fill" aria-hidden="true" />
            Imprimir
          </button>
          <Link
            to="/perfil?tab=compras"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-accent-400 px-6 py-3 font-bold text-black shadow-lg shadow-accent-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent-300"
          >
            <i className="bi bi-ticket-perforated-fill" aria-hidden="true" />
            Mis compras
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Ticket;
