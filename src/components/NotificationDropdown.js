import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import NotificationItem from "./NotificationItem";
import { useAuth } from "../context/AuthContext";
import { HiCheckBadge } from "react-icons/hi2";

const NotificationDropdown = ({ onClose }) => {
  const { user, markNotificationAsRead, markAllNotificationsAsRead } =
    useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setNotifications([]);
      return;
    }
    const notificationsCollectionRef = collection(db, "notifications");
    const q = query(
      notificationsCollectionRef,
      where("recipientId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(7)
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedNotifications = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(fetchedNotifications);
        setLoading(false);
      },
      (err) => {
        console.error("Erro ao carregar notificações para o dropdown:", err);
        setError("Não foi possível carregar suas notificações.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [user]);

  const handleMarkAsRead = (notificationId) => {
    markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    if (unreadCount > 0) {
      markAllNotificationsAsRead();
    }
  };

  if (loading) {
    return (
      <div className="w-80 p-4 text-center bg-brand-light-dark rounded-md shadow-lg border border-brand-border">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-primary mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 p-4 text-center text-red-400 bg-brand-light-dark rounded-md shadow-lg border border-brand-border">
        {error}
      </div>
    );
  }

  return (
    <div
      className="w-80 sm:w-96 bg-brand-light-dark rounded-lg shadow-2xl z-50 border border-brand-border animate-fade-in"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="px-4 py-3 border-b border-brand-border flex justify-between items-center">
        <h3 className="font-bold text-white text-lg">Notificações</h3>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleMarkAllAsRead();
            }}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-400"
          >
            <HiCheckBadge className="h-4 w-4" />
            Marcar todas como lidas
          </button>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="text-brand-text-secondary text-sm p-6 text-center">
            Nenhuma notificação recente.
          </p>
        ) : (
          <div className="divide-y divide-brand-border">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onClose={onClose}
              />
            ))}
          </div>
        )}
      </div>
      <div className="border-t border-brand-border text-center">
        <Link
          to="/notifications"
          onClick={onClose}
          className="block px-4 py-3 text-sm text-brand-primary hover:bg-brand-dark transition-colors"
        >
          Ver Todas as Notificações
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropdown;
