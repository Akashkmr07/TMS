import { useState } from 'react';
import { Search, Circle, Clock, CheckCircle2, Filter, Plus, Archive, Trash2, Edit3 } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import TaskModal from '../components/TaskModal';
import type { Task, TaskWithoutId } from '../types/task';

const AllTasks: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');
  const { tasks, isLoading, error, addTask, updateTask, deleteTask, archiveTask } = useTask();

  const handleAddOrUpdateTask = async (taskData: TaskWithoutId) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, taskData);
        setEditingTask(null);
      } else {
        await addTask(taskData);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error handling task:', err);
    }
  };

  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus;
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
    });

  const tabs = [
    { id: 'all', label: 'All', count: tasks.length },
    { id: 'todo', label: 'To Do', count: tasks.filter(t => t.status === 'todo').length },
    { id: 'in-progress', label: 'In Progress', count: tasks.filter(t => t.status === 'in progress').length },
    { id: 'completed', label: 'Completed', count: tasks.filter(t => t.status === 'completed').length },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'in progress':
        return 'bg-yellow-500/10 text-yellow-500';
      default:
        return 'bg-blue-500/10 text-blue-500';
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500';
      default:
        return 'bg-green-500/10 text-green-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <div className="text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white px-4 py-8 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white">All Tasks</h1>
            <p className="text-gray-300 mt-2 text-sm sm:text-base">Manage and organize all your tasks</p>
          </div>
          <button 
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     flex items-center space-x-2 transition-colors w-full sm:w-auto shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            <span>New Task</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-slate-900 border border-slate-700 rounded-lg 
                       text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       shadow-sm"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          </div>
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority')}
              className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white 
                       hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       shadow-sm"
            >
              <option value="dueDate">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
            </select>
            <button className="flex items-center px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg 
                             text-white hover:bg-slate-800 shadow-sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                       ${selectedStatus === tab.id 
                         ? 'bg-blue-600 text-white shadow-lg' 
                         : 'bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800'}`}
            >
              {tab.label} <span className="ml-1 text-xs opacity-75">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredAndSortedTasks.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/50 rounded-lg border border-slate-800">
              <div className="text-slate-300 text-lg">No tasks found</div>
              <p className="text-slate-400 mt-2">Create a new task to get started!</p>
            </div>
          ) : (
            filteredAndSortedTasks.map((task) => (
              <div key={task._id} 
                   className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 
                            sm:space-x-4 p-6 rounded-xl bg-slate-900/80 border border-slate-800
                            hover:bg-slate-900 transition-all shadow-lg">
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  {getStatusIcon(task.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(task.status)}`}>
                    {task.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-lg sm:text-xl text-white">{task.title}</h2>
                  {task.description && (
                    <p className="text-slate-300 text-sm mt-1">{task.description}</p>
                  )}
                  {task.dueDate && (
                    <p className="text-slate-400 text-sm mt-2">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      setEditingTask(task);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => archiveTask(task._id)}
                    className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="Archive"
                  >
                    <Archive className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this task?')) {
                        deleteTask(task._id);
                      }
                    }}
                    className="p-2 text-slate-300 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleAddOrUpdateTask}
        initialTask={editingTask || undefined}
      />
    </div>
  );
};

export default AllTasks;
