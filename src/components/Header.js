import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationDropdown from "./NotificationDropdown";
import {
  HiOutlineUserCircle,
  HiOutlineArrowRightOnRectangle,
  HiOutlineStar,
  HiBars3,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineBookmark,
  HiBell,
  HiRss,
  HiOutlineUsers,
  HiOutlineSparkles,
} from "react-icons/hi2";

const Header = ({ onFilterToggle, onSidebarToggle }) => {
  const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] =
    useState(false);
  const { user, logout, unreadNotificationsCount } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const dropdownRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const profileMenuRef = useRef(null);
  const profileToggleButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isNotificationsDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsNotificationsDropdownOpen(false);
      }
      if (
        isProfileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        profileToggleButtonRef.current &&
        !profileToggleButtonRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationsDropdownOpen, isProfileMenuOpen]);

  const toggleNotificationsDropdown = () => {
    setIsProfileMenuOpen(false);
    setIsNotificationsDropdownOpen((prev) => !prev);
  };

  const toggleProfileMenu = () => {
    setIsNotificationsDropdownOpen(false);
    setIsProfileMenuOpen((prev) => !prev);
  };

  const closeDropdowns = () => {
    setIsNotificationsDropdownOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    const protectedRoutes = [
      "/profile",
      "/favorites",
      "/watchlist",
      "/activity-feed",
      "/notifications",
      "/create-list",
      "/lists",
      "/list",
      "/foryou",
    ];

    const isProtectedRoute = protectedRoutes.some((route) =>
      location.pathname.startsWith(route)
    );

    closeDropdowns();
    await logout();

    if (isProtectedRoute) {
      navigate("/");
    }
  };

  const handleProfileLinkClick = (path) => {
    closeDropdowns();
    navigate(path);
  };

  return (
    <>
      <header className="p-4 sticky top-0 z-40 bg-brand-light-dark/80 backdrop-blur-lg border-b border-brand-border">
        <div className="container mx-auto flex items-center justify-between h-9">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-brand-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                />
              </svg>
              <h1 className="text-2xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-purple-400">
                StreamBase
              </h1>
            </Link>
          </div>

          <div className="flex items-center justify-end gap-2">
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <button
                    onClick={onFilterToggle}
                    className="p-2 text-gray-400 hover:text-brand-primary"
                    title="Filtros"
                  >
                    <HiOutlineAdjustmentsHorizontal className="h-6 w-6" />
                  </button>
                  <Link
                    to="/foryou"
                    className="p-2 text-gray-400 hover:text-purple-400"
                    title="Para Você"
                  >
                    <HiOutlineSparkles className="h-6 w-6" />
                  </Link>
                  <Link
                    to="/favorites"
                    className="p-2 text-gray-400 hover:text-yellow-400"
                    title="Favoritos"
                  >
                    <HiOutlineStar className="h-6 w-6" />
                  </Link>
                  <Link
                    to="/watchlist"
                    className="p-2 text-gray-400 hover:text-brand-primary"
                    title="Minha Lista"
                  >
                    <HiOutlineBookmark className="h-6 w-6" />
                  </Link>
                  <Link
                    to="/activity-feed"
                    className="p-2 text-gray-400 hover:text-brand-primary"
                    title="Feed de Atividades"
                  >
                    <HiRss className="h-6 w-6" />
                  </Link>
                  <Link
                    to="/discover-users"
                    className="p-2 text-gray-400 hover:text-brand-primary"
                    title="Descobrir Usuários"
                  >
                    <HiOutlineUsers className="h-6 w-6" />
                  </Link>

                  <div className="relative">
                    <button
                      ref={toggleButtonRef}
                      onClick={toggleNotificationsDropdown}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="p-2 text-gray-400 hover:text-brand-primary relative"
                      title="Notificações"
                    >
                      <HiBell className="h-6 w-6" />
                      {unreadNotificationsCount > 0 && (
                        <span
                          data-testid="notification-count"
                          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center"
                        >
                          {unreadNotificationsCount}
                        </span>
                      )}
                    </button>
                    {isNotificationsDropdownOpen && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 w-full sm:w-80 lg:w-96"
                      >
                        <NotificationDropdown onClose={closeDropdowns} />
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      ref={profileToggleButtonRef}
                      onClick={toggleProfileMenu}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="p-2 text-gray-400 hover:text-brand-primary"
                      title="Perfil"
                    >
                      <HiOutlineUserCircle className="h-6 w-6" />
                    </button>
                    {isProfileMenuOpen && (
                      <div
                        ref={profileMenuRef}
                        className="absolute right-0 mt-2 w-48 bg-brand-light-dark rounded-md shadow-lg py-1 z-50 border border-brand-border"
                      >
                        <button
                          onClick={() => handleProfileLinkClick("/profile")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-brand-primary hover:text-white flex items-center gap-2"
                        >
                          <HiOutlineUserCircle className="h-5 w-5" />
                          Meu Perfil
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white flex items-center gap-2"
                        >
                          <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
                          Sair
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={onFilterToggle}
                    className="p-2 text-gray-400 hover:text-brand-primary"
                    title="Filtros"
                  >
                    <HiOutlineAdjustmentsHorizontal className="h-6 w-6" />
                  </button>
                  <Link
                    to="/login"
                    className="p-2 text-gray-400 hover:text-brand-primary flex items-center gap-1"
                    title="Login"
                  >
                    <HiOutlineUserCircle className="h-6 w-6" />
                    <span className="font-medium">Entrar</span>
                  </Link>
                </>
              )}
            </div>
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={onFilterToggle}
                className="p-2 text-gray-400 hover:text-brand-primary"
                title="Filtros"
              >
                <HiOutlineAdjustmentsHorizontal className="h-6 w-6" />
              </button>
              {user && (
                <>
                  <div className="relative">
                    <button
                      ref={toggleButtonRef}
                      onClick={toggleNotificationsDropdown}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="p-2 text-gray-400 hover:text-brand-primary relative"
                      title="Notificações"
                    >
                      <HiBell className="h-6 w-6" />
                      {unreadNotificationsCount > 0 && (
                        <span
                          data-testid="notification-count"
                          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center"
                        >
                          {unreadNotificationsCount}
                        </span>
                      )}
                    </button>
                    {isNotificationsDropdownOpen && (
                      <div
                        ref={dropdownRef}
                        className="absolute right-0 mt-2 w-72 xs:w-80 sm:w-96 max-w-[calc(100vw-32px)] z-50"
                      >
                        <NotificationDropdown onClose={closeDropdowns} />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={onSidebarToggle}
                    className="p-2 text-gray-400 hover:text-brand-primary"
                    title="Menu"
                  >
                    <HiBars3 className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
