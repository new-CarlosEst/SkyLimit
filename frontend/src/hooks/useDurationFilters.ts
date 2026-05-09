import { useState } from "react";
import chevronDown from "../assets/ui/FlowbiteChevronDownOutline.svg";
import chevronUp from "../assets/ui/FlowbiteChevronUpOutline.svg";

// Interfaz para filtros de duración
export interface DurationFilters {
    [key: string]: string;
}

interface UseDurationFiltersProps {
    tripType: "oneWay" | "roundTrip" | "multi" | null;
}

export function useDurationFilters({ tripType }: UseDurationFiltersProps) {
    const [localDurationFilters, setLocalDurationFilters] = useState<DurationFilters>({});
    const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});

    const durationOptions = [
        { value: "short", label: "Menos de 2 horas" },
        { value: "medium", label: "2 - 4 horas" },
        { value: "long", label: "4 - 6 horas" },
        { value: "very-long", label: "Más de 6 horas" }
    ];

    const toggleSection = (section: string) => {
        setExpandedSections((prev: {[key: string]: boolean}) => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const updateDurationFilter = (leg: string, value: string) => {
        setLocalDurationFilters((prev: any) => ({
            ...prev,
            [leg]: prev[leg] === value ? "" : value
        }) as DurationFilters);
    };

    const getChevronIcon = (isExpanded: boolean) => {
        return isExpanded ? chevronUp : chevronDown;
    };

    return {
        localDurationFilters,
        setLocalDurationFilters,
        expandedSections,
        durationOptions,
        toggleSection,
        updateDurationFilter,
        getChevronIcon
    };
}
