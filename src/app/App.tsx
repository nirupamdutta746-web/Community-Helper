import { useState } from 'react';
import { Users, CheckSquare, AlertCircle, Activity } from 'lucide-react';
import VolunteerMap from './components/VolunteerMap';
import TaskCard from './components/TaskCard';
import AssignTaskModal from './components/AssignTaskModal';
import VolunteerList from './components/VolunteerList';
import TaskManagement from './components/TaskManagement';


interface Volunteer {
  id: number;
  name: string;
  role: string;
  status: string;
  position: { x: number; y: number };
  currentTask: string | null;
}

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  location: string;
  estimatedTime: string;
  assignedTo: string | null;
}

export default function App() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Medical Support',
      status: 'active',
      position: { x: 25, y: 30 },
      currentTask: 'Medical Kit Distribution'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Logistics',
      status: 'active',
      position: { x: 60, y: 45 },
      currentTask: null
    },
    {
      id: 3,
      name: 'Emma Williams',
      role: 'Food Distribution',
      status: 'active',
      position: { x: 40, y: 65 },
      currentTask: 'Community Kitchen Setup'
    },
    {
      id: 4,
      name: 'James Rodriguez',
      role: 'Transportation',
      status: 'active',
      position: { x: 75, y: 25 },
      currentTask: null
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      role: 'Community Outreach',
      status: 'active',
      position: { x: 50, y: 50 },
      currentTask: null
    },
    {
      id: 6,
      name: 'David Kumar',
      role: 'Medical Support',
      status: 'active',
      position: { x: 30, y: 75 },
      currentTask: 'Emergency Response'
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Medical Kit Distribution',
      description: 'Distribute medical supplies to shelter residents',
      priority: 'urgent',
      location: 'Downtown Shelter',
      estimatedTime: '2 hours',
      assignedTo: 'Sarah Johnson'
    },
    {
      id: 2,
      title: 'Food Bank Restocking',
      description: 'Urgent restocking needed for weekend distribution',
      priority: 'urgent',
      location: 'Central Food Bank',
      estimatedTime: '3 hours',
      assignedTo: null
    },
    {
      id: 3,
      title: 'Community Kitchen Setup',
      description: 'Set up and prepare community meal service',
      priority: 'high',
      location: 'Community Center',
      estimatedTime: '4 hours',
      assignedTo: 'Emma Williams'
    },
    {
      id: 4,
      title: 'Emergency Response',
      description: 'Medical emergency assistance required',
      priority: 'urgent',
      location: 'Riverside District',
      estimatedTime: '1 hour',
      assignedTo: 'David Kumar'
    },
    {
      id: 5,
      title: 'Supply Transport',
      description: 'Transport donated supplies from warehouse',
      priority: 'high',
      location: 'North Warehouse',
      estimatedTime: '2 hours',
      assignedTo: null
    },
    {
      id: 6,
      title: 'Volunteer Coordination',
      description: 'Organize weekend volunteer schedules',
      priority: 'medium',
      location: 'NGO Office',
      estimatedTime: '1.5 hours',
      assignedTo: null
    }
  ]);

  const handleAssignTask = (volunteer: Volunteer) => {
    if (!selectedTask) return;

    setTasks(tasks.map(task =>
      task.id === selectedTask.id
        ? { ...task, assignedTo: volunteer.name }
        : task
    ));
    setVolunteers(volunteers.map(v =>
      v.id === volunteer.id
        ? { ...v, currentTask: selectedTask.title }
        : v
    ));
    setSelectedTask(null);
  };

  const urgentTasks = tasks.filter(t => t.priority === 'urgent');
  const availableVolunteers = volunteers.filter(v => !v.currentTask);
  const activeVolunteers = volunteers.filter(v => v.status === 'active');

  return (
    <div className="size-full bg-gradient-to-br from-slate-50 to-slate-100 p-6 overflow-auto">
      <div className="max-w-[1800px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">NGO Admin Terminal</h1>
          <p className="text-slate-600">Real-time volunteer coordination and task management</p>
        </div>

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
                <div className="text-sm text-slate-600 mb-1">Total Tasks</div>
                <div className="font-bold text-slate-900">{tasks.length}</div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                Volunteer Locations
              </h2>
              <div className="h-[400px]">
                <VolunteerMap
                  volunteers={volunteers}
                  onVolunteerClick={(volunteer) => console.log('Clicked:', volunteer)}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Urgent Priority Tasks
                </h2>
                <span className="text-sm text-slate-600">{urgentTasks.length} urgent</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {urgentTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onAssign={() => setSelectedTask(task)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h2 className="font-semibold text-slate-900 mb-4">All Tasks</h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onAssign={() => setSelectedTask(task)}
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
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900">{volunteer.name}</div>
                        <div className="text-xs text-slate-500">{volunteer.role}</div>
                      </div>
                    </div>
                    {volunteer.currentTask ? (
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full border border-yellow-200">
                        Busy
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full border border-green-200">
                        Available
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* // Temporary container for TaskManagement and VolunteerList components */}
      <div>
        {/* We pass a function that takes a new task and adds it to the existing list */}
        <TaskManagement
          onAddTask={(newTask: Task) => setTasks(prevTasks => [...prevTasks, newTask])}
        />
        <VolunteerList
          volunteers={volunteers}
          onAddVolunteer={(newVol: Volunteer) => setVolunteers(prev => [...prev, newVol])}
        />
      </div>

      {selectedTask && (
        <AssignTaskModal
          task={selectedTask}
          volunteers={volunteers}
          onAssign={handleAssignTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
