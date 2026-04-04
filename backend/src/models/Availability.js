import mongoose from 'mongoose'

// A user defines recurring weekly availability slots
// e.g. "Every Monday 6pm–9pm IST"
const slotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true,
  },
  startTime: { type: String, required: true }, // "18:00"
  endTime:   { type: String, required: true }, // "21:00"
}, { _id: false })

const availabilitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    timezone:    { type: String, default: 'Asia/Kolkata' },
    weeklySlots: [slotSchema],

    // Specific blocked-out dates (holidays, busy days)
    blockedDates: [{ type: Date }],

    // Max sessions per week
    maxSessionsPerWeek: { type: Number, default: 5 },

    // Buffer between sessions (minutes)
    bufferMins: { type: Number, default: 15 },

    isAcceptingRequests: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Availability', availabilitySchema)