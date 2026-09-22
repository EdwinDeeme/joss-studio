'use client';

import React, { useState, useEffect } from 'react';
import Stepper from './components/Stepper';
import ServiceCard from './components/ServiceCard';
import Calendar from './components/Calendar';
import TimeSlots from './components/TimeSlots';
import Input from './components/Input';
import Button from './components/Button';
import { FiMapPin, FiPhone, FiInstagram, FiCheck } from 'react-icons/fi';

const STEPS = ['Servicio', 'Fecha', 'Hora', 'Datos', 'Resumen'];

interface Service {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  deposit: number;
}

interface TimeSlot {
  label: string;
  value: string;
}

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [needsRemoval, setNeedsRemoval] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState(false);
  const [gelXSize, setGelXSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [gelXType, setGelXType] = useState<'normal' | 'piedrera' | '3d'>('normal');

  // Form fields Step 4
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Form fields Step 5
  const [paymentRef, setPaymentRef] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'loading'; message: string } | null>(null);

  // Cargar servicios
  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetch('/api/services');
        const data = await res.json();
        setServices(data);
        if (data.length > 0) {
          setSelectedService(data[0]);
          setSelectedDate(new Date().toISOString().split('T')[0]);
        }
      } catch (error) {
        console.error('Error loading services:', error);
      }
    };
    loadServices();
  }, []);

  // Cargar slots cuando cambia servicio o fecha
  useEffect(() => {
    if ((selectedService || selectedPromo) && selectedDate) {
      loadSlots();
    }
  }, [selectedService, selectedDate, selectedPromo]);

  const loadSlots = async () => {
    setSlotsLoading(true);
    try {
      const res = await fetch(`/api/availability?serviceId=${selectedService?.id || ''}&date=${selectedDate}&selectedPromo=${selectedPromo ? 'true' : 'false'}`);
      const data = await res.json();
      setTimeSlots(data.slots || []);
      setSelectedTime('');
    } catch (error) {
      console.error('Error loading slots:', error);
      setTimeSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calcular precio total con extras
  const calculateTotalPrice = (): number => {
    if (selectedPromo) return 13000;
    if (!selectedService) return 0;
    
    let total = selectedService.price;
    
    // Ajustes por tamaño de Gel X
    if (selectedService.id === 'gel-sm') {
      if (gelXSize === 'L') total += 3000;
      if (gelXSize === 'XL') total += 3500;
      
      // Ajustes por tipo
      if (gelXType === 'piedrera') total += 2000;
      if (gelXType === '3d') total += 2500;
    }
    
    if (needsRemoval) total += 2000;
    if (selectedPromo) total = 13000;
    return total;
  };

  const calculateTotalDeposit = (): number => {
    return Math.ceil(calculateTotalPrice() / 2);
  };

  const canProceedToStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!selectedService || selectedPromo;
      case 2:
        return !!selectedDate;
      case 3:
        return !!selectedTime;
      case 4:
        return !!name.trim() && !!phone.trim();
      case 5:
        return !!paymentRef.trim();
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceedToStep(currentStep) && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceedToStep(currentStep)) return;

    setIsLoading(true);
    setStatusMessage({ type: 'loading', message: 'Procesando tu reserva...' });

    try {
      const formData = new FormData();
      formData.append('serviceId', selectedService?.id || '');
      formData.append('date', selectedDate);
      formData.append('time', selectedTime);
      formData.append('clientName', name);
      formData.append('clientPhone', phone);
      formData.append('clientEmail', email);
      formData.append('paymentReference', paymentRef);
      formData.append('notes', notes);
      formData.append('needsRemoval', needsRemoval.toString());
      formData.append('selectedPromo', selectedPromo.toString());
      formData.append('gelXSize', gelXSize);
      formData.append('gelXType', gelXType);
      formData.append('totalPrice', calculateTotalPrice().toString());
      formData.append('totalDeposit', calculateTotalDeposit().toString());
      if (image) formData.append('inspirationImage', image);

      const res = await fetch('/api/bookings', {
        method: 'POST',
        body: formData,
        headers: {
          Referer: typeof window !== 'undefined' ? window.location.origin : '',
        },
      });

      if (!res.ok) {
        throw new Error('Error al crear la reserva');
      }

      const data = await res.json();
      setStatusMessage({ type: 'success', message: `✅ ¡Reserva guardada! ${data.message}` });

      // Limpiar formulario
      setTimeout(() => {
        setCurrentStep(1);
        setSelectedService(services[0] || null);
        setSelectedDate('');
        setSelectedTime('');
        setName('');
        setPhone('');
        setEmail('');
        setNotes('');
        setImage(null);
        setImagePreview('');
        setPaymentRef('');
        setNeedsRemoval(false);
        setSelectedPromo(false);
        setGelXSize('M');
        setGelXType('normal');
        setStatusMessage(null);
      }, 2000);
    } catch (error) {
      setStatusMessage({
        type: 'error',
        message: `❌ ${error instanceof Error ? error.message : 'Error desconocido'}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex flex-col">
      {/* Header Premium - Sticky */}
      <header className="bg-white border-b border-primary-200/30 sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-center">
          <img 
            src="/logo.png" 
            alt="Joss Studio Logo" 
            className="h-28 w-auto object-contain md:h-32"
          />
        </div>
      </header>

      {/* Stepper - Fixed al top sin scroll */}
      <div className="bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/40 border-b border-primary-200/30 fixed top-40 left-0 right-0 z-40 md:top-44 flex-shrink-0 w-full">
        <div className="px-4 py-3">
          <Stepper currentStep={currentStep} totalSteps={STEPS.length} steps={STEPS} />
        </div>
      </div>

      {/* Main Content - Scrollable - Ajustado para stepper fixed */}
      <div className="w-full px-3 md:px-4 pt-48 md:pt-52 pb-4 md:pb-8 flex-1 overflow-y-auto">
        {/* Status Message */}
        {statusMessage && (
          <div
            className={`
            p-4 rounded-lg mb-8 font-medium text-sm
            ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : statusMessage.type === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-primary-50 text-primary-700 border border-primary-200'
            }
          `}
          >
            {statusMessage.message}
          </div>
        )}

        {/* Content Card */}
        <div className="bg-white/80 md:bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg p-4 md:p-8 mb-6 md:mb-8 border border-primary-100/30 md:border-primary-100/50 backdrop-blur-sm md:backdrop-blur-none">
          {/* STEP 1: SERVICES */}
          {currentStep === 1 && (
            <div className="space-y-4 md:space-y-8">
              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-light text-primary-900 mb-2 md:mb-3">¿Qué te gustaría hacerte?</h2>
                <p className="text-primary-600 font-light text-sm md:text-base">Elige el servicio que deseas</p>
              </div>
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    isSelected={selectedService?.id === service.id && !selectedPromo}
                    disabled={selectedPromo}
                    onClick={() => {
                      setSelectedService(service);
                      setNeedsRemoval(false);
                      setSelectedPromo(false);
                      setGelXSize('M');
                      setGelXType('normal');
                    }}
                  />
                ))}
              </div>

              {/* Mensaje cuando promo está activa */}
              {selectedPromo && (
                <div className="bg-primary-50 rounded-lg border-2 border-primary-300 p-4 text-center">
                  <p className="font-light text-primary-900 mb-1">✓ Promo Manos y Pies Seleccionada</p>
                  <p className="text-sm text-primary-600 font-light">Incluye: Semi-permanente en uña natural + Semi-permanente en pies</p>
                </div>
              )}

              {/* Extras Section - Solo mostrar si NO hay promo seleccionada */}
              {!selectedPromo && selectedService && (
                <div className="space-y-6 pt-6 border-t border-primary-200">
                  {/* Gel X Options */}
                  {selectedService && selectedService.id === 'gel-sm' && (
                    <div className="bg-white rounded-xl p-6 border-2 border-primary-500 space-y-6 shadow-lg">
                      <div>
                        <h4 className="font-serif text-xl font-light text-primary-900 mb-4">Elige tu Gel X</h4>
                        
                        {/* Tamaño */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-base font-light text-primary-900">Tamaño:</p>
                            <span className="text-sm text-primary-600">
                              {gelXSize === 'S' || gelXSize === 'M' ? '(Sin costo extra)' : `+₡${gelXSize === 'L' ? '3,000' : '3,500'}`}
                            </span>
                          </div>
                          <div className="grid grid-cols-4 gap-3">
                            {(['S', 'M', 'L', 'XL'] as const).map((size) => (
                              <button
                                key={size}
                                onClick={() => setGelXSize(size)}
                                className={`py-3 px-2 rounded-lg font-light transition-all duration-200 text-center ${
                                  gelXSize === size
                                    ? 'bg-primary-500 text-white border-2 border-primary-500 shadow-md'
                                    : 'bg-primary-50 border-2 border-primary-300 text-primary-700 hover:bg-primary-100'
                                }`}
                              >
                                <div className="text-lg font-semibold">{size}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Tipo */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-base font-light text-primary-900">Tipo:</p>
                            <span className="text-sm text-primary-600">
                              {gelXType === 'normal' ? '(Sin costo extra)' : `+₡${gelXType === 'piedrera' ? '2,000' : '2,500'}`}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <button
                              onClick={() => setGelXType('normal')}
                              className={`py-3 px-2 rounded-lg font-light transition-all duration-200 text-center ${
                                gelXType === 'normal'
                                  ? 'bg-primary-500 text-white border-2 border-primary-500 shadow-md'
                                  : 'bg-primary-50 border-2 border-primary-300 text-primary-700 hover:bg-primary-100'
                              }`}
                            >
                              <div className="text-sm font-semibold">Normal</div>
                            </button>
                            <button
                              onClick={() => setGelXType('piedrera')}
                              className={`py-3 px-2 rounded-lg font-light transition-all duration-200 text-center ${
                                gelXType === 'piedrera'
                                  ? 'bg-primary-500 text-white border-2 border-primary-500 shadow-md'
                                  : 'bg-primary-50 border-2 border-primary-300 text-primary-700 hover:bg-primary-100'
                              }`}
                            >
                              <div className="text-sm font-semibold">Piedrera</div>
                            </button>
                            <button
                              onClick={() => setGelXType('3d')}
                              className={`py-3 px-2 rounded-lg font-light transition-all duration-200 text-center ${
                                gelXType === '3d'
                                  ? 'bg-primary-500 text-white border-2 border-primary-500 shadow-md'
                                  : 'bg-primary-50 border-2 border-primary-300 text-primary-700 hover:bg-primary-100'
                              }`}
                            >
                              <div className="text-sm font-semibold">3D</div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Checkbox: ¿Necesito retiro? */}
                  <button
                    onClick={() => setNeedsRemoval(!needsRemoval)}
                    className="w-full flex items-center gap-4 p-4 bg-white rounded-lg border-2 border-primary-300 hover:border-primary-500 transition-all duration-200 hover:shadow-md active:scale-98"
                  >
                    <div className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                      needsRemoval
                        ? 'bg-primary-500 border-primary-500'
                        : 'border-primary-300 bg-white hover:border-primary-400'
                    }`}>
                      {needsRemoval && <FiCheck size={16} className="text-white font-bold" />}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-light text-primary-900">¿Necesito retiro también?</div>
                      <div className="text-xs text-primary-600 font-light">Agrega ₡2,000 al total</div>
                    </div>
                  </button>

                  {/* Promo Section */}
                  <button
                    onClick={() => {
                      if (!selectedPromo) {
                        // Activar promo: limpiar servicio individual
                        setSelectedService(null);
                        setNeedsRemoval(false);
                        setGelXSize('M');
                        setGelXType('normal');
                      }
                      setSelectedPromo(!selectedPromo);
                    }}
                    className={`w-full text-left rounded-xl p-6 border-2 transition-all duration-200 ${
                      selectedPromo
                        ? 'bg-primary-500/10 border-primary-500 shadow-lg'
                        : 'bg-white border-primary-300 hover:border-primary-400 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                        selectedPromo
                          ? 'bg-primary-500 border-primary-500'
                          : 'border-primary-300 bg-white group-hover:border-primary-400'
                      }`}>
                        {selectedPromo && <FiCheck size={16} className="text-white font-bold" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-serif text-lg font-light text-primary-900 mb-1">Promo: Manos y Pies</h3>
                        <p className="text-primary-700 text-sm mb-3 font-light">Llévate ambos servicios por un precio especial</p>
                        <div className={`text-2xl font-serif font-light ${
                          selectedPromo ? 'text-primary-600' : 'text-primary-800'
                        }`}>
                          ₡13,000
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: DATE */}
          {currentStep === 2 && (
            <div className="space-y-4 md:space-y-8">
              <div>
                <h2 className="font-serif text-lg md:text-xl font-light text-primary-900 mb-1 md:mb-2">Elige una fecha</h2>
                <p className="text-primary-600 font-light text-xs md:text-sm">Selecciona el día de tu cita</p>
              </div>
              <Calendar value={selectedDate} onChange={setSelectedDate} minDate={today} />
            </div>
          )}

          {/* STEP 3: TIME */}
          {currentStep === 3 && (
            <div className="space-y-4 md:space-y-8">
              <div>
                <h2 className="font-serif text-lg md:text-xl font-light text-primary-900 mb-1 md:mb-2">¿A qué hora?</h2>
                <p className="text-primary-600 font-light text-xs md:text-sm">Elige tu horario preferido</p>
              </div>
              <TimeSlots
                slots={timeSlots}
                isLoading={slotsLoading}
                selectedSlot={selectedTime}
                onSelect={setSelectedTime}
                durationMinutes={selectedPromo ? 180 : selectedService?.durationMinutes ?? 120}
              />
            </div>
          )}

          {/* STEP 4: PERSONAL INFO */}
          {currentStep === 4 && (
            <div className="space-y-4 md:space-y-8">
              <div>
                <h2 className="font-serif text-lg md:text-xl font-light text-primary-900 mb-1 md:mb-2">Cuéntanos sobre ti</h2>
                <p className="text-primary-600 font-light text-xs md:text-sm">Necesitamos tus datos para la reserva</p>
              </div>

              <div className="space-y-6">
                <Input label="Nombre completo" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: María García" required />

                <Input label="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Ej: 87654321" required />

                <Input label="Correo (opcional)" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Ej: maria@example.com" />

                <Input label="Notas especiales" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ej: soy alérgica a..." helperText="Cuéntanos detalles importantes para tu cita" />

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-primary-900 mb-3">Foto de inspiración (opcional)</label>
                  <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-primary-300 rounded-lg cursor-pointer hover:bg-primary-50 transition-colors bg-primary-50/50">
                    <div className="text-center">
                      <p className="text-3xl mb-2">📸</p>
                      <p className="font-medium text-primary-900">Tap para subir foto</p>
                      <p className="text-xs text-primary-600 mt-1">JPG, PNG (máx. 5MB)</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-full rounded-lg shadow-md" />}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: CONFIRMATION */}
          {currentStep === 5 && selectedService && (
            <div className="space-y-4 md:space-y-8">
              <div>
                <h2 className="font-serif text-lg md:text-xl font-light text-primary-900 mb-1 md:mb-2">Confirma tu reserva</h2>
                <p className="text-primary-600 font-light text-xs md:text-sm">Revisa los detalles antes de confirmar</p>
              </div>

              {/* Summary Box */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 p-8 rounded-xl border-2 border-primary-200 space-y-5">
                <div className="grid grid-cols-2 gap-6">
                  <div className="border-b border-primary-200/50 pb-4">
                    <p className="text-xs uppercase font-semibold text-primary-600 tracking-wider">Servicio</p>
                    <p className="text-lg font-serif font-light text-primary-900 mt-2">{selectedService.name}</p>
                    {selectedService.description && (
                      <p className="text-xs text-primary-600 mt-1 italic">{selectedService.description}</p>
                    )}
                  </div>
                  <div className="border-b border-primary-200/50 pb-4">
                    <p className="text-xs uppercase font-semibold text-primary-600 tracking-wider">Duración</p>
                    <p className="text-lg font-serif font-light text-primary-900 mt-2">{selectedService.durationMinutes} min</p>
                  </div>
                  <div className="border-b border-primary-200/50 pb-4">
                    <p className="text-xs uppercase font-semibold text-primary-600 tracking-wider">Fecha</p>
                    <p className="text-lg font-serif font-light text-primary-900 mt-2">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-CR', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div className="border-b border-primary-200/50 pb-4">
                    <p className="text-xs uppercase font-semibold text-primary-600 tracking-wider">Hora</p>
                    <p className="text-lg font-serif font-light text-primary-900 mt-2">{selectedTime?.substring(0, 5)}</p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-primary-700 font-light">Precio base:</span>
                    <span className="text-lg font-serif font-light text-primary-800">₡{selectedService.price.toLocaleString('es-CR')}</span>
                  </div>
                  
                  {selectedService.id === 'gel-sm' && (
                    <>
                      <div className="text-xs text-primary-600 pt-2 pb-2 border-b border-primary-100">
                        <p className="font-light">Tamaño: <span className="text-primary-900 font-semibold">{gelXSize}</span></p>
                        <p className="font-light mt-1">Tipo: <span className="text-primary-900 font-semibold capitalize">{gelXType}</span></p>
                      </div>
                      
                      {(gelXSize === 'L' || gelXSize === 'XL') && (
                        <div className="flex items-center justify-between">
                          <span className="text-primary-700 font-light">+ {gelXSize === 'L' ? 'Tamaño L' : 'Tamaño XL'}:</span>
                          <span className="text-lg font-serif font-light text-primary-800">₡{gelXSize === 'L' ? '3,000' : '3,500'}</span>
                        </div>
                      )}
                      
                      {gelXType !== 'normal' && (
                        <div className="flex items-center justify-between">
                          <span className="text-primary-700 font-light">+ {gelXType === 'piedrera' ? 'Piedrera' : '3D'}:</span>
                          <span className="text-lg font-serif font-light text-primary-800">₡{gelXType === 'piedrera' ? '2,000' : '2,500'}</span>
                        </div>
                      )}
                    </>
                  )}
                  
                  {needsRemoval && (
                    <div className="flex items-center justify-between">
                      <span className="text-primary-700 font-light">+ Retiro:</span>
                      <span className="text-lg font-serif font-light text-primary-800">₡2,000</span>
                    </div>
                  )}

                  {selectedPromo && (
                    <div className="flex items-center justify-between text-emerald-700">
                      <span className="font-light">🎉 Promo Manos y Pies:</span>
                      <span className="text-lg font-serif font-light">₡13,000</span>
                    </div>
                  )}

                  <div className="h-px bg-primary-200"></div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-primary-700 font-light">Precio total:</span>
                    <span className="text-2xl font-serif font-light text-primary-800">₡{calculateTotalPrice().toLocaleString('es-CR')}</span>
                  </div>
                  
                  <div className="h-px bg-primary-200"></div>
                  
                  <div className="flex items-center justify-between bg-gradient-to-r from-primary-100/30 to-transparent p-4 rounded-lg">
                    <span className="font-semibold text-primary-900">Adelanto a pagar (50%):</span>
                    <span className="text-2xl font-serif text-primary-700">₡{calculateTotalDeposit().toLocaleString('es-CR')}</span>
                  </div>
                </div>
              </div>

              {/* Payment Reference */}
              <Input
                label="Comprobante SINPE"
                value={paymentRef}
                onChange={(e) => setPaymentRef(e.target.value)}
                placeholder="Ej: SINPE#123456"
                required
                helperText="Ingresa el número de tu comprobante de transferencia"
              />

              <div className="bg-primary-50 border-l-4 border-primary-400 p-4 rounded">
                <p className="text-sm text-primary-800">
                  <strong>Importante:</strong> Al confirmar, te comprometes a haber realizado la transferencia del adelanto (50%) por SINPE.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Buttons - Sticky Bottom */}
      <div className="bg-white/80 md:bg-white backdrop-blur md:backdrop-blur-none border-t border-primary-200/30 sticky bottom-0 z-40 flex-shrink-0">
        <div className="px-3 md:px-4 py-3 md:py-4 flex gap-3 md:gap-4">
          <Button variant="secondary" onClick={handlePrev} disabled={currentStep === 1}>
            ← Atrás
          </Button>
          <Button
            variant="primary"
            onClick={currentStep === STEPS.length ? handleSubmit : handleNext}
            disabled={!canProceedToStep(currentStep) || isLoading}
            isLoading={isLoading}
            className="flex-1"
          >
            {currentStep === STEPS.length ? '✓ Confirmar Reserva' : 'Siguiente →'}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 md:py-6 border-t border-primary-200/30 bg-white/50 flex-shrink-0">
        <div className="px-3 md:px-4 text-center">
          <div className="flex items-center justify-center gap-6 md:gap-8 text-primary-600 text-sm md:text-base font-light\">
            <div className="flex items-center gap-6\">
              <FiMapPin size={18} className="text-primary-500\"/>
              <span>Villas el Ángel</span>
            </div>
            <div className="flex items-center gap-6\">
              <FiPhone size={18} className="text-primary-500\"/>
              <span>64215957</span>
            </div>
            <div className="flex items-center gap-6\">
              <FiInstagram size={18} className="text-primary-500\"/>
              <span>@joss.studio.cr</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
