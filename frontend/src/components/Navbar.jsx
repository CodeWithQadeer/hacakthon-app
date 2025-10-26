import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiShield,
  FiMessageSquare,
  FiPlus,
  FiHome,
  FiChevronDown,
} from "react-icons/fi";
import { logout } from "../features/auth/authSlice";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {};
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileDropdown(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    setProfileDropdown(false);
  };

  const isActiveLink = (path) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Home", icon: FiHome },
    { to: "/complaints", label: "Complaints", icon: FiMessageSquare },
    { to: "/create-complaint", label: "Report Issue", icon: FiPlus },
  ];

  return (
    <nav
      className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[92%] md:w-[80%] z-50 rounded-2xl 
      backdrop-blur-xl transition-all duration-500
      bg-linear-to-r from-gray-50/80 to-gray-100/70 text-gray-800 
      border border-gray-300 shadow-[0_4px_12px_rgba(0,0,0,0.05)]
      dark:from-gray-900/90 dark:to-gray-800/80 dark:text-gray-100 dark:border-gray-700"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="flex items-center justify-center hover:opacity-90 transition"
            >
              <img
                src="/logo.png"
                alt="CivFix Logo"
                className="w-14 h-14 object-contain drop-shadow-md"
              />
              <span className="font-semibold text-3xl tracking-wide bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                CivFix
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = isActiveLink(to);
              return (
                <motion.div whileHover={{ y: -2 }} key={to}>
                  <Link
                    to={to}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      active
                        ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Desktop User Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* Admin Badge */}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all ${
                      isActiveLink("/admin")
                        ? "bg-orange-500 text-white"
                        : "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:hover:bg-orange-800"
                    }`}
                  >
                    <FiShield className="w-4 h-4" />
                    <span className="hidden xl:block">Admin</span>
                  </Link>
                )}

                {/* User Profile Dropdown */}
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileDropdown((p) => !p)}
                    className="flex items-center space-x-2 bg-linear-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4" />
                    </div>
                    <span className="hidden xl:block">{user?.name}</span>
                    <FiChevronDown
                      className={`w-4 h-4 transition-transform ${
                        profileDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {profileDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2"
                      >
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {user?.name}
                          </p>
                          <p
                            className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]"
                            title={user?.email}
                          >
                            {user?.email}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              user.role === "admin"
                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                                : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                            }`}
                          >
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </span>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-linear-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                {user.role === "admin" && (
                  <FiShield className="w-4 h-4 text-orange-500" />
                )}
              </div>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700"
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              {/* Mobile Navigation */}
              <div className="space-y-2 mb-6">
                {navLinks.map(({ to, label, icon: Icon }) => {
                  const active = isActiveLink(to);
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        active
                          ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile User Section */}
              {user ? (
                <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="flex items-center space-x-3 px-4">
                    <div className="w-12 h-12 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {user?.name}
                      </p>
                      <p
                        className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[140px]"
                        title={user?.email}
                      >
                        {user?.email}
                      </p>
                    </div>
                    <span
                      className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>

                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        isActiveLink("/admin")
                          ? "bg-orange-500 text-white"
                          : "text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/20"
                      }`}
                    >
                      <FiShield className="w-5 h-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-all"
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-medium transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 bg-linear-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium shadow-md transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
