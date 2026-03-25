/**
 * Calculates a match score (0–100) between a seeker and a mentor.
 * Score is based on:
 * - How many of the seeker's WANTED skills the mentor can TEACH  (70% weight)
 * - How many of the seeker's OFFERED skills the mentor WANTS      (30% weight)
 */
export function calcMatchScore(seekerWanted, seekerOffered, mentorOffered, mentorWanted) {
  if (!seekerWanted.length && !seekerOffered.length) return 0

  const teachMatch = seekerWanted.filter(s =>
    mentorOffered.map(m => m.toLowerCase()).includes(s.toLowerCase())
  ).length

  const learnMatch = seekerOffered.filter(s =>
    mentorWanted.map(m => m.toLowerCase()).includes(s.toLowerCase())
  ).length

  const teachScore = seekerWanted.length
    ? (teachMatch / seekerWanted.length) * 70
    : 0

  const learnScore = seekerOffered.length
    ? (learnMatch / seekerOffered.length) * 30
    : 0

  return Math.round(teachScore + learnScore)
}

/**
 * Given a list of mentors and the current user's profile,
 * returns mentors sorted by match score descending, then rating descending.
 */
export function sortMentorsByMatch(mentors, userWanted, userOffered) {
  return [...mentors]
    .map(mentor => ({
      ...mentor,
      matchScore: calcMatchScore(userWanted, userOffered, mentor.skillsOffered, mentor.skillsWanted),
    }))
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore
      return b.rating - a.rating
    })
}

/**
 * Returns which of the user's wanted skills a specific mentor can teach.
 */
export function getMatchedSkills(userWanted, mentorOffered) {
  return userWanted.filter(s =>
    mentorOffered.map(m => m.toLowerCase()).includes(s.toLowerCase())
  )
}