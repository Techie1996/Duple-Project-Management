import Task from '../models/Task.js';
/**
 * @swagger
 * /api/projects/{projectId}/tasks:
 *   get:
 *     summary: Get tasks for project
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks
 */
export async function list(req, res, next) {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: tasks, message: '' });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { title, description, priority, dueDate, assignedTo, boardId } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ success: false, data: null, message: 'Title is required' });
    }
    const task = await Task.create({
      project: req.params.projectId,
      title: String(title).trim(),
      description: description ?? '',
      priority: (priority ?? 'medium').toLowerCase(),
      dueDate: dueDate ? new Date(dueDate) : undefined,
      assignedTo: assignedTo ?? undefined,
      boardId: boardId ?? 'todo'
    });
    res.status(201).json({ success: true, data: task, message: 'Task created' });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const task = await Task.findOne({ _id: req.params.taskId, project: req.params.projectId });
    if (!task) return res.status(404).json({ success: false, data: null, message: 'Task not found' });

    const { title, description, priority, dueDate, assignedTo, boardId } = req.body;
    if (title !== undefined) task.title = String(title).trim();
    if (description !== undefined) task.description = description ?? '';
    if (priority !== undefined) task.priority = String(priority).toLowerCase();
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : undefined;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || undefined;
    if (boardId !== undefined) task.boardId = boardId;

    await task.save();
    res.json({ success: true, data: task, message: 'Task updated' });
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const { boardId } = req.body;
    if (!boardId) {
      return res.status(400).json({ success: false, data: null, message: 'boardId is required' });
    }
    const task = await Task.findOne({ _id: req.params.taskId, project: req.params.projectId });
    if (!task) return res.status(404).json({ success: false, data: null, message: 'Task not found' });
    task.boardId = boardId;
    await task.save();
    res.json({ success: true, data: task, message: 'Task status updated' });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.taskId, project: req.params.projectId });
    if (!task) return res.status(404).json({ success: false, data: null, message: 'Task not found' });
    res.json({ success: true, data: null, message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
}

