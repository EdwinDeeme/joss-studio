'use client';

import React, { useState } from 'react';

interface CalendarProps {
  value: string;
  onChange: (date: string) => void;
  minDate: string;
}

export default function Calendar({ value, onChange, minDate }: CalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(new Date(value || new Date()));

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-CR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleDateClick = (day: number) => {
    const selected = new Date(month.getFullYear(), month.getMonth(), day).toISOString().split('T')[0];
    onChange(selected);
    setIsOpen(false);
  };

  const daysInMonth = getDaysInMonth(month);
  const firstDay = getFirstDayOfMonth(month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, () => null);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-left bg-white hover:border-primary-300 transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className={value ? 'text-dark font-medium' : 'text-gray-400'}>
            {value ? formatDate(value) : 'Selecciona una fecha'}
          </span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h14M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl z-50 p-4 w-80">
          {/* Header del calendario */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="font-bold text-dark">
              {month.toLocaleDateString('es-CR', { month: 'long', year: 'numeric' })}
            </h3>
            <button
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
              <div key={day} className="text-center text-xs font-bold text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Días */}
          <div className="grid grid-cols-7 gap-1">
            {[...emptyDays, ...days].map((day, i) => (
              <button
                key={i}
                onClick={() => day && handleDateClick(day)}
                disabled={!day}
                className={`
                  p-2 rounded-lg font-medium transition-all duration-200
                  ${
                    !day
                      ? 'invisible'
                      : value === `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                        ? 'bg-primary-300 text-dark font-bold'
                        : new Date(month.getFullYear(), month.getMonth(), day) < new Date(minDate)
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'hover:bg-primary-50 text-dark'
                  }
                `}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
