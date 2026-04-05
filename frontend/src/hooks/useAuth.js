import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import { authApi } from "../api";
import { connectSocket, disconnectSocket } from "../api/socket";
import { saveAuthData, clearAuthData } from "../api/auth.utils";

export function useAuthActions() {
  const { login, logout }               = useAuth();
  const { updateProfile, resetProfile } = useUser();
  const navigate                        = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // ── Email/Password Login ───────────────────────────────────────────
  async function handleLogin(email, password) {
    setLoading(true);
    setError(null);
    try {
      // axios → res.data contains the actual response body
      const res = await authApi.login(email, password);
      const { token, user } = res.data.data || res.data;

      // Save to localStorage via auth.utils
      saveAuthData({ user, accessToken: token, refreshToken: null });

      // Update AuthContext
      login({ ...user, token });

      // Connect Socket.io with JWT
      connectSocket(token);

      // Fetch full profile → sync UserContext
      const meRes = await authApi.getMe();
      const me = meRes.data.data || meRes.data;

      updateProfile({
        role:               me.role || "seeker",
        bio:                me.bio || "",
        location:           me.location?.city || "",
        skillsOffered:      me.skillsOffered || [],
        skillsWanted:       me.skillsWanted || [],
        swapsDone:          me.totalSwapsCompleted || 0,
        onboardingComplete: !!(me.bio || me.skillsOffered?.length > 0),
      });

      navigate("/dashboard");
    } catch (err) {
      // axios error → err.response.data.message
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  // ── Register ───────────────────────────────────────────────────────
  async function handleRegister(name, email, password) {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.register(name, email, password);
      const { token, user } = res.data.data || res.data;

      saveAuthData({ user, accessToken: token, refreshToken: null });
      login({ ...user, token });

      // New users go to onboarding
      navigate("/onboarding");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  // ── Google OAuth ───────────────────────────────────────────────────
  async function handleGoogleLogin(credential) {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.googleLogin(credential);
      const { token, user, isNewUser } = res.data.data || res.data;

      saveAuthData({ user, accessToken: token, refreshToken: null });
      login({ ...user, token });
      connectSocket(token);

      navigate(isNewUser ? "/onboarding" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  // ── Logout ─────────────────────────────────────────────────────────
  function handleLogout() {
    disconnectSocket();
    logout();
    resetProfile();
    clearAuthData();
    navigate("/login");
  }

  return {
    handleLogin,
    handleRegister,
    handleGoogleLogin,
    handleLogout,
    loading,
    error,
  };
}