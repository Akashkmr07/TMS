const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
});

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    dueDate: Date,
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['todo', 'in progress', 'completed'],
        default: 'todo'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subtasks: [subtaskSchema],
    isArchived: {
        type: Boolean,
        default: false
    },
    archivedAt: Date
}, {
    timestamps: true
});

// Add index for better query performance
taskSchema.index({ user: 1, isArchived: 1 });

module.exports = mongoose.model('Task', taskSchema);