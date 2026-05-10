import { create } from "zustand";
import type { User } from "../types/user.types";

interface AuthState {
    user: User | null;
    token: string | null;
    login: (user: User, token: string, rememberMe: boolean) => void;
    logout: () => void;
    setUser: (user: User) => void;
    validateSession: () => Promise<void>;
}

// Función para guardar token según el tipo de almacenamiento
const saveToken = (token: string, rememberMe: boolean = false) => {
    if (rememberMe) {
        localStorage.setItem('auth-token', token);
    } else {
        sessionStorage.setItem('auth-token', token);
    }
};

// Función para cargar token del almacenamiento correcto
const getTokenFromStorage = () => {
    try {
        // Intentar cargar desde sessionStorage primero
        let token = sessionStorage.getItem('auth-token');
        
        // Si no hay en sessionStorage, intentar localStorage
        if (!token) {
            token = localStorage.getItem('auth-token');
        }
        
        return token;
    } catch (error) {
        console.error('Error loading token from storage:', error);
        return null;
    }
};

// Store de Zustand: usuario solo en memoria, token en almacenamiento
export const useAuthStore = create<AuthState>()(
    (set, get) => {
        // Cargar solo el token inicialmente
        const initialToken = getTokenFromStorage();
        
        return {
            user: null,
            token: initialToken,
            login: (user, token, rememberMe: boolean = false) => {
                // Guardar token en el almacenamiento correcto según remember me
                saveToken(token, rememberMe);
                
                // Usuario solo en Zustand
                set({ user, token });
            },
            logout: () => {
                localStorage.removeItem("auth-token");
                sessionStorage.removeItem("auth-token");
                set({ user: null, token: null });
            },
            setUser: (user) => {
                set({ user });
            },
            validateSession: async () => {
                const { token } = get();
                if (!token) return;
                
                try {
                    // Validar token con backend y obtener datos actualizados
                    const response = await fetch('/api/auth/validateJWT', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        set({ user: data.user });
                    } else {
                        // Token inválido, cerrar sesión
                        get().logout();
                    }
                } catch (error) {
                    console.error('Error validating session:', error);
                    get().logout();
                }
            }
        };
    }
);