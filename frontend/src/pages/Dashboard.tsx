import { useState } from 'react';
import { BarChart2, CheckCircle2, Clock, AlertCircle, MoreVertical, Plus } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import TaskModal from '../components/TaskModal';
import type { Task, TaskWithoutId } from '../types/task';

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { tasks, isLoading, error, addTask, updateTask } = useTask();
  const { user } = useAuth();
  const { theme } = useTheme();

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
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

  const stats = [
    {
      title: "Total Tasks",
      value: tasks.length,
      icon: <BarChart2 className="w-6 h-6 text-blue-500" />,
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-500'
    },
    {
      title: "Completed",
      value: tasks.filter(t => t.status === 'completed').length,
      icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-500'
    },
    {
      title: "In Progress",
      value: tasks.filter(t => t.status === 'in progress').length,
      icon: <Clock className="w-6 h-6 text-yellow-500" />,
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-500'
    },
    {
      title: "To Do",
      value: tasks.filter(t => t.status === 'todo').length,
      icon: <AlertCircle className="w-6 h-6 text-purple-500" />,
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-500'
    }
  ];

  const handleTaskAction = async (taskData: TaskWithoutId) => {
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

  
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  
  const tasksdueSoon = tasks
    .filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      const now = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(now.getDate() + 7);
      return dueDate >= now && dueDate <= sevenDaysFromNow;
    })
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
    .slice(0, 5);

  return (
    <div className="w-full min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold">Dashboard</h1>
            <p className={`mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-gray-700'}`}>
              Welcome back, {user.name}
            </p>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                     flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Task</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div key={index} 
                 className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white shadow-lg'} 
                           border transition-all duration-200`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                    {stat.title}
                  </p>
                  <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white shadow-lg'} border`}>
            <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task._id} 
                     className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'} 
                               border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`font-medium ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                        {task.title}
                      </h3>
                      <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Created {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in progress' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        
          <div className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-white shadow-lg'} border`}>
            <h2 className="text-xl font-semibold mb-4">Due Soon</h2>
            <div className="space-y-4">
              {tasksdueSoon.length > 0 ? (
                tasksdueSoon.map((task) => (
                  <div key={task._id} 
                       className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-gray-50'} 
                                 border ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{task.title}</h3>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          Due {new Date(task.dueDate!).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  No tasks due in the next 7 days
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSubmit={handleTaskAction}
          task={editingTask}
        />
      )}
    </div>
  );
};

export default Dashboard;
