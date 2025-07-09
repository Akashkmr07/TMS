const express = require('express');
const router = express.Router();
const {
    getTasks,
    getArchivedTasks,
    createTask,
    updateTask,
    deleteTask,
    archiveTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Task routes
router.route('/')
    .get(getTasks)
    .post(createTask);

router.route('/archived')
    .get(getArchivedTasks);

router.route('/:id')
    .put(updateTask)
    .delete(deleteTask);

router.route('/:id/archive')
    .put(archiveTask);

module.exports = router;