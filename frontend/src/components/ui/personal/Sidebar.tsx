import { useAuthStore } from "../../../store/authStore";
import { sileo } from "sileo";
import { Link } from "react-router-dom";
import ProiconsPerson from "../../../assets/ui/ProiconsPerson.svg";
import FamiconsCard from "../../../assets/ui/FamiconsCard.svg";
import IconoirCalendar from "../../../assets/ui/IconoirCalendar.svg";
import PajamasAdmin from "../../../assets/ui/PajamasAdmin.svg";
import pointRightArrow from "../../../assets/ui/pointRightArrow.svg";
import MynauiPlane from "../../../assets/ui/MynauiPlane.svg";

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const { user } = useAuthStore();

    const handleUnavailable = () => {
        sileo.warning({ title: "Función no disponible" });
    };

    const menuItems = [
        {
            id: "home",
            label: "Inicio",
            icon: MynauiPlane,
            isLink: true,
            to: "/"
        },
        {
            id: "profile",
            label: "Perfil",
            icon: ProiconsPerson,
            onClick: () => setActiveTab("profile")
        },
        {
            id: "payment",
            label: "Métodos de Pago",
            icon: FamiconsCard,
            onClick: handleUnavailable
        },
        {
            id: "reservations",
            label: "Mis Reservas",
            icon: IconoirCalendar,
            onClick: handleUnavailable
        }
    ];

    const adminMenuItem = {
        id: "admin",
        label: "Panel de Administración",
        icon: PajamasAdmin,
        onClick: () => setActiveTab("admin")
    };

    return (
        <div className="sidebar-container">
            <nav className="sidebar-nav">
                <ul>
                    {menuItems.map((item) => (
                        item.isLink ? (
                            <Link 
                                key={item.id}
                                to={item.to}
                                className={`sidebar-menu-item ${activeTab === item.id ? "active" : ""}`}
                            >
                                <div className="sidebar-menu-content">
                                    <img src={item.icon} alt={item.label} className="sidebar-menu-icon" />
                                    {item.label}
                                </div>
                                <img src={pointRightArrow} alt="→" className="sidebar-arrow" />
                            </Link>
                        ) : item.id === "profile" ? (
                            <Link 
                                key={item.id}
                                to="/personalData"
                                className={`sidebar-menu-item ${activeTab === item.id ? "active" : ""}`}
                            >
                                <div className="sidebar-menu-content">
                                    <img src={item.icon} alt={item.label} className="sidebar-menu-icon" />
                                    {item.label}
                                </div>
                                <img src={pointRightArrow} alt="→" className="sidebar-arrow" />
                            </Link>
                        ) : (
                            <li
                                key={item.id}
                                className={`sidebar-menu-item ${activeTab === item.id ? "active" : ""}`}
                                onClick={item.onClick}
                            >
                                <div className="sidebar-menu-content">
                                    <img src={item.icon} alt={item.label} className="sidebar-menu-icon" />
                                    {item.label}
                                </div>
                                <img src={pointRightArrow} alt="→" className="sidebar-arrow" />
                            </li>
                        )
                    ))}
                    
                    {(user?.role.toLowerCase() === "admin" || user?.role.toLowerCase() === "superadmin") && (
                        <Link 
                            to="/adminPanel"
                            className={`sidebar-menu-item sidebar-admin-item ${activeTab === "admin" ? "active" : ""}`}
                        >
                            <div className="sidebar-menu-content">
                                <img src={adminMenuItem.icon} alt={adminMenuItem.label} className="sidebar-menu-icon" />
                                {adminMenuItem.label}
                            </div>
                            <img src={pointRightArrow} alt="→" className="sidebar-arrow" />
                        </Link>
                    )}
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;
