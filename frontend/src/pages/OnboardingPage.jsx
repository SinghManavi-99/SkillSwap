import { useState } from 'react'
import { useOnboarding } from '../hooks/useExplore'

const CATS = ['Technology','Design','Music','Language','Cooking','Fitness','Business','Arts & Crafts','Academic','Other']

const ROLES = [
  { id: 'seeker', icon: '🎓', title: 'Seeker', desc: 'I want to learn new skills' },
  { id: 'sage', icon: '🧠', title: 'Sage', desc: 'I want to teach and mentor' },
  { id: 'catalyst', icon: '⚡', title: 'Catalyst', desc: 'I want to do both!' },
]

export default function OnboardingPage() {
  const { completeOnboarding, loading, error } = useOnboarding()

  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')
  const [offering, setOffering] = useState([{ name: '', category: 'Technology', level: 'intermediate' }])
  const [wanting, setWanting] = useState([{ name: '', category: 'Music', level: 'beginner' }])

  // 🔧 update helpers
  const updSkill = (list, set, i, f, v) => {
    const n = [...list]
    n[i][f] = v
    set(n)
  }

  const addSkill = (list, set) => {
    if (list.some(s => !s.name.trim())) {
      return alert('Fill existing skill first')
    }
    set([...list, { name: '', category: 'Technology', level: 'intermediate' }])
  }

  const remSkill = (list, set, i) => {
    set(list.filter((_, idx) => idx !== i))
  }

  // 🔥 validation
  const isValid = () => {
    if (!role) return alert('Select a role')

    if (!bio.trim()) return alert('Please add a bio')
    if (!location.trim()) return alert('Please add location')

    if (offering.some(s => !s.name.trim()))
      return alert('Fill all teaching skills')

    if (wanting.some(s => !s.name.trim()))
      return alert('Fill all learning skills')

    return true
  }

  const SkillSection = ({ label, list, set }) => (
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-bold">{label}</span>
        <button onClick={() => addSkill(list, set)} className="text-xs text-purple-500">+ Add</button>
      </div>

      {list.map((s, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            className="input-field flex-1"
            placeholder="Skill name"
            value={s.name}
            onChange={e => updSkill(list, set, i, 'name', e.target.value)}
          />

          <select
            className="input-field"
            value={s.category}
            onChange={e => updSkill(list, set, i, 'category', e.target.value)}
          >
            {CATS.map(c => <option key={c}>{c}</option>)}
          </select>

          <select
            className="input-field"
            value={s.level}
            onChange={e => updSkill(list, set, i, 'level', e.target.value)}
          >
            {['beginner','intermediate','expert'].map(l => <option key={l}>{l}</option>)}
          </select>

          {list.length > 1 && (
            <button onClick={() => remSkill(list, set, i)}>×</button>
          )}
        </div>
      ))}
    </div>
  )

  const handleSubmit = async () => {
    if (!isValid()) return

    await completeOnboarding({
      role,
      bio,
      location,
      skillsOffered: offering,
      skillsWanted: wanting
    })

    // 🔥 redirect
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">

      <div className="w-full max-w-lg p-6 border rounded-xl">

        {/* Step Indicator */}
        <div className="flex gap-2 mb-6">
          {[1,2,3].map(s => (
            <div key={s} className={`h-2 flex-1 ${s <= step ? 'bg-purple-500' : 'bg-gray-300'}`} />
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Select your role</h2>

            {ROLES.map(r => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`block w-full p-3 mb-2 border rounded ${role === r.id ? 'bg-purple-100 border-purple-500' : ''}`}
              >
                {r.icon} {r.title}
              </button>
            ))}

            <button
              disabled={!role}
              onClick={() => setStep(2)}
              className="btn-primary w-full mt-4"
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Profile Info</h2>

            <textarea
              className="input-field mb-3"
              placeholder="Your bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
            />

            <input
              className="input-field"
              placeholder="City"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />

            <div className="flex gap-2 mt-4">
              <button onClick={() => setStep(1)}>Back</button>
              <button onClick={() => setStep(3)} className="btn-primary">Next</button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Skills</h2>

            {error && <p className="text-red-500">{error}</p>}

            <SkillSection label="Teach" list={offering} set={setOffering} />
            <SkillSection label="Learn" list={wanting} set={setWanting} />

            <div className="flex gap-2 mt-4">
              <button onClick={() => setStep(2)}>Back</button>
              <button onClick={handleSubmit} className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Finish'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}