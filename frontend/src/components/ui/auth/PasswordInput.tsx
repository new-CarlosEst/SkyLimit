import { useState } from "react";

import eyeIcon from "../../../assets/ui/eye.svg";
import eyeOffIcon from "../../../assets/ui/eye-closed.svg";
import padlock from "../../../assets/ui/padlock.svg";

function PasswordInput() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <div className="flex flex-col gap-1 w-full">
            <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Contraseña
            </label>
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 sm:py-3.5 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all bg-white group">
                <img src={padlock} alt="Candado" className="w-5 h-5 opacity-40 group-focus-within:opacity-80 transition-opacity shrink-0" />
                <input
                    type={isPasswordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Introduce tu contraseña..."
                    className="outline-none text-gray-700 text-sm bg-transparent placeholder-gray-500 font-medium text-left w-full h-full"
                />
                <button
                    type="button"
                    onClick={() => setIsPasswordVisible(prev => !prev)}
                    className="shrink-0 opacity-40 hover:opacity-80 transition-opacity"
                >
                    <img src={isPasswordVisible ? eyeOffIcon : eyeIcon} alt="Visibilidad" className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
}

export default PasswordInput;