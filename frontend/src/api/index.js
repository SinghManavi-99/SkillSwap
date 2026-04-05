import api from "./client.js";

// ═══════════════════════════════════════════════════════════════════════
// AUTH
// POST /api/auth/register   → { token, user }
// POST /api/auth/login      → { token, user }
// POST /api/auth/google     → { token, user, isNewUser }
// GET  /api/auth/me         → current user profile
// ═══════════════════════════════════════════════════════════════════════
export const authApi = {
  register: (name, email, password) =>
    api.post("/auth/register", { name, email, password }),

  login: (email, password) =>
    api.post("/auth/login", { email, password }),

  googleLogin: (credential) =>
    api.post("/auth/google", { credential }),

  getMe: () =>
    api.get("/auth/me"),
};

// ═══════════════════════════════════════════════════════════════════════
// USERS
// GET    /api/users              → browse all users
// GET    /api/users/matches      → smart bidirectional matches
// GET    /api/users/:id          → single user public profile
// PUT    /api/users/profile      → update own profile
// PUT    /api/users/skills       → update skills offered/wanted
// DELETE /api/users/me           → deactivate account
// ═══════════════════════════════════════════════════════════════════════
export const usersApi = {
  getAll: (params = {}) =>
    api.get("/users", { params }),

  getMatches: () =>
    api.get("/users/matches"),

  getById: (id) =>
    api.get(`/users/${id}`),

  updateProfile: (data) =>
    api.put("/users/profile", data),

  updateSkills: (skillsOffered, skillsWanted) =>
    api.put("/users/skills", { skillsOffered, skillsWanted }),

  deactivate: () =>
    api.delete("/users/me"),
};

// ═══════════════════════════════════════════════════════════════════════
// SKILLS
// GET    /api/skills              → list/search skills
// GET    /api/skills/categories   → all categories array
// GET    /api/skills/:id          → single skill
// POST   /api/skills              → create skill (auth required)
// PUT    /api/skills/:id          → update own skill
// DELETE /api/skills/:id          → delete own skill
// ═══════════════════════════════════════════════════════════════════════
export const skillsApi = {
  getAll: (params = {}) =>
    api.get("/skills", { params }),

  getCategories: () =>
    api.get("/skills/categories"),

  getById: (id) =>
    api.get(`/skills/${id}`),

  create: (data) =>
    api.post("/skills", data),

  update: (id, data) =>
    api.put(`/skills/${id}`, data),

  delete: (id) =>
    api.delete(`/skills/${id}`),
};

// ═══════════════════════════════════════════════════════════════════════
// SWAPS
// GET   /api/swaps                → my swaps (filter: status, role)
// GET   /api/swaps/:id            → swap detail + chat messages
// POST  /api/swaps                → send swap request
// PATCH /api/swaps/:id/status     → accept/reject/complete/cancel
// POST  /api/swaps/:id/messages   → send chat message
// ═══════════════════════════════════════════════════════════════════════
export const swapsApi = {
  getAll: (params = {}) =>
    api.get("/swaps", { params }),

  getById: (id) =>
    api.get(`/swaps/${id}`),

  create: (data) =>
    api.post("/swaps", data),

  // Status transitions
  accept: (id) =>
    api.patch(`/swaps/${id}/status`, { status: "accepted" }),

  reject: (id) =>
    api.patch(`/swaps/${id}/status`, { status: "rejected" }),

  start: (id) =>
    api.patch(`/swaps/${id}/status`, { status: "in_progress" }),

  complete: (id) =>
    api.patch(`/swaps/${id}/status`, { status: "completed" }),

  cancel: (id, cancellationReason = "") =>
    api.patch(`/swaps/${id}/status`, { status: "cancelled", cancellationReason }),

  updateStatus: (id, status, extra = {}) =>
    api.patch(`/swaps/${id}/status`, { status, ...extra }),

  // Chat
  sendMessage: (swapId, text) =>
    api.post(`/swaps/${swapId}/messages`, { text }),
};

// ═══════════════════════════════════════════════════════════════════════
// REVIEWS
// GET    /api/reviews/user/:userId → reviews for a user + average
// POST   /api/reviews              → submit review (post-swap only)
// DELETE /api/reviews/:id          → delete own review
// ═══════════════════════════════════════════════════════════════════════
export const reviewsApi = {
  getForUser: (userId) =>
    api.get(`/reviews/user/${userId}`),

  create: (swapId, rating, comment = "") =>
    api.post("/reviews", { swapId, rating, comment }),

  delete: (id) =>
    api.delete(`/reviews/${id}`),
};

// ═══════════════════════════════════════════════════════════════════════
// CHAT
// GET /api/chat/:swapId → full chat history from MongoDB
// (real-time messages come via Socket.io — see socket.js)
// ═══════════════════════════════════════════════════════════════════════
export const chatApi = {
  getHistory: (swapId) =>
    api.get(`/chat/${swapId}`),
};

// ═══════════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// GET   /api/notifications          → my notifications + unreadCount
// PATCH /api/notifications/read-all → mark all as read
// PATCH /api/notifications/:id/read → mark single as read
// DELETE /api/notifications/:id     → delete notification
// ═══════════════════════════════════════════════════════════════════════
export const notifApi = {
  getAll: (params = {}) =>
    api.get("/notifications", { params }),

  markRead: (id) =>
    api.patch(`/notifications/${id}/read`),

  markAllRead: () =>
    api.patch("/notifications/read-all"),

  delete: (id) =>
    api.delete(`/notifications/${id}`),
};

// ═══════════════════════════════════════════════════════════════════════
// COMMUNITY POSTS
// GET    /api/posts                  → feed (filter: type, search, page)
// GET    /api/posts/:id              → single post
// POST   /api/posts                  → create post
// PATCH  /api/posts/:id/like         → toggle like
// POST   /api/posts/:id/comments     → add comment
// DELETE /api/posts/:id/comments/:cid → delete comment
// DELETE /api/posts/:id              → delete post
// PATCH  /api/posts/:id/hide         → admin hide post
// ═══════════════════════════════════════════════════════════════════════
export const postsApi = {
  getFeed: (params = {}) =>
    api.get("/posts", { params }),

  getById: (id) =>
    api.get(`/posts/${id}`),

  create: (data) =>
    api.post("/posts", data),

  like: (id) =>
    api.patch(`/posts/${id}/like`),

  comment: (id, content) =>
    api.post(`/posts/${id}/comments`, { content }),

  deleteComment: (postId, commentId) =>
    api.delete(`/posts/${postId}/comments/${commentId}`),

  delete: (id) =>
    api.delete(`/posts/${id}`),

  hide: (id) =>
    api.patch(`/posts/${id}/hide`),
};

// ═══════════════════════════════════════════════════════════════════════
// SESSIONS (Scheduling)
// GET   /api/sessions/my                    → my sessions
// GET   /api/sessions/availability/:userId  → user's availability
// GET   /api/sessions/:id                   → single session
// POST  /api/sessions                       → book session
// PUT   /api/sessions/availability          → set own availability
// PATCH /api/sessions/:id/confirm           → confirm attendance
// PATCH /api/sessions/:id/start             → mark session started
// PATCH /api/sessions/:id/complete          → mark completed
// PATCH /api/sessions/:id/cancel            → cancel session
// ═══════════════════════════════════════════════════════════════════════
export const sessionsApi = {
  getMy: (params = {}) =>
    api.get("/sessions/my", { params }),

  getById: (id) =>
    api.get(`/sessions/${id}`),

  getAvailability: (userId) =>
    api.get(`/sessions/availability/${userId}`),

  book: (data) =>
    api.post("/sessions", data),

  setAvailability: (data) =>
    api.put("/sessions/availability", data),

  confirm: (id) =>
    api.patch(`/sessions/${id}/confirm`),

  start: (id) =>
    api.patch(`/sessions/${id}/start`),

  complete: (id, notes = "") =>
    api.patch(`/sessions/${id}/complete`, { notes }),

  cancel: (id, reason = "") =>
    api.patch(`/sessions/${id}/cancel`, { reason }),
};

// ═══════════════════════════════════════════════════════════════════════
// REPORTS & BLOCKS
// GET    /api/reports/blocked           → my blocked users list
// GET    /api/reports/is-blocked/:uid   → check if user is blocked
// POST   /api/reports                   → report a user
// POST   /api/reports/block             → block a user
// DELETE /api/reports/block/:userId     → unblock a user
// GET    /api/reports                   → (admin) all reports
// PATCH  /api/reports/:id/review        → (admin) review a report
// ═══════════════════════════════════════════════════════════════════════
export const reportsApi = {
  getBlocked: () =>
    api.get("/reports/blocked"),

  checkBlocked: (userId) =>
    api.get(`/reports/is-blocked/${userId}`),

  report: (reportedId, reason, description = "") =>
    api.post("/reports", { reportedId, reason, description }),

  block: (blockId) =>
    api.post("/reports/block", { blockId }),

  unblock: (userId) =>
    api.delete(`/reports/block/${userId}`),

  // Admin
  getAllReports: (params = {}) =>
    api.get("/reports", { params }),

  reviewReport: (id, status, note = "") =>
    api.patch(`/reports/${id}/review`, { status, note }),
};

// ═══════════════════════════════════════════════════════════════════════
// DISPUTES
// GET  /api/disputes/my              → my disputes (raisedBy or against)
// GET  /api/disputes/:id             → dispute detail + thread
// POST /api/disputes                 → raise a dispute
// POST /api/disputes/:id/message     → add message to thread
// GET  /api/disputes                 → (admin) all disputes
// PATCH /api/disputes/:id/resolve    → (admin) resolve/dismiss
// ═══════════════════════════════════════════════════════════════════════
export const disputesApi = {
  getMy: () =>
    api.get("/disputes/my"),

  getById: (id) =>
    api.get(`/disputes/${id}`),

  create: (data) =>
    api.post("/disputes", data),

  addMessage: (id, message) =>
    api.post(`/disputes/${id}/message`, { message }),

  // Admin
  getAll: (params = {}) =>
    api.get("/disputes", { params }),

  resolve: (id, status, resolution, outcome) =>
    api.patch(`/disputes/${id}/resolve`, { status, resolution, outcome }),
};

// ═══════════════════════════════════════════════════════════════════════
// ENDORSEMENTS & BADGES
// GET  /api/endorsements/user/:uid         → endorsements for user
// GET  /api/endorsements/verification/:uid → badge + verification status
// POST /api/endorsements                   → endorse a skill
// POST /api/endorsements/verify-identity   → submit ID document
// DELETE /api/endorsements/:id             → withdraw endorsement
// POST   /api/endorsements/verify-skill    → (admin) verify a skill
// PATCH  /api/endorsements/verify-identity/:uid → (admin) approve/reject
// ═══════════════════════════════════════════════════════════════════════
export const endorsementsApi = {
  getForUser: (userId) =>
    api.get(`/endorsements/user/${userId}`),

  getVerification: (userId) =>
    api.get(`/endorsements/verification/${userId}`),

  create: (endorseeId, skillId, note = "", swapId = null) =>
    api.post("/endorsements", { endorseeId, skillId, note, swapId }),

  submitIdentity: (documentType, documentRef) =>
    api.post("/endorsements/verify-identity", { documentType, documentRef }),

  delete: (id) =>
    api.delete(`/endorsements/${id}`),

  // Admin
  verifySkill: (userId, skillId, method, certificateUrl = "") =>
    api.post("/endorsements/verify-skill", { userId, skillId, method, certificateUrl }),

  reviewIdentity: (userId, status, reason = "") =>
    api.patch(`/endorsements/verify-identity/${userId}`, { status, reason }),
};