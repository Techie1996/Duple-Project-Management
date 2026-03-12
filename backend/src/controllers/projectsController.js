import Project from '../models/Project.js';
import ProjectMember from '../models/ProjectMember.js';
/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of projects
 */
export async function list(req, res, next) {
  try {
    const userId = req.user.userId;
    const memberships = await ProjectMember.find({ user: userId })
      .populate('project')
      .sort({ updatedAt: -1 });
    const projects = memberships
      .map((m) => (m.project ? { ...m.project.toObject(), role: m.role } : null))
      .filter(Boolean);
    const withCount = await Promise.all(
      projects.map(async (p) => {
        const memberCount = await ProjectMember.countDocuments({ project: p._id });
        return {
          id: p._id,
          _id: p._id,
          name: p.name,
          updatedAt: p.updatedAt,
          memberCount
        };
      })
    );
    res.json({
      success: true,
      data: withCount,
      message: ''
    });
  } catch (err) {
    next(err);
  }
}
/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create new project
 *     tags: [Projects]
 *     responses:
 *       201:
 *         description: Project created
 */
export async function create(req, res, next) {
  try {
    const { name } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Project name is required'
      });
    }
    const project = await Project.create({ name: String(name).trim() });
    await ProjectMember.create({
      project: project._id,
      user: req.user.userId,
      role: 'owner'
    });
    res.status(201).json({
      success: true,
      data: {
        id: project._id,
        _id: project._id,
        name: project.name,
        updatedAt: project.updatedAt,
        memberCount: 1
      },
      message: 'Project created'
    });
  } catch (err) {
    next(err);
  }
}

async function ensureMember(req, res, next) {
  try {
    const membership = await ProjectMember.findOne({
      project: req.params.id,
      user: req.user.userId
    });
    if (!membership) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Project not found'
      });
    }
    req.membership = membership;
    next();
  } catch (err) {
    next(err);
  }
}

export async function getOne(req, res, next) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Project not found'
      });
    }
    const membership = await ProjectMember.findOne({
      project: req.params.id,
      user: req.user.userId
    });
    if (!membership) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Project not found'
      });
    }
    const memberCount = await ProjectMember.countDocuments({ project: project._id });
    res.json({
      success: true,
      data: {
        id: project._id,
        _id: project._id,
        name: project.name,
        updatedAt: project.updatedAt,
        memberCount
      },
      message: ''
    });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Project not found'
      });
    }
    const membership = await ProjectMember.findOne({
      project: req.params.id,
      user: req.user.userId
    });
    if (!membership) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Project not found'
      });
    }
    if (['owner', 'admin'].indexOf(membership.role) === -1) {
      return res.status(403).json({
        success: false,
        data: null,
        message: 'Only owners and admins can update the project'
      });
    }
    const { name } = req.body;
    if (name !== undefined) project.name = String(name).trim();
    await project.save();
    res.json({
      success: true,
      data: {
        id: project._id,
        _id: project._id,
        name: project.name,
        updatedAt: project.updatedAt
      },
      message: 'Project updated'
    });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Project not found'
      });
    }
    const membership = await ProjectMember.findOne({
      project: req.params.id,
      user: req.user.userId
    });
    if (!membership) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Project not found'
      });
    }
    if (membership.role !== 'owner') {
      return res.status(403).json({
        success: false,
        data: null,
        message: 'Only the owner can delete the project'
      });
    }
    await ProjectMember.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(project._id);
    res.json({
      success: true,
      data: null,
      message: 'Project deleted'
    });
  } catch (err) {
    next(err);
  }
}

export { ensureMember };
