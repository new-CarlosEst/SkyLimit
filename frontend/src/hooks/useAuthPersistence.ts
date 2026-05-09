// Hook personalizado para la persistencia de la aplicación
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { validateJWT } from '../api/auth.api';

export const useAuthPersistence = () => {
    useEffect(() => {
        const checkAuth = async () => {
            // Obtener token del almacenamiento (localStorage o sessionStorage)
            const token = localStorage.getItem("auth-token") || sessionStorage.getItem("auth-token");

            if (!token) return;

            try {
                // Validar token con backend y obtener datos de usuario
                const res = await validateJWT(token);
                
                if (res.data.user && res.data.access_token) {
                    // Actualizar store con datos del usuario
                    useAuthStore.getState().setUser(res.data.user);
                    
                    // Actualizar token si ha cambiado
                    if (res.data.access_token !== token) {
                        localStorage.setItem('auth-token', res.data.access_token);
                        sessionStorage.setItem('auth-token', res.data.access_token);
                        useAuthStore.getState().setUser(res.data.user);
                    }
                }
            } catch (error) {
                console.error("Error validando sesión:", error);
                // Token inválido, limpiar almacenamiento
                localStorage.removeItem("auth-token");
                sessionStorage.removeItem("auth-token");
                useAuthStore.getState().logout();
            }
        };

        checkAuth();
    }, []);
};