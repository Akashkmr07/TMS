import React, { useState, useEffect } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import type { Task } from '../types/task';

const Archive = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  
  const { archivedTasks, isLoading, error, fetchArchivedTasks, deleteTask } = useTask();
  
  useEffect(() => {
    fetchArchivedTasks();
  }, []);

  const stats = [
    { 
      value: archivedTasks.filter(t => t.status === 'completed').length.toString(), 
      label: 'Completed Tasks', 
      color: 'text-green-500' 
    },
    { 
      value: archivedTasks.filter(t => t.status !== 'completed').length.toString(), 
      label: 'Other Tasks', 
      color: 'text-blue-500' 
    },
    { 
      value: archivedTasks.length.toString(), 
      label: 'Total Archived', 
      color: 'text-purple-500' 
    },
  ];

  const filteredTasks = archivedTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'All Status' || task.status === selectedStatus.toLowerCase();
    const matchesPriority = selectedPriority === 'All Priorities' || 
                           task.priority === selectedPriority.toLowerCase();
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleDelete = async (taskId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this task?')) {
      try {
        await deleteTask(taskId);
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Archive</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search archived tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option>All Status</option>
          <option>Todo</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option>All Priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task: Task) => (
          <div key={task._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                <p className="text-gray-600 mb-2">{task.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${
                  task.status === 'completed' ? 'bg-green-100 text-green-800' :
                  task.status === 'in progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDelete(task._id)}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No archived tasks found.
        </div>
      )}
    </div>
  );
};

export default Archive;
