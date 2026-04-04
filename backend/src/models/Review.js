import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  swap:     { type: mongoose.Schema.Types.ObjectId, ref: 'Swap',  required: true },
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  comment:  { type: String, default: '' },
}, { timestamps: true })

reviewSchema.index({ swap: 1, reviewer: 1 }, { unique: true })

reviewSchema.post('save', async function() {
  const User = (await import('./User.js')).default
  const reviews = await mongoose.model('Review').find({ reviewee: this.reviewee })
  const total = reviews.reduce((sum, r) => sum + r.rating, 0)
  await User.findByIdAndUpdate(this.reviewee, {
    reputationScore: total,
    totalSwapsCompleted: reviews.length
  })
})

export default mongoose.model('Review', reviewSchema)