import React from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineUserCircle,
  HiOutlineEnvelopeOpen,
  HiUserPlus,
  HiCheckCircle,
} from "react-icons/hi2";

const NotificationItem = ({ notification, onMarkAsRead, onClose }) => {
  const navigate = useNavigate();

  const getIcon = (type) => {
    switch (type) {
      case "new_follower":
        return <HiUserPlus className="h-6 w-6 text-green-400" />;
      case "new_comment_on_my_media":
        return <HiOutlineEnvelopeOpen className="h-6 w-6 text-brand-primary" />;
      default:
        return (
          <HiOutlineUserCircle className="h-6 w-6 text-brand-text-secondary" />
        );
    }
  };

  const formattedDate = notification.createdAt
    ? new Date(notification.createdAt.toDate()).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "Data Indisponível";

  const handleContainerClick = (e) => {
    e.stopPropagation();
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
    onClose();
  };

  const handleCheckButtonClick = (e) => {
    e.stopPropagation();
    onMarkAsRead(notification.id);
  };

  return (
    <div
      onClick={handleContainerClick}
      onMouseDown={(e) => e.stopPropagation()}
      className={`p-4 flex items-start gap-4 transition-colors relative hover:bg-brand-dark/80 cursor-pointer ${
        notification.read ? "bg-brand-dark/20 opacity-70" : "bg-brand-dark/50"
      }`}
    >
      <div className="flex-shrink-0 text-brand-primary mt-1">
        {getIcon(notification.type)}
      </div>
      <div className="flex-1">
        <p className="text-sm leading-snug text-brand-text">
          {notification.message}
        </p>
        <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
      </div>
      {!notification.read && (
        <div className="flex-shrink-0 z-20">
          <button
            type="button"
            onClick={handleCheckButtonClick}
            onMouseDown={(e) => e.stopPropagation()}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
            title="Marcar como lida"
          >
            <HiCheckCircle className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
