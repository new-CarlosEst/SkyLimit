import DatePicker from 'react-datepicker';
import calendarIcon from '../../../assets/ui/IconoirCalendar.svg';

interface DateInputProps {
    label: string;
    name: string;
    value: Date | null;
    onChange: (date: Date | null) => void;
    maxDate?: Date;
    minDate?: Date;
    required?: boolean;
}

function DateInput({ label, value, onChange, maxDate, minDate, required = false }: DateInputProps) {
    return (
        <div className="passenger-input-container">
            <label className="passenger-input-label">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="passenger-input-wrapper group datepicker-wrapper">
                <div className="passenger-input-icon-container">
                    <img src={calendarIcon} alt={label} className="passenger-input-icon" />
                </div>
                <DatePicker
                    selected={value}
                    onChange={onChange}
                    locale="es"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/aaaa"
                    maxDate={maxDate}
                    minDate={minDate}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    showMonthDropdown
                    className="passenger-input-field datepicker-input sky-datepicker"
                    required={required}
                    popperPlacement="bottom-start"
                />
            </div>
        </div>
    );
}

export default DateInput;
