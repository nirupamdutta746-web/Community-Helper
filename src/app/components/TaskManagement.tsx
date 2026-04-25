import { useState } from 'react';
import type { Task } from '../App';

interface TaskManagementProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id'>) => void; // Callback to save to Firebase
}

export default function TaskManagement({ tasks, onAddTask }: TaskManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    location: '',
    priority: 'medium' as Task['priority'],
    description: '',
    estimatedTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      ...newTask,
      status: 'pending',
      assignedTo: null
    });
    setNewTask({ title: '', location: '', priority: 'medium', description: '', estimatedTime: '' });
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900">Task Management Registry</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Create Task'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Task Title"
            className="p-2 border rounded"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            required
          />
          <input
            placeholder="Location"
            className="p-2 border rounded"
            value={newTask.location}
            onChange={(e) => setNewTask({...newTask, location: e.target.value})}
            required
          />
          <select 
            className="p-2 border rounded"
            value={newTask.priority}
            onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
            <option value="urgent">Urgent</option>
          </select>
          <input
            placeholder="Estimated Time (e.g. 2 hours)"
            className="p-2 border rounded"
            value={newTask.estimatedTime}
            onChange={(e) => setNewTask({...newTask, estimatedTime: e.target.value})}
          />
          <textarea
            placeholder="Task Description"
            className="p-2 border rounded md:col-span-2"
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
          />
          <button type="submit" className="md:col-span-2 bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">
            Save Task to Registry
          </button>
        </form>
      )}

      {/* Existing Table Code */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Task Title</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Location</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Priority</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 text-sm font-medium text-slate-900">{task.title}</td>
                <td className="py-3 px-4 text-sm text-slate-600">{task.location}</td>
                <td className="py-3 px-4">
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md ${
                    task.priority === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {task.priority}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs text-slate-500 capitalize">{task.status.replace('-', ' ')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}