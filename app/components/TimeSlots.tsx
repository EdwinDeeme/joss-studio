'use client';

interface TimeSlot {
  label: string;
  value: string;
}

interface TimeSlotsProps {
  slots: TimeSlot[];
  isLoading: boolean;
  selectedSlot: string | null;
  onSelect: (slot: string) => void;
  durationMinutes?: number;
}

export default function TimeSlots({ slots, isLoading, selectedSlot, onSelect, durationMinutes = 120 }: TimeSlotsProps) {
  const formatSlotRange = (slotValue: string) => {
    if (!slotValue) return '';

    const [startHour, startMinute] = slotValue.split(':').map(Number);
    const start = new Date();
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    return `${slotValue}–${end.toLocaleTimeString('es-CR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'America/Costa_Rica',
    })}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin">
          <svg className="w-8 h-8 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="ml-3 text-gray-500 font-medium">Cargando disponibilidad...</span>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <p className="text-blue-700 font-medium">No hay horarios disponibles para esta fecha</p>
        <p className="text-blue-600 text-sm mt-1">Intenta seleccionar otro día</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-primary-50 rounded-lg border border-primary-200 px-4 py-3 text-sm text-primary-700 font-medium">
        Duración de la cita: {Math.round(durationMinutes / 60)} hora{durationMinutes >= 120 ? 's' : ''}
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {slots.map((slot) => (
          <button
            key={slot.value}
            onClick={() => onSelect(slot.value)}
            className={`
              py-3 px-2 rounded-lg font-bold text-sm transition-all duration-200
              border-2 hover:shadow-md active:scale-95
              ${
                selectedSlot === slot.value
                  ? 'border-primary-300 bg-primary-300 text-dark shadow-lg'
                  : 'border-gray-200 bg-white text-dark hover:border-primary-300 hover:bg-primary-50'
              }
            `}
          >
            <span className="block">{formatSlotRange(slot.label)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
