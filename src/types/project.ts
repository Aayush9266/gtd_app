export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string; // Changed from Date to string
  taskCount?: number;
}
