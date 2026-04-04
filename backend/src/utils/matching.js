import User from '../models/User.js'

export const findMatches = async (userId) => {
  const me = await User.findById(userId).populate('skillsOffered').populate('skillsWanted')
  if (!me) throw new Error('User not found')

  const offeredIds = me.skillsOffered.map(s => s._id)
  const wantedIds  = me.skillsWanted.map(s => s._id)

  const matches = await User.find({
    _id: { $ne: userId }, isActive: true,
    skillsWanted:  { $in: offeredIds },
    skillsOffered: { $in: wantedIds },
  })
    .select('-password')
    .populate('skillsOffered', 'name category level')
    .populate('skillsWanted',  'name category level')
    .sort({ reputationScore: -1 })
    .limit(20)

  return matches.map(m => ({
    user: m,
    matchedSkills: {
      theyWant:  m.skillsWanted.filter(s  => offeredIds.some(id => id.equals(s._id))),
      theyOffer: m.skillsOffered.filter(s => wantedIds.some(id  => id.equals(s._id))),
    },
    matchScore: m.skillsWanted.filter(s => offeredIds.some(id => id.equals(s._id))).length +
                m.skillsOffered.filter(s => wantedIds.some(id => id.equals(s._id))).length,
  })).sort((a, b) => b.matchScore - a.matchScore)
}