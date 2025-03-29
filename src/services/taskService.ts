import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, TaskStatus } from '../types/task';

const TASKS_STORAGE_KEY = '@gtd_tasks';

export const taskService = {
  // Get all tasks
  async getAllTasks(): Promise<Task[]> {
    try {
      const tasksJson = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  },

  // Get tasks by status
  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return tasks.filter(task => task.status === status);
  },

  // Add a new task
  async addTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    try {
      const tasks = await this.getAllTasks();
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      tasks.push(newTask);
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  },

  // Update a task
  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      const tasks = await this.getAllTasks();
      const taskIndex = tasks.findIndex(t => t.id === taskId);
      
      if (taskIndex === -1) return null;

      const updatedTask = {
        ...tasks[taskIndex],
        ...updates,
      };
      
      tasks[taskIndex] = updatedTask;
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  async deleteTask(taskId: string): Promise<boolean> {
    try {
      const tasks = await this.getAllTasks();
      const filteredTasks = tasks.filter(t => t.id !== taskId);
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(filteredTasks));
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Move task to a different status
  async moveTask(taskId: string, newStatus: TaskStatus): Promise<Task | null> {
    return this.updateTask(taskId, { status: newStatus });
  },

  // Complete a task
  async completeTask(taskId: string): Promise<Task | null> {
    return this.updateTask(taskId, {
      status: 'completed',
      completedAt: new Date().toISOString(),
    });
  },

  // Search tasks
  async searchTasks(query: string): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseQuery) ||
      task.description.toLowerCase().includes(lowercaseQuery) ||
      task.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  },

  // Filter tasks by context
  async filterTasksByContext(context: string): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return tasks.filter(task => task.context === context);
  },

  // Get tasks by project
  async getTasksByProject(projectId: string): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return tasks.filter(task => task.projectId === projectId);
  },

  // Get completed/archived tasks
  async getCompletedTasks(): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return tasks.filter(task => task.status === 'completed');
  },
  
  async getArchivedTasks(): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    return tasks.filter(task => task.status === 'archived');
  },
  
  // Archive a completed task
  async archiveTask(taskId: string): Promise<Task | null> {
    return this.updateTask(taskId, { status: 'archived' });
  },
  
  // Assign task to project
  async assignTaskToProject(taskId: string, projectId: string | undefined): Promise<Task | null> {
    return this.updateTask(taskId, { projectId });
  },
  
  // Get tasks for weekly review (tasks updated in the last 7 days)
  async getTasksForWeeklyReview(): Promise<Task[]> {
    const tasks = await this.getAllTasks();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return tasks.filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate >= oneWeekAgo;
    });
  },
};