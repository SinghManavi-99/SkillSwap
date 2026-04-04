// ─── review.controller.js ────────────────────────────────────────────
import Review from '../models/Review.js'
import Swap   from '../models/Swap.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const createReview = async (req, res, next) => {
  try {
    const { swapId, rating, comment } = req.body
    const swap = await Swap.findById(swapId)
    if (!swap) return sendError(res, 'Swap not found', 404)
    if (swap.status !== 'completed') return sendError(res, 'Can only review completed swaps', 400)
    const isParty = swap.requester.equals(req.user._id) || swap.provider.equals(req.user._id)
    if (!isParty) return sendError(res, 'Not authorized', 403)
    const exists = await Review.findOne({ swap: swapId, reviewer: req.user._id })
    if (exists) return sendError(res, 'Already reviewed this swap', 409)
    const revieweeId = swap.requester.equals(req.user._id) ? swap.provider : swap.requester
    const review = await Review.create({ swap: swapId, reviewer: req.user._id, reviewee: revieweeId, rating, comment })
    await review.populate('reviewer', 'name avatar')
    sendSuccess(res, 'Review submitted!', review, 201)
  } catch (err) { next(err) }
}

export const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar').sort({ createdAt: -1 })
    const average = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null
    sendSuccess(res, 'Reviews fetched', { reviews, average, total: reviews.length })
  } catch (err) { next(err) }
}

export const deleteReview = async (req, res, next) => {
  try {
    const r = await Review.findById(req.params.id)
    if (!r) return sendError(res, 'Review not found', 404)
    if (!r.reviewer.equals(req.user._id) && req.user.role !== 'admin') return sendError(res, 'Not authorized', 403)
    await r.deleteOne()
    sendSuccess(res, 'Review deleted')
  } catch (err) { next(err) }
}