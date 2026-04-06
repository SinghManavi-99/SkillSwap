import { useState, useEffect } from 'react'
import { updateUserSkills, getMyProfile } from '../api/user.api'

const CATEGORIES = ['Technology','Design','Music','Language','Cooking','Fitness','Business','Academic','Other']

export default function SkillsPage() {
  const [offered, setOffered] = useState([])
  const [wanted, setWanted] = useState([])
  const [loading, setLoading] = useState(true)

  // 🔥 Fetch existing skills
  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile()
      setOffered(data.skillsOffered || [])
      setWanted(data.skillsWanted || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 🔧 Helpers
  const updateSkill = (list, set, i, field, value) => {
    const newList = [...list]
    newList[i][field] = value
    set(newList)
  }

  const addSkill = (list, set) => {
    set([...list, { name: '', category: 'Technology', level: 'beginner' }])
  }

  const removeSkill = (list, set, i) => {
    set(list.filter((_, idx) => idx !== i))
  }

  // 🔥 Save
  const handleSave = async () => {
    if (offered.some(s => !s.name.trim()) || wanted.some(s => !s.name.trim())) {
      return alert('Fill all skills properly')
    }

    try {
      await updateUserSkills({
        skillsOffered: offered,
        skillsWanted: wanted
      })

      alert('Skills updated successfully 🚀')
    } catch (err) {
      console.error(err)
      alert('Error updating skills')
    }
  }

  if (loading) return <p className="p-6">Loading...</p>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Your Skills</h1>

      {/* Offered */}
      <Section
        title="Skills You Offer"
        list={offered}
        set={setOffered}
        updateSkill={updateSkill}
        addSkill={addSkill}
        removeSkill={removeSkill}
      />

      {/* Wanted */}
      <Section
        title="Skills You Want"
        list={wanted}
        set={setWanted}
        updateSkill={updateSkill}
        addSkill={addSkill}
        removeSkill={removeSkill}
      />

      <button
        onClick={handleSave}
        className="mt-6 bg-purple-600 text-white px-6 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  )
}

// 🔥 Reusable section
function Section({ title, list, set, updateSkill, addSkill, removeSkill }) {
  return (
    <div className="mb-6">
      <h2 className="font-semibold mb-2">{title}</h2>

      {list.map((s, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input
            className="border p-2 flex-1"
            placeholder="Skill name"
            value={s.name}
            onChange={e => updateSkill(list, set, i, 'name', e.target.value)}
          />

          <select
            className="border p-2"
            value={s.category}
            onChange={e => updateSkill(list, set, i, 'category', e.target.value)}
          >
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          <select
            className="border p-2"
            value={s.level}
            onChange={e => updateSkill(list, set, i, 'level', e.target.value)}
          >
            {['beginner','intermediate','expert'].map(l => (
              <option key={l}>{l}</option>
            ))}
          </select>

          {list.length > 1 && (
            <button onClick={() => removeSkill(list, set, i)}>❌</button>
          )}
        </div>
      ))}

      <button
        onClick={() => addSkill(list, set)}
        className="text-blue-500 text-sm"
      >
        + Add Skill
      </button>
    </div>
  )
}