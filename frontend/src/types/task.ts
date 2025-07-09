export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in progress' | 'completed';
  user: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  isArchived: boolean;
  archivedAt?: string;
  subtasks: SubTask[];
}

export type TaskWithoutId = Omit<Task, '_id' | 'createdAt' | 'updatedAt' | 'isArchived' | 'archivedAt' | 'user'>;

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: TaskWithoutId) => void;
  updateTask: (id: number, task: TaskWithoutId) => void;
  deleteTask: (id: number) => void;
  archiveTask: (id: number) => void;
  unarchiveTask: (id: number) => void;
  getArchivedTasks: () => Task[];
  getActiveTasks: () => Task[];
}
