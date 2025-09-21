import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import {
  HiOutlineUserCircle,
  HiOutlineFilm,
  HiOutlineTv,
  HiOutlineClock,
  HiArrowTopRightOnSquare,
} from "react-icons/hi2";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const {
    user,
    updateUserProfile,
    getFollowing,
    getFollowers,
    getUserMediaStats,
  } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [stats, setStats] = useState({
    moviesWatched: 0,
    seriesWatched: 0,
    totalMinutes: 0,
  });

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      const fetchProfileData = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().profile) {
          setBio(docSnap.data().profile.bio || "");
        } else {
          setBio("");
        }

        const followingList = await getFollowing(user.uid);
        setFollowingCount(followingList.length);

        const followersList = await getFollowers(user.uid);
        setFollowersCount(followersList.length);

        const userStats = await getUserMediaStats(user.uid);
        setStats(userStats);
      };
      fetchProfileData();
    }
  }, [user, getFollowing, getFollowers, getUserMediaStats]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updateUserProfile({ displayName: displayName, bio: bio });
      setSuccess("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar o perfil:", err);
      setError("Falha ao atualizar o perfil.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 animate-fade-in">
        <div className="text-center p-8 bg-brand-light-dark rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-3">Acesso Negado</h2>
          <p className="text-brand-text-secondary mb-6">
            Você precisa estar logado para ver seu perfil.
          </p>
          <a
            href="/login"
            className="bg-brand-primary text-white font-bold py-2 px-6 rounded-md hover:bg-blue-500 transition-colors"
          >
            Ir para Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:px-8 py-16 animate-fade-in">
      <div className="max-w-3xl mx-auto bg-brand-light-dark rounded-xl shadow-2xl p-8 border border-brand-border">
        <div className="flex justify-between items-center mb-10 border-b-2 border-brand-primary pb-4">
          <h2 className="text-4xl font-extrabold text-white">Editar Perfil</h2>
          <Link
            to={`/profile/${user.uid}`}
            className="flex items-center gap-2 text-sm bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
            title="Veja como os outros usuários veem seu perfil"
          >
            <HiArrowTopRightOnSquare className="h-5 w-5" />
            Ver Perfil Público
          </Link>
        </div>

        {error && (
          <p className="text-center text-red-400 bg-red-900/20 p-3 rounded-md mb-6 transition-all duration-300">
            {error}
          </p>
        )}
        {success && (
          <p className="text-center text-green-400 bg-green-900/20 p-3 rounded-md mb-6 transition-all duration-300">
            {success}
          </p>
        )}

        <div className="flex flex-col items-center mb-8">
          <HiOutlineUserCircle className="h-40 w-40 text-brand-text-secondary mb-4 drop-shadow-md" />
          <p className="text-lg font-semibold text-white">
            {displayName || "Usuário StreamBase"}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            A funcionalidade de avatar está desabilitada no momento.
          </p>
        </div>

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
            to={`/profile/following/${user.uid}`}
            className="text-brand-primary hover:underline"
          >
            <span className="font-bold text-2xl">{followingCount}</span>
            <p className="text-brand-text-secondary">Seguindo</p>
          </Link>
          <Link
            to={`/profile/followers/${user.uid}`}
            className="text-brand-primary hover:underline"
          >
            <span className="font-bold text-2xl">{followersCount}</span>
            <p className="text-brand-text-secondary">Seguidores</p>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-gray-400 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              className="w-full p-3 bg-brand-dark border border-brand-border rounded-lg text-gray-500 cursor-not-allowed focus:outline-none"
              disabled
            />
            <p className="text-xs text-brand-text-secondary mt-1">
              O email não pode ser alterado aqui.
            </p>
          </div>

          <div>
            <label
              htmlFor="displayName"
              className="block text-sm font-bold text-gray-400 mb-2"
            >
              Nome de Usuário
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full p-3 bg-brand-dark border border-brand-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>

          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-bold text-gray-400 mb-2"
            >
              Biografia
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="5"
              className="w-full p-3 bg-brand-dark border border-brand-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y"
              placeholder="Fale um pouco sobre você e seus interesses em filmes e séries..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-blue-500 transition-colors duration-300 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
