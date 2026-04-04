import express from 'express'
import { body } from 'express-validator'
import {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
  getCategories,
} from '../controllers/skill.controller.js'
import { protect } from '../middleware/auth.js'
import validate from '../middleware/validate.js'

const router = express.Router()

// ─── GET /api/skills ─────────────────────────────────────────────────
// List/search skills
// Query params: category, level, search (text), page, limit
// Public — no auth needed
router.get('/', getAllSkills)

// ─── GET /api/skills/categories ──────────────────────────────────────
// Returns all available skill categories array
// NOTE: must be before /:id
router.get('/categories', getCategories)

// ─── GET /api/skills/:id ─────────────────────────────────────────────
// Get a single skill by its MongoDB ID
// Public — no auth needed
router.get('/:id', getSkillById)

// ─── POST /api/skills ────────────────────────────────────────────────
// Create a new skill (requires auth)
// Body: { name, description, category, level, tags[] }
router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Skill name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('level')
      .optional()
      .isIn(['beginner', 'intermediate', 'expert'])
      .withMessage('Invalid level — must be beginner, intermediate, or expert'),
    body('description').optional().isLength({ max: 500 }).withMessage('Description max 500 chars'),
    body('tags').optional().isArray().withMessage('Tags must be an array'),
  ],
  validate,
  createSkill
)

// ─── PUT /api/skills/:id ─────────────────────────────────────────────
// Update a skill — only the creator or admin can update
// Body: any of { name, description, category, level, tags }
router.put('/:id', protect, updateSkill)

// ─── DELETE /api/skills/:id ──────────────────────────────────────────
// Delete a skill — only the creator or admin can delete
router.delete('/:id', protect, deleteSkill)

export default router