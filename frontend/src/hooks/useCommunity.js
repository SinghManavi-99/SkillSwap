import { useState, useEffect, useCallback } from 'react'
import { postsApi } from '../api'

export function useCommunity(initialType = 'all') {
  const [posts,       setPosts]       = useState([])
  const [loading,     setLoading]     = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error,       setError]       = useState(null)
  const [type,        setType]        = useState(initialType)
  const [page,        setPage]        = useState(1)
  const [hasMore,     setHasMore]     = useState(false)

  const load = useCallback((reset = false) => {
    const currentPage = reset ? 1 : page
    if (reset) setLoading(true)
    else setLoadingMore(true)

    const params = { page: currentPage, limit: 10 }
    if (type !== 'all') params.type = type

    postsApi.getFeed(params)
      .then(res => {
        const newPosts = res.data.posts
        if (reset) setPosts(newPosts)
        else setPosts(prev => [...prev, ...newPosts])
        setHasMore(res.data.pagination?.page < res.data.pagination?.pages)
      })
      .catch(err => setError(err.message))
      .finally(() => { setLoading(false); setLoadingMore(false) })
  }, [type, page])

  useEffect(() => { setPage(1); load(true) }, [type])

  function loadMore() { setPage(p => p + 1); load(false) }

  function changeType(newType) { setType(newType); setPage(1); setPosts([]) }

  // Create a post → saved to MongoDB
  async function createPost(content, postType = 'skill_share') {
    const res = await postsApi.create({ content, type: postType })
    setPosts(prev => [res.data, ...prev])
    return res.data
  }

  // Toggle like → saved to MongoDB
  async function toggleLike(postId) {
    const res = await postsApi.like(postId)
    setPosts(prev => prev.map(p =>
      p._id === postId ? { ...p, likeCount: res.data.likeCount } : p
    ))
  }

  // Add comment → saved to MongoDB
  async function addComment(postId, content) {
    const res = await postsApi.comment(postId, content)
    setPosts(prev => prev.map(p =>
      p._id === postId ? { ...p, comments: [...(p.comments || []), res.data] } : p
    ))
  }

  // Delete post
  async function deletePost(postId) {
    await postsApi.delete(postId)
    setPosts(prev => prev.filter(p => p._id !== postId))
  }

  return {
    posts, loading, loadingMore, error, hasMore,
    type, changeType, loadMore,
    createPost, toggleLike, addComment, deletePost,
  }
}