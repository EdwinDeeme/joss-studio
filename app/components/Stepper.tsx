'use client';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export default function Stepper({ currentStep, totalSteps, steps }: StepperProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <div key={stepNum} className="flex items-center flex-1">
            {/* Círculo del paso */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                  transition-all duration-300 z-10
                  ${
                    isCompleted
                      ? 'bg-green-500 text-white border-2 border-green-600'
                      : isActive
                        ? 'bg-primary-300 text-dark border-2 border-primary-500 shadow-lg scale-110'
                        : 'bg-white text-gray-400 border-2 border-gray-300'
                  }
                `}
              >
                {isCompleted ? '✓' : stepNum}
              </div>
              {/* Label */}
              <p
                className={`
                  text-xs font-semibold mt-2 text-center uppercase tracking-wide
                  transition-colors duration-300
                  ${isActive ? 'text-primary-500' : isCompleted ? 'text-green-500' : 'text-gray-400'}
                `}
              >
                {label}
              </p>
            </div>

            {/* Línea conectora */}
            {stepNum < totalSteps && (
              <div
                className={`
                  h-1 flex-1 mx-2 rounded-full transition-colors duration-300
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
