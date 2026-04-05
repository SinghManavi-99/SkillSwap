import { useState, useEffect, useCallback } from "react";
import { notifApi } from "../api";
import { connectSocket, onNotification, offNotification } from "../api/socket";
import { useAuth } from "../context/AuthContext";

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount,   setUnreadCount]   = useState(0);
  const [loading,       setLoading]       = useState(true);

  const refresh = useCallback(() => {
    notifApi
      .getAll({ limit: 30 })
      .then((res) => {
        const data = res.data?.data || res.data;
        setNotifications(data?.notifications || data || []);
        setUnreadCount(data?.unreadCount || 0);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Real-time notifications via Socket.io
  useEffect(() => {
    if (!user?.token) return;
    connectSocket(user.token);
    onNotification((notif) => {
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
    return () => offNotification();
  }, [user?.token]);

  const markRead = async (id) => {
    await notifApi.markRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await notifApi.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const remove = async (id) => {
    await notifApi.delete(id);
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  return {
    notifications,
    unread: notifications.filter((n) => !n.isRead),
    unreadCount,
    loading,
    markRead,
    markAllRead,
    remove,
    refresh,
  };
}