import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:    { type: String, enum: ['skill_share','swap_success','question','resource','milestone'], default: 'skill_share' },
  content: { type: String, required: true, maxlength: 2000 },
  skills:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  likes:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likeCount: { type: Number, default: 0 },
  comments: [{
    author:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content:   { type: String, required: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
  }],
  viewCount: { type: Number, default: 0 },
  isHidden:  { type: Boolean, default: false },
  isPinned:  { type: Boolean, default: false },
}, { timestamps: true })

postSchema.index({ content: 'text' })
postSchema.pre('save', function(next) { this.likeCount = this.likes.length; next() })

export default mongoose.model('Post', postSchema)