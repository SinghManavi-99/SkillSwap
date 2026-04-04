import Skill, { SKILL_CATEGORIES } from '../models/Skill.js'
import { sendSuccess, sendError } from '../utils/response.js'

export const getAllSkills = async (req, res, next) => {
  try {
    const { category, level, search, page = 1, limit = 12 } = req.query
    const query = {}
    if (category) query.category = category
    if (level)    query.level    = level
    if (search)   query.$text    = { $search: search }
    const skills = await Skill.find(query).populate('createdBy', 'name avatar')
      .sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit))
    const total = await Skill.countDocuments(query)
    sendSuccess(res, 'Skills fetched', { skills, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } })
  } catch (err) { next(err) }
}

export const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('createdBy', 'name avatar')
    if (!skill) return sendError(res, 'Skill not found', 404)
    sendSuccess(res, 'Skill fetched', skill)
  } catch (err) { next(err) }
}

export const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create({ ...req.body, createdBy: req.user._id })
    sendSuccess(res, 'Skill created', skill, 201)
  } catch (err) { next(err) }
}

export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id)
    if (!skill) return sendError(res, 'Skill not found', 404)
    if (!skill.createdBy.equals(req.user._id) && req.user.role !== 'admin') return sendError(res, 'Not authorized', 403)
    Object.assign(skill, req.body)
    await skill.save()
    sendSuccess(res, 'Skill updated', skill)
  } catch (err) { next(err) }
}

export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id)
    if (!skill) return sendError(res, 'Skill not found', 404)
    if (!skill.createdBy.equals(req.user._id) && req.user.role !== 'admin') return sendError(res, 'Not authorized', 403)
    await skill.deleteOne()
    sendSuccess(res, 'Skill deleted')
  } catch (err) { next(err) }
}

export const getCategories = (req, res) => sendSuccess(res, 'Categories', SKILL_CATEGORIES)