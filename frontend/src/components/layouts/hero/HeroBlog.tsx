import shield from "../../../assets/ui/UilShield.svg";
import trendingDown from "../../../assets/ui/MaterialSymbolsTrendingDown.svg";
import "./HeroBlog.css";

function HeroBlog() {
    return (
        <div className="hero-blog bg-linear-to-br from-[#2c5aa0] to-[#1e3a6f]">
            <h2 className="title-hero-blog ">Transparencia en cada vuelo</h2>
            <p className="subtitle-hero-blog text-blue-200">Buscar y compra vuelos sin preocuparte por precios manipulados o subidas repentinas. En Skylimit, lo que ves es lo que pagas.</p>
            <div className="badges-hero-blog">
                <div className="badge">
                    <img src={shield} alt="Shield" style={{ filter: 'invert(1)' }} />
                    <span>Sin cookies engañosas</span>
                </div>
                <div className="badge">
                    <img src={trendingDown} alt="Trending Down" style={{ filter: 'invert(1)' }} />
                    <span>Precios estables</span>
                </div>

            </div>
        </div>
    )
}

export default HeroBlog;