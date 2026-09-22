import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="mb-6">
            <h1 className="font-serif text-6xl text-primary-400 font-light">
              404
            </h1>
          </div>
          
          <h2 className="font-serif text-2xl text-primary-900 mb-2">
            Página no encontrada
          </h2>
          
          <p className="text-primary-600 text-sm font-light mb-8">
            Lo sentimos, la página que buscas no existe o fue movida.
          </p>

          <Link
            href="/"
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-light py-3 rounded-xl hover:shadow-lg transition-all duration-300 inline-block"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
