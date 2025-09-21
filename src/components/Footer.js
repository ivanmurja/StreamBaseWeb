import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-light-dark border-t border-brand-border text-brand-text-secondary">
      <div className="container mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="font-bold text-brand-text text-lg mb-2">StreamBase</h3>
          <p className="text-sm">Explorando o universo do cinema e TV.</p>
        </div>
        <div>
          <h3 className="font-bold text-brand-text text-lg mb-2">Navegação</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a
                href="/"
                className="hover:text-brand-primary transition-colors"
              >
                Início
              </a>
            </li>
            <li>
              <a
                href="/"
                className="hover:text-brand-primary transition-colors"
              >
                Sobre Nós
              </a>
            </li>
            <li>
              <a
                href="/"
                className="hover:text-brand-primary transition-colors"
              >
                API Utilizada
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-brand-text text-lg mb-2">Legal</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a
                href="/"
                className="hover:text-brand-primary transition-colors"
              >
                Termos de Uso
              </a>
            </li>
            <li>
              <a
                href="/"
                className="hover:text-brand-primary transition-colors"
              >
                Política de Privacidade
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="bg-brand-dark py-4">
        <p className="text-center text-xs">
          © {currentYear} StreamBase. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
