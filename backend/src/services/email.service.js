import nodemailer from 'nodemailer'

// ── Transporter ───────────────────────────────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

// ── Base HTML template ─────────────────────────────────────────────────
const baseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #f4f7fb; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 20px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #0d1520, #1a3050); padding: 32px 40px; text-align: center; }
    .header h1 { color: #00c8ff; font-size: 24px; margin: 0; letter-spacing: 3px; }
    .header p  { color: #8ab0cc; margin: 6px 0 0; font-size: 13px; }
    .body { padding: 36px 40px; color: #333; line-height: 1.7; }
    .body h2 { color: #0d1520; font-size: 20px; margin-top: 0; }
    .body p  { margin: 0 0 16px; color: #555; }
    .highlight { background: #f0f9ff; border-left: 4px solid #00c8ff; padding: 14px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }
    .btn { display: inline-block; background: #00c8ff; color: #0d1520; text-decoration: none; font-weight: 700; padding: 12px 28px; border-radius: 8px; margin: 20px 0; font-size: 14px; }
    .meta { font-size: 12px; color: #aaa; margin-top: 4px; }
    .footer { background: #f8fafc; padding: 20px 40px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #eee; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 100px; font-size: 12px; font-weight: 600; }
    .badge-blue   { background: #e0f4ff; color: #0077aa; }
    .badge-green  { background: #e0fff4; color: #007744; }
    .badge-amber  { background: #fff8e0; color: #aa7700; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>⇄ SKILLSWAP</h1>
      <p>Peer-to-peer skill exchange</p>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>You received this because you have a SkillSwap account.</p>
      <p>© ${new Date().getFullYear()} SkillSwap — Built with ❤️</p>
    </div>
  </div>
</body>
</html>
`

// ── Send helper ────────────────────────────────────────────────────────
async function sendEmail(to, subject, html) {
  if (!process.env.SMTP_USER) {
    console.log(`[Email] Would send to ${to}: ${subject}`)
    return
  }
  const transporter = createTransporter()
  await transporter.sendMail({
    from: `"SkillSwap" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  })
}

// ── Email templates ────────────────────────────────────────────────────

export async function sendWelcomeEmail(user) {
  await sendEmail(
    user.email,
    '🎉 Welcome to SkillSwap!',
    baseTemplate(`
      <h2>Welcome, ${user.name}! 👋</h2>
      <p>You've joined a community where knowledge is the currency. Start your first skill swap today.</p>
      <div class="highlight">
        <strong>Your next steps:</strong><br/>
        1. Complete your profile<br/>
        2. Add skills you can teach<br/>
        3. Find your first swap partner
      </div>
      <a href="${process.env.CLIENT_URL}/explore" class="btn">Find Matches →</a>
    `)
  )
}

export async function sendSwapRequestEmail(provider, requester, swap) {
  await sendEmail(
    provider.email,
    `🔄 New swap request from ${requester.name}`,
    baseTemplate(`
      <h2>You have a new swap request!</h2>
      <p><strong>${requester.name}</strong> wants to exchange skills with you.</p>
      <div class="highlight">
        <strong>They offer:</strong> ${swap.skillOffered?.name}<br/>
        <strong>They want:</strong> ${swap.skillWanted?.name}<br/>
        <span class="meta">${swap.message || 'No message included'}</span>
      </div>
      <a href="${process.env.CLIENT_URL}/swaps" class="btn">View Request →</a>
    `)
  )
}

export async function sendSwapAcceptedEmail(requester, provider, swap) {
  await sendEmail(
    requester.email,
    `✅ ${provider.name} accepted your swap request!`,
    baseTemplate(`
      <h2>Your swap was accepted! 🎉</h2>
      <p><strong>${provider.name}</strong> is ready to exchange skills with you.</p>
      <div class="highlight">
        <strong>Skill exchange:</strong> ${swap.skillOffered?.name} ⇄ ${swap.skillWanted?.name}
      </div>
      <p>Schedule your first session to get started.</p>
      <a href="${process.env.CLIENT_URL}/swaps" class="btn">Schedule Session →</a>
    `)
  )
}

export async function sendSwapRejectedEmail(requester, provider) {
  await sendEmail(
    requester.email,
    `Swap request update from ${provider.name}`,
    baseTemplate(`
      <h2>Swap request not accepted</h2>
      <p><strong>${provider.name}</strong> couldn't accept your swap request at this time.</p>
      <p>Don't worry — there are many other great matches waiting for you!</p>
      <a href="${process.env.CLIENT_URL}/explore" class="btn">Find Other Matches →</a>
    `)
  )
}

export async function sendSessionReminderEmail(user, session, hoursUntil) {
  await sendEmail(
    user.email,
    `⏰ Session reminder — in ${hoursUntil} hour${hoursUntil > 1 ? 's' : ''}`,
    baseTemplate(`
      <h2>Your session is coming up!</h2>
      <p>You have a session scheduled in <strong>${hoursUntil} hour${hoursUntil > 1 ? 's' : ''}</strong>.</p>
      <div class="highlight">
        <strong>${session.title}</strong><br/>
        📅 ${new Date(session.scheduledAt).toLocaleString('en-IN', { timeZone: session.timezone })}<br/>
        ⏱ ${session.durationMins} minutes<br/>
        ${session.meetingLink ? `🔗 <a href="${session.meetingLink}">Join Meeting</a>` : `📍 ${session.location}`}
      </div>
      <a href="${process.env.CLIENT_URL}/swaps" class="btn">View Session →</a>
    `)
  )
}

export async function sendSessionBookedEmail(user, session, bookedBy) {
  await sendEmail(
    user.email,
    `📅 Session booked by ${bookedBy.name}`,
    baseTemplate(`
      <h2>A session has been booked!</h2>
      <p><strong>${bookedBy.name}</strong> has scheduled a session with you.</p>
      <div class="highlight">
        <strong>${session.title}</strong><br/>
        📅 ${new Date(session.scheduledAt).toLocaleString('en-IN', { timeZone: session.timezone })}<br/>
        ⏱ ${session.durationMins} minutes<br/>
        ${session.format === 'video' ? '📹 Video call' : session.format === 'audio' ? '🎙 Audio call' : '📍 In person'}
      </div>
      <a href="${process.env.CLIENT_URL}/swaps" class="btn">Confirm Session →</a>
    `)
  )
}

export async function sendVerificationApprovedEmail(user) {
  await sendEmail(
    user.email,
    '✅ Your identity has been verified!',
    baseTemplate(`
      <h2>You're now verified! 🏅</h2>
      <p>Your identity has been verified. You'll now display a verification badge on your profile, building trust with other users.</p>
      <div class="highlight">
        <span class="badge badge-green">✓ Verified User</span><br/><br/>
        Your badge level has been upgraded.
      </div>
      <a href="${process.env.CLIENT_URL}/settings" class="btn">View Profile →</a>
    `)
  )
}

export async function sendDisputeUpdateEmail(user, dispute) {
  await sendEmail(
    user.email,
    `⚖️ Update on your dispute #${dispute._id.toString().slice(-6)}`,
    baseTemplate(`
      <h2>Dispute Status Update</h2>
      <p>There's been an update on your dispute.</p>
      <div class="highlight">
        <strong>Status:</strong> <span class="badge badge-amber">${dispute.status.replace('_', ' ').toUpperCase()}</span><br/>
        ${dispute.resolution ? `<strong>Resolution:</strong> ${dispute.resolution}` : ''}
      </div>
      <a href="${process.env.CLIENT_URL}/swaps" class="btn">View Dispute →</a>
    `)
  )
}

export async function sendSwapCompletedEmail(user, swap) {
  await sendEmail(
    user.email,
    '🎊 Swap completed! Leave a review',
    baseTemplate(`
      <h2>Swap Completed! 🎉</h2>
      <p>Great job completing your skill swap. Share your experience by leaving a review.</p>
      <div class="highlight">
        <strong>Skill exchanged:</strong> ${swap.skillOffered?.name} ⇄ ${swap.skillWanted?.name}
      </div>
      <p>Your review helps the community make better swap decisions.</p>
      <a href="${process.env.CLIENT_URL}/swaps" class="btn">Leave a Review →</a>
    `)
  )
}

export async function sendEmailVerificationEmail(user, token) {
  await sendEmail(
    user.email,
    '📧 Verify your email address',
    baseTemplate(`
      <h2>Verify your email</h2>
      <p>Click the button below to verify your email address. This link expires in 24 hours.</p>
      <a href="${process.env.CLIENT_URL}/verify-email?token=${token}" class="btn">Verify Email →</a>
      <p class="meta">If you didn't create a SkillSwap account, you can safely ignore this email.</p>
    `)
  )
}

export async function sendEndorsementEmail(endorsee, endorser, skill) {
  await sendEmail(
    endorsee.email,
    `⭐ ${endorser.name} endorsed your ${skill.name} skill!`,
    baseTemplate(`
      <h2>You got an endorsement!</h2>
      <p><strong>${endorser.name}</strong> has endorsed your <strong>${skill.name}</strong> skill.</p>
      <div class="highlight">
        Endorsements strengthen your profile and help others trust your skills.
      </div>
      <a href="${process.env.CLIENT_URL}/settings" class="btn">View Profile →</a>
    `)
  )
}