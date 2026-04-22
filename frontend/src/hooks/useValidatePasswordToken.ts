import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sileo } from "sileo";
import { validateJWT } from "../api/auth.api";

export const useValidatePasswordToken = (token: string | null) => {
    const navigate = useNavigate();
    const [isValidating, setIsValidating] = useState(true);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            // Si no hay token en la URL
            if (!token) {
                sileo.error({
                    title: "Token no válido",
                    description: "El enlace de recuperación es inválido o ha expirado",
                });
                navigate("/");
                setIsValidating(false);
                return;
            }

            try {
                // Valida el token en el backend
                await validateJWT(token);
                setIsValid(true);
                setIsValidating(false);
            } catch (err: any) {
                sileo.error({
                    title: "Token expirado o inválido",
                    description: "El enlace de recuperación ha expirado o es inválido. Solicita uno nuevo.",
                });
                navigate("/");
                setIsValidating(false);
            }
        };

        validateToken();
    }, [token, navigate]);

    return { isValidating, isValid };
};