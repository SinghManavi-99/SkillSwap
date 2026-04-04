import 'dotenv/config'
import app from './app.js'
import connectDB from './config/db.js'
import { initSocket } from './config/socket.js'
import { setIO } from './services/notification.service.js'

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 SkillSwap backend running on http://localhost:${PORT}`)
    console.log(`📦 MongoDB connected`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`)
  })

  const io = initSocket(server)
  setIO(io)
})
