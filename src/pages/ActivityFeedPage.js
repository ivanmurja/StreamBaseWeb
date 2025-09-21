import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/config";
import ActivityCard from "../components/ActivityCard";
import { Link } from "react-router-dom";

const ActivityFeedPage = () => {
  const { user, getFollowing } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [followingUsers, setFollowingUsers] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!user) return;
      try {
        const following = await getFollowing(user.uid);
        setFollowingUsers(following.map((f) => f.id));
      } catch (err) {
        console.error("Erro ao carregar usuários seguidos:", err);
        setError("Não foi possível carregar os usuários seguidos.");
      }
    };
    fetchFollowing();
  }, [user, getFollowing]);

  useEffect(() => {
    if (!user || followingUsers.length === 0) {
      setLoading(false);
      setActivities([]);
      return;
    }

    const activitiesCollectionRef = collection(db, "activities");
    const q = query(
      activitiesCollectionRef,
      orderBy("timestamp", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedActivities = [];
        snapshot.docs.forEach((doc) => {
          const activity = { id: doc.id, ...doc.data() };
          if (followingUsers.includes(activity.userId)) {
            fetchedActivities.push(activity);
          }
        });
        setActivities(fetchedActivities);
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao carregar atividades:", err);
        setError("Não foi possível carregar o feed de atividades.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, followingUsers]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 animate-fade-in">
        <div className="text-center p-8 bg-brand-light-dark rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-3">Acesso Negado</h2>
          <p className="text-brand-text-secondary mb-6">
            Você precisa estar logado para ver o feed de atividades.
          </p>
          <Link
            to="/login"
            className="bg-brand-primary text-white font-bold py-2 px-6 rounded-md hover:bg-blue-500 transition-colors"
          >
            Ir para Login
          </Link>
        </div>
      </div>
    );
  }

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

  return (
    <div className="container mx-auto p-4 md:px-8 py-16 animate-fade-in">
      <div className="max-w-3xl mx-auto bg-brand-light-dark rounded-xl shadow-2xl p-4 md:p-8 border border-brand-border">
        <h2 className="text-4xl font-extrabold text-white text-center mb-10 border-b-2 border-brand-primary pb-4">
          Feed de Atividades
        </h2>

        {followingUsers.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl font-bold text-white mb-2">
              Comece a seguir usuários!
            </p>
            <p className="text-brand-text-secondary">
              Seu feed de atividades estará vazio até que você siga alguns
              amigos.
            </p>
            <Link
              to="/discover-users"
              className="mt-4 inline-block bg-brand-primary text-white font-bold py-2 px-6 rounded-md hover:bg-blue-500 transition-colors"
            >
              Descobrir Usuários
            </Link>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl font-bold text-white mb-2">
              Nenhuma atividade recente.
            </p>
            <p className="text-brand-text-secondary">
              Seus amigos ainda não realizaram atividades que aparecem aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeedPage;
