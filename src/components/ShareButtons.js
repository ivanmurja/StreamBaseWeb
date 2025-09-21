import React, { useState } from "react";
import { HiShare } from "react-icons/hi2";

const ShareButtons = ({ url, title }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const shareUrl = window.location.href;
    const shareTitle = `Confira ${title} no StreamBase!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl });
      } catch (error) {
        console.error("Erro ao compartilhar:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Falha ao copiar o link:", err);
      }
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="flex items-center justify-center w-full h-full"
        title="Compartilhar"
      >
        <HiShare className="h-6 w-6" />
      </button>
      {copied && (
        <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-green-500 text-white text-xs rounded-md whitespace-nowrap animate-fade-in">
          Copiado!
        </span>
      )}
    </>
  );
};

export default ShareButtons;
