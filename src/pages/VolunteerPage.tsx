import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from '../firebase';
import { Clock, Upload, ExternalLink, LogOut, MapPin } from 'lucide-react';
import type { Task, Volunteer } from '../app/App';
import { signOut } from 'firebase/auth';

export default function VolunteerDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [volunteerData, setVolunteerData] = useState<Volunteer | null>(null);
  const [emergencyNotification, setEmergencyNotification] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [proofLink, setProofLink] = useState<string>("");

  const handleLogout = async () => {
    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, "volunteers", user.uid), {
        status: "offline"
      });
    }
    await signOut(auth);
  };

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    let unsubTasks: () => void;

    const fetchProfileAndTasks = async () => {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setVolunteerData({
          id: userDoc.id,
          name: userData.name || "Volunteer",
          role: userData.role || "volunteer",
          status: userData.status || "active",
          currentTask: userData.currentTask || null,
          position: userData.position || { x: 20, y: 50 }
        } as Volunteer);

        const q = query(
          collection(db, "tasks"),
          where("assignedToId", "==", currentUser.uid)
        );

        unsubTasks = onSnapshot(q, (snapshot) => {
          const taskList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Task[];

          setTasks(taskList);

          const latestUrgent = taskList.find(t => 
            t.priority === 'urgent' && (t.status === 'pending' || t.status === 'in-progress')
          );
          if (latestUrgent) setEmergencyNotification(latestUrgent);
        });
      }
    };

    const unsubVolMap = onSnapshot(doc(db, "volunteers", currentUser.uid), (doc) => {
      if (doc.exists()) {
        setVolunteerData(prev => ({ ...prev, ...doc.data() } as Volunteer));
      }
    });

    fetchProfileAndTasks();

    return () => {
      unsubVolMap();
      if (unsubTasks) unsubTasks();
    };
  }, []);

  const handleSubmitProof = async () => {
    if (selectedTask && proofLink) {
      const taskRef = doc(db, "tasks", selectedTask.id);
      try {
        await updateDoc(taskRef, {
          status: 'awaiting-review',
          proofUrl: proofLink
        });
        setSelectedTask(null);
        setProofLink("");
      } catch (error) {
        console.error("Error submitting proof:", error);
      }
    }
  };

  const handleAcceptEmergency = async () => {
    if (emergencyNotification) {
      const taskRef = doc(db, "tasks", emergencyNotification.id);
      try {
        await updateDoc(taskRef, { status: 'in-progress' });
        setEmergencyNotification(null);
      } catch (error) {
        console.error("Error accepting task:", error);
      }
    }
  };

  const priorityColors = {
    urgent: 'bg-red-50 border-red-200 text-red-700',
    high: 'bg-orange-50 border-orange-200 text-orange-700',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    low: 'bg-green-50 border-green-200 text-green-700',
  };

  const statusColors = {
    pending: 'bg-slate-100 text-slate-700 border-slate-300',
    'in-progress': 'bg-blue-100 text-blue-700 border-blue-300',
    'awaiting-review': 'bg-amber-100 text-amber-700 border-amber-300',
    completed: 'bg-green-100 text-green-700 border-green-300'
  };

  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="size-full bg-gradient-to-br from-slate-50 to-slate-100 p-6 overflow-auto">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Volunteer Dashboard</h1>
            <p className="text-slate-600">Welcome back, {volunteerData?.name || 'Volunteer'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-600 mb-1">Tasks Completed</div>
            <div className="text-2xl font-bold text-slate-900">{completedTasks.length}</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-600 mb-1">Active Tasks</div>
            <div className="text-2xl font-bold text-slate-900">{activeTasks.length}</div>
          </div>
        </div>

        {/* Main Task Feed */}
        <div className="space-y-6">
          
          {/* Active Tasks Section */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" /> My Active Tasks
            </h2>
            <div className="space-y-3">
              {activeTasks.length === 0 ? (
                <p className="text-slate-500 text-sm italic">No active tasks assigned to you.</p>
              ) : (
                activeTasks.map(task => (
                  <div key={task.id} className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">{task.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority as keyof typeof priorityColors]}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-3">{task.description}</p>

                    {/* Task Metadata: Location and Time */}
                    <div className="flex flex-wrap gap-4 mb-4 text-xs font-medium text-slate-500 bg-white/50 p-2 rounded-md border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <span>Location: {task.location || 'Unspecified'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Estimated Time: {task.estimatedTime || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${statusColors[task.status as keyof typeof statusColors]}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                      {task.status === 'in-progress' && (
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2 shadow-sm"
                        >
                          <Upload className="w-4 h-4" /> Submit Proof
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Task History Section */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" /> Task History
            </h2>
            <div className="space-y-3">
              {completedTasks.length === 0 ? (
                <p className="text-slate-500 text-sm italic">No completed tasks yet.</p>
              ) : (
                completedTasks.map(task => (
                  <div key={task.id} className="bg-green-50/50 rounded-lg border border-green-100 p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{task.title}</h3>
                        <p className="text-xs text-slate-500 mb-2">Completed successfully</p>
                        
                        <p className="text-[10px] text-slate-400 font-medium mb-2 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {task.location || 'General Location'}
                        </p>

                        {task.proofUrl && (
                          <div className="mt-2 p-3 bg-white border border-green-200 rounded-lg text-sm text-slate-700 shadow-sm">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Submitted Proof:</span>
                            {task.proofUrl.startsWith('http') ? (
                              <a href={task.proofUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all flex items-center gap-1">
                                <ExternalLink className="w-3 h-3" /> {task.proofUrl}
                              </a>
                            ) : (
                              <p className="italic text-slate-600">"{task.proofUrl}"</p>
                            )}
                          </div>
                        )}
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 ml-4">
                        DONE
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Notification Modal */}
      {emergencyNotification && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full overflow-hidden border-4 border-red-500 shadow-2xl">
            <div className="p-6">
              <h2 className="font-bold text-2xl text-red-600 mb-2 text-center">URGENT DISPATCH</h2>
              <h3 className="font-bold text-slate-900 text-center text-lg mb-1">{emergencyNotification.title}</h3>
              
              <p className="text-slate-500 text-sm text-center flex items-center justify-center gap-1 mb-4">
                <MapPin className="w-4 h-4" /> {emergencyNotification.location || 'Immediate Area'}
              </p>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setEmergencyNotification(null)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold">Decline</button>
                <button onClick={handleAcceptEmergency} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold shadow-lg">Accept Now</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proof Submission Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl">
            <h2 className="font-semibold text-xl text-slate-900 mb-2">Submit Proof of Work</h2>
            <textarea
              placeholder="Paste link or type completion notes here..."
              className="w-full p-3 border border-slate-200 rounded-lg mb-4 h-32 resize-none outline-none focus:ring-2 focus:ring-blue-500"
              value={proofLink}
              onChange={(e) => setProofLink(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => setSelectedTask(null)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium">Cancel</button>
              <button onClick={handleSubmitProof} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-md">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}