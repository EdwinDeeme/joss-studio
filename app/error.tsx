'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="font-serif text-2xl text-primary-900 mb-2">
            Algo salió mal
          </h1>
          
          <p className="text-primary-600 text-sm font-light mb-6">
            Lo sentimos, encontramos un error inesperado. Por favor, intenta de nuevo.
          </p>

          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-left">
              <p className="text-xs text-red-700 font-mono break-words">
                {error.message}
              </p>
            </div>
          )}

          <button
            onClick={() => reset()}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-light py-3 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    </div>
  );
}
