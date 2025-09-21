import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import {
  HiOutlineUserCircle,
  HiUserPlus,
  HiUserMinus,
  HiFilm,
  HiOutlineFilm,
  HiOutlineTv,
  HiOutlineClock,
  HiOutlineClipboardDocumentList,
} from "react-icons/hi2";
import ActivityCard from "../components/ActivityCard";

const PublicProfilePage = () => {
  const { userId } = useParams();
  const {
    user,
    followUser,
    unfollowUser,
    isFollowing,
    getFollowing,
    getFollowers,
    getUserActivities,
    getUserMediaStats,
  } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [isUserFollowing, setIsUserFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [latestActivities, setLatestActivities] = useState([]);
  const [stats, setStats] = useState({
    moviesWatched: 0,
    seriesWatched: 0,
    totalMinutes: 0,
  });

  useEffect(() => {
    const fetchProfileAndStatus = async () => {
      setLoading(true);
      setError("");
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          if (data.profile) {
            setProfileData({ id: userDocSnap.id, ...data.profile });
          } else {
            setProfileData({
              id: userDocSnap.id,
              displayName: data.displayName || userDocSnap.id,
              bio: "",
            });
          }
        } else {
          setProfileData(null);
          setError("Perfil de usuário não encontrado.");
        }

        if (user && user.uid !== userId) {
          const followingStatus = await isFollowing(userId);
          setIsUserFollowing(followingStatus);
        }

        const followingList = await getFollowing(userId);
        setFollowingCount(followingList.length);

        const followersList = await getFollowers(userId);
        setFollowersCount(followersList.length);

        const activities = await getUserActivities(userId, 6);
        setLatestActivities(activities);

        const userStats = await getUserMediaStats(userId);
        setStats(userStats);
      } catch (err) {
        console.error("Erro ao carregar perfil público:", err);
        setError("Não foi possível carregar o perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndStatus();
  }, [
    userId,
    user,
    isFollowing,
    getFollowing,
    getFollowers,
    getUserActivities,
    getUserMediaStats,
  ]);

  const handleFollowToggle = async () => {
    if (!user) {
      setError("Você precisa estar logado para seguir/deixar de seguir.");
      return;
    }
    setActionLoading(true);
    setError("");
    try {
      if (isUserFollowing) {
        await unfollowUser(userId);
        setIsUserFollowing(false);
        setFollowersCount((prev) => prev - 1);
      } else {
        await followUser(userId);
        setIsUserFollowing(true);
        setFollowersCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Erro na ação de seguir/deixar de seguir:", err);
      setError("Falha na operação. Tente novamente.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-red-400">{error}</h2>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-white">
          Perfil não encontrado.
        </h2>
        <p className="text-brand-text-secondary mt-2">
          O usuário que você procura pode não existir.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:px-8 py-16 animate-fade-in">
      <div className="max-w-3xl mx-auto bg-brand-light-dark rounded-xl shadow-2xl p-8 border border-brand-border">
        <div className="flex flex-col items-center mb-8">
          <HiOutlineUserCircle className="h-40 w-40 text-brand-text-secondary mb-4 drop-shadow-md" />
          <p className="text-lg font-semibold text-white">
            {profileData.displayName || "Usuário StreamBase"}
          </p>
        </div>

        {profileData.bio && (
          <div className="text-center text-brand-text-secondary mb-8 p-4 bg-brand-dark rounded-lg border border-brand-border">
            <p>{profileData.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          <div className="p-4 bg-brand-dark rounded-lg">
            <HiOutlineFilm className="h-8 w-8 mx-auto text-brand-primary" />
            <p className="text-2xl font-bold text-white">
              {stats.moviesWatched}
            </p>
            <p className="text-sm text-brand-text-secondary">Filmes Vistos</p>
          </div>
          <div className="p-4 bg-brand-dark rounded-lg">
            <HiOutlineTv className="h-8 w-8 mx-auto text-brand-primary" />
            <p className="text-2xl font-bold text-white">
              {stats.seriesWatched}
            </p>
            <p className="text-sm text-brand-text-secondary">Séries Vistas</p>
          </div>
          <div className="p-4 bg-brand-dark rounded-lg">
            <HiOutlineClock className="h-8 w-8 mx-auto text-brand-primary" />
            <p className="text-2xl font-bold text-white">
              {(stats.totalMinutes / 60).toFixed(1)}
            </p>
            <p className="text-sm text-brand-text-secondary">Horas</p>
          </div>
        </div>

        <div className="flex justify-center gap-8 mb-8 text-center">
          <Link
            to={`/profile/following/${userId}`}
            className="text-brand-primary hover:underline"
          >
            <span className="font-bold text-2xl">{followingCount}</span>
            <p className="text-brand-text-secondary">Seguindo</p>
          </Link>
          <Link
            to={`/profile/followers/${userId}`}
            className="text-brand-primary hover:underline"
          >
            <span className="font-bold text-2xl">{followersCount}</span>
            <p className="text-brand-text-secondary">Seguidores</p>
          </Link>
          <Link
            to={`/lists/${userId}`}
            className="text-brand-primary hover:underline"
          >
            <HiOutlineClipboardDocumentList className="h-8 w-8 mx-auto" />
            <p className="text-brand-text-secondary">Listas</p>
          </Link>
        </div>

        {user && user.uid !== userId && (
          <div className="text-center mt-6">
            <button
              onClick={handleFollowToggle}
              className={`px-8 py-3 rounded-lg text-white font-bold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                isUserFollowing
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-brand-primary hover:bg-blue-600"
              }`}
              disabled={actionLoading}
            >
              {actionLoading ? (
                "Processando..."
              ) : isUserFollowing ? (
                <>
                  <HiUserMinus className="inline-block mr-2 text-xl" />
                  Deixar de Seguir
                </>
              ) : (
                <>
                  <HiUserPlus className="inline-block mr-2 text-xl" />
                  Seguir
                </>
              )}
            </button>
          </div>
        )}

        {user && user.uid === userId && (
          <div className="text-center mt-6">
            <Link
              to="/profile"
              className="px-8 py-3 bg-gray-700 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors duration-300"
            >
              Editar Meu Perfil
            </Link>
          </div>
        )}

        <div className="mt-12 pt-8 border-t-2 border-brand-border">
          <h3 className="text-2xl font-bold text-white border-b border-brand-primary pb-2 mb-6 flex items-center justify-between">
            <span>Últimas Atividades</span>
            {latestActivities.length > 0 && (
              <Link
                to={`/activity-feed`}
                className="text-brand-primary text-sm hover:underline flex items-center gap-1"
              >
                Ver Tudo
              </Link>
            )}
          </h3>

          {latestActivities.length > 0 ? (
            <div className="space-y-4">
              {latestActivities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4 bg-brand-dark rounded-lg border border-brand-border">
              <HiFilm className="h-16 w-16 text-brand-primary mx-auto mb-4" />
              <p className="text-xl font-bold text-white mb-2">
                Nenhuma atividade recente encontrada.
              </p>
              <p className="text-brand-text-secondary">
                {profileData.displayName || "Este usuário"} ainda não registrou
                nenhuma atividade ou elas não são públicas.
              </p>
              {user && user.uid !== userId && (
                <p className="text-brand-text-secondary mt-4">
                  Tente seguir {profileData.displayName} para ver as atividades
                  futuras!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfilePage;
