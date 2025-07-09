import React, { useState, useMemo } from 'react';
import { BarChart2, CheckCircle, Clock, Calendar } from 'lucide-react';
import { useTask } from '../context/TaskContext';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { tasks } = useTask();

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const totalTasks = tasks.length;
    const completedThisMonth = completedTasks.filter(task => {
      const completedDate = new Date(task.completedAt || Date.now());
      const now = new Date();
      return completedDate.getMonth() === now.getMonth() &&
             completedDate.getFullYear() === now.getFullYear();
    });

    // Calculate average resolution time for completed tasks
    const avgResolutionTime = completedTasks.length > 0
      ? completedTasks.reduce((acc, task) => {
          const created = new Date(task.createdAt);
          const completed = new Date(task.completedAt || Date.now());
          return acc + (completed.getTime() - created.getTime());
        }, 0) / completedTasks.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0;

    return [
      {
        title: 'Tasks Completed',
        value: completedTasks.length.toString(),
        change: `${((completedTasks.length / (totalTasks || 1)) * 100).toFixed(0)}% completion rate`,
        trend: 'up',
        icon: CheckCircle,
        color: 'text-green-500',
        iconBg: 'bg-green-100'
      },
      {
        title: 'Average Resolution Time',
        value: `${avgResolutionTime.toFixed(1)} days`,
        change: 'Based on completed tasks',
        trend: 'neutral',
        icon: Clock,
        color: 'text-blue-500',
        iconBg: 'bg-blue-100'
      },
      {
        title: 'Tasks This Month',
        value: tasks.filter(task => {
          const createdDate = new Date(task.createdAt);
          const now = new Date();
          return createdDate.getMonth() === now.getMonth() &&
                 createdDate.getFullYear() === now.getFullYear();
        }).length.toString(),
        change: `${completedThisMonth.length} completed this month`,
        trend: 'up',
        icon: Calendar,
        color: 'text-purple-500',
        iconBg: 'bg-purple-100'
      }
    ];
  }, [tasks]);

  // Tab data
  const tabs = [
    { id: 'overview', label: 'Overview' },
   
  ];

  return (
    <div className="flex flex-col p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl sm:text-3xl font-bold">Analytics</h1>
        <p className="text-gray-400 mt-1 text-sm sm:text-base">Track your team's productivity and performance</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-slate-900/50 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                       ${activeTab === tab.id 
                         ? 'bg-blue-600 text-white' 
                         : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className={`text-sm ${stat.trend === 'up' ? 'text-green-400' : stat.trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800">
          <h2 className="text-lg font-semibold mb-6">Task Completion Trend</h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <BarChart2 className="w-12 h-12" />
            <span className="ml-4">Charts coming soon</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
