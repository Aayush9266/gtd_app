import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project } from '../types/project';
import { taskService } from './taskService';

const PROJECTS_STORAGE_KEY = '@gtd_projects';

export const projectService = {
  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    try {
      const projectsJson = await AsyncStorage.getItem(PROJECTS_STORAGE_KEY);
      const projects = projectsJson ? JSON.parse(projectsJson) : [];
      
      // Add task count to each project
      for (const project of projects) {
        const projectTasks = await taskService.getTasksByProject(project.id);
        project.taskCount = projectTasks.length;
      }
      
      return projects;
    } catch (error) {
      console.error('Error getting projects:', error);
      return [];
    }
  },

  // Get a specific project
  async getProjectById(projectId: string): Promise<Project | null> {
    try {
      const projects = await this.getAllProjects();
      const project = projects.find(p => p.id === projectId);
      
      if (project) {
        const projectTasks = await taskService.getTasksByProject(projectId);
        project.taskCount = projectTasks.length;
      }
      
      return project || null;
    } catch (error) {
      console.error('Error getting project by ID:', error);
      return null;
    }
  },

  // Add a new project
  async addProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    try {
      const projects = await this.getAllProjects();
      const newProject: Project = {
        ...project,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      projects.push(newProject);
      await AsyncStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
      return newProject;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  },

  // Update a project
  async updateProject(projectId: string, updates: Partial<Project>): Promise<Project | null> {
    try {
      const projects = await this.getAllProjects();
      const projectIndex = projects.findIndex(p => p.id === projectId);
      
      if (projectIndex === -1) return null;

      const updatedProject = {
        ...projects[projectIndex],
        ...updates,
      };
      
      projects[projectIndex] = updatedProject;
      await AsyncStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
      return updatedProject;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete a project
  async deleteProject(projectId: string): Promise<boolean> {
    try {
      const projects = await this.getAllProjects();
      const filteredProjects = projects.filter(p => p.id !== projectId);
      await AsyncStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(filteredProjects));
      
      // Also remove project association from tasks
      const tasks = await taskService.getAllTasks();
      for (const task of tasks) {
        if (task.projectId === projectId) {
          await taskService.updateTask(task.id, { projectId: undefined });
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },
};
