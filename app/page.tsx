'use client';

import { useEffect, useState } from 'react';
import { createClient } from './lib/supabase/client';
import { Wine } from './types/wine';

export default function Home() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchWines = async () => {
      try {
        setLoading(true);
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;
        
        // Primero obtenemos el conteo total
        let countQuery = supabase
          .from('vinos')
          .select('*', { count: 'exact', head: true });
          
        if (searchTerm) {
          countQuery = countQuery.or(
            `Title.ilike.%${searchTerm}%,Variety.ilike.%${searchTerm}%,Winery.ilike.%${searchTerm}%,Province.ilike.%${searchTerm}%`
          );
        }
        
        // Luego obtenemos los datos paginados
        let query = supabase
          .from('vinos')
          .select('*')
          .range(from, to);
          
        if (searchTerm) {
          query = query.or(
            `Title.ilike.%${searchTerm}%,Variety.ilike.%${searchTerm}%,Winery.ilike.%${searchTerm}%,Province.ilike.%${searchTerm}%`
          );
        }
        
        const [{ count }, { data, error }] = await Promise.all([
          countQuery,
          query
        ]);
        
        if (error) throw error;
        
        setTotalItems(count || 0);
        setWines(data || []);
      } catch (error) {
        console.error('Error fetching wines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWines();
  }, [supabase, searchTerm, currentPage, itemsPerPage]);
  
  // Resetear a la primera página cuando se realiza una búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  
  // Calcular el número total de páginas
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Cambiar de página
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
        {/* Barra de búsqueda */}
        <div className="px-4 sm:px-0 mb-6">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              placeholder="Buscar por nombre, variedad, bodega o región..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de vinos */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : wines.length > 0 ? (
          <div className="bg-gray-800 shadow-lg overflow-hidden rounded-lg">
            <ul className="divide-y divide-gray-700">
              {wines.map((wine) => (
                <li key={wine.Id} className="px-3 py-2 sm:px-4 hover:bg-gray-700 transition-colors duration-150">
                  <div className="text-base font-medium text-white truncate pr-2 mb-1">
                    {wine.Title} {wine.Vintage && <span className="text-gray-400">({wine.Vintage})</span>}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <span className="truncate max-w-[100px]" title={wine.Winery || ''}>{wine.Winery}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-400">{wine.Variety}</span>
                      <span className="text-gray-500 ml-1">
                        {wine.Country} · {wine.Province}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 ml-2">
                      <span className="px-2 py-0.5 text-sm leading-5 font-semibold rounded-full bg-indigo-900 bg-opacity-50 text-indigo-200">
                        {wine.Points} pts
                      </span>
                      <span className="font-medium whitespace-nowrap text-sm text-gray-400">
                        {wine.Price ? `$${wine.Price.toFixed(2)}` : 'Consultar'}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-10 w-10 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-3 text-sm font-medium text-gray-300">No se encontraron vinos</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm
                ? 'Intenta con otro término de búsqueda.'
                : 'No hay vinos en la colección por el momento.'}
            </p>
          </div>
        )}
        
        {/* Controles de paginación */}
        {totalPages > 1 && (
          <div className="bg-gray-800 px-3 py-2 flex items-center justify-between border-t border-gray-700 sm:px-4 mt-6 rounded-md shadow-lg">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-3 py-1.5 border border-gray-600 text-xs font-medium rounded ${
                  currentPage === 1 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                Anterior
              </button>
              <div className="flex items-center px-3">
                <span className="text-xs text-gray-400">
                  Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
                </span>
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-3 py-1.5 border border-gray-600 text-xs font-medium rounded ${
                  currentPage === totalPages 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-gray-400">
                  Mostrando <span className="font-medium text-gray-300">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
                  <span className="font-medium text-gray-300">
                    {Math.min(currentPage * itemsPerPage, totalItems)}
                  </span>{' '}
                  de <span className="font-medium text-gray-300">{totalItems}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-1.5 rounded-l-md border border-gray-600 text-sm font-medium ${
                      currentPage === 1 
                        ? 'text-gray-600 cursor-not-allowed' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="sr-only">Anterior</span>
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Números de página */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`relative inline-flex items-center px-3 py-1 border text-xs font-medium ${
                          currentPage === pageNum
                            ? 'z-10 bg-indigo-700 border-indigo-500 text-white'
                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-1.5 rounded-r-md border border-gray-600 text-sm font-medium ${
                      currentPage === totalPages 
                        ? 'text-gray-600 cursor-not-allowed' 
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="sr-only">Siguiente</span>
                    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer con enlaces a newsletter y contacto */}
      <footer className="bg-gray-800 mt-12 border-t border-gray-700">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:py-10 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start space-x-6 md:order-2">
              <a href="/newsletter" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Newsletter</span>
                <span className="text-sm">Suscríbete a nuestro boletín</span>
              </a>
              <a href="/contacto" className="text-gray-400 hover:text-white transition-colors ml-6">
                <span className="sr-only">Contacto</span>
                <span className="text-sm">Contáctanos</span>
              </a>
            </div>
            <div className="mt-6 md:mt-0 md:order-1">
              <p className="text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} Mi Colección de Vinos. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
