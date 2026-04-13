import { Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import Header from "./components/layouts/Header/Header";
import { Toaster } from "sileo";
import "sileo/styles.css"; // Hay que traerse este css para ver los toast de sileo
import { useToastStore } from "./store/toastStore";


function App() {
  // Meto la posicion del toast en zustand
  const toastPosition = useToastStore((state) => state.toastPosition);

  return (
    <>
      <Toaster position={toastPosition} />
      <Header />
      <Routes>
        {/* Aqui van las rutas de la aplicacion */}
        <Route path="/" element={<Landing />} />
      </Routes>
    </>
  )
}

export default App
