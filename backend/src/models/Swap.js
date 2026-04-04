import mongoose from 'mongoose'

const swapSchema = new mongoose.Schema({
  requester:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
  provider:     { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
  skillOffered: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  skillWanted:  { type: mongoose.Schema.Types.ObjectId, ref: 'Skill', required: true },
  status: { type: String, enum: ['pending','accepted','in_progress','completed','cancelled','rejected'], default: 'pending' },
  message:            { type: String, default: '' },
  sessionFormat:      { type: String, enum: ['online','in_person'], default: 'online' },
  scheduledAt:        { type: Date, default: null },
  completedAt:        { type: Date, default: null },
  cancellationReason: { type: String, default: '' },
  cancelledBy:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text:   { type: String, maxlength: 1000 },
    sentAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true })

swapSchema.pre('save', function(next) {
  if (this.requester.equals(this.provider)) return next(new Error('Cannot swap with yourself'))
  next()
})

export default mongoose.model('Swap', swapSchema)