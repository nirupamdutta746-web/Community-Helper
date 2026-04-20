interface TaskCardProps {
  task: {
    id: number;
    title: string;
    description: string;
    priority: 'urgent' | 'high' | 'medium' | 'low';
    assignedTo: string | null;
    status: 'pending' | 'in-progress' | 'awaiting-review' | 'completed';
    proofUrl?: string;
  };
  onAssign: () => void;
  onReview: () => void;
  onVerify: () => void;
}

export default function TaskCard({ task, onAssign, onReview, onVerify }: TaskCardProps) {
  // 1. Determine the card's border color based on status
  const getBorderColor = () => {
    if (task.status === 'awaiting-review') return 'border-amber-400 bg-amber-50';
    if (task.status === 'completed') return 'border-green-200 bg-slate-50 opacity-75';
    return 'border-slate-200 bg-white';
  };

  return (
    <div className={`p-4 rounded-xl border shadow-sm transition-all ${getBorderColor()}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-slate-900">{task.title}</h3>
        <span className={`text-[10px] uppercase px-2 py-1 rounded-full font-bold ${
          task.priority === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
        }`}>
          {task.priority}
        </span>
      </div>
      
      <p className="text-sm text-slate-600 mb-4">{task.description}</p>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 italic">
            {task.assignedTo ? `👤 Assigned: ${task.assignedTo}` : '⚠️ Unassigned'}
          </span>
          <span className={`font-bold px-2 py-0.5 rounded text-[9px] uppercase ${
            task.status === 'awaiting-review' ? 'bg-amber-200 text-amber-800' : 'bg-slate-100 text-slate-600'
          }`}>
            {task.status || 'pending'}
          </span>
        </div>

        {/* --- DYNAMIC ACTION BUTTONS --- */}
        <div className="pt-2 border-t border-slate-100">
          {task.status === 'awaiting-review' ? (
            <div className="space-y-2">
              <div className="text-[10px] text-amber-700 bg-white p-1 rounded border border-amber-200 truncate">
                <strong>Proof:</strong> {task.proofUrl}
              </div>
              <button 
                onClick={onVerify}
                className="w-full bg-amber-600 text-white text-xs py-1.5 rounded-md hover:bg-amber-700 font-bold transition-colors shadow-sm"
              >
                Verify & Close Task
              </button>
            </div>
          ) : task.assignedTo ? (
            <button 
              onClick={onReview}
              className="w-full bg-emerald-600 text-white text-xs py-1.5 rounded-md hover:bg-emerald-700 transition-colors"
            >
              Submit Work for Review
            </button>
          ) : (
            <button 
              onClick={onAssign}
              className="w-full bg-slate-900 text-white text-xs py-1.5 rounded-md hover:bg-slate-800 transition-colors"
            >
              Assign Volunteer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}