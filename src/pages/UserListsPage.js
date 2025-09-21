import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ListCard from "../components/ListCard";
import AccessDenied from "../components/AccessDenied";

const UserListsPage = () => {
  const { userId } = useParams();
  const { user, getUserLists, getUserProfile } = useAuth();
  const [lists, setLists] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      const userLists = await getUserLists(userId);
      const userProfile = await getUserProfile(userId);
      setLists(userLists);
      setProfile(userProfile);
      setLoading(false);
    };
    fetchData();
  }, [userId, user, getUserLists, getUserProfile]);

  if (!user) {
    return (
      <AccessDenied message="Você precisa estar logado para ver as listas de usuários." />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:px-8 py-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">
          Listas de {profile?.displayName || "Usuário"}
        </h2>
        {user && user.uid === userId && (
          <Link
            to="/create-list"
            className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-blue-500 transition-colors"
          >
            + Criar Nova Lista
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.length > 0 ? (
          lists.map((list) => (
            <ListCard key={list.id} list={list} userId={userId} />
          ))
        ) : (
          <p className="text-brand-text-secondary col-span-full text-center mt-8">
            Este usuário ainda não criou nenhuma lista.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserListsPage;
