import { Clock, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  location: string;
  estimatedTime: string;
  assignedTo: string | null;
}

interface TaskCardProps {
  task: Task;
  onAssign: (task: Task) => void;
}

export default function TaskCard({ task, onAssign }: TaskCardProps) {
  const priorityColors = {
    urgent: 'bg-red-50 border-red-200 text-red-700',
    high: 'bg-orange-50 border-orange-200 text-orange-700',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    low: 'bg-green-50 border-green-200 text-green-700'
  };

  const priorityIcons = {
    urgent: <AlertCircle className="w-4 h-4" />,
    high: <AlertCircle className="w-4 h-4" />,
    medium: <Clock className="w-4 h-4" />,
    low: <CheckCircle2 className="w-4 h-4" />
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all hover:shadow-md p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 mb-1">{task.title}</h3>
          <p className="text-sm text-slate-600">{task.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]} flex items-center gap-1 whitespace-nowrap`}>
          {priorityIcons[task.priority]}
          {task.priority.toUpperCase()}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          <span>{task.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{task.estimatedTime}</span>
        </div>
      </div>

      {task.assignedTo ? (
        <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
          <span className="text-sm text-blue-700">Assigned to: <span className="font-medium">{task.assignedTo}</span></span>
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
        </div>
      ) : (
        <button
          onClick={() => onAssign(task)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          Assign Volunteer
        </button>
      )}
    </div>
  );
}
