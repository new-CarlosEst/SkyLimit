import { useState, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { updatePersonalData } from "../api/auth.api";
import { sileo } from "sileo";

//Hook que te envia los datos de usuario a modificar en datos personales
interface UsePersonalDataFormReturn {
    isSubmitting: boolean;
    nameInputRef: React.RefObject<HTMLInputElement | null>;
    surnameInputRef: React.RefObject<HTMLInputElement | null>;
    handleSubmit: (e: React.FormEvent, selectedAirportId?: number) => Promise<void>;
}

export function usePersonalDataForm(): UsePersonalDataFormReturn {
    const { user, setUser, login } = useAuthStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const nameInputRef = useRef<HTMLInputElement>(null);
    const surnameInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent, selectedAirportId?: number) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Obtener los valores de los inputs directamente
            const name = nameInputRef.current?.value?.trim();
            const surname = surnameInputRef.current?.value?.trim();
            
            // Preparar datos para enviar
            const updateData: { name?: string; surname?: string; favoriteAirportId?: number } = {};
            
            if (name && name !== user?.name) {
                updateData.name = name;
            }
            
            if (surname && surname !== user?.surname) {
                updateData.surname = surname;
            }
            
            // Manejar el aeropuerto favorito
            const currentFavoriteId = user?.favoriteAirportId;
            
            // Si hay un aeropuerto seleccionado, añadirlo a los datos a actualizar
            if (selectedAirportId) {
                updateData.favoriteAirportId = selectedAirportId;
            } else if (selectedAirportId === 0 && currentFavoriteId) {
                // Si se envía 0, significa que se quiere eliminar el aeropuerto favorito
                updateData.favoriteAirportId = 0;
            }

            // Si no hay cambios, mostrar mensaje y salir
            if (Object.keys(updateData).length === 0) {
                sileo.warning({ title: "No hay cambios para guardar" });
                return;
            }

            // Llamar a la API
            const response = await updatePersonalData(updateData);
            
            // Actualizar el token y datos del usuario en la store
            if (response.data.access_token && response.data.user) {
                // Actualizar token en almacenamiento (mantener remember me)
                login(response.data.user, response.data.access_token, true);
                
                // Actualizar Zustand store con usuario actualizado
                setUser(response.data.user);
                
                sileo.success({ title: "Datos actualizados correctamente" });
            } else {
                sileo.error({ title: "Error al actualizar los datos" });
            }
        } catch (error) {
            console.error("Error al actualizar datos personales:", error);
            sileo.error({ title: "Error al actualizar los datos" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        isSubmitting,
        nameInputRef,
        surnameInputRef,
        handleSubmit
    };
}
