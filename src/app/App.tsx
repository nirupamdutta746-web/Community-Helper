import { useState } from 'react';
import { Users, CheckSquare, AlertCircle, Activity } from 'lucide-react';
import VolunteerMap from './components/VolunteerMap';
import TaskCard from './components/TaskCard';
import AssignTaskModal from './components/AssignTaskModal';
import VolunteerList from './components/VolunteerList';
import TaskManagement from './components/TaskManagement';

export interface Volunteer {
  id: number;
  name: string;
  role: string;
  status: string;
  position: { x: number; y: number };
  currentTask: string | null;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  location: string;
  estimatedTime: string;
  assignedTo: string | null;
  status: 'pending' | 'in-progress' | 'awaiting-review' | 'completed'; // Added for verification
  proofUrl?: string; // Added to store verification link
}

export default function App() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    { id: 1, name: 'Sarah Johnson', role: 'Medical Support', status: 'active', position: { x: 25, y: 30 }, currentTask: 'Medical Kit Distribution' },
    { id: 2, name: 'Michael Chen', role: 'Logistics', status: 'active', position: { x: 60, y: 45 }, currentTask: null },
    { id: 3, name: 'Emma Williams', role: 'Food Distribution', status: 'active', position: { x: 40, y: 65 }, currentTask: 'Community Kitchen Setup' },
    { id: 4, name: 'James Rodriguez', role: 'Transportation', status: 'active', position: { x: 75, y: 25 }, currentTask: null },
    { id: 5, name: 'Lisa Anderson', role: 'Community Outreach', status: 'active', position: { x: 50, y: 50 }, currentTask: null },
    { id: 6, name: 'David Kumar', role: 'Medical Support', status: 'active', position: { x: 30, y: 75 }, currentTask: 'Emergency Response' }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Medical Kit Distribution', description: 'Distribute medical supplies', priority: 'urgent', location: 'Downtown', estimatedTime: '2h', assignedTo: 'Sarah Johnson', status: 'in-progress' },
    { id: 2, title: 'Food Bank Restocking', description: 'Restocking needed', priority: 'urgent', location: 'Central Bank', estimatedTime: '3h', assignedTo: null, status: 'pending' },
    { id: 3, title: 'Community Kitchen Setup', description: 'Prepare meal service', priority: 'high', location: 'Community Center', estimatedTime: '4h', assignedTo: 'Emma Williams', status: 'in-progress' },
    { id: 4, title: 'Emergency Response', description: 'Medical assistance required', priority: 'urgent', location: 'Riverside', estimatedTime: '1h', assignedTo: 'David Kumar', status: 'in-progress' }
  ]);

  const handleAssignTask = (volunteer: Volunteer) => {
    if (!selectedTask) return;
    setTasks(tasks.map(task =>
      task.id === selectedTask.id ? { ...task, assignedTo: volunteer.name, status: 'in-progress' } : task
    ));
    setVolunteers(volunteers.map(v =>
      v.id === volunteer.id ? { ...v, currentTask: selectedTask.title } : v
    ));
    setSelectedTask(null);
  };

  // --- NEW VERIFICATION LOGIC ---
  
  const handleSubmitForReview = (taskId: number) => {
    const proof = prompt("Please enter the URL/Link as proof of work (e.g., photo link or report):");
    if (!proof) return;

    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'awaiting-review', proofUrl: proof } : t
    ));
  };

  const handleVerifyTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // 1. Mark task as completed in the master list
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'completed', assignedTo: null, priority: 'low' } : t
    ));

    // 2. Free up the volunteer so they can take new tasks
    if (task.assignedTo) {
      setVolunteers(prev => prev.map(v => 
        v.name === task.assignedTo ? { ...v, currentTask: null } : v
      ));
    }
    alert(`Task "${task.title}" has been officially verified!`);
  };

  // ------------------------------

  const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed');
  const availableVolunteers = volunteers.filter(v => !v.currentTask);
  const activeVolunteers = volunteers.filter(v => v.status === 'active');

  return (
    <div className="size-full bg-gradient-to-br from-slate-50 to-slate-100 p-6 overflow-auto">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">NGO Admin Terminal</h1>
          <p className="text-slate-600">Real-time volunteer coordination and verification</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Active Volunteers</div>
                <div className="font-bold text-slate-900">{activeVolunteers.length}</div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Available</div>
                <div className="font-bold text-slate-900">{availableVolunteers.length}</div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Urgent Tasks</div>
                <div className="font-bold text-slate-900">{urgentTasks.length}</div>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">In Review</div>
                <div className="font-bold text-slate-900">{tasks.filter(t => t.status === 'awaiting-review').length}</div>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                Live Operational Map
              </h2>
              <div className="h-[400px]">
                <VolunteerMap volunteers={volunteers} onVolunteerClick={() => {}} />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Urgent Priority Tasks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {urgentTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onAssign={() => setSelectedTask(task)}
                    onReview={() => handleSubmitForReview(task.id)}
                    onVerify={() => handleVerifyTask(task.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="font-semibold text-slate-900 mb-4">Task Pipeline</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {tasks.filter(t => t.status !== 'completed').map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onAssign={() => setSelectedTask(task)}
                    onReview={() => handleSubmitForReview(task.id)}
                    onVerify={() => handleVerifyTask(task.id)}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="font-semibold text-slate-900 mb-4">Volunteer Status</h2>
              <div className="space-y-3">
                {volunteers.map(volunteer => (
                  <div key={volunteer.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                        {volunteer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{volunteer.name}</div>
                        <div className="text-[10px] text-slate-500">{volunteer.role}</div>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      volunteer.currentTask ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-green-100 text-green-700 border-green-200'
                    }`}>
                      {volunteer.currentTask ? 'Busy' : 'Available'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <TaskManagement onAddTask={(newTask: Task) => setTasks(prev => [...prev, { ...newTask, status: 'pending' }])} />
          <VolunteerList volunteers={volunteers} onAddVolunteer={(newVol: Volunteer) => setVolunteers(prev => [...prev, newVol])} />
        </div>
      </div>

      {selectedTask && (
        <AssignTaskModal
          task={selectedTask}
          volunteers={volunteers.filter(v => !v.currentTask)}
          onAssign={handleAssignTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}