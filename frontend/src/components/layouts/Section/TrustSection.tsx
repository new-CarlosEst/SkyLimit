import shield from "../../../assets/ui/UilShield.svg";
import TrustCard from "../../ui/blog/TrustCard";
import "./TrustSection.css";

function TrustSection() {
    return (
        <section className="trust-section-container">
            <div className="trust-badge rounded-lg">
                <img src={shield} alt="Shield" />
                <span>Compromiso de transparencia</span>
            </div>
            <h3>Honestos sobre nuestras limitaciones</h3>
            <p>Porque la transparencia se construye siendo claros de lo que podemos y no podemos controlar</p>

            <div className="trust-card">
                <TrustCard />
            </div>
        </section>
    );
}

export default TrustSection;