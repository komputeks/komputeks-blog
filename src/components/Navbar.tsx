import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, Moon, Sun, Menu, X, User, LogOut } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  categories: any[];
}

export default function Navbar({ categories }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className={`${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-sm">
          <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{today}</span>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className={`p-1.5 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-200 text-gray-600'}`}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/admin" className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} flex items-center gap-1`}>
                  <User size={14} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <button onClick={signOut} className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} flex items-center gap-1`}>
                  <LogOut size={14} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} text-xs font-medium transition-colors`}>
                  Login
                </Link>
                <Link to="/login?mode=signup" className={`px-3 py-1 rounded border ${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} text-xs font-medium transition-colors`}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Komputeks
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className={`${theme === 'dark' ? 'text-gray-200 hover:text-white' : 'text-gray-700 hover:text-black'} font-medium transition-colors`}>
              Home
            </Link>
            {categories.slice(0, 5).map(cat => (
              <Link key={cat.id} to={`/category/${cat.slug}`} className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black'} transition-colors`}>
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => setSearchOpen(!searchOpen)} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
              <Search size={20} />
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`lg:hidden p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleSearch} className="px-4 pb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className={`w-full px-4 py-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    autoFocus
                  />
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500">
                    <Search size={20} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`lg:hidden overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t`}
            >
              <nav className="px-4 py-4 flex flex-col gap-3">
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} font-medium py-2`}>
                  Home
                </Link>
                {categories.map(cat => (
                  <Link key={cat.id} to={`/category/${cat.slug}`} onClick={() => setMobileMenuOpen(false)} className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} py-2`}>
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
