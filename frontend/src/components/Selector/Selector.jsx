import * as Select from "@radix-ui/react-select";

// Lista desplegable con el estilo del sitio, construida sobre Radix (teclado y lectores de pantalla).
// `className` son las clases del botón; deben incluir el espacio izquierdo para el ícono, si lo hay.
// `onChange` recibe un objeto parecido a un evento ({ target: { name, value } }).
const Selector = ({ value, onChange, opciones, placeholder = "Selecciona", name, className = "" }) => (
  <Select.Root value={value} onValueChange={(v) => onChange({ target: { name, value: v } })}>
    <Select.Trigger
      aria-label={placeholder}
      className={`flex items-center justify-between text-left ${className} ${value ? "" : "text-surface-500"}`}
    >
      <Select.Value placeholder={placeholder} />
      <Select.Icon asChild>
        <i className="bi bi-chevron-down ml-2 text-xs text-primary-400" aria-hidden="true" />
      </Select.Icon>
    </Select.Trigger>

    <Select.Portal>
      <Select.Content
        position="popper"
        sideOffset={8}
        className="z-[70] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-primary-700/60 bg-primary-950 py-1 text-white shadow-2xl shadow-black/60"
      >
        <Select.Viewport>
          {opciones.map((opcion) => (
            <Select.Item
              key={opcion}
              value={opcion}
              className="flex cursor-pointer items-center justify-between px-4 py-2.5 text-sm text-primary-100/80 outline-none data-[highlighted]:bg-primary-600 data-[highlighted]:text-white data-[state=checked]:font-semibold"
            >
              <Select.ItemText>{opcion}</Select.ItemText>
              <Select.ItemIndicator>
                <i className="bi bi-check-lg text-accent-400" aria-hidden="true" />
              </Select.ItemIndicator>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

export default Selector;
