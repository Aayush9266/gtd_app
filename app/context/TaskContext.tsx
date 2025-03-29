import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskStatus } from '../../src/types/task';
import taskService from '../../src/services/taskService';

// Define the shape of our context
interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refreshTasks: () => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<Task>;
  updateTask: (task: Partial<Task>) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  moveTask: (id: string, newStatus: TaskStatus) => Promise<void>;
}

// Create the context with a default value
const TaskContext = createContext<TaskContextType>({
  tasks: [],
  loading: false,
  error: null,
  refreshTasks: async () => {},
  addTask: async () => ({ id: '', title: '', status: 'inbox', priority: 'medium', createdAt: '', updatedAt: '' }),
  updateTask: async () => null,
  deleteTask: async () => {},
  completeTask: async () => {},
  moveTask: async () => {},
});

// Hook to use the task context
export const useTaskContext = () => useContext(TaskContext);

// Provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks when the provider mounts
  useEffect(() => {
    refreshTasks();
  }, []);

  // Refresh tasks from the service
  const refreshTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const allTasks = await taskService.getAllTasks();
      setTasks(allTasks);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new task
  const addTask = async (task: Partial<Task>): Promise<Task> => {
    try {
      setError(null);
      const newTask = await taskService.addTask(task);
      setTasks(prevTasks => [...prevTasks, newTask]);
      return newTask;
    } catch (err) {
      setError('Failed to add task');
      console.error('Error adding task:', err);
      throw err;
    }
  };

  // Update an existing task
  const updateTask = async (task: Partial<Task>): Promise<Task | null> => {
    try {
      setError(null);
      const updatedTask = await taskService.updateTask(task);
      if (updatedTask) {
        setTasks(prevTasks => 
          prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t)
        );
      }
      return updatedTask;
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
      throw err;
    }
  };

  // Delete a task
  const deleteTask = async (id: string): Promise<void> => {
    try {
      setError(null);
      await taskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  // Mark a task as complete
  const completeTask = async (id: string): Promise<void> => {
    try {
      setError(null);
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;

      const updatedTask = await taskService.updateTask({
        ...taskToUpdate,
        status: 'completed',
        completedAt: new Date().toISOString()
      });

      if (updatedTask) {
        setTasks(prevTasks => 
          prevTasks.map(t => t.id === id ? updatedTask : t)
        );
      }
    } catch (err) {
      setError('Failed to complete task');
      console.error('Error completing task:', err);
      throw err;
    }
  };

  // Move a task to a different status
  const moveTask = async (id: string, newStatus: TaskStatus): Promise<void> => {
    try {
      setError(null);
      const taskToMove = tasks.find(task => task.id === id);
      if (!taskToMove) return;

      const updatedTask = await taskService.updateTask({
        ...taskToMove,
        status: newStatus
      });

      if (updatedTask) {
        setTasks(prevTasks => 
          prevTasks.map(t => t.id === id ? updatedTask : t)
        );
      }
    } catch (err) {
      setError('Failed to move task');
      console.error('Error moving task:', err);
      throw err;
    }
  };

  // Provide the context value
  const contextValue: TaskContextType = {
    tasks,
    loading,
    error,
    refreshTasks,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    moveTask,
  };

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;