import { useState } from 'react'
import { useOnboarding } from '../hooks/useExplore'
import { skillsApi } from '../api'

const CATS  = ['Technology','Design','Music','Language','Cooking','Fitness','Business','Arts & Crafts','Academic','Other']
const ROLES = [
  { id: 'seeker',   icon: '🎓', title: 'Seeker',   desc: 'I want to learn new skills' },
  { id: 'sage',     icon: '🧠', title: 'Sage',     desc: 'I want to teach and mentor' },
  { id: 'catalyst', icon: '⚡', title: 'Catalyst', desc: 'I want to do both!' },
]

export default function OnboardingPage() {
  const { completeOnboarding, loading, error } = useOnboarding()
  const [step,     setStep]     = useState(1)
  const [role,     setRole]     = useState('')
  const [bio,      setBio]      = useState('')
  const [location, setLocation] = useState('')
  const [offering, setOffering] = useState([{ name: '', category: 'Technology', level: 'intermediate' }])
  const [wanting,  setWanting]  = useState([{ name: '', category: 'Music', level: 'beginner' }])

  const updSkill = (list, set, i, f, v) => { const n = [...list]; n[i][f] = v; set(n) }
  const addSkill = (list, set) => set([...list, { name: '', category: 'Technology', level: 'intermediate' }])
  const remSkill = (list, set, i) => set(list.filter((_, idx) => idx !== i))

  const S = ({ label, list, set }) => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold" style={{ color: 'var(--text)' }}>{label}</span>
        <button onClick={() => addSkill(list, set)} className="text-xs font-semibold hover:underline" style={{ color: 'var(--purple)' }}>+ Add</button>
      </div>
      {list.map((s, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input className="input-field flex-1" placeholder="Skill name" value={s.name} onChange={e => updSkill(list, set, i, 'name', e.target.value)} />
          <select className="input-field" style={{ width: '130px' }} value={s.category} onChange={e => updSkill(list, set, i, 'category', e.target.value)}>
            {CATS.map(c => <option key={c}>{c}</option>)}
          </select>
          <select className="input-field" style={{ width: '120px' }} value={s.level} onChange={e => updSkill(list, set, i, 'level', e.target.value)}>
            {['beginner','intermediate','expert'].map(l => <option key={l}>{l}</option>)}
          </select>
          {list.length > 1 && <button onClick={() => remSkill(list, set, i)} className="px-2 text-lg" style={{ color: 'var(--red)' }}>×</button>}
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: 'var(--bg2)' }}>
      <div className="w-full max-w-lg" style={{ background: 'var(--card-bg)', border: '1.5px solid var(--border)', borderRadius: '24px', padding: '2.5rem', boxShadow: 'var(--shadow)' }}>
        <div className="flex gap-2 mb-8">
          {[1,2,3].map(s => <div key={s} className="h-1.5 flex-1 rounded-full transition-all" style={{ background: s <= step ? 'var(--purple)' : 'var(--border)' }} />)}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text)' }}>What's your role?</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text3)' }}>Choose how you want to use SkillSwap</p>
            {ROLES.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)} className="w-full flex items-center gap-4 p-4 rounded-2xl text-left mb-3 transition-all"
                style={{ border: `1.5px solid ${role === r.id ? 'var(--purple)' : 'var(--border)'}`, background: role === r.id ? 'var(--purple-light)' : 'var(--card-bg)' }}>
                <span className="text-3xl">{r.icon}</span>
                <div className="flex-1">
                  <div className="font-bold" style={{ color: 'var(--text)' }}>{r.title}</div>
                  <div className="text-sm" style={{ color: 'var(--text2)' }}>{r.desc}</div>
                </div>
                {role === r.id && <span style={{ color: 'var(--purple)', fontSize: '1.25rem' }}>✓</span>}
              </button>
            ))}
            <button disabled={!role} onClick={() => setStep(2)} className="btn-primary w-full py-3 mt-4">Continue →</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text)' }}>Your profile</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text3)' }}>Tell people a bit about yourself</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text2)' }}>Bio</label>
                <textarea className="input-field resize-none" rows={3} placeholder="I'm passionate about..." value={bio} onChange={e => setBio(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: 'var(--text2)' }}>City</label>
                <input className="input-field" placeholder="e.g. Prayagraj" value={location} onChange={e => setLocation(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="btn-outline flex-1 py-3">← Back</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1 py-3">Continue →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text)' }}>Your skills</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text3)' }}>What can you teach? What do you want to learn?</p>
            {error && <div className="text-sm rounded-xl px-4 py-3 mb-4" style={{ background: '#FEE2E2', color: '#991B1B' }}>{error}</div>}
            <S label="Skills I can teach" list={offering} set={setOffering} />
            <S label="Skills I want to learn" list={wanting} set={setWanting} />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(2)} className="btn-outline flex-1 py-3">← Back</button>
              <button disabled={loading} onClick={() => completeOnboarding({ bio, location, role, skillsOffered: offering, skillsWanted: wanting })} className="btn-primary flex-1 py-3">
                {loading ? 'Setting up...' : '🎉 Finish Setup'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}