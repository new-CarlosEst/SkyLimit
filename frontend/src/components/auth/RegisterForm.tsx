import { register } from "../../api/auth.api";
import type { RegisterData } from "../../api/types";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import "./RegisterForm.css";

// Import logo
import logo from "../../assets/logo/logo-skylimit-letters-blue-rounded.svg";

function RegisterForm({ isLogin }: { isLogin: boolean, setIsLogin: React.Dispatch<React.SetStateAction<boolean>> }) {
    if (isLogin) { return null }

    const enviarDatos = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        const datos: RegisterData = {
            name: formData.get("name") as string,
            surname: formData.get("surname") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string
        }

        register(datos)
            .then(res => console.log(res.data))
            .catch(error => console.error(error.response.data))
    }

    return (
        <>
        </>
    )
}

export default RegisterForm;
