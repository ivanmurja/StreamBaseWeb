import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import NotificationItem from "../components/NotificationItem";
import AccessDenied from "../components/AccessDenied";
import { HiCheckBadge } from "react-icons/hi2";

const NotificationsPage = () => {
  const { user, markNotificationAsRead, markAllNotificationsAsRead } =
    useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      orderBy("createdAt", "desc")
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
        console.error("Erro ao carregar notificações:", err);
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
    if (notifications.some((n) => !n.read)) {
      markAllNotificationsAsRead();
    }
  };

  if (!user) {
    return (
      <AccessDenied message="Você precisa estar logado para ver suas notificações." />
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container mx-auto p-4 md:px-8 py-16 animate-fade-in">
      <div className="max-w-3xl mx-auto bg-brand-light-dark rounded-xl shadow-2xl border border-brand-border">
        <div className="p-6 flex justify-between items-center border-b border-brand-border">
          <h2 className="text-3xl font-extrabold text-white">Notificações</h2>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 text-sm text-brand-primary hover:text-blue-400 font-semibold transition-colors"
            >
              <HiCheckBadge className="h-5 w-5" />
              Marcar todas como lidas
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-20 px-6">
            <h3 className="text-xl font-bold text-white mb-2">
              Você não tem notificações.
            </h3>
            <p className="text-brand-text-secondary">
              Mantenha-se ativo ou conecte-se com amigos para receber novidades!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-brand-border">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onClose={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
