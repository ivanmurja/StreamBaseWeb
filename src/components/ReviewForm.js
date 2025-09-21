import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import StarRating from "./StarRating";
import { HiOutlineXMark } from "react-icons/hi2";

const ReviewForm = ({ mediaType, mediaId, onClose }) => {
  const { addReview, updateMediaState, getMediaStatus } = useAuth();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(
    getMediaStatus(mediaType, mediaId).rating || 0
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Por favor, selecione uma nota.");
      return;
    }
    if (!title.trim()) {
      setError("O título da avaliação é obrigatório.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await addReview(mediaType, mediaId, { title, text, rating });

      const mediaData = { id: mediaId, mediaType };
      await updateMediaState(mediaData, { rating, watched: true });

      onClose();
    } catch (err) {
      setError("Falha ao enviar avaliação. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRating = (newRating) => {
    setRating(newRating);
  };

  return (
    <>
      <div className="p-6 border-b border-brand-border flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Escreva sua Avaliação</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <HiOutlineXMark className="h-6 w-6" />
        </button>
      </div>
      <div className="p-6">
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center">
            <StarRating rating={rating} onRating={handleRating} />
          </div>
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-bold text-gray-400 mb-2"
            >
              Título da Avaliação
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-brand-dark border border-brand-border rounded-md text-white"
              required
            />
          </div>
          <div>
            <label
              htmlFor="text"
              className="block text-sm font-bold text-gray-400 mb-2"
            >
              Sua Avaliação
            </label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows="5"
              className="w-full p-3 bg-brand-dark border border-brand-border rounded-md text-white resize-y"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-brand-primary text-white font-bold rounded-md hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar Avaliação"}
          </button>
        </form>
      </div>
    </>
  );
};

export default ReviewForm;
