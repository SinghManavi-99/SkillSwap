import mongoose from 'mongoose'

const verificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // Identity verification
    identityStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified',
    },
    identitySubmittedAt: { type: Date, default: null },
    identityVerifiedAt:  { type: Date, default: null },
    identityRejectedReason: { type: String, default: '' },

    // Document info (store reference, NOT the actual doc)
    documentType: {
      type: String,
      enum: ['aadhar', 'passport', 'driving_license', 'student_id', ''],
      default: '',
    },
    documentRef: { type: String, default: '' }, // encrypted reference ID

    // Skill verification (admin manually verifies after test/demo)
    verifiedSkills: [
      {
        skill:      { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
        verifiedAt: { type: Date, default: Date.now },
        verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin
        method:     { type: String, enum: ['demo', 'certificate', 'test', 'portfolio'] },
        certificateUrl: { type: String, default: '' },
      },
    ],

    // Email verification
    emailVerified:   { type: Boolean, default: false },
    emailVerifiedAt: { type: Date, default: null },
    emailToken:      { type: String, default: null, select: false },
    emailTokenExp:   { type: Date, default: null },

    // Computed badge level: none < bronze < silver < gold
    badgeLevel: {
      type: String,
      enum: ['none', 'bronze', 'silver', 'gold'],
      default: 'none',
    },
  },
  { timestamps: true }
)

// Recompute badge level based on verifications
verificationSchema.methods.computeBadge = function () {
  const hasEmail    = this.emailVerified
  const hasIdentity = this.identityStatus === 'verified'
  const skillCount  = this.verifiedSkills.length

  if (hasEmail && hasIdentity && skillCount >= 2) return 'gold'
  if (hasEmail && hasIdentity) return 'silver'
  if (hasEmail) return 'bronze'
  return 'none'
}

export default mongoose.model('Verification', verificationSchema)