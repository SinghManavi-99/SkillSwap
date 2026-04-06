import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import { authApi } from "../api";
import { connectSocket, disconnectSocket } from "../api/socket";
import { saveAuthData, clearAuthData } from "../utils/auth.utils";

export function useAuthActions() {
  const { login, logout } = useAuth();
  const { updateProfile, resetProfile } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔐 LOGIN
  async function handleLogin(email, password) {
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.login(email, password);
      const { token, user } = res.data.data || res.data;

      const authData = {
        user,
        accessToken: token,
        refreshToken: null
      };

      // ✅ single source of truth
      saveAuthData(authData);
      login(authData);

      connectSocket(token);

      // 🔥 fetch profile
      const meRes = await authApi.getMe();
      const me = meRes.data.data || meRes.data;

      updateProfile({
        role: me.role || "seeker",
        bio: me.bio || "",
        location: me.location?.city || "",
        skillsOffered: me.skillsOffered || [],
        skillsWanted: me.skillsWanted || [],
        swapsDone: me.totalSwapsCompleted || 0,
        onboardingComplete: !!(me.bio || me.skillsOffered?.length > 0),
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  // 📝 REGISTER
  async function handleRegister(name, email, password) {
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.register(name, email, password);
      const { token, user } = res.data.data || res.data;

      const authData = {
        user,
        accessToken: token,
        refreshToken: null
      };

      saveAuthData(authData);
      login(authData);

      navigate("/onboarding");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  // 🔥 GOOGLE LOGIN
  async function handleGoogleLogin(credential) {
    setLoading(true);
    setError(null);

    try {
      const res = await authApi.googleLogin(credential);
      const { token, user, isNewUser } = res.data.data || res.data;

      const authData = {
        user,
        accessToken: token,
        refreshToken: null
      };

      saveAuthData(authData);
      login(authData);

      connectSocket(token);

      navigate(isNewUser ? "/onboarding" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  // 🚪 LOGOUT
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