'use client';

import React from 'react';

interface Service {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  deposit: number;
}

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export default function ServiceCard({ service, isSelected, onClick, disabled = false }: ServiceCardProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full group relative overflow-hidden rounded-2xl md:rounded-3xl transition-all duration-500 text-left
        border-2 backdrop-blur-sm
        ${
          disabled
            ? 'border-primary-200/30 bg-white/40 opacity-50 cursor-not-allowed'
            : isSelected
            ? 'border-primary-500 bg-white shadow-lg md:shadow-xl'
            : 'border-primary-200/50 bg-white/70 hover:border-primary-300 hover:shadow-md md:hover:shadow-lg hover:bg-white'
        }
      `}
    >
      {/* Efecto de fondo gradiente sutil en hover/selected */}
      <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
        isSelected 
          ? 'bg-gradient-to-br from-primary-50/50 to-transparent opacity-100' 
          : 'bg-gradient-to-br from-primary-50/0 to-transparent opacity-0 group-hover:opacity-50'
      }`}></div>

      {/* Línea decorativa izquierda */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-500 ${
        isSelected 
          ? 'bg-gradient-to-b from-primary-500 via-primary-400 to-primary-300' 
          : 'bg-primary-200/30 group-hover:bg-primary-300/50'
      }`}></div>

      <div className="relative p-3 md:p-6 space-y-3 md:space-y-6">
        {/* Encabezado: Nombre + Checkmark */}
        <div className="flex items-start justify-between gap-3 md:gap-4">
          <div className="flex-1 space-y-1">
            <h3 className="font-serif text-sm md:text-lg text-primary-900 font-light tracking-wide">
              {service.name}
            </h3>
            {service.description && (
              <p className="text-xs text-primary-600/70 font-light">
                {service.description}
              </p>
            )}
          </div>

          {/* Checkmark elegante */}
          {isSelected && (
            <div className="flex-shrink-0 flex items-center justify-center">
              <div className="relative w-5 h-5 md:w-6 md:h-6">
                <svg className="w-5 h-5 md:w-6 md:h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Divisor elegante */}
        <div className="flex gap-2 items-center">
          <div className={`flex-1 h-px transition-colors duration-300 ${
            isSelected ? 'bg-primary-300' : 'bg-primary-200/40'
          }`}></div>
          <span className="text-primary-400/60 text-xs font-light">●</span>
          <div className={`flex-1 h-px transition-colors duration-300 ${
            isSelected ? 'bg-primary-300' : 'bg-primary-200/40'
          }`}></div>
        </div>

        {/* Información: Duración + Precios */}
        <div className="space-y-4">
          {/* Duración */}
          <div className="flex items-center justify-between text-xs md:text-sm">
            <span className="text-primary-600/70 font-light">Duración</span>
            <span className="font-serif text-primary-800 font-light">
              {service.durationMinutes} min
            </span>
          </div>

          {/* Precio Total */}
          <div className="flex items-center justify-between">
            <span className="text-primary-600/70 font-light text-xs md:text-sm">Tarifa</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-primary-500/70">₡</span>
              <span className="font-serif text-primary-900 text-lg md:text-xl font-light tracking-tight">
                {service.price.toLocaleString('es-CR')}
              </span>
            </div>
          </div>

          {/* Adelanto - Destacado con fondo */}
          <div className={`rounded-xl md:rounded-2xl p-2 md:p-4 transition-colors duration-300 ${
            isSelected
              ? 'bg-primary-100/60 border border-primary-300/50'
              : 'bg-primary-50/40 border border-primary-200/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs md:text-sm font-light ${
                isSelected ? 'text-primary-700' : 'text-primary-600/70'
              }`}>
                Adelanto (50%)
              </span>
              <span className={`font-serif font-light ${
                isSelected ? 'text-primary-800 text-sm md:text-base' : 'text-primary-700 text-xs md:text-sm'
              }`}>
                ₡{service.deposit.toLocaleString('es-CR')}
              </span>
            </div>
          </div>
        </div>

        {/* Texto interactivo en hover */}
        <div className={`text-center text-xs font-light transition-all duration-300 ${
          isSelected
            ? 'text-primary-600 opacity-100'
            : 'text-primary-500/40 group-hover:text-primary-600 group-hover:opacity-100'
        }`}>
          {isSelected ? '● Seleccionado' : 'Seleccionar'}
        </div>
      </div>
    </button>
  );
}
