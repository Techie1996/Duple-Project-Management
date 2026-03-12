import Board from '../models/Board.js';

export async function list(req, res, next) {
  try {
    const boards = await Board.find({ project: req.params.projectId }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: boards, message: '' });
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { name } = req.body;
    if (!name || !String(name).trim()) {
      return res.status(400).json({ success: false, data: null, message: 'Board name is required' });
    }
    const last = await Board.findOne({ project: req.params.projectId }).sort({ order: -1 });
    const order = (last?.order ?? 0) + 1;
    const board = await Board.create({ project: req.params.projectId, name: String(name).trim(), order });
    res.status(201).json({ success: true, data: board, message: 'Board created' });
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const { name } = req.body;
    const board = await Board.findOne({ _id: req.params.boardId, project: req.params.projectId });
    if (!board) return res.status(404).json({ success: false, data: null, message: 'Board not found' });
    if (name !== undefined) board.name = String(name).trim();
    await board.save();
    res.json({ success: true, data: board, message: 'Board updated' });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const board = await Board.findOneAndDelete({ _id: req.params.boardId, project: req.params.projectId });
    if (!board) return res.status(404).json({ success: false, data: null, message: 'Board not found' });
    res.json({ success: true, data: null, message: 'Board deleted' });
  } catch (err) {
    next(err);
  }
}

export async function reorder(req, res, next) {
  try {
    const { boardIds } = req.body;
    if (!Array.isArray(boardIds)) {
      return res.status(400).json({ success: false, data: null, message: 'boardIds must be an array' });
    }
    const updates = boardIds.map((id, idx) =>
      Board.updateOne({ _id: id, project: req.params.projectId }, { $set: { order: idx } })
    );
    await Promise.all(updates);
    const boards = await Board.find({ project: req.params.projectId }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: boards, message: 'Boards reordered' });
  } catch (err) {
    next(err);
  }
}

