const send = (res, code, ok, msg, data = null) => {
  const body = { success: ok, message: msg }
  if (data !== null) body.data = data
  return res.status(code).json(body)
}
export const sendSuccess = (res, msg, data = null, code = 200) => send(res, code, true, msg, data)
export const sendError   = (res, msg, code = 400)              => send(res, code, false, msg)