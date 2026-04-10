import { Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import Header from "./components/layouts/Header/Header";
import AuthModal from "./components/auth/AuthModal";

//TODO: Hacer header, boton login/registro, como el modal con los forms cuando vayan ya los endpoints
function App() {
  return (
    <>
      <Header />
      <Routes>
        {/* Aqui van las rutas de la aplicacion */}
        <Route path="/" element={<Landing />} />
      </Routes>
    </>
  )
}

export default App
