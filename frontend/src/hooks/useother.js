import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import { usersApi, skillsApi, postsApi, authApi, swapsApi, reviewsApi } from "../api";

// ── useOnboarding ──────────────────────────────────────────────────────
export function useOnboarding() {
  const { updateProfile } = useUser();
  const { updateUser }    = useAuth();
  const navigate          = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  async function completeOnboarding({ name, bio, location, role, skillsOffered = [], skillsWanted = [] }) {
    setLoading(true);
    setError(null);
    try {
      // 1. Update profile in MongoDB
      await usersApi.updateProfile({ name, bio, location: { city: location } });

      // 2. Create each skill → get IDs back (axios: use res.data.data or res.data)
      const createIds = async (skills) =>
        Promise.all(
          skills
            .filter((s) => s.name?.trim())
            .map(async (s) => {
              if (s._id) return s._id;
              const res = await skillsApi.create(s);
              const created = res.data?.data || res.data;
              return created._id;
            })
        );

      const offIds  = await createIds(skillsOffered);
      const wantIds = await createIds(skillsWanted);

      // 3. Link skills to user
      await usersApi.updateSkills(offIds, wantIds);

      // 4. Sync contexts
      updateUser({ name });
      updateProfile({
        role,
        bio,
        location,
        skillsOffered:      offIds,
        skillsWanted:       wantIds,
        onboardingComplete: true,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Onboarding failed");
    } finally {
      setLoading(false);
    }
  }

  return { completeOnboarding, loading, error };
}

// ── useSettings ────────────────────────────────────────────────────────
export function useSettings() {
  const { user, updateUser }           = useAuth();
  const { profile, updateProfile }     = useUser();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState(null);

  const clearStatus = () => setTimeout(() => setSuccess(false), 3000);

  async function saveProfile({ name, bio, location }) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await usersApi.updateProfile({ name, bio, location: { city: location } });
      updateUser({ name });
      updateProfile({ bio, location });
      setSuccess(true);
      clearStatus();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  }

  async function saveSkills(offered, wanted) {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await usersApi.updateSkills(offered, wanted);
      updateProfile({ skillsOffered: offered, skillsWanted: wanted });
      setSuccess(true);
      clearStatus();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save skills");
    } finally {
      setLoading(false);
    }
  }

  return { user, profile, saveProfile, saveSkills, loading, success, error };
}

// ── useProgress ────────────────────────────────────────────────────────
export function useProgress() {
  const { user }    = useAuth();
  const { profile } = useUser();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([
      authApi.getMe(),
      swapsApi.getAll({ status: "completed" }),
      reviewsApi.getForUser(user.id),
    ])
      .then(([meRes, swRes, rvRes]) => {
        // axios: extract from res.data or res.data.data
        const me     = meRes.data?.data || meRes.data;
        const swData = swRes.data?.data || swRes.data;
        const rvData = rvRes.data?.data || rvRes.data;

        setStats({
          name:           me.name,
          avatar:         me.avatar,
          reputationScore: me.reputationScore,
          totalSwaps:     me.totalSwapsCompleted,
          averageRating:  rvData?.average || null,
          skillsOffered:  me.skillsOffered || [],
          skillsWanted:   me.skillsWanted  || [],
          completedSwaps: Array.isArray(swData) ? swData : [],
          reviews:        rvData?.reviews || [],
          xp:     profile.xp     || 0,
          level:  profile.level  || 1,
          streak: profile.streak || 0,
        });
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const xpForNext = ((stats?.level || 1)) * 200;

  return { stats, loading, error, xpForNext };
}

// ── useCommunity ───────────────────────────────────────────────────────
export function useCommunity(initialType = "all") {
  const [posts,       setPosts]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error,       setError]       = useState(null);
  const [type,        setType]        = useState(initialType);
  const [page,        setPage]        = useState(1);
  const [hasMore,     setHasMore]     = useState(false);

  const load = useCallback(
    (reset = false) => {
      const currentPage = reset ? 1 : page;
      reset ? setLoading(true) : setLoadingMore(true);

      const params = { page: currentPage, limit: 10 };
      if (type !== "all") params.type = type;

      postsApi
        .getFeed(params)
        .then((res) => {
          const data = res.data?.data || res.data;
          const newPosts = data?.posts || (Array.isArray(data) ? data : []);
          reset ? setPosts(newPosts) : setPosts((prev) => [...prev, ...newPosts]);
          setHasMore(data?.pagination?.page < data?.pagination?.pages);
        })
        .catch((err) => setError(err.response?.data?.message || err.message))
        .finally(() => { setLoading(false); setLoadingMore(false); });
    },
    [type, page]
  );

  useEffect(() => { setPage(1); load(true); }, [type]);

  const changeType = (t) => { setType(t); setPage(1); setPosts([]); };
  const loadMore   = ()  => { setPage((p) => p + 1); load(false); };

  const createPost = async (content, ptype = "skill_share") => {
    const res  = await postsApi.create({ content, type: ptype });
    const post = res.data?.data || res.data;
    setPosts((prev) => [post, ...prev]);
    return post;
  };

  const toggleLike = async (id) => {
    const res  = await postsApi.like(id);
    const data = res.data?.data || res.data;
    setPosts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, likeCount: data.likeCount } : p))
    );
  };

  const addComment = async (id, content) => {
    const res     = await postsApi.comment(id, content);
    const comment = res.data?.data || res.data;
    setPosts((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, comments: [...(p.comments || []), comment] } : p
      )
    );
  };

  const deletePost = async (id) => {
    await postsApi.delete(id);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  return {
    posts, loading, loadingMore, error, hasMore,
    type, changeType, loadMore,
    createPost, toggleLike, addComment, deletePost,
  };
}
