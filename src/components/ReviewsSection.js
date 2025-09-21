import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ReviewCard from "./ReviewCard";
import { HiPencil } from "react-icons/hi2";

const ReviewsSection = ({ mediaType, mediaId, onWriteReviewClick }) => {
  const { user, getReviews } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const fetchedReviews = await getReviews(mediaType, mediaId);
      setReviews(fetchedReviews);
      setLoading(false);
    };
    fetchReviews();
  }, [mediaType, mediaId, getReviews]);

  return (
    <div className="mt-12">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b-2 border-brand-border pb-2 mb-4 gap-2">
        <h2 className="text-2xl font-bold text-white">
          Avaliações dos Usuários
        </h2>
        {user && (
          <button
            onClick={onWriteReviewClick}
            className="flex items-center gap-2 text-sm text-brand-primary hover:underline"
          >
            <HiPencil className="h-4 w-4" />
            <span>Clique aqui para escrever sua avaliação</span>
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-brand-text-secondary">Carregando avaliações...</p>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-brand-text-secondary">Ainda não há avaliações.</p>
          {user && (
            <p className="text-brand-text-secondary mt-2">
              Seja o primeiro a avaliar!
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
