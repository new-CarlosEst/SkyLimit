// Hook personalizado para la persistencia de la aplicación
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { validateJWT } from '../api/auth.api';

export const useAuthPersistence = () => {
    useEffect(() => {
        const checkAuth = async () => {
            // Intento recuperar local, y si no, del session
            const storedAuth = localStorage.getItem("auth-storage") || sessionStorage.getItem("auth-storage");

            if (!storedAuth) return;

            try {
                const parsedAuth = JSON.parse(storedAuth);
                const token = parsedAuth.state?.token;

                if (token) {
                    const res = await validateJWT(token);
                    useAuthStore.getState().login(res.data.user, res.data.access_token);
                }
            } catch (error) {
                console.error("Error recuperando sesión:", error);
                localStorage.removeItem("auth-storage");
                sessionStorage.removeItem("auth-storage");
            }
        };

        checkAuth();
    }, []);
};