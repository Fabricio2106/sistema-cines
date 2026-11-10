import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer.jsx";
import ScrollToHash from "./components/ScrollToHash/ScrollToHash.jsx";
import Inicio from "./pages/Inicio.jsx";
import Pelicula from "./pages/Pelicula.jsx";
import Butacas from "./pages/Butacas.jsx";
import Login from "./components/Login/Login";

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/pelicula/:id" element={<Pelicula />} />
        <Route path="/pelicula/:id/butacas/:funcionId" element={<Butacas />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
