import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/ui/personal/Sidebar";
import PersonalDataForm from "../components/ui/personal/PersonalDataForm";
import PaymentMethods from "../components/ui/personal/PaymentMethods";
import UserReservations from "../components/ui/personal/UserReservations";
import AdminPanel from "../components/ui/personal/AdminPanel";
import "./PersonalData.css";

function PersonalData() {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState("profile");

    useEffect(() => {
        const tabParam = searchParams.get("tab");
        if (tabParam) {
            setActiveTab(tabParam);
        }
    }, [searchParams]);

    const renderContent = () => {
        switch (activeTab) {
            case "profile":
                return <PersonalDataForm />;
            case "payment":
                return <PaymentMethods />;
            case "reservations":
                return <UserReservations />;
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
