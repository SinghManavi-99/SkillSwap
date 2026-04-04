import mongoose from 'mongoose'

const disputeSchema = new mongoose.Schema(
  {
    // What swap is this about
    swap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Swap',
      required: true,
    },
    // Who raised it
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Who it's against
    against: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Dispute type
    type: {
      type: String,
      enum: [
        'no_show',          // other party didn't show up
        'skill_mismatch',   // skill level was misrepresented
        'inappropriate',    // inappropriate behavior
        'session_quality',  // session quality was poor
        'cancellation',     // unfair cancellation
        'other',
      ],
      required: true,
    },

    title:       { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 2000 },
    evidence:    [{ type: String }], // URLs to screenshots/docs

    status: {
      type: String,
      enum: ['open', 'under_review', 'resolved', 'dismissed'],
      default: 'open',
    },

    // Admin resolution
    resolvedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    resolution:      { type: String, maxlength: 1000, default: '' },
    resolvedAt:      { type: Date, default: null },

    // Outcome
    outcome: {
      type: String,
      enum: ['', 'warning_issued', 'swap_cancelled', 'user_suspended', 'no_action'],
      default: '',
    },

    // Communication thread
    thread: [
      {
        sender:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, required: true, maxlength: 1000 },
        sentAt:  { type: Date, default: Date.now },
        isAdmin: { type: Boolean, default: false },
      },
    ],

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Dispute', disputeSchema)