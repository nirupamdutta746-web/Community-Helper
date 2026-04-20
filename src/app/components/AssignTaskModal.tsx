import { X, User, MapPin } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  location: string;
  estimatedTime: string;
  assignedTo: string | null;
}

interface Volunteer {
  id: number;
  name: string;
  role: string;
  status: string;
  position: { x: number; y: number };
  currentTask: string | null;
}

interface AssignTaskModalProps {
  task: Task | null;
  volunteers: Volunteer[];
  onAssign: (volunteer: Volunteer) => void;
  onClose: () => void;
}

export default function AssignTaskModal({ task, volunteers, onAssign, onClose }: AssignTaskModalProps) {
  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="font-semibold text-slate-900">Assign Task</h2>
            <p className="text-sm text-slate-600 mt-1">{task.title}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="text-sm text-slate-600 mb-2">Task Details</div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-slate-700">{task.location}</span>
              </div>
              <div className="text-slate-400">•</div>
              <div className="text-slate-700">{task.estimatedTime}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium text-slate-700 mb-3">Select Volunteer</div>
            {volunteers.map((volunteer) => (
              <button
                key={volunteer.id}
                onClick={() => onAssign(volunteer)}
                className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-slate-900">{volunteer.name}</div>
                    <div className="text-sm text-slate-500">{volunteer.role}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {volunteer.currentTask ? (
                    <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full border border-yellow-200">
                      Busy
                    </span>
                  ) : (
                    <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full border border-green-200">
                      Available
                    </span>
                  )}
                  <div className="text-sm text-slate-400 group-hover:text-blue-600 transition-colors">
                    Assign →
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
