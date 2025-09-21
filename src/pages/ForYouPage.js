import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import MovieList from "../components/MovieList";
import { Link } from "react-router-dom";

const ForYouPage = () => {
  const { user, getPersonalizedRecommendations } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      setLoading(true);
      setError("");
      try {
        const recs = await getPersonalizedRecommendations();
        setRecommendations(recs);
      } catch (err) {
        console.error("Erro ao buscar recomendações:", err);
        setError(
          "Não foi possível carregar suas recomendações. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, getPersonalizedRecommendations]);

  if (!user) {
    return (
      <div className="text-center py-20 px-4 animate-fade-in">
        <h2 className="text-3xl font-bold text-white">Acesso Negado</h2>
        <p className="text-brand-text-secondary mt-2 mb-6">
          Você precisa estar logado para ver suas recomendações.
        </p>
        <Link
          to="/login"
          className="bg-brand-primary text-white font-bold py-2 px-6 rounded-md hover:bg-blue-500 transition-colors"
        >
          Ir para Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:px-8 pb-16 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white border-b-2 border-brand-border pb-2">
          Especialmente Para Você
        </h2>
        <p className="text-brand-text-secondary mt-2">
          Recomendações baseadas nos filmes e séries que você mais gostou.
        </p>
      </div>

      <MovieList
        results={recommendations}
        isLoading={loading}
        error={error}
        query={" "}
      />

      {!loading && recommendations.length === 0 && !error && (
        <div className="text-center py-20">
          <h3 className="text-xl font-bold text-white">
            Ainda não temos recomendações para você.
          </h3>
          <p className="text-brand-text-secondary mt-2">
            Comece a avaliar e favoritar filmes e séries para receber sugestões
            personalizadas!
          </p>
        </div>
      )}
    </div>
  );
};

export default ForYouPage;
