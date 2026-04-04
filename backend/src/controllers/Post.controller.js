import Post from '../models/Post.js'
import { sendSuccess, sendError } from '../utils/response.js'
import { notify } from '../services/notification.service.js'

export const getFeed = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 15, search } = req.query
    const query = { isHidden: false }
    if (type)   query.type  = type
    if (search) query.$text = { $search: search }
    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .populate('comments.author', 'name avatar')
      .sort({ isPinned: -1, createdAt: -1 })
      .skip((page - 1) * limit).limit(Number(limit))
    const total = await Post.countDocuments(query)
    sendSuccess(res, 'Feed fetched', { posts, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } })
  } catch (err) { next(err) }
}

export const createPost = async (req, res, next) => {
  try {
    const post = await Post.create({ ...req.body, author: req.user._id })
    await post.populate('author', 'name avatar')
    sendSuccess(res, 'Post created!', post, 201)
  } catch (err) { next(err) }
}

export const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post || post.isHidden) return sendError(res, 'Post not found', 404)
    const liked = post.likes.includes(req.user._id)
    if (liked) post.likes.pull(req.user._id)
    else {
      post.likes.push(req.user._id)
      if (!post.author.equals(req.user._id))
        await notify({ recipientId: post.author, type: 'post_liked', title: 'Someone liked your post', message: `${req.user.name} liked your post.`, link: '/community', refModel: 'Post', refId: post._id })
    }
    await post.save()
    sendSuccess(res, liked ? 'Like removed' : 'Post liked', { likeCount: post.likes.length })
  } catch (err) { next(err) }
}

export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body
    const post = await Post.findById(req.params.id)
    if (!post || post.isHidden) return sendError(res, 'Post not found', 404)
    post.comments.push({ author: req.user._id, content })
    await post.save()
    await post.populate('comments.author', 'name avatar')
    const comment = post.comments[post.comments.length - 1]
    if (!post.author.equals(req.user._id))
      await notify({ recipientId: post.author, type: 'post_commented', title: 'New comment on your post', message: `${req.user.name}: "${content.slice(0, 50)}..."`, link: '/community', refModel: 'Post', refId: post._id })
    sendSuccess(res, 'Comment added', comment, 201)
  } catch (err) { next(err) }
}

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return sendError(res, 'Post not found', 404)
    if (!post.author.equals(req.user._id) && req.user.role !== 'admin') return sendError(res, 'Not authorized', 403)
    await post.deleteOne()
    sendSuccess(res, 'Post deleted')
  } catch (err) { next(err) }
}
export const deleteComment = async (req, res, next) => {
  try {
    const { id, commentId } = req.params

    const post = await Post.findById(id)
    if (!post) return sendError(res, 'Post not found', 404)

    const comment = post.comments.id(commentId)
    if (!comment) return sendError(res, 'Comment not found', 404)

    // permission check
    if (
      !comment.author.equals(req.user._id) &&
      !post.author.equals(req.user._id) &&
      req.user.role !== 'admin'
    ) {
      return sendError(res, 'Not authorized', 403)
    }

    comment.deleteOne()
    await post.save()

    sendSuccess(res, 'Comment deleted')
  } catch (err) {
    next(err)
  }
}


