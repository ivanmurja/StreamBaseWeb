import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import UserCard from "../components/UserCard";
import UserSearch from "../components/UserSearch";

const DiscoverUsersPage = () => {
  const { user, getAllUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const allUsers = await getAllUsers();
        const otherUsers = allUsers.filter((u) => u.id !== user.uid);
        setUsers(otherUsers);
        setFilteredUsers(otherUsers);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        setError("Não foi possível carregar a lista de usuários.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, getAllUsers]);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = users.filter((item) => {
      return (
        (item.displayName &&
          item.displayName.toLowerCase().includes(lowercasedFilter)) ||
        (item.bio && item.bio.toLowerCase().includes(lowercasedFilter))
      );
    });
    setFilteredUsers(filteredData);
  }, [searchTerm, users]);

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
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-extrabold text-white text-center mb-4">
          Descobrir Usuários
        </h2>
        <p className="text-brand-text-secondary text-center mb-8">
          Encontre e conecte-se com outros amantes de filmes e séries.
        </p>

        <UserSearch value={searchTerm} onChange={setSearchTerm} />

        {filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredUsers.map((u) => (
              <UserCard key={u.id} user={u} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-white">
              Nenhum usuário encontrado.
            </h3>
            <p className="text-brand-text-secondary mt-2">
              Tente um termo de busca diferente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverUsersPage;
