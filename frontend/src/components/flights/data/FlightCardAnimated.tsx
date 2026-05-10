import { useEffect, useRef, useState } from "react";
import type { FlightResult } from "../../../types/flight.types";
import FlightCard from "./FlightCard";
import "./FlightCardAnimated.css";

interface FlightCardAnimatedProps {
    flight: FlightResult;
    cabinClass: 'economy' | 'premiumeconomy' | 'business' | 'first' | null;
    passengers: {
        adults: number;
        children: number;
        infants: number;
    } | null;
    index: number;
}

function FlightCardAnimated({ flight, cabinClass, passengers, index }: FlightCardAnimatedProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        setIsExiting(false);
                    } else {
                        setIsVisible(false);
                        setIsExiting(true);
                    }
                });
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
                rootMargin: '0px'
            }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, []);

    return (
        <div 
            ref={elementRef}
            className={`flight-card-animated ${isVisible ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}
            style={{
                transitionDelay: isVisible ? `${index * 50}ms` : '0ms'
            }}
        >
            <FlightCard flight={flight} cabinClass={cabinClass} passengers={passengers} />
        </div>
    );
}

export default FlightCardAnimated;
