import React from "react";
import { Link } from "react-router-dom";

const AccessDenied = ({ message }) => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 animate-fade-in">
      <div className="text-center p-8 bg-brand-light-dark rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-3">Acesso Negado</h2>
        <p className="text-brand-text-secondary mb-6">
          {message || "Você precisa estar logado para ver esta página."}
        </p>
        <Link
          to="/login"
          className="bg-brand-primary text-white font-bold py-2 px-6 rounded-md hover:bg-blue-500 transition-colors"
        >
          Ir para Login
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
