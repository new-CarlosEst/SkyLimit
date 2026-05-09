import { useState } from "react";
import Sidebar from "../components/ui/personal/Sidebar";
import PersonalDataForm from "../components/ui/personal/PersonalDataForm";
import AdminPanel from "../components/ui/personal/AdminPanel";
import "./PersonalData.css";

function PersonalData() {
    const [activeTab, setActiveTab] = useState("profile");

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return <PersonalDataForm />;
            case "admin":
                return <AdminPanel />;
            default:
                return null;
        }
    };

    return (
        <div className="personal-data-container">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="personal-data-content">
                {renderContent()}
            </div>
        </div>
    );
}

export default PersonalData;
