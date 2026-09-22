export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center space-y-6">
          {/* Animated logo */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-200 to-primary-300 animate-pulse"></div>
          </div>

          {/* Loading text */}
          <div className="space-y-2">
            <h2 className="font-serif text-xl text-primary-900 font-light">
              Cargando...
            </h2>
            <p className="text-primary-600/60 text-sm font-light">
              Por favor espera un momento
            </p>
          </div>

          {/* Animated dots */}
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
