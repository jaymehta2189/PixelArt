import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaPalette, FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    setShowDropdown(false);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FaPalette className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-800">ARTIQ</span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-purple-600">Home</Link>
            <Link to="/about" className="text-gray-600 hover:text-purple-600">About</Link>
            <Link to="/explore" className="text-gray-600 hover:text-purple-600">Explore Paintings</Link>
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-purple-600"
                >
                  <FaUser />
                  <span>{user.username}</span>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-gray-700 hover:bg-purple-50"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50"
                    >
                      <div className="flex items-center space-x-2">
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;