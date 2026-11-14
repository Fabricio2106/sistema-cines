import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Hace aparecer su contenido (con un leve desplazamiento) cuando entra en pantalla al hacer scroll.
const Aparece = ({ children, retraso = 0, className = "" }) => {
  const [ref, visible] = useInView({ triggerOnce: true, threshold: 0.15 });
  const sinMovimiento = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: sinMovimiento ? 0 : 28 }}
      animate={visible ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, delay: retraso, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default Aparece;
