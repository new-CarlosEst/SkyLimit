import plane from "../../../assets/ui/MynauiPlane.svg";

function PriceCard({title, price, className, icon}: {title: string, price: string, className?: string, icon?: string}) {
    return (
        <div className={`${className} price-card rounded-lg p-4`}>
            <div className="price-card-title">
                <p>{title}</p>
                <img src={icon || plane} alt="icon" />
            </div>
            <div className="price-card-price">
                <p>{price}</p>
            </div>
        </div>
    );
}

export default PriceCard;