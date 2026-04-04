import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'

// ── Import all routes ──────────────────────────────────────────────────
import authRoutes         from './routes/auth.routes.js'
import userRoutes         from './routes/user.routes.js'
import skillRoutes        from './routes/skill.routes.js'
//import swapRoutes         from './routes/swap.routes.js'
//import reviewRoutes       from './routes/review.routes.js'
//import chatRoutes         from './routes/chat.routes.js'
//import postRoutes         from './routes/post.routes.js'
//import notificationRoutes from './routes/notification.routes.js'
//import sessionRoutes      from './routes/session.routes.js'
//import reportRoutes       from './routes/report.routes.js'
//import disputeRoutes      from './routes/dispute.routes.js'
//import endorsementRoutes  from './routes/endorsement.routes.js'

import errorHandler from './middleware/errorHandler.js'
import notFound     from './middleware/notFound.js'

const app = express()

// ── Security middleware ────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))

// ── Rate limiting ──────────────────────────────────────────────────────
app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max:      200,
  message:  { success: false, message: 'Too many requests. Please try again later.' },
}))

// ── Body parsing ───────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Logging ────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'))

// ── Health check ───────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({
  success: true,
  message: 'SkillSwap API running ✅',
  version: '2.0.0',
  timestamp: new Date().toISOString(),
}))

// ── Register all routes ────────────────────────────────────────────────
app.use('/api/auth',          authRoutes)
app.use('/api/users',         userRoutes)
app.use('/api/skills',        skillRoutes)
//app.use('/api/swaps',         swapRoutes)
//app.use('/api/reviews',       reviewRoutes)
//app.use('/api/chat',          chatRoutes)
//app.use('/api/posts',         postRoutes)
//app.use('/api/notifications', notificationRoutes)
//app.use('/api/sessions',      sessionRoutes)
//app.use('/api/reports',       reportRoutes)
// app.use('/api/disputes',      disputeRoutes)
//app.use('/api/endorsements',  endorsementRoutes)

// ── Error handling ─────────────────────────────────────────────────────
app.use(notFound)
app.use(errorHandler)

export default app