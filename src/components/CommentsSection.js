import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Comment from "./Comment";

const CommentsSection = ({ mediaType, mediaId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const commentsCollectionRef = collection(
      db,
      `media/${mediaType}_${mediaId}/comments`
    );
    const q = query(commentsCollectionRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedComments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(fetchedComments);
      },
      (err) => {
        console.error("Erro ao carregar comentários:", err);
        setError("Não foi possível carregar os comentários.");
      }
    );

    return () => unsubscribe();
  }, [mediaType, mediaId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("Você precisa estar logado para comentar.");
      return;
    }
    if (!newCommentText.trim()) {
      setError("O comentário não pode estar vazio.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const commentsCollectionRef = collection(
        db,
        `media/${mediaType}_${mediaId}/comments`
      );
      await addDoc(commentsCollectionRef, {
        userId: user.uid,
        userName: user.displayName || user.email,
        userPhotoURL: user.photoURL || null,
        text: newCommentText,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setNewCommentText("");
    } catch (err) {
      console.error("Erro ao adicionar comentário:", err);
      setError("Falha ao adicionar comentário.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditComment = async (commentId, newText) => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const commentRef = doc(
        db,
        `media/${mediaType}_${mediaId}/comments`,
        commentId
      );
      await updateDoc(commentRef, {
        text: newText,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Erro ao editar comentário:", err);
      setError("Falha ao editar comentário.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const commentRef = doc(
        db,
        `media/${mediaType}_${mediaId}/comments`,
        commentId
      );
      await deleteDoc(commentRef);
    } catch (err) {
      console.error("Erro ao deletar comentário:", err);
      setError("Falha ao deletar comentário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 p-6 bg-brand-light-dark rounded-lg border border-brand-border animate-fade-in">
      <h3 className="text-2xl font-bold text-white border-b border-brand-border pb-3 mb-6">
        Comentários
      </h3>

      {error && (
        <p className="text-red-400 bg-red-900/20 p-3 rounded-md mb-4">
          {error}
        </p>
      )}

      {user ? (
        <form onSubmit={handleAddComment} className="mb-8 space-y-4">
          <textarea
            className="w-full p-3 bg-brand-dark border border-brand-border rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y"
            rows="3"
            placeholder="Escreva seu comentário..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            disabled={loading}
          ></textarea>
          <button
            type="submit"
            className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-md hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !newCommentText.trim()}
          >
            {loading ? "Enviando..." : "Enviar Comentário"}
          </button>
        </form>
      ) : (
        <p className="text-brand-text-secondary text-center py-4">
          Faça login para deixar um comentário.
        </p>
      )}

      <div className="space-y-6">
        {comments.length === 0 && !loading && (
          <p className="text-brand-text-secondary text-center">
            Nenhum comentário ainda. Seja o primeiro a comentar!
          </p>
        )}
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            comment={comment}
            currentUserUid={user?.uid}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
            loading={loading}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
