
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Array', path: '/array' },
    { name: 'Stack', path: '/stack' },
    { name: 'Queue', path: '/queue' },
    { name: 'Linked List', path: '/linked-list' },
    { name: 'Deque', path: '/deque' },
    { name: 'Tree', path: '/tree' },
    { name: 'BST', path: '/bst' },
    { name: 'Heap', path: '/heap' },
    { name: 'Graph', path: '/graph' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-arena-red">ArenaTools</span>
            </Link>
          </div>
          
          <div className="-mr-2 -my-2 md:hidden">
            <button
              onClick={toggleMenu}
              className="rounded-md p-2 inline-flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-arena-red"
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <nav className="hidden md:flex space-x-10">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-medium transition-colors duration-300 ${
                  isActive(link.path)
                    ? 'text-arena-red'
                    : 'text-gray-700 hover:text-arena-red'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div
        className={`
          fixed inset-0 bg-white z-50 transition-transform transform duration-300 ease-in-out 
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          md:hidden
        `}
      >
        <div className="p-4 flex items-center justify-between">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
            <span className="text-2xl font-bold text-arena-red">ArenaTools</span>
          </Link>
          <button
            onClick={toggleMenu}
            className="rounded-md p-2 inline-flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-arena-red"
          >
            <span className="sr-only">Close menu</span>
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6 px-5 space-y-6">
          <div className="grid gap-y-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`text-base font-medium transition-colors duration-300 ${
                  isActive(link.path)
                    ? 'text-arena-red'
                    : 'text-gray-700 hover:text-arena-red'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
