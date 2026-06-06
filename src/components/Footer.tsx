import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface FooterProps {
  categories: any[];
}

export default function Footer({ categories }: FooterProps) {
  const { theme } = useTheme();

  return (
    <footer className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-900 border-gray-800'} border-t mt-16`}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-white">Komputeks</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted source for technology news, reviews, and insights. Stay ahead with the latest in computing, AI, and digital innovation.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-4">Categories</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">Home</Link></li>
              <li><Link to="/search" className="text-gray-400 hover:text-white text-sm transition-colors">Search</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white text-sm transition-colors">Login</Link></li>
              <li><Link to="/admin" className="text-gray-400 hover:text-white text-sm transition-colors">Admin</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail size={14} />
                info@komputeks.com
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin size={14} />
                Technology Hub, Digital City
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={14} />
                +1 (555) 123-4567
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Komputeks Blog. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            Made with <Heart size={14} className="text-red-500" /> by Komputeks Team
          </p>
        </div>
      </div>
    </footer>
  );
}
