import "./MainBlog.css";
import warning from "../../../assets/ui/EpWarning.svg";
import cross from "../../../assets/ui/MynauiX.svg";
import tick from "../../../assets/ui/tickCircle.svg";
import PriceCard from "../../ui/blog/PricesCard";

function MainBlog() {
    return (
        <div className="main-blog">
            <div className="main-problem">
                <section className="info-problema">
                    <div className="info-problema-content">
                        <img src={warning} alt="warning" />
                        <span>El Problema</span>
                    </div>
                    <h3>Falta de transparencia en la industria</h3>
                    <p>Las plataformas tradicionales de búsqueda de vuelos utilizan técnicas opacas para ajustar los precios según tu historial de navegación.</p>
                    <ul className="problema-list">
                        <li>
                            <div className="cross-icon-container"><img src={cross} alt="cross" /></div>
                            <span>Precios que suben cada vez que visitas la página</span>
                        </li>
                        <li>
                            <div className="cross-icon-container"><img src={cross} alt="cross" /></div>
                            <span>Cookies que rastrean tus búsquedas anteriores</span>
                        </li>
                        <li>
                            <div className="cross-icon-container"><img src={cross} alt="cross" /></div>
                            <span>Necesidad de usar modo incógnito o VPN para ver precios reales</span>
                        </li>
                    </ul>
                </section>
                <section className="visit-prices">
                    <PriceCard title="Primera visita" price="250€" className="neutral-price" />
                    <PriceCard title="Segunda visita" price="285€" className="warning-price" />
                    <PriceCard title="Tercera visita" price="320€" className="danger-price" />
                </section>
            </div>
            <div className="main-solution">
                <section className="visit-prices">
                    <PriceCard title="Primera visita" price="250€" className="success-price" icon={tick} />
                    <PriceCard title="Segunda visita" price="250€" className="success-price" icon={tick} />
                    <PriceCard title="Tercera visita" price="250€" className="success-price" icon={tick} />
                </section>
                <section className="info-solution">
                    <div className="info-solution-content">
                        <img src={tick} alt="success" />
                        <span>Nuestra Solución</span>
                    </div>
                    <h3>Precios justos y consistentes</h3>
                    <p>En SkyLimit, mostramos siempre los mismos precios, independientemente de cuántas veces consultes un vuelo o de tu historial de búsqueda.</p>
                    <ul className="solution-list">
                        <li>
                            <div className="tick-icon-container"><img src={tick} alt="tick" /></div>
                            <span>Sin tracking de cookies para manipular precios</span>
                        </li>
                        <li>
                            <div className="tick-icon-container"><img src={tick} alt="tick" /></div>
                            <span>Evitamos la volatilidad artificial de precios</span>
                        </li>
                        <li>
                            <div className="tick-icon-container"><img src={tick} alt="tick" /></div>
                            <span>No necesitas modo incógnito ni VPN</span>
                        </li>
                    </ul>
                </section>
            </div>
        </div>
    );
}

export default MainBlog;