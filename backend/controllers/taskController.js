const Task = require('../models/taskModel');
const mongoose = require('mongoose');


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


const createTask = async(req, res) => {
    try {
        const { title, description, dueDate, priority, status, subtasks } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }

     
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


const updateTask = async(req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        
        const task = await Task.findOne({
            _id: id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (updates.subtasks) {
           
            updates.subtasks = updates.subtasks.map(st => ({
                ...st,
                id: st.id || new mongoose.Types.ObjectId().toString()
            }));
        }

      
        const updatedTask = await Task.findByIdAndUpdate(
            id, {...updates }, { new: true, runValidators: true }
        );

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const deleteTask = async(req, res) => {
    try {
        const { id } = req.params;

       
        const task = await Task.findOne({
            _id: id,
            user: req.user.id
        });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.deleteOne(); 
        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


const archiveTask = async(req, res) => {
    try {
        const { id } = req.params;

        
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
