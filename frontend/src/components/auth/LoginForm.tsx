import { login } from "../../api/auth.api";
import type { LoginData } from "../../api/types";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import "./LoginForm.css";

// Import logo
import logo from "../../assets/logo/logo-skylimit-letters-blue-rounded.svg";

function LoginForm({ isLogin, setIsLogin }: { isLogin: boolean, setIsLogin: React.Dispatch<React.SetStateAction<boolean>> }) {

    if (!isLogin) { return null }

    const enviarDatos = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const datos: LoginData = {
            email: formData.get("email") as string,
            password: formData.get("password") as string
        }

        login(datos)
            .then(res => console.log(res.data))
            .catch(error => console.error(error.response.data))
    }

    return (
        <>
        </>
    )
}

export default LoginForm;