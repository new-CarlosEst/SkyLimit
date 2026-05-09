import { useState } from "react";
import Sidebar from "../components/ui/personal/Sidebar";
import AdminPanelContent from "../components/ui/personal/AdminPanel";
import "./AdminPanel.css";

function AdminPanel() {
    const [activeTab, setActiveTab] = useState("admin");

    return (
        <div className="admin-panel-container">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="admin-panel-content">
                <AdminPanelContent />
            </div>
        </div>
    );
}

export default AdminPanel;
