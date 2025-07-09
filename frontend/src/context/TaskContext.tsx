import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Task, TaskWithoutId } from '../types/task';
import taskService from '../services/taskService';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  archivedTasks: Task[];
  isLoading: boolean;
  error: string | null;
  addTask: (task: TaskWithoutId) => Promise<void>;
  updateTask: (id: string, task: TaskWithoutId) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  archiveTask: (id: string) => Promise<void>;
  fetchArchivedTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTasks = async () => {
    if (user) {
      try {
        setIsLoading(true);
        const fetchedTasks = await taskService.getTasks();
        setTasks(fetchedTasks);
        setError(null);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to fetch tasks');
      } finally {
        setIsLoading(false);
      }
    } else {
      setTasks([]);
      setArchivedTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const addTask = async (task: TaskWithoutId) => {
    try {
      setIsLoading(true);
      const newTask = await taskService.createTask(task);
      setTasks(prevTasks => [...prevTasks, newTask]);
      setError(null);
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to add task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, task: TaskWithoutId) => {
    try {
      setIsLoading(true);
      const updatedTask = await taskService.updateTask(id, task);
      setTasks(prevTasks =>
        prevTasks.map(t => t._id === id ? updatedTask : t)
      );
      setError(null);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setIsLoading(true);
      await taskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(t => t._id !== id));
      setArchivedTasks(prevTasks => prevTasks.filter(t => t._id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const archiveTask = async (id: string) => {
    try {
      setIsLoading(true);
      const archivedTask = await taskService.archiveTask(id);
      setTasks(prevTasks => prevTasks.filter(t => t._id !== id));
      setArchivedTasks(prevTasks => [...prevTasks, archivedTask]);
      setError(null);
    } catch (err) {
      console.error('Error archiving task:', err);
      setError('Failed to archive task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArchivedTasks = async () => {
    if (user) {
      try {
        setIsLoading(true);
        const fetchedTasks = await taskService.getTasks(true);
        setArchivedTasks(fetchedTasks);
        setError(null);
      } catch (err) {
        console.error('Error fetching archived tasks:', err);
        setError('Failed to fetch archived tasks');
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      archivedTasks,
      isLoading,
      error,
      addTask,
      updateTask,
      deleteTask,
      archiveTask,
      fetchArchivedTasks,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export default TaskProvider;
