import { useState } from "react";

import DatePickerLib from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import calendarIcon from "../../../../assets/ui/IconoirCalendar.svg";

// import { formatDate } from "../../../../utils/formaters";

import "./DatePicker.css";


//Los props para seleccionar fecha , si es ida y vuelta (range) o solo ida (single)

interface DatePickerProps {

    mode: "single" | "range";

    onDateChange: (date: Date | [Date, Date] | null) => void; //La fecha

    name: string; //Label

    minDate?: Date; //Fecha mínima opcional para multi-trip

}


function DatePicker({ mode, onDateChange, name, minDate }: DatePickerProps) {

    //Estados para las fechas de ida y vuelta

    const [startDate, setStartDate] = useState<Date | null>(null);

    const [endDate, setEndDate] = useState<Date | null>(null);



    //Funcion para la fecha solo ida

    const handleSingleDateChange = (date: Date | null) => {

        setStartDate(date);

        onDateChange(date);

    };



    //Funcion para la fecha ida y vuelta

    const handleStartDateChange = (date: Date | null) => {

        setStartDate(date);

        if (date && endDate && date > endDate) {

            setEndDate(null);

        }

        onDateChange(date ? [date, endDate || date] : null);

    };



    //Funcion para la fecha de vuelta

    const handleEndDateChange = (date: Date | null) => {

        // Validar que la vuelta no sea el mismo día que la ida
        if (date && startDate) {
            const startDay = new Date(startDate);
            startDay.setHours(0, 0, 0, 0);
            const endDay = new Date(date);
            endDay.setHours(0, 0, 0, 0);
            
            // Si es el mismo día, no permitir
            if (startDay.getTime() === endDay.getTime()) {
                return;
            }
        }

        setEndDate(date);

        onDateChange(startDate && date ? [startDate, date] : null);

    };



    return (

        <div className="date-picker-wrapper">

            <label className="text-sm font-semibold text-gray-700">{name}</label>



            {/* Modo solo una fecha */}

            {mode === "single" ? (

                <div>
                    <div className="input-wrapper">
                        <img src={calendarIcon} alt="calendar" className="input-icon" />
                        <DatePickerLib
                            selected={startDate}
                            onChange={handleSingleDateChange}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Selecciona fecha"
                            minDate={minDate || new Date()}
                            className="date-input"
                        />
                    </div>
                </div>

            ) : (

                // Modo ida y vuelta

                <div className="range-wrapper">

                    <div className="range-input">

                        <img src={calendarIcon} alt="calendar" className="input-icon" />

                        <DatePickerLib

                            selected={startDate}

                            onChange={handleStartDateChange}

                            dateFormat="dd/MM/yyyy"

                            placeholderText="Ida"

                            minDate={new Date()}

                            className="date-input"

                        />

                    </div>

                    <span className="separator">→</span>

                    <div className="range-input">

                        <img src={calendarIcon} alt="calendar" className="input-icon" />

                        <DatePickerLib

                            selected={endDate}

                            onChange={handleEndDateChange}

                            dateFormat="dd/MM/yyyy"

                            placeholderText="Vuelta"

                            minDate={startDate ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) : new Date()}

                            className="date-input"

                        />

                    </div>

                </div>

            )}

        </div>

    );

}



export default DatePicker;