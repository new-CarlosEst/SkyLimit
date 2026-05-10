import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../DatePickerShared.css';
import IconoirCalendar from '../../../assets/ui/IconoirCalendar.svg';


interface TwoStepDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText: string;
  minDate?: Date;
  maxDate?: Date;
  required?: boolean;
}

function TwoStepDatePicker({ 
  selected, 
  onChange, 
  placeholderText, 
  minDate, 
  maxDate, 
  required: _required 
}: TwoStepDatePickerProps) {
  const [step, setStep] = useState<'date' | 'time'>('date');
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateClick = () => {
    setStep('date');
    setShowDatePicker(true);
  };

  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setTempDate(date);
      setStep('time');
    }
  };

  const handleTimeSelect = (time: Date | null) => {
    if (time && tempDate) {
      // Combinar la fecha seleccionada con la hora seleccionada
      const combinedDateTime = new Date(tempDate);
      combinedDateTime.setHours(time.getHours());
      combinedDateTime.setMinutes(time.getMinutes());
      combinedDateTime.setSeconds(0);
      
      onChange(combinedDateTime);
      setShowDatePicker(false);
      setStep('date');
      setTempDate(null);
    }
  };

  const handleCancel = () => {
    setShowDatePicker(false);
    setStep('date');
    setTempDate(null);
  };

  const formatDateDisplay = (date: Date | null) => {
    if (!date) return placeholderText;
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1">
      <div 
        className="flex items-center border border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition-colors"
        onClick={handleDateClick}
      >
        <div className="p-2 border-r border-gray-300">
          <img src={IconoirCalendar} alt="Calendar" className="w-5 h-5" />
        </div>
        <div className="flex-1 px-3 py-2">
          <span className={selected ? 'text-gray-700' : 'text-gray-400'}>
            {formatDateDisplay(selected)}
          </span>
        </div>
      </div>

      {showDatePicker && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/40"
          onClick={handleCancel}
        >
          <div 
            className="relative z-[10000]"
            onClick={(e) => e.stopPropagation()}
          >
            {step === 'date' && (
              <DatePicker
                selected={tempDate}
                onChange={handleDateSelect}
                inline
                minDate={minDate}
                maxDate={maxDate}
                calendarClassName="sky-datepicker"
              />
            )}

            {step === 'time' && tempDate && (
              <DatePicker
                selected={null}
                onChange={handleTimeSelect}
                showTimeSelect
                showTimeSelectOnly
                inline
                timeIntervals={15}
                timeFormat="HH:mm"
                calendarClassName="sky-datepicker"
              />
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default TwoStepDatePicker;
