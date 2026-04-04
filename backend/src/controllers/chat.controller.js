// chat.controller.js
import Swap from '../models/Swap.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const getChatHistory = async (req, res, next) => {
  try {
    const swap = await Swap.findById(req.params.swapId)
      .select('messages requester provider status')
      .populate('messages.sender', 'name avatar')
    if (!swap) return sendError(res, 'Swap not found', 404)
    const isParty = swap.requester.equals(req.user._id) || swap.provider.equals(req.user._id)
    if (!isParty) return sendError(res, 'Not authorized', 403)
    sendSuccess(res, 'Chat history fetched', swap.messages)
  } catch (err) { next(err) }
}