import { Router } from 'express';
import * as projectsController from '../controllers/projectsController.js';
import { authenticate } from '../middlewares/auth.js';
import { requireProjectMember } from '../middlewares/projectMember.js';
import * as boardsController from '../controllers/boardsController.js';
import * as tasksController from '../controllers/tasksController.js';

const router = Router();

router.use(authenticate);

router.get('/', projectsController.list);
router.post('/', projectsController.create);

// Boards (project-scoped)
router.get('/:projectId/boards', requireProjectMember, boardsController.list);
router.post('/:projectId/boards', requireProjectMember, boardsController.create);
router.patch('/:projectId/boards/reorder', requireProjectMember, boardsController.reorder);
router.patch('/:projectId/boards/:boardId', requireProjectMember, boardsController.update);
router.delete('/:projectId/boards/:boardId', requireProjectMember, boardsController.remove);

// Tasks (project-scoped)
router.get('/:projectId/tasks', requireProjectMember, tasksController.list);
router.post('/:projectId/tasks', requireProjectMember, tasksController.create);
router.patch('/:projectId/tasks/:taskId', requireProjectMember, tasksController.update);
router.patch('/:projectId/tasks/:taskId/status', requireProjectMember, tasksController.updateStatus);
router.delete('/:projectId/tasks/:taskId', requireProjectMember, tasksController.remove);

router.get('/:id', projectsController.getOne);
router.patch('/:id', projectsController.update);
router.delete('/:id', projectsController.remove);

export default router;
