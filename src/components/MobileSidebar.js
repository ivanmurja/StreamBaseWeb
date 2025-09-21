import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineStar,
  HiOutlineXMark,
  HiOutlineHome,
  HiOutlineBookmark,
  HiOutlineUserCircle,
  HiBell,
  HiRss,
  HiOutlineClipboardDocumentList,
  HiOutlineUsers,
  HiOutlineSparkles,
} from "react-icons/hi2";

const MobileSidebar = ({ isOpen, onClose, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    onClose();
    await onLogout();

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
    if (isProtectedRoute) {
      navigate("/");
    }
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-brand-dark shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center pb-4 border-b border-brand-border">
            <span className="font-bold text-white">Menu</span>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white"
            >
              <HiOutlineXMark className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6">
            {user && (
              <div className="px-2 py-3 border-b border-brand-border flex items-center gap-3">
                <HiOutlineUserCircle className="h-12 w-12 text-brand-text-secondary" />
                <div>
                  <p className="text-sm text-gray-400">Logado como</p>
                  <p className="text-md font-medium text-white truncate">
                    {user.displayName || user.email}
                  </p>
                </div>
              </div>
            )}
            <nav className="mt-4 space-y-2">
              <Link
                to="/"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-2 py-3 text-lg text-gray-300 hover:bg-brand-light-dark hover:text-white rounded-md"
              >
                <HiOutlineHome className="h-6 w-6" />
                Início
              </Link>
              <Link
                to="/foryou"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-2 py-3 text-lg text-gray-300 hover:bg-brand-light-dark hover:text-white rounded-md"
              >
                <HiOutlineSparkles className="h-6 w-6" />
                Para Você
              </Link>
              <Link
                to="/favorites"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-2 py-3 text-lg text-gray-300 hover:bg-brand-light-dark hover:text-white rounded-md"
              >
                <HiOutlineStar className="h-6 w-6" />
                Favoritos
              </Link>
              <Link
                to="/watchlist"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-2 py-3 text-lg text-gray-300 hover:bg-brand-light-dark hover:text-white rounded-md"
              >
                <HiOutlineBookmark className="h-6 w-6" />
                Minha Lista
              </Link>
              <Link
                to={`/lists/${user.uid}`}
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-2 py-3 text-lg text-gray-300 hover:bg-brand-light-dark hover:text-white rounded-md"
              >
                <HiOutlineClipboardDocumentList className="h-6 w-6" />
                Minhas Listas
              </Link>
              <Link
                to="/activity-feed"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-2 py-3 text-lg text-gray-300 hover:bg-brand-light-dark hover:text-white rounded-md"
              >
                <HiRss className="h-6 w-6" />
                Feed de Atividades
              </Link>
              <Link
                to="/discover-users"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-2 py-3 text-lg text-gray-300 hover:bg-brand-light-dark hover:text-white rounded-md"
              >
                <HiOutlineUsers className="h-6 w-6" />
                Descobrir Usuários
              </Link>
              <Link
                to="/notifications"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-2 py-3 text-lg text-gray-300 hover:bg-brand-light-dark hover:text-white rounded-md"
              >
                <HiBell className="h-6 w-6" />
                Notificações
              </Link>
              <Link
                to="/profile"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-2 py-3 text-lg text-gray-300 hover:bg-brand-light-dark hover:text-white rounded-md"
              >
                <HiOutlineUserCircle className="h-6 w-6" />
                Meu Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-2 py-3 text-lg text-red-400 hover:bg-brand-light-dark w-full text-left rounded-md"
              >
                <HiOutlineArrowRightOnRectangle className="h-6 w-6" />
                Sair
              </button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
