import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { db } from '../../firebase';
// 1. Import the Firestore functions
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface TaskManagementProps {
  // We keep this for backward compatibility, but we won't need it 
  // to update the UI since the onSnapshot listener handles that.
  onAddTask?: (task: any) => void;
}

const TaskManagement: React.FC<TaskManagementProps> = () => {
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'urgent' | 'high' | 'medium' | 'low',
  });

  const handleTaskChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTaskSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // 2. Write directly to the "tasks" collection in Firebase
      await addDoc(collection(db, "tasks"), {
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority,
        location: 'Remote / Office',
        estimatedTime: 'TBD',
        assignedTo: null,
        status: 'pending',
        // Using serverTimestamp ensures consistent timing across all users
        createdAt: serverTimestamp() 
      });

      // 3. Reset form and notify user
      setTaskForm({ title: '', description: '', priority: 'medium' });
      alert('Task successfully posted to the cloud!');
      
    } catch (error) {
      console.error("Error adding task to Firebase:", error);
      alert('Failed to post task. Check your internet or Firebase rules.');
    }
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
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Priority</label>
            <select
              name="priority"
              value={taskForm.priority}
              onChange={handleTaskChange}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
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
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm p-2 border focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 font-medium transition-colors shadow-sm"
          >
            Post Task to Dashboard
          </button>
        </form>
      </section>
    </div>
  );
};

export default TaskManagement;