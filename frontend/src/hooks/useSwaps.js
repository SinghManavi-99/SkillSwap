import { useState, useEffect, useCallback, useRef } from "react";
import { swapsApi, chatApi } from "../api";
import {
  joinSwapRoom,
  leaveSwapRoom,
  emitMessage,
  typingStart,
  typingStop,
  onMessage,
  offMessage,
  onTyping,
  offTyping,
} from "../api/socket";
import { useAuth } from "../context/AuthContext";

// ── useMySwaps ─────────────────────────────────────────
export function useMySwaps(filters = {}) {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    setLoading(true);

    swapsApi.getAll(filters)
      .then((res) => {
        const data = res.data?.data || res.data;
        setSwaps(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
      })
      .finally(() => setLoading(false));

  }, [JSON.stringify(filters)]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const pending   = swaps.filter(s => s.status === "pending");
  const active    = swaps.filter(s => ["accepted","in_progress"].includes(s.status));
  const completed = swaps.filter(s => s.status === "completed");

  const accept   = async (id)    => { await swapsApi.accept(id);   refresh(); };
  const reject   = async (id)    => { await swapsApi.reject(id);   refresh(); };
  const start    = async (id)    => { await swapsApi.start(id);    refresh(); };
  const complete = async (id)    => { await swapsApi.complete(id); refresh(); };
  const cancel   = async (id,r)  => { await swapsApi.cancel(id,r); refresh(); };

  return { swaps, pending, active, completed, loading, error, refresh, accept, reject, start, complete, cancel };
}

// ── useSwapDetail ──────────────────────────────────────
export function useSwapDetail(swapId) {
  const [swap, setSwap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!swapId) return;

    setLoading(true);

    swapsApi.getById(swapId)
      .then(res => setSwap(res.data?.data || res.data))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));

  }, [swapId]);

  return { swap, loading, error };
}

// ── useSendSwap ────────────────────────────────────────
export function useSendSwap() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  async function sendSwap({ providerId, skillOfferedId, skillWantedId, message = "", sessionFormat = "online" }) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await swapsApi.create({
        providerId,
        skillOfferedId,
        skillWantedId,
        message,
        sessionFormat
      });

      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to send swap");
    } finally {
      setLoading(false);
    }
  }

  return {
    sendSwap,
    loading,
    error,
    success,
    reset: () => setSuccess(false)
  };
}

// ── useChat ────────────────────────────────────────────
export function useChat(swapId) {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const [error, setError] = useState(null);

  const bottomRef = useRef(null);
  const typingTimer = useRef(null);

  // 📥 Load history
  useEffect(() => {
    if (!swapId) return;

    setLoading(true);

    chatApi.getHistory(swapId)
      .then((res) => {
        const msgs = res.data?.data || res.data;
        setMessages(Array.isArray(msgs) ? msgs : []);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));

  }, [swapId]);

  // 🔌 Socket listeners
  useEffect(() => {
    if (!swapId) return;

    joinSwapRoom(swapId);

    onMessage((msg) => {
      setMessages(prev => [...prev, msg]);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    });

    onTyping(({ userId }) => {
      if (userId !== user?._id) {
        setOtherTyping(true);
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => setOtherTyping(false), 2000);
      }
    });

    return () => {
      offMessage();
      offTyping();
      leaveSwapRoom(swapId);
      clearTimeout(typingTimer.current);
    };

  }, [swapId, user?._id]);

  // ✉️ Send message
  async function send(text) {
    if (!text.trim()) return;

    setSending(true);

    try {
      await swapsApi.sendMessage(swapId, text);

      emitMessage(swapId, text);

      setMessages(prev => [
        ...prev,
        {
          sender: { _id: user?._id, name: user?.name },
          text,
          sentAt: new Date()
        }
      ]);

      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSending(false);
    }
  }

  return {
    messages,
    loading,
    sending,
    error,
    otherTyping,
    send,
    bottomRef,
    onTypingStart: () => typingStart(swapId),
    onTypingStop: () => typingStop(swapId)
  };
}