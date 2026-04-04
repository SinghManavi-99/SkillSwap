import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6, select: false },
  googleId: { type: String, default: null, sparse: true },
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  avatar:   { type: String, default: '' },
  bio:      { type: String, default: '', maxlength: 300 },
  location: { city: String, country: String },
  role:     { type: String, enum: ['user','admin','seeker','sage','catalyst'], default: 'seeker' },
  skillsOffered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  skillsWanted:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
  reputationScore:     { type: Number, default: 0 },
  totalSwapsCompleted: { type: Number, default: 0 },
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true, toJSON: { virtuals: true } })

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password || this.password.startsWith('google_oauth_')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function(candidate) {
  if (!this.password || this.password.startsWith('google_oauth_')) return Promise.resolve(false)
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model('User', userSchema)