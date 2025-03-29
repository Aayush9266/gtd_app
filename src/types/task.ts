export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskContext = 'work' | 'home' | 'errands' | 'personal';
export type TaskStatus = 'inbox' | 'next' | 'waiting' | 'someday' | 'completed' | 'archived';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  context: TaskContext;
  status: TaskStatus;
  dueDate?: string; // ISO string format
  createdAt: string; // Changed from Date to string
  completedAt?: string; // Changed from Date to string
  tags: string[];
  projectId?: string; // Reference to project
  reminder?: string; // ISO string format for reminder time
}