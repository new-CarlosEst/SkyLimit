// store para guardar la posicion del toast
import { create } from "zustand";

type ToastPosition = "top-right" | "top-left" | "top-center" | "bottom-right" | "bottom-left" | "bottom-center";

type ToastStore = {
    toastPosition: ToastPosition;
    setToastPosition: (position: ToastPosition) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
    toastPosition: "top-center",
    setToastPosition: (position) => set({ toastPosition: position }),
}));