import React, { useState } from 'react';
import briefcaseIcon from '../../../assets/ui/briefcase.svg';
import bagIcon from '../../../assets/ui/bag.svg';
import bigSuitcaseIcon from '../../../assets/ui/big-suitcase.svg';

interface BaggageInfoCardProps {
    cabinClass: string | null;
    isClassic: boolean;
    addCheckedBag: boolean;
    onToggleClassic: (value: boolean) => void;
    onToggleCheckedBag: (value: boolean) => void;
}

const ALL_CLASSES_INFO = [
    {
        id: 'economy-basic',
        name: 'Turista (Básica / Light)',
        hand: 'NO INCLUIDA (Solo pago)',
        personal: '1 pieza (40×30×15 cm) Bajo asiento',
        checked: 'NO INCLUIDA (De pago)'
    },
    {
        id: 'economy-classic',
        name: 'Turista (Classic / Estándar)',
        hand: '1 pieza (56×40×25 cm - 10kg)',
        personal: '1 pieza (40×30×15 cm)',
        checked: '1 maleta (23 kg / 158 cm)'
    },
    {
        id: 'premiumeconomy',
        name: 'Turista Premium',
        hand: '1 pieza (56×40×25 cm - 10kg)',
        personal: '1 pieza (40×30×15 cm)',
        checked: '2 maletas (23 kg c/u)'
    },
    {
        id: 'business',
        name: 'Ejecutiva (Business)',
        hand: '2 piezas (56×40×25 cm - 14kg total)',
        personal: '1 pieza (40×30×15 cm)',
        checked: '2 maletas (32 kg c/u)'
    },
    {
        id: 'first',
        name: 'Primera Clase',
        hand: '2 piezas (56×40×25 cm - 15kg c/u)',
        personal: '1 pieza (40×30×15 cm)',
        checked: '3 maletas (32 kg c/u)'
    }
];

const BaggageInfoCard: React.FC<BaggageInfoCardProps> = ({ 
    cabinClass, 
    isClassic, 
    addCheckedBag, 
    onToggleClassic, 
    onToggleCheckedBag 
}) => {
    const [showOtherClasses, setShowOtherClasses] = useState(false);

    let displayClass = '';
    let handLuggage = { title: '', desc: [] as string[] };
    let personalItem = { title: 'Accesorio personal (1 pieza)', desc: ['• Dimensiones máximas: 40 x 30 x 15 cm'] };
    let checkedLuggage = { title: '', desc: [] as string[] };

    if (cabinClass === 'economy' || !cabinClass) {
        if (!isClassic) {
            displayClass = 'Turista (Básica / Light)';
            handLuggage = { title: 'Equipaje de mano', desc: ['• NO INCLUIDA (Solo si pagas más)'] };
            personalItem.desc.push('• Bajo el asiento');
            checkedLuggage = { title: 'Equipaje de bodega', desc: [addCheckedBag ? '• 1 maleta (añadida por 30€)' : '• NO INCLUIDA (De pago)'] };
        } else {
            displayClass = 'Turista (Classic / Estándar)';
            handLuggage = { title: 'Equipaje de mano (1 pieza)', desc: ['• Dimensiones máximas: 56 × 40 × 25 cm', '• Peso máximo: 10 kg'] };
            checkedLuggage = { title: 'Equipaje de bodega (1 pieza)', desc: ['• Dimensiones máximas: 158 cm lineales', '• Peso máximo: 23 kg'] };
        }
    } else if (cabinClass === 'premiumeconomy') {
        displayClass = 'Turista Premium';
        handLuggage = { title: 'Equipaje de mano (1 pieza)', desc: ['• Dimensiones máximas: 56 × 40 × 25 cm', '• Peso máximo: 10 kg'] };
        checkedLuggage = { title: 'Equipaje de bodega (2 piezas)', desc: ['• Dimensiones máximas: 158 cm lineales', '• Peso máximo por pieza: 23 kg'] };
    } else if (cabinClass === 'business') {
        displayClass = 'Ejecutiva (Business)';
        handLuggage = { title: 'Equipaje de mano (2 piezas)', desc: ['• Dimensiones máximas: 56 × 40 × 25 cm', '• Peso máximo total: 14 kg'] };
        checkedLuggage = { title: 'Equipaje de bodega (2 piezas)', desc: ['• Dimensiones máximas: 158 cm lineales', '• Peso máximo por pieza: 32 kg'] };
    } else if (cabinClass === 'first') {
        displayClass = 'Primera Clase';
        handLuggage = { title: 'Equipaje de mano (2 piezas)', desc: ['• Dimensiones máximas: 56 × 40 × 25 cm', '• Peso máximo por pieza: 15 kg'] };
        checkedLuggage = { title: 'Equipaje de bodega (3 piezas)', desc: ['• Dimensiones máximas: 158 cm lineales', '• Peso máximo por pieza: 32 kg'] };
    }

    let currentClassId = 'economy-basic';
    if (cabinClass === 'economy' || !cabinClass) {
        currentClassId = isClassic ? 'economy-classic' : 'economy-basic';
    } else {
        currentClassId = cabinClass;
    }
    const otherClasses = ALL_CLASSES_INFO.filter(c => c.id !== currentClassId);

    return (
        <div className="card">
            <h3 className="text-slate-800 font-medium mb-6">Equipaje incluido - {displayClass}</h3>
            
            {(cabinClass === 'economy' || !cabinClass) && (
                <div className="mb-6 p-5 bg-blue-50 border border-blue-100 rounded-lg">
                    <h4 className="font-medium text-[#2b5aa0] mb-4">Opciones de mejora para tarifa Turista</h4>
                    <div className="flex flex-col gap-4">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <input 
                                type="checkbox" 
                                checked={isClassic} 
                                onChange={(e) => onToggleClassic(e.target.checked)}
                                className="mt-1 w-4 h-4 text-[#2b5aa0] border-slate-300 rounded focus:ring-[#2b5aa0]"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-800 group-hover:text-[#1a3c79]">Cambiar a Tarifa Classic (+35€ por pasajero)</span>
                                <span className="text-xs text-slate-500 mt-1">Incluye maleta de mano de 10kg y equipaje facturado de 23kg.</span>
                            </div>
                        </label>
                        {!isClassic && (
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input 
                                    type="checkbox" 
                                    checked={addCheckedBag} 
                                    onChange={(e) => onToggleCheckedBag(e.target.checked)}
                                    className="mt-1 w-4 h-4 text-[#2b5aa0] border-slate-300 rounded focus:ring-[#2b5aa0]"
                                />
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-800 group-hover:text-[#1a3c79]">Añadir Equipaje de bodega (+30€ por pasajero)</span>
                                    <span className="text-xs text-slate-500 mt-1">Añade solo 1 maleta facturada de 23kg sin maleta de mano.</span>
                                </div>
                            </label>
                        )}
                    </div>
                </div>
            )}

            <div className="baggage-item">
                <div className="baggage-icon-wrapper">
                    <img src={briefcaseIcon} alt="Equipaje de mano" className="baggage-icon" />
                </div>
                <div>
                    <h4 className="font-medium text-slate-800 mb-1">{handLuggage.title}</h4>
                    <ul className="text-sm text-slate-500 space-y-1">
                        {handLuggage.desc.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                </div>
            </div>

            <div className="baggage-item">
                <div className="baggage-icon-wrapper">
                    <img src={bagIcon} alt="Accesorio personal" className="baggage-icon" />
                </div>
                <div>
                    <h4 className="font-medium text-slate-800 mb-1">{personalItem.title}</h4>
                    <ul className="text-sm text-slate-500 space-y-1">
                        {personalItem.desc.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                </div>
            </div>

            <div className="baggage-item">
                <div className="baggage-icon-wrapper">
                    <img src={bigSuitcaseIcon} alt="Equipaje de bodega" className="baggage-icon" />
                </div>
                <div>
                    <h4 className="font-medium text-slate-800 mb-1">{checkedLuggage.title}</h4>
                    <ul className="text-sm text-slate-500 space-y-1">
                        {checkedLuggage.desc.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                </div>
            </div>

            <div 
                className="mt-6 text-[#2b5aa0] text-sm hover:text-[#1a3c79] hover:underline cursor-pointer flex items-center gap-1 select-none w-max transition-colors"
                onClick={() => setShowOtherClasses(!showOtherClasses)}
            >
                {showOtherClasses ? '▼ Ocultar equipaje de otras clases' : '▶ Ver equipaje permitido en otras clases'}
            </div>

            {showOtherClasses && (
                <div className="mt-4 overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-sm text-left whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3">Clase de Cabina</th>
                                <th className="px-4 py-3">Accesorio Personal</th>
                                <th className="px-4 py-3">Equipaje de Mano</th>
                                <th className="px-4 py-3">Equipaje de Bodega</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-500">
                            {otherClasses.map((cls, idx) => (
                                <tr key={cls.id} className={idx !== otherClasses.length - 1 ? 'border-b border-slate-100' : ''}>
                                    <td className="px-4 py-3 font-medium text-slate-700">{cls.name}</td>
                                    <td className="px-4 py-3">{cls.personal}</td>
                                    <td className="px-4 py-3">{cls.hand}</td>
                                    <td className="px-4 py-3">{cls.checked}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BaggageInfoCard;
