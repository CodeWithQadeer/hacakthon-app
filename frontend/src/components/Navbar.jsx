import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { to: "/complaints", label: "Complaints" },
    { to: "/create-complaint", label: "Report" },
  ];

  return (
    <nav
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 w-[92%] md:w-[80%] z-50 rounded-2xl backdrop-blur-xl transition-all duration-500
      bg-linear-to-r from-gray-50/80 to-gray-100/70 text-gray-800 border border-gray-300 shadow-[0_4px_12px_rgba(0,0,0,0.05)]
      dark:bg-linear-to-r dark:from-gray-900/90 dark:to-gray-800/80 dark:text-gray-100 dark:border-gray-700`}
    >
      <div className="px-6 sm:px-10 py-4 flex justify-between items-center">
        {/* 🌆 Logo */}
        <Link
          to="/"
          className="font-semibold text-2xl tracking-wide bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text hover:opacity-80 transition"
        >
          Improve My City
        </Link>

        {/* 🖥️ Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <motion.div whileHover={{ y: -2 }} key={link.to}>
              <Link
                to={link.to}
                className="relative px-3 py-2 text-[15px] font-medium group"
              >
                {link.label}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-linear-to-r from-indigo-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.div>
          ))}

          {user ? (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="relative px-3 py-2 text-[15px] font-medium group"
                >
                  Admin
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-linear-to-r from-indigo-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-2 bg-linear-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition"
              >
                <FiLogOut /> Logout
              </motion.button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="relative px-3 py-2 text-[15px] font-medium group"
              >
                Login
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-linear-to-r from-indigo-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                to="/register"
                className="relative px-3 py-2 text-[15px] font-medium group"
              >
                Register
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-linear-to-r from-indigo-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </>
          )}
        </div>

        {/* 📱 Mobile Menu Button */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* 📲 Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden backdrop-blur-xl bg-linear-to-r from-gray-50/90 to-gray-100/80 dark:from-gray-900/90 dark:to-gray-800/80 rounded-b-2xl border-t border-gray-300 dark:border-gray-700"
          >
            <div className="flex flex-col space-y-3 p-5">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-medium hover:text-indigo-500 transition"
                >
                  {link.label}
                </Link>
              ))}

              {user ? (
                <>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="text-lg font-medium hover:text-indigo-500 transition"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 bg-linear-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition"
                  >
                    <FiLogOut /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-lg font-medium hover:text-indigo-500 transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="text-lg font-medium hover:text-indigo-500 transition"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
