import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const CommentForm = ({ mediaType, mediaId }) => {
  const { user, addComment } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!commentText.trim()) {
      setError("O comentário não pode estar vazio.");
      return;
    }

    setLoading(true);
    try {
      await addComment(mediaType, mediaId, commentText);
      setCommentText("");
      setSuccess("Comentário adicionado!");
    } catch (err) {
      console.error("Erro ao adicionar comentário:", err);
      setError("Falha ao adicionar comentário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-brand-light-dark p-6 rounded-lg text-center">
        <p className="text-brand-text-secondary">Faça login para comentar.</p>
      </div>
    );
  }

  return (
    <div className="bg-brand-light-dark p-6 rounded-lg shadow-md border border-brand-border">
      <h3 className="text-xl font-bold text-white mb-4">
        Adicionar Comentário
      </h3>
      {error && (
        <p className="text-red-400 bg-red-900/20 p-2 rounded-md mb-4">
          {error}
        </p>
      )}
      {success && (
        <p className="text-green-400 bg-green-900/20 p-2 rounded-md mb-4">
          {success}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full p-3 bg-brand-dark border border-brand-border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y"
            rows="3"
            placeholder="Escreva seu comentário aqui..."
            maxLength="500"
          ></textarea>
          <p className="text-right text-xs text-brand-text-secondary mt-1">
            {commentText.length}/500 caracteres
          </p>
        </div>
        <button
          type="submit"
          className="w-full p-3 bg-brand-primary text-white font-bold rounded-md hover:bg-blue-500 transition-colors duration-300"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar Comentário"}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
