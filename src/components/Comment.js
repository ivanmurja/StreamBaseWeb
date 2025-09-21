import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";

const Comment = ({ comment, currentUserUid, onEdit, onDelete, loading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const isAuthor = currentUserUid === comment.userId;
  const defaultAvatar =
    "data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%238b949e'%3e%3cpath fill-rule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z' clip-rule='evenodd' /%3e%3c/svg%3e";

  const handleSaveEdit = () => {
    if (editedText.trim() !== comment.text) {
      onEdit(comment.id, editedText);
    }
    setIsEditing(false);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Data Indisponível";
    if (timestamp.toDate) {
      return new Date(timestamp.toDate()).toLocaleString("pt-BR");
    }
    return new Date(timestamp).toLocaleString("pt-BR");
  };

  return (
    <div className="bg-brand-dark p-5 rounded-lg border border-brand-border shadow-md">
      <div className="flex items-center mb-3">
        <img
          src={comment.userPhotoURL || defaultAvatar}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-brand-primary"
        />
        <div>
          <Link
            to={`/profile/${comment.userId}`}
            className="font-semibold text-white text-lg hover:underline"
          >
            {comment.userName}
          </Link>
          <p className="text-xs text-brand-text-secondary">
            {formatTimestamp(comment.createdAt)}
            {comment.updatedAt &&
              comment.createdAt &&
              comment.updatedAt.seconds !== comment.createdAt.seconds && (
                <span className="ml-2">
                  (Editado em {formatTimestamp(comment.updatedAt)})
                </span>
              )}
          </p>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-3">
          <textarea
            className="w-full p-2 bg-brand-light-dark border border-brand-border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y"
            rows="3"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            disabled={loading}
          ></textarea>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 text-sm bg-brand-primary text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || !editedText.trim()}
            >
              Salvar
            </button>
          </div>
        </div>
      ) : (
        <p className="text-brand-text leading-relaxed mt-3">{comment.text}</p>
      )}

      {isAuthor && !isEditing && (
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center text-brand-primary hover:text-blue-400 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <HiOutlinePencilSquare className="h-5 w-5 mr-1" />
            Editar
          </button>
          <button
            onClick={() => onDelete(comment.id)}
            className="flex items-center text-red-400 hover:text-red-500 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <HiOutlineTrash className="h-5 w-5 mr-1" />
            Excluir
          </button>
        </div>
      )}
    </div>
  );
};

export default Comment;
