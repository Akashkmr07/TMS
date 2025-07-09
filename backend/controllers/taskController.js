const Task = require('../models/taskModel');
const mongoose = require('mongoose');

// @desc    Get all tasks for logged in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async(req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.id,
            isArchived: false
        }).sort({ createdAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get archived tasks for logged in user
// @route   GET /api/tasks/archived
// @access  Private
const getArchivedTasks = async(req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.id,
            isArchived: true
        }).sort({ archivedAt: -1 });

        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async(req, res) => {
    try {
        const { title, description, dueDate, priority, status, subtasks } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

        // Create task with user reference
        const task = await Task.create({
            title,
            description,
            dueDate,
            priority,
            status,
            subtasks: subtasks ? subtasks.map(st => ({
                ...st,
                id: new mongoose.Types.ObjectId().toString()
            })) : [],
            user: req.user.id
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async(req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Find task and verify ownership
        const task = await Task.findOne({
            _id: id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update subtasks if provided
        if (updates.subtasks) {
            // Ensure all subtasks have IDs
            updates.subtasks = updates.subtasks.map(st => ({
                ...st,
                id: st.id || new mongoose.Types.ObjectId().toString()
            }));
        }

        // Update task
        const updatedTask = await Task.findByIdAndUpdate(
            id, {...updates }, { new: true, runValidators: true }
        );

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async(req, res) => {
    try {
        const { id } = req.params;

        // Find task and verify ownership
        const task = await Task.findOne({
            _id: id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.deleteOne(); // Changed from remove() to deleteOne()
        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Archive a task
// @route   PUT /api/tasks/:id/archive
// @access  Private
const archiveTask = async(req, res) => {
    try {
        const { id } = req.params;

        // Find task and verify ownership
        const task = await Task.findOne({
            _id: id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.isArchived = true;
        task.archivedAt = new Date();
        await task.save();

        res.status(200).json(task);
    } catch (error) {
        console.error('Archive task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getTasks,
    getArchivedTasks,
    createTask,
    updateTask,
    deleteTask,
    archiveTask
};