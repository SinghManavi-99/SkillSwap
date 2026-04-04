import { validationResult } from 'express-validator'
import { sendError } from '../utils/response.js'

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty())
    return sendError(res, errors.array().map(e => e.msg).join(', '), 422)
  next()
}

export default validate