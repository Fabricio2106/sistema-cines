import { lazy, Suspense } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Skeleton from "react-loading-skeleton";

// El reproductor pesa bastante: solo se descarga cuando alguien abre un tráiler.
const ReactPlayer = lazy(() => import("react-player"));

const TrailerDialog = ({ url, titulo }) => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border-2 border-accent-400 px-5 py-2.5 text-sm font-bold text-accent-400 transition-colors hover:bg-accent-400 hover:text-black"
      >
        <i className="bi bi-play-circle-fill text-lg" aria-hidden="true" />
        Ver tráiler
      </button>
    </Dialog.Trigger>

    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-sm" />
      <Dialog.Content
        aria-describedby={undefined}
        className="fixed left-1/2 top-1/2 z-[61] w-[92vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 focus:outline-none"
      >
        <Dialog.Title className="mb-3 truncate pr-12 text-lg font-bold text-white">Tráiler de {titulo}</Dialog.Title>
        <div className="aspect-video overflow-hidden rounded-2xl border border-primary-700/50 bg-black shadow-2xl shadow-black/60">
          <Suspense fallback={<Skeleton height="100%" containerClassName="block h-full leading-none" />}>
            <ReactPlayer src={url} playing controls width="100%" height="100%" />
          </Suspense>
        </div>
        <Dialog.Close
          aria-label="Cerrar tráiler"
          className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-500"
        >
          <i className="bi bi-x-lg" aria-hidden="true" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default TrailerDialog;
