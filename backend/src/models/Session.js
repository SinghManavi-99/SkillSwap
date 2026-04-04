import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema(
  {
    swap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Swap',
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: { type: String, maxlength: 500, default: '' },

    // Scheduling
    scheduledAt: { type: Date, required: true },
    durationMins: { type: Number, default: 60, min: 15, max: 480 },
    timezone: { type: String, default: 'Asia/Kolkata' },

    // Format & meeting link
    format: {
      type: String,
      enum: ['video', 'audio', 'in_person', 'async'],
      default: 'video',
    },
    meetingLink: { type: String, default: '' }, // Zoom/Meet/custom link
    location: { type: String, default: '' },    // For in_person

    // Status lifecycle
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled', 'no_show'],
      default: 'pending',
    },

    // Attendee confirmations
    hostConfirmed:        { type: Boolean, default: false },
    participantConfirmed: { type: Boolean, default: false },

    // Session notes / recap (filled after session)
    hostNotes:        { type: String, maxlength: 1000, default: '' },
    participantNotes: { type: String, maxlength: 1000, default: '' },

    // Cancellation
    cancelledBy:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    cancellationReason: { type: String, default: '' },
    cancelledAt:        { type: Date, default: null },

    // Actual timing (for tracking)
    startedAt:   { type: Date, default: null },
    completedAt: { type: Date, default: null },

    // Reminder sent flags
    reminder24hSent: { type: Boolean, default: false },
    reminder1hSent:  { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Prevent double-booking: same user can't have two sessions at the same time
sessionSchema.index({ host: 1, scheduledAt: 1 })
sessionSchema.index({ participant: 1, scheduledAt: 1 })
sessionSchema.index({ swap: 1 })

export default mongoose.model('Session', sessionSchema)