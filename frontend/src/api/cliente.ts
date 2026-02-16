//Cliente de axios
import axios from "axios";

//Me hago un cliente de axios para hacer petciones
const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api', // Url de mi backend
    headers: {
        'Content-Type': 'application/json', //Le digo que lo envie en formato json
    },
    timeout: 30000, // si despues de 30 segundos no responde manda un error
});

// Aqui coge los errores
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        //Devuelve el reject con una promesa
        // Aquí puedes manejar errores globales
        return Promise.reject(error);
});

export default apiClient;
