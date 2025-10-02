import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { HiOutlineXMark } from "react-icons/hi2";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import Modal from "./Modal";

const AddToListModal = ({ mediaData, onClose }) => {
  const { user, getUserLists, addMediaToList } = useAuth();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const fetchLists = async () => {
      if (user) {
        const userLists = await getUserLists(user.uid);
        setLists(userLists);
        setLoading(false);
      }
    };
    fetchLists();
  }, [user, getUserLists]);

  const getListDetails = async (targetUserId, listId) => {
    const listRef = doc(db, "users", targetUserId, "customLists", listId);
    const docSnap = await getDoc(listRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  };

  const handleAddToList = async (listId) => {
    if (!user || !mediaData) return;

    setFeedback("Adicionando...");

    try {
      const listDetails = await getListDetails(user.uid, listId);
      const itemExists = listDetails.items.some(
        (item) =>
          item.id === mediaData.id && item.mediaType === mediaData.mediaType
      );

      if (itemExists) {
        setFeedback(`"${mediaData.title}" já está nesta lista.`);
        setTimeout(() => setFeedback(""), 2000);
        return;
      }

      await addMediaToList(listId, mediaData);
      setFeedback(
        `Adicionado a "${lists.find((l) => l.id === listId).name}" com sucesso!`
      );
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setFeedback("Erro ao adicionar à lista.");
      console.error(error);
      setTimeout(() => setFeedback(""), 2000);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-6 border-b border-brand-border flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Adicionar à Lista</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <HiOutlineXMark className="h-6 w-6" />
        </button>
      </div>
      <div className="p-6 max-h-80 overflow-y-auto">
        {loading && (
          <p className="text-center text-brand-text-secondary">
            Carregando listas...
          </p>
        )}
        {!loading && lists.length === 0 && (
          <p className="text-center text-brand-text-secondary">
            Você ainda não tem listas.{" "}
            <a href="/create-list" className="text-brand-primary underline">
              Crie uma agora!
            </a>
          </p>
        )}
        {feedback && (
          <p className="text-center text-green-400 mb-4">{feedback}</p>
        )}
        <div className="space-y-2">
          {lists.map((list) => (
            <button
              key={list.id}
              onClick={() => handleAddToList(list.id)}
              disabled={!!feedback}
              className="w-full text-left p-3 rounded-md bg-brand-dark hover:bg-brand-border transition-colors text-white disabled:opacity-50"
            >
              {list.name}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default AddToListModal;
