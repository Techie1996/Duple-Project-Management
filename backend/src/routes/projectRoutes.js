
/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management APIs
 */
import { Router } from 'express';
import * as projectsController from '../controllers/projectsController.js';
import { authenticate } from '../middlewares/auth.js';
import { requireProjectMember } from '../middlewares/projectMember.js';
import * as boardsController from '../controllers/boardsController.js';
import * as tasksController from '../controllers/tasksController.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/projects/{projectId}/tasks:
 *   get:
 *     summary: Get tasks for a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/:projectId/tasks', requireProjectMember, tasksController.list);

/**
 * @swagger
 * /api/projects/{projectId}/tasks:
 *   post:
 *     summary: Create a task
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date
 *               assignedTo:
 *                 type: string
 *               boardId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 */
router.post('/:projectId/tasks', requireProjectMember, tasksController.create);

/**
 * @swagger
 * /api/projects/{projectId}/tasks/{taskId}:
 *   patch:
 *     summary: Update a task
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               assignedTo:
 *                 type: string
 *               boardId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated
 */
router.patch('/:projectId/tasks/:taskId', requireProjectMember, tasksController.update);

/**
 * @swagger
 * /api/projects/{projectId}/tasks/{taskId}/status:
 *   patch:
 *     summary: Update a task status (boardId)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - boardId
 *             properties:
 *               boardId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task status updated
 */
router.patch('/:projectId/tasks/:taskId/status', requireProjectMember, tasksController.updateStatus);

/**
 * @swagger
 * /api/projects/{projectId}/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.delete('/:projectId/tasks/:taskId', requireProjectMember, tasksController.remove);

/**
 * @swagger
 * /api/projects/{projectId}/boards:
 *   get:
 *     summary: Get all boards in a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of boards
 */
router.get('/:projectId/boards', requireProjectMember, boardsController.list);

/**
 * @swagger
 * /api/projects/{projectId}/boards:
 *   post:
 *     summary: Create a new board in a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Board created
 */
router.post('/:projectId/boards', requireProjectMember, boardsController.create);

/**
 * @swagger
 * /api/projects/{projectId}/boards/reorder:
 *   patch:
 *     summary: Reorder boards in a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               boardIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Boards reordered successfully
 */
router.patch('/:projectId/boards/reorder', requireProjectMember, boardsController.reorder);

/**
 * @swagger
 * /api/projects/{projectId}/boards/{boardId}:
 *   patch:
 *     summary: Update a board
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: boardId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Board updated
 */
router.patch('/:projectId/boards/:boardId', requireProjectMember, boardsController.update);

/**
 * @swagger
 * /api/projects/{projectId}/boards/{boardId}:
 *   delete:
 *     summary: Delete a board
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: boardId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Board deleted
 */
router.delete('/:projectId/boards/:boardId', requireProjectMember, boardsController.remove);/**
 * @swagger
 * /api/projects/{projectId}/tasks:
 *   get:
 *     summary: Get tasks for a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/:projectId/tasks', requireProjectMember, tasksController.list);

/**
 * @swagger
 * /api/projects/{projectId}/tasks:
 *   post:
 *     summary: Create a task
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *               dueDate:
 *                 type: string
 *                 format: date
 *               assignedTo:
 *                 type: string
 *               boardId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 */
router.post('/:projectId/tasks', requireProjectMember, tasksController.create);

/**
 * @swagger
 * /api/projects/{projectId}/tasks/{taskId}:
 *   patch:
 *     summary: Update a task
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               assignedTo:
 *                 type: string
 *               boardId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated
 */
router.patch('/:projectId/tasks/:taskId', requireProjectMember, tasksController.update);

/**
 * @swagger
 * /api/projects/{projectId}/tasks/{taskId}/status:
 *   patch:
 *     summary: Update a task status (boardId)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - boardId
 *             properties:
 *               boardId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task status updated
 */
router.patch('/:projectId/tasks/:taskId/status', requireProjectMember, tasksController.updateStatus);

/**
 * @swagger
 * /api/projects/{projectId}/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: projectId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: taskId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.delete('/:projectId/tasks/:taskId', requireProjectMember, tasksController.remove);

export default router;
