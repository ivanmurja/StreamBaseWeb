import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CreateListPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, createCustomList } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("O nome da lista é obrigatório.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const newListId = await createCustomList({ name, description, isPublic });
      navigate(`/list/${user.uid}/${newListId}`);
    } catch (err) {
      setError("Falha ao criar a lista. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white">Acesso Negado</h2>
        <p className="text-brand-text-secondary mt-2">
          Você precisa estar logado para criar uma lista.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:px-8 py-16 animate-fade-in">
      <div className="max-w-2xl mx-auto bg-brand-light-dark rounded-xl shadow-2xl p-8 border border-brand-border">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Criar Nova Lista
        </h2>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-bold text-gray-400 mb-2"
            >
              Nome da Lista
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-brand-dark border border-brand-border rounded-md text-white"
              required
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-bold text-gray-400 mb-2"
            >
              Descrição (Opcional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full p-3 bg-brand-dark border border-brand-border rounded-md text-white resize-y"
            />
          </div>
          <div className="flex items-center">
            <input
              id="isPublic"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 text-brand-primary bg-brand-dark border-brand-border rounded focus:ring-brand-primary"
            />
            <label htmlFor="isPublic" className="ml-2 block text-sm text-white">
              Lista Pública
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-brand-primary text-white font-bold rounded-md hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            {loading ? "Criando..." : "Criar Lista"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListPage;
