import mongoose from 'mongoose'

// ── Report ────────────────────────────────────────────────────────────
const reportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reported: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    reason: {
      type: String,
      enum: [
        'spam',
        'harassment',
        'fake_profile',
        'inappropriate_content',
        'scam',
        'hate_speech',
        'other',
      ],
      required: true,
    },
    description: { type: String, maxlength: 500, default: '' },
    evidence:    [{ type: String }],

    status: {
      type: String,
      enum: ['pending', 'reviewed', 'actioned', 'dismissed'],
      default: 'pending',
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewNote: { type: String, default: '' },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
)

// One report per reporter-reported pair
reportSchema.index({ reporter: 1, reported: 1 }, { unique: true })

// ── Block ─────────────────────────────────────────────────────────────
const blockSchema = new mongoose.Schema(
  {
    blocker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    blocked: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

blockSchema.index({ blocker: 1, blocked: 1 }, { unique: true })

export const Report = mongoose.model('Report', reportSchema)
export const Block  = mongoose.model('Block',  blockSchema)