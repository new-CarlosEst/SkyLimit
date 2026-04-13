import { Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import Header from "./components/layouts/Header/Header";

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
