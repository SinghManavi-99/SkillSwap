import mongoose from 'mongoose'

export const SKILL_CATEGORIES = ['Technology','Design','Music','Language','Cooking','Fitness','Business','Arts & Crafts','Academic','Other']

const skillSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category:    { type: String, enum: SKILL_CATEGORIES, required: true },
  level:       { type: String, enum: ['beginner','intermediate','expert'], default: 'intermediate' },
  tags:        [{ type: String, lowercase: true }],
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })

skillSchema.index({ name: 'text', description: 'text', tags: 'text' })

export default mongoose.model('Skill', skillSchema)