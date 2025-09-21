import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import MovieCard from "../components/MovieCard";
import { HiOutlineTrash } from "react-icons/hi2";
import AccessDenied from "../components/AccessDenied";

const ListPage = () => {
  const { userId, listId } = useParams();
  const { getListDetails, removeMediaFromList, user } = useAuth();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchList = async () => {
      setLoading(true);
      const listDetails = await getListDetails(userId, listId);
      setList(listDetails);
      setLoading(false);
    };
    fetchList();
  }, [userId, listId, user, getListDetails]);

  const handleRemove = async (mediaDataToRemove) => {
    if (!user) return;

    await removeMediaFromList(listId, mediaDataToRemove);
    setList((prevList) => ({
      ...prevList,
      items: prevList.items.filter(
        (item) =>
          !(
            item.id === mediaDataToRemove.id &&
            item.mediaType === mediaDataToRemove.mediaType
          )
      ),
    }));
    setItemToDelete(null);
  };

  if (!user) {
    return (
      <AccessDenied message="Você precisa estar logado para ver o conteúdo desta lista." />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="text-center py-20 text-white">
        Lista não encontrada ou você não tem permissão para vê-la.
      </div>
    );
  }

  return (
    <>
      {itemToDelete && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center"
          onClick={() => setItemToDelete(null)}
        >
          <div
            className="bg-brand-light-dark rounded-lg shadow-xl p-6 m-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-white">Confirmar Exclusão</h3>
            <p className="text-brand-text-secondary mt-2 mb-6">
              Tem certeza que deseja remover "{itemToDelete.title}" desta lista?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleRemove(itemToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4 md:px-8 py-16">
        <h2 className="text-4xl font-extrabold text-white mb-2">{list.name}</h2>
        <p className="text-brand-text-secondary mb-8">{list.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {list.items && list.items.length > 0 ? (
            list.items.map((item) => (
              <div
                key={`${item.mediaType}-${item.id}`}
                className="relative group"
              >
                <MovieCard
                  id={item.id}
                  poster={item.poster}
                  title={item.title}
                  year={item.year}
                  rating={item.rating_tmdb}
                  mediaType={item.mediaType}
                />
                {user && user.uid === userId && (
                  <button
                    onClick={() => setItemToDelete(item)}
                    className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    title="Remover da lista"
                  >
                    <HiOutlineTrash className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="col-span-full text-brand-text-secondary text-center">
              Esta lista ainda não tem itens.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ListPage;
