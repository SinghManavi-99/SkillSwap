import mongoose from 'mongoose'

const notifSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:      { type: String, required: true },
  title:     { type: String, required: true },
  message:   { type: String, required: true },
  link:      { type: String, default: '' },
  refModel:  { type: String, default: '' },
  refId:     { type: mongoose.Schema.Types.ObjectId, default: null },
  isRead:    { type: Boolean, default: false },
  readAt:    { type: Date, default: null },
}, { timestamps: true })

notifSchema.index({ recipient: 1, isRead: 1, createdAt: -1 })
export default mongoose.model('Notification', notifSchema)