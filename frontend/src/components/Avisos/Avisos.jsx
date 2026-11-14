import { Toaster } from "react-hot-toast";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Avisos emergentes y colores de los esqueletos de carga, con la paleta del sitio.
const Avisos = ({ children }) => (
  <SkeletonTheme baseColor="#2b1010" highlightColor="#4a1716">
    {children}
    <Toaster
      position="top-center"
      containerStyle={{ top: 84 }}
      toastOptions={{
        duration: 4000,
        style: {
          background: "#160909",
          color: "#fff",
          border: "1px solid rgba(163, 31, 29, 0.6)",
          borderRadius: "14px",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: 600,
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.5)",
        },
        success: { iconTheme: { primary: "#facc15", secondary: "#160909" } },
        error: { iconTheme: { primary: "#f2685f", secondary: "#160909" } },
      }}
    />
  </SkeletonTheme>
);

export default Avisos;
