import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        {/* Brand Logo */}
        <Link to="/" className="text-xl font-bold text-blue-400">
          NewsPortal
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-blue-300 transition-colors">
            Home
          </Link>

          {user ? (
            <>
              <Link to="/saved" className="hover:text-blue-300 transition-colors">
                Saved News
              </Link>
              
              {/* Only show 'Create News' if user role is Admin or Reporter */}
              {(user.role === 'admin' || user.role === 'reporter') && (
                <Link to="/create-news" className="hover:text-blue-300 transition-colors">
                  Create News
                </Link>
              )}

              <span className="text-sm bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                {user.name} ({user.role})
              </span>

              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded transition-colors text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-300 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded transition-colors text-sm"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;