//Me importo la peticion de registro
import { register } from "../../api/auth.api";
import type { RegisterData } from "../../api/types";


type loginProps = {
    isLogin: boolean;
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

function RegisterForm({isLogin, setIsLogin}: loginProps){
    if (isLogin){return null}

    //Me hago la funcion que recogera los datos del evento y hara la peticion con axios
    const enviarDatos = async (e : React.SubmitEvent<HTMLFormElement>) => {
        //evito que se recarge la pagina y demas eventos por defecto del submit
        e.preventDefault();

        //Me saco los datos del form
        const formData = new FormData(e.currentTarget)

        const datos: RegisterData = {
            name: formData.get("name") as string,
            surname: formData.get("surname") as string,
            email: formData.get("email") as string,
            password: formData.get("password") as string
        }

        //TODO: En vez de sacar los datos e imprimirlos ponr consola, darle los estilos (maquetarlo) y mostrar los errores cuando hay un 4XX o un 5XX
        //Hago el register, lo manejo con then y catch
        register(datos)
            .then(res => console.log(res.data))
            .catch(error => console.error(error.response.data))
    }

    return (
        <form onSubmit={enviarDatos}>
            <h2>Registrate en SkyLimit</h2>
            <label htmlFor="name">Nombre
                <input type="text" name="name" id="" />
            </label>

            <label htmlFor="surname">Apellido/s
                <input type="text" name="surname" />
            </label>

            <label htmlFor="email">Email
                <input type="text" name="email" id="" />
            </label>

            <label htmlFor="password">Contraseña
                <input type="password" name="password" id="" />
            </label>

            <button type="submit">Registrate</button>

            <button type="button" onClick={() => setIsLogin(true)}>¿Ya tienes cuenta?</button>
        </form>
)}

export default RegisterForm;