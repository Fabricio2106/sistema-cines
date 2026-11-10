import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Lleva al ancla (#estrenos, #funciones…) o al inicio al cambiar de ruta.
const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToHash;
