import type { User } from "../../../types/user.types";
import { useState } from "react";
import { useAuthStore } from "../../../store/authStore";

function UserButton({ user }: { user: User }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const logout = useAuthStore((state) => state.logout);
    return (
        <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex gap-2 user-button text-white font-semibold hover:bg-white/20 transition-colors duration-250 cursor-pointer py-2 px-6 rounded-lg mr-6">
            <div className="w-8 h-8 bg-white text-[#2c5aa0] rounded-full flex items-center justify-center">
                {user?.name.charAt(0).toUpperCase()}
            </div>
            <button>
                {user?.name}
            </button>
            {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                    <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Mis reservas
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Datos personales
                    </button>
                    <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>

    )
}

export default UserButton;