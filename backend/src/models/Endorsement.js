import mongoose from 'mongoose'

const endorsementSchema = new mongoose.Schema(
  {
    // Who gave the endorsement
    endorser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Who received it
    endorsee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Which specific skill is being endorsed
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    // Optional note
    note: { type: String, maxlength: 200, default: '' },

    // Swap context (endorsements from actual swap partners carry more weight)
    swap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Swap',
      default: null,
    },
    // Weight: 'swap_partner' > 'community'
    weight: {
      type: String,
      enum: ['swap_partner', 'community'],
      default: 'community',
    },
  },
  { timestamps: true }
)

// One endorsement per skill per pair
endorsementSchema.index({ endorser: 1, endorsee: 1, skill: 1 }, { unique: true })

export default mongoose.model('Endorsement', endorsementSchema)