import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice'; 

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false)
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-white font-bold text-xl">User Management System</Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {isAuthenticated && (
                  <>
                  {!user?.isAdmin && (
                    <Link 
                      to="/profile" 
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Profile
                    </Link>
                    )}
                    {user?.isAdmin && (
                      <Link 
                        to="/admin/dashboard" 
                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  >
                    <span className="sr-only">Open user menu</span>
                    {user?.profilePicture ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={user.profilePicture}
                        alt="Profile"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="ml-2 text-gray-300">{user?.name || 'User'}</span>
                  </button>
                  
                  {isDropdownOpen && (
                    <div 
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      {!user?.isAdmin && (
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                      )}
                      {user?.isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated && (
              <>
              {!user.isAdmin && (
                <Link
                  to="/profile"
                  className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link> )}
                
                {user?.isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
              </>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-700">
            {isAuthenticated ? (
              <>
                <div className="flex items-center px-5">
                  {user?.profilePicture ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={user.profilePicture}
                      alt="Profile"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">{user?.name || 'User'}</div>
                    <div className="text-sm font-medium leading-none text-gray-400 mt-1">{user?.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  
                  {user?.isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="px-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;