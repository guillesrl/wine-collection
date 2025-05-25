'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({ type: '', message: '' });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus({ type: 'error', message: 'Por favor ingresa tu correo electrónico' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al suscribirse al boletín');
      }

      setStatus({
        type: 'success',
        message: '¡Gracias por suscribirte a nuestro boletín!'
      });
      
      // Limpiar el formulario
      setEmail('');
      
      // Redirigir al inicio después de 3 segundos
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      console.error('Error al suscribirse:', error);
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error al suscribirse. Por favor, inténtalo de nuevo.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        </div>
      </header>

      <main className="flex flex-col items-center justify-center sm:px-6 lg:px-8">
        
        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-4 sm:p-6 bg-gray-900">
            <h2 className="text-xl font-semibold text-white mb-4">Newsletter</h2>
            <div className="text-center">
              <p className="text-gray-400 mb-8">¡Suscríbete para recibir las últimas novedades!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:w-96 px-5 py-3 bg-gray-700 border border-gray-600 text-white shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                  placeholder="Ingresa tu correo electrónico"
                />
              </div>

              {status.message && (
                <div className={`w-full sm:w-96 mx-auto p-4 rounded-lg ${
                  status.type === 'success' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                }`}>
                  {status.message}
                </div>
              )}

              <div className="w-full sm:w-96 mx-auto">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white ${isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}>
                  {isSubmitting ? 'Procesando...' : 'Suscribirme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <div className="flex justify-center mt-8">
        <button
          onClick={() => router.push('/')}
          className="text-blue-400 hover:text-blue-300"
        >
          &larr; Volver al inicio
        </button>
      </div>
    </div>
  );
}
