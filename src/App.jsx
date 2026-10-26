import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer.jsx";
import Hero from "./components/Hero/Hero";
import Estrenos from "./components/Estrenos/Estrenos.jsx";
import Normas from "./components/Normas/Normas.jsx";
import ComoLlegar from "./components/Comollegar/Comollegar.jsx";
import Login from "./components/Login/Login";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Estrenos />
              <Normas />
              <ComoLlegar />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
