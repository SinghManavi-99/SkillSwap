const errorHandler = (err, req, res, next) => {
  let code = err.statusCode || 500
  let msg  = err.message || 'Server error'

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    msg = `${field} already exists`
    code = 409
  }
  if (err.name === 'ValidationError')
    msg = Object.values(err.errors).map(e => e.message).join(', ')
  if (err.name === 'JsonWebTokenError') { msg = 'Invalid token'; code = 401 }

  res.status(code).json({ success: false, message: msg })
}

export default errorHandler