import ProjectMember from '../models/ProjectMember.js';

export async function requireProjectMember(req, res, next) {
  try {
    const projectId = req.params.projectId;
    const membership = await ProjectMember.findOne({
      project: projectId,
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

