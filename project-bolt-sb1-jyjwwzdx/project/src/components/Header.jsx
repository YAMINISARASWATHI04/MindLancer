import { ArrowRight, LogOut, Menu, User, X } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isSmartMenuOpen, setIsSmartMenuOpen] = React.useState(false);

  const dashboardLink =
    user?.role === 'admin'
      ? '/admin'
      : user?.role === 'freelancer'
        ? '/freelancer-dashboard'
        : '/business-dashboard';

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-black-600">
            Mindlancer
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/jobs" className="text-gray-600 hover:text-black-600">
              Find Jobs
            </Link>
            <button
              onClick={() => {
                const element = document.getElementById('why-mindlancer');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-gray-600 hover:text-black-600"
            >
              Why Mindlancer
            </button>
            <Link to="/freelancers" className="text-gray-600 hover:text-black-600">
              Find Talent
            </Link>

            {/* Authenticated */}
            {user ? (
              <>
                <Link
                  to={dashboardLink}
                  className="text-gray-600 hover:text-black-600"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center text-gray-600 hover:text-black-600"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-white text-black-600 px-4 py-2 rounded-md border border-black-600 hover:bg-blue-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-black-700 transition-colors"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}

            {/* Smart Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSmartMenuOpen((prev) => !prev)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Smart Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              {isSmartMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-md rounded-md py-2 z-50">
                  <a
                    href="http://localhost:5173/resume"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-black"
                    onClick={() => setIsSmartMenuOpen(false)}
                  >
                    Resume Generator
                  </a>
                  <a
                    href="http://localhost:5173/upload"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-black"
                    onClick={() => setIsSmartMenuOpen(false)}
                  >
                    ATS Evaluator
                  </a>
                  <a
                    href="http://localhost:5173/smartjob"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-black"
                    onClick={() => setIsSmartMenuOpen(false)}
                  >
                    Smart Job Recommendation
                  </a>
                </div>
              )}
              <div className="text-sm text-gray-500 mt-1 text-center">Smart Services</div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link
              to="/jobs"
              className="block text-gray-600 hover:text-black-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Jobs
            </Link>
            <button
              onClick={() => {
                const element = document.getElementById('why-mindlancer');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }
              }}
              className="block text-gray-600 hover:text-black-600 w-full text-left"
            >
              Why Mindlancer
            </button>
            <Link
              to="/freelancers"
              className="block text-gray-600 hover:text-black-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Talent
            </Link>

            {user ? (
              <>
                <Link
                  to={dashboardLink}
                  className="block text-gray-600 hover:text-black-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center text-gray-600 hover:text-black-600"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-blue-600 hover:text-black-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-black-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
