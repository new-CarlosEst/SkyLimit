import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Landing from './pages/Landing';
import Header from "./components/layouts/Header/Header";
import { Toaster } from "sileo";
import "sileo/styles.css"; // Hay que traerse este css para ver los toast de sileo
import { useToastStore } from "./store/toastStore";
import { useAuthPersistence } from "./hooks/useAuthPersistence";
import PasswordRecovery from "./pages/PasswordRecovery";
import Blog from "./pages/Blog";
import Flights from "./pages/Flights";
import loginBackground from "./assets/backgrounds/Login-Avion-azul.jpg";
import registerBackground from "./assets/backgrounds/Register-Pasaporte-azul.jpg";
import forgotPasswordBackground from "./assets/backgrounds/aeropuerto-azul.png";


function App() {
  // Hook para la persistencia de la aplicacion
  useAuthPersistence();

  // Meto la posicion del toast en zustand
  const toastPosition = useToastStore((state) => state.toastPosition);

  // Obtener la ruta actual
  const location = useLocation();
  const navigate = useNavigate();
  const showHeader = location.pathname !== '/reset-password';

  // Precargar imágenes de fondo para el modal de autenticación
  useEffect(() => {
    const images = [
      loginBackground,
      registerBackground,
      forgotPasswordBackground
    ];

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Leer parámetro resetToken y navegar
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resetToken = params.get('token');
    
    // Si hay token, navegar a la pagina de recuperacion de contraseña para que funcione la paginacion de react-router en produccion
    if (resetToken) {
      navigate(`/reset-password?token=${resetToken}`);
    }
  }, [location.search, navigate]);

  return (
    <>
      <Toaster position={toastPosition} />
      {showHeader && <Header />}
      <Routes>
        {/* Aqui van las rutas de la aplicacion */}
        <Route path="/" element={<Landing />} />
        <Route path="/reset-password" element={<PasswordRecovery />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/flights" element={<Flights />} />
      </Routes>
    </>
  )
}

export default App
