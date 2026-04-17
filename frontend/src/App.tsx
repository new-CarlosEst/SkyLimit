import { Routes, Route, useLocation } from "react-router-dom";
import Landing from './pages/Landing';
import Header from "./components/layouts/Header/Header";
import { Toaster } from "sileo";
import "sileo/styles.css"; // Hay que traerse este css para ver los toast de sileo
import { useToastStore } from "./store/toastStore";
import { useAuthPersistence } from "./hooks/useAuthPersistence";
import PasswordRecovery from "./pages/PasswordRecovery";
import Blog from "./pages/Blog";


function App() {
  // Hook para la persistencia de la aplicacion
  useAuthPersistence();

  // Meto la posicion del toast en zustand
  const toastPosition = useToastStore((state) => state.toastPosition);

  // Obtener la ruta actual
  const location = useLocation();
  const showHeader = location.pathname !== '/reset-password';

  return (
    <>
      <Toaster position={toastPosition} />
      {showHeader && <Header />}
      <Routes>
        {/* Aqui van las rutas de la aplicacion */}
        <Route path="/" element={<Landing />} />
        <Route path="/reset-password" element={<PasswordRecovery />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    </>
  )
}

export default App
