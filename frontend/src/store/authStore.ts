import { create } from "zustand";
import type { User } from "../types/user.types";


interface AuthState {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
}

//Meto en la store de zustand (que no en el localStorage) los datos de usuario y el token
    export const useAuthStore = create<AuthState>()(
        (set) => ({
            user: null,
            token: null,
            login: (user, token) => set({ user, token }),
            logout: () => {
                localStorage.removeItem("auth-storage");
                sessionStorage.removeItem("auth-storage");
                set({ user: null, token: null });
            },
        })
    );