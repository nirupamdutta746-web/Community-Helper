// Define the base URL for your Express server
// In development, this usually points to http://localhost:5000 or similar
const API_BASE_URL = ' http://localhost:5173';

export interface Task {
  id?: number;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status?: string;
}

export interface Volunteer {
  id?: number;
  name: string;
  email: string;
  skills: string;
  status?: string;
}

/**
 * Task Services
 */
export const taskService = {
  // Fetch all tasks
  getTasks: async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  // Create a new task
  createTask: async (taskData: Task): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  // Assign a volunteer to a task
  assignTask: async (taskId: number, volunteerId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tasks/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, volunteerId }),
    });
    if (!response.ok) throw new Error('Failed to assign task');
  },
};

/**
 * Volunteer Services
 */
export const volunteerService = {
  // Fetch all volunteers
  getVolunteers: async (): Promise<Volunteer[]> => {
    const response = await fetch(`${API_BASE_URL}/volunteers`);
    if (!response.ok) throw new Error('Failed to fetch volunteers');
    return response.json();
  },

  // Register a new volunteer
  registerVolunteer: async (volunteerData: Volunteer): Promise<Volunteer> => {
    const response = await fetch(`${API_BASE_URL}/volunteers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(volunteerData),
    });
    if (!response.ok) throw new Error('Failed to register volunteer');
    return response.json();
  },
};