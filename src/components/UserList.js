import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserCard from "./UserCard";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

const UserList = ({ type }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, getFollowing, getFollowers } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchUsersAndProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists() && userDocSnap.data().profile) {
          setProfileData(userDocSnap.data().profile);
        } else {
          setProfileData({ displayName: "Usuário Desconhecido" });
        }
      } catch (err) {
        console.error("Erro ao buscar perfil do usuário para UserList:", err);
        setProfileData({ displayName: "Erro ao carregar nome" });
      }

      if (!user) {
        setUsers([]);
        setLoading(false);
        return;
      }

      try {
        let fetchedList = [];
        if (type === "following") {
          fetchedList = await getFollowing(userId);
        } else if (type === "followers") {
          fetchedList = await getFollowers(userId);
        }
        setUsers(fetchedList);
      } catch (err) {
        console.error(`Erro ao carregar ${type} list:`, err);
        setError(`Não foi possível carregar a lista de ${type}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndProfile();
  }, [userId, type, user, getFollowing, getFollowers]);

  const getTitle = () => {
    const userName = profileData?.displayName || "este usuário";
    if (type === "following") {
      return `Seguindo por ${userName}`;
    }
    if (type === "followers") {
      return `Seguidores de ${userName}`;
    }
    return "Lista de Usuários";
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

  return (
    <div className="container mx-auto p-4 md:px-8 py-16 animate-fade-in">
      <div className="max-w-3xl mx-auto bg-brand-light-dark rounded-xl shadow-2xl p-8 border border-brand-border">
        <h2 className="text-3xl font-bold text-white border-b-2 border-brand-border pb-2 mb-8">
          {getTitle()}
        </h2>

        {users.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-bold text-white">
              Nenhum usuário encontrado.
            </h3>
            <p className="text-brand-text-secondary mt-2">
              {type === "following"
                ? "Este usuário ainda não segue ninguém."
                : "Este usuário ainda não tem seguidores."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {users.map((u) => (
              <UserCard key={u.id} user={u} />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="bg-brand-primary text-white font-bold py-2 px-6 rounded-md hover:bg-blue-500 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
