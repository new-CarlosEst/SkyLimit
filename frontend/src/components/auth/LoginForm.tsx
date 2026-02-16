import { login } from "../../api/auth.api";
import type { LoginData } from "../../api/types";

type loginProps = {
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

function LoginForm({isLogin, setIsLogin} : loginProps){
    
    if (!isLogin){return null}

    //Me creo la funcion pra enviar los datos
    const enviarDatos = (e: React.SubmitEvent<HTMLFormElement>) => {
        //evito las cosas del submit por defecto
        e.preventDefault()

        //Saco los datos y los envio con la funcion de login

        const formData = new FormData(e.currentTarget)

        const datos : LoginData = {
            email: formData.get("email") as string,
            password: formData.get("password") as string
        }

        //TODO: En vez de sacar los datos e imprimirlos ponr consola, darle los estilos (maquetarlo) y mostrar los errores cuando hay un 4XX o un 5XX
        login(datos)
            .then(res => console.log(res.data))
            .catch(error => console.error(error.response.data))
    }
    return (
        <form onSubmit={enviarDatos}>
            <h2>Inicia sesion en Skylimit</h2>
            <label htmlFor="email">Email
                <input type="text" name="email" id="" />
            </label>

            <label htmlFor="password">Contraseña
                <input type="password" name="password" id="" />
            </label>

            <button type="submit">Inicia Sesion</button>

            <button type="button" onClick={() => setIsLogin(false)}>¿No tienes cuenta?</button>
        </form>
)}

export default LoginForm;