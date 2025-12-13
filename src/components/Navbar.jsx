import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <Plane size={32} />
            <span>TripWise</span>
          </Link>
          <div className="flex gap-4">
            <select className="bg-blue-700 px-3 py-2 rounded-lg border-none outline-none cursor-pointer">
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}
