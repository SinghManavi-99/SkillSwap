import { useState, useEffect, useCallback } from "react";
import { skillsApi, usersApi, reviewsApi } from "../api";

// ── useSkills ─────────────────────────────────────────
export function useSkills(initialFilters = {}) {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    ...initialFilters
  });

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      skillsApi.getAll(filters),
      skillsApi.getCategories()
    ])
      .then(([skillsRes, catRes]) => {
        const sd = skillsRes.data?.data || skillsRes.data;
        const cd = catRes.data?.data || catRes.data;

        const skillsList = Array.isArray(sd)
          ? sd
          : (sd?.skills || []);

        // ✅ FIXED
        setSkills(prev =>
          filters.page === 1 ? skillsList : [...prev, ...skillsList]
        );

        setPagination(sd?.pagination || {});
        setCategories(Array.isArray(cd) ? cd : []);
      })
      .catch(err =>
        setError(err.response?.data?.message || err.message)
      )
      .finally(() => setLoading(false));

  }, [JSON.stringify(filters)]);

  const applyFilter = (newFilters) => {
    setSkills([]);
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1
    }));
  };

  const loadMore = () => {
    if (pagination?.page < pagination?.pages) {
      setFilters(prev => ({
        ...prev,
        page: prev.page + 1
      }));
    }
  };

  return {
    skills,
    categories,
    loading,
    error,
    pagination,
    hasMore: pagination?.page < pagination?.pages,
    applyFilter,
    loadMore,
  };
}

// ── useMatches ─────────────────────────────────────────
export function useMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    usersApi.getMatches()
      .then(res => {
        const data = res.data?.data || res.data;
        setMatches(Array.isArray(data) ? data : []);
      })
      .catch(err =>
        setError(err.response?.data?.message || err.message)
      )
      .finally(() => setLoading(false));
  }, []);

  return { matches, loading, error };
}

// ── useUserProfile ─────────────────────────────────────
export function useUserProfile(userId) {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    Promise.all([
      usersApi.getById(userId),
      reviewsApi.getForUser(userId)
    ])
      .then(([userRes, reviewRes]) => {
        setUser(userRes.data?.data || userRes.data);

        const rd = reviewRes.data?.data || reviewRes.data;
        setReviews(rd?.reviews || []);
        setAverage(rd?.average || null);
      })
      .catch(err =>
        setError(err.response?.data?.message || err.message)
      )
      .finally(() => setLoading(false));

  }, [userId]);

  return { user, reviews, average, loading, error };
}

// ── useUsers ───────────────────────────────────────────
export function useUsers(filters = {}) {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);

    usersApi.getAll(filters)
      .then(res => {
        const data = res.data?.data || res.data;

        setUsers(data?.users || (Array.isArray(data) ? data : []));
        setPagination(data?.pagination || {});
      })
      .catch(err =>
        setError(err.response?.data?.message || err.message)
      )
      .finally(() => setLoading(false));

  }, [JSON.stringify(filters)]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { users, pagination, loading, error, refresh };
}