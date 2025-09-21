import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import tmdbApi, { TMDB_IMAGE_BASE_URL_ORIGINAL, omdbApi } from "../api/tmdb";
import { useAuth } from "../context/AuthContext";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import CastCard from "../components/CastCard";
import Recommendations from "../components/Recommendations";
import CommentsSection from "../components/CommentsSection";
import AddToListModal from "../components/AddToListModal";
import ReviewsSection from "../components/ReviewsSection";
import Modal from "../components/Modal";
import ReviewForm from "../components/ReviewForm";
import DetailHeader from "../components/DetailHeader";
import ActionButtons from "../components/ActionButtons";
import MediaStats from "../components/MediaStats";
import AggregatorRatings from "../components/AggregatorRatings";

const DetailPage = () => {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  const [aggregatorRatings, setAggregatorRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, updateMediaState, getMediaStatus } = useAuth();
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const mediaStatus = getMediaStatus(mediaType, id);

  useEffect(() => {
    const fetchAllDetails = async () => {
      setIsLoading(true);
      setError("");
      try {
        const detailsResponse = await tmdbApi.get(`/${mediaType}/${id}`);
        setDetails(detailsResponse.data);

        const imdbId = detailsResponse.data.imdb_id;
        if (imdbId) {
          try {
            const ratingsResponse = await omdbApi.get(`/?i=${imdbId}`);
            if (ratingsResponse.data.Response === "True") {
              setAggregatorRatings(ratingsResponse.data.Ratings || []);
            }
          } catch (omdbError) {
            console.error("Falha ao buscar notas de agregadores:", omdbError);
          }
        }

        const [
          creditsResponse,
          recsResponse,
          videosResponse,
          providersResponse,
        ] = await Promise.all([
          tmdbApi.get(`/${mediaType}/${id}/credits`),
          tmdbApi.get(`/${mediaType}/${id}/recommendations`),
          tmdbApi.get(`/${mediaType}/${id}/videos`),
          tmdbApi.get(`/${mediaType}/${id}/watch/providers`),
        ]);

        setCredits(creditsResponse.data);
        setRecommendations(recsResponse.data.results);

        if (providersResponse.data.results.BR) {
          setWatchProviders(providersResponse.data.results.BR);
        }

        setTrailer(
          videosResponse.data.results.find(
            (video) => video.site === "YouTube" && video.type === "Trailer"
          )
        );
      } catch (err) {
        setError("Não foi possível carregar os detalhes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllDetails();
    window.scrollTo(0, 0);
  }, [mediaType, id]);

  const handleRating = (newRating) => {
    updateMediaState(mediaData, { rating: newRating, watched: true });
  };

  const mediaData = details
    ? {
        id: details.id,
        title: details.title || details.name,
        poster: details.poster_path,
        runtime: details.runtime,
        year:
          (details.release_date || details.first_air_date)?.substring(0, 4) ||
          "N/A",
        rating_tmdb: details.vote_average
          ? details.vote_average.toFixed(1)
          : "N/A",
        mediaType: mediaType,
        genres: details.genres || [],
      }
    : null;

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );

  if (error || !details)
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-red-400">
          {error || "Conteúdo não encontrado."}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 inline-block bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors"
        >
          Voltar
        </button>
      </div>
    );

  const currentUrl = window.location.href;
  const shareTitle = `Confira ${details.title || details.name} no StreamBase!`;

  return (
    <>
      {isListModalOpen && (
        <AddToListModal
          mediaData={mediaData}
          onClose={() => setIsListModalOpen(false)}
        />
      )}
      {isReviewModalOpen && (
        <Modal onClose={() => setIsReviewModalOpen(false)}>
          <ReviewForm
            mediaType={mediaType}
            mediaId={id}
            onClose={() => setIsReviewModalOpen(false)}
          />
        </Modal>
      )}
      <div className="animate-fade-in">
        <div className="relative text-white">
          {details.backdrop_path && (
            <img
              src={`${TMDB_IMAGE_BASE_URL_ORIGINAL}${details.backdrop_path}`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover z-0"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent z-10"></div>
          <div className="container mx-auto px-4 relative z-20">
            <div className="py-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-brand-text hover:text-white bg-brand-light-dark/70 border border-brand-border px-3 py-1.5 rounded-lg transition-colors duration-200 backdrop-blur-sm"
              >
                <HiOutlineArrowLeft className="h-5 w-5" />
                <span>Voltar</span>
              </button>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-1/2 max-w-[200px] md:w-1/3 md:max-w-xs flex-shrink-0">
                <img
                  src={`${TMDB_IMAGE_BASE_URL_ORIGINAL}${details.poster_path}`}
                  alt={`Pôster de ${details.title || details.name}`}
                  className="rounded-lg shadow-2xl w-full"
                />
              </div>
              <div className="w-full md:w-2/3 flex-1 text-center md:text-left">
                <DetailHeader
                  details={details}
                  actionButtons={
                    <ActionButtons
                      user={user}
                      trailer={trailer}
                      mediaData={mediaData}
                      mediaStatus={mediaStatus}
                      onListModalOpen={() => setIsListModalOpen(true)}
                      onReviewModalOpen={() => setIsReviewModalOpen(true)}
                      watchProviders={watchProviders}
                      currentUrl={currentUrl}
                      shareTitle={shareTitle}
                      updateMediaState={updateMediaState}
                    />
                  }
                  mediaStats={
                    <MediaStats
                      user={user}
                      mediaStatus={mediaStatus}
                      handleRating={handleRating}
                    />
                  }
                />
                <AggregatorRatings ratings={aggregatorRatings} />
              </div>
            </div>
            <div className="md:hidden mt-8 w-full flex flex-col items-center gap-4">
              <ActionButtons
                user={user}
                trailer={trailer}
                mediaData={mediaData}
                mediaStatus={mediaStatus}
                onListModalOpen={() => setIsListModalOpen(true)}
                onReviewModalOpen={() => setIsReviewModalOpen(true)}
                watchProviders={watchProviders}
                currentUrl={currentUrl}
                shareTitle={shareTitle}
                updateMediaState={updateMediaState}
              />
              <MediaStats
                user={user}
                mediaStatus={mediaStatus}
                handleRating={handleRating}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto p-4 md:px-8 pb-16">
          <div className="mt-8">
            {credits?.cast?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white border-b-2 border-brand-border pb-2 mb-4">
                  Elenco Principal
                </h2>
                <div className="flex overflow-x-auto space-x-4 pb-4">
                  {credits.cast.slice(0, 10).map((person) => (
                    <CastCard key={person.cast_id} person={person} />
                  ))}
                </div>
              </div>
            )}
            <ReviewsSection
              mediaType={mediaType}
              mediaId={id}
              onWriteReviewClick={() => setIsReviewModalOpen(true)}
            />
            {recommendations?.length > 0 && (
              <div className="mt-12">
                <Recommendations recommendations={recommendations} />
              </div>
            )}
            <CommentsSection mediaType={mediaType} mediaId={id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailPage;
