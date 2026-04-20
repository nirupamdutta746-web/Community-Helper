import React, { useState, type ChangeEvent, type FormEvent } from 'react';

// Define the interface to match App.tsx exactly
interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  location: string;
  estimatedTime: string;
  assignedTo: string | null;
}

interface TaskManagementProps {
  onAddTask: (task: Task) => void;
}

const TaskManagement: React.FC<TaskManagementProps> = ({ onAddTask }) => {
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'urgent' | 'high' | 'medium' | 'low',
  });

  const handleTaskChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Construct the full Task object required by App.tsx
    const newTask: Task = {
      id: Date.now(), // Generate a unique ID
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority,
      location: 'Remote / Office', // Default value
      estimatedTime: 'TBD',         // Default value
      assignedTo: null,
    };

    onAddTask(newTask); // Update the state in App.tsx
    alert('Task successfully added to the dashboard!');
    
    // Reset form
    setTaskForm({ title: '', description: '', priority: 'medium' });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <section className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-indigo-600">Add New Task</h2>
        <form onSubmit={handleTaskSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Task Title</label>
            <input
              type="text"
              name="title"
              value={taskForm.title}
              onChange={handleTaskChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Priority</label>
            <select
              name="priority"
              value={taskForm.priority}
              onChange={handleTaskChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea
              name="description"
              value={taskForm.description}
              onChange={handleTaskChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 font-medium"
          >
            Post Task
          </button>
        </form>
      </section>
    </div>
  );
};

export default TaskManagement;