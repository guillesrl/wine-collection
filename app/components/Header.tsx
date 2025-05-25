import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Vinoteka Logo"
              width={32}
              height={32}
              className="mr-2"
            />
            <span className="text-xl font-semibold text-white">Vinoteka</span>
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            Inicio
          </Link>
          <Link href="/contacto" className="text-gray-400 hover:text-white transition-colors">
            Contacto
          </Link>
          <Link href="/newsletter" className="text-gray-400 hover:text-white transition-colors">
            Newsletter
          </Link>
        </div>
      </div>
    </header>
  );
}
