import { useState } from "react";

interface PriceRange {
    min: number;
    max: number;
}
//Hook personalizado que te permite controlar las opciones de los inputs
function usePriceSlider(initialMax: number = 20000) {
    const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: initialMax });
    const [sliderValue, setSliderValue] = useState(100);

    const handlePriceChange = (val: number) => {
        setSliderValue(val);

        if (val === 0) {
            setPriceRange({ min: 0, max: 0 });
            return;
        }
        if (val === 100) {
            setPriceRange({ min: 0, max: initialMax });
            return;
        }

        const minLog = 10;
        const maxLog = initialMax;
        let calculatedPrice = minLog * Math.pow(maxLog / minLog, val / 100);

        if (calculatedPrice < 50) {
            calculatedPrice = Math.round(calculatedPrice / 5) * 5;
        } else if (calculatedPrice < 500) {
            calculatedPrice = Math.round(calculatedPrice / 10) * 10;
        } else if (calculatedPrice < 2000) {
            calculatedPrice = Math.round(calculatedPrice / 50) * 50;
        } else {
            calculatedPrice = Math.round(calculatedPrice / 100) * 100;
        }

        setPriceRange({ min: 0, max: calculatedPrice });
    };

    const resetPrice = () => {
        setPriceRange({ min: 0, max: initialMax });
        setSliderValue(100);
    };

    return {
        priceRange,
        sliderValue,
        handlePriceChange,
        resetPrice,
    };
}

export default usePriceSlider;
