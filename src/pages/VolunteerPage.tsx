import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, doc, updateDoc, getDoc } from "firebase/firestore"; // Added getDoc
import { auth, db } from '../firebase';
import { Clock, Upload } from 'lucide-react';
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

    // 1. Fetch Volunteer's name from the 'users' collection instead of auth profile
    const fetchProfileAndTasks = async () => {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Update local volunteer state for the UI
        setVolunteerData({
          id: userDoc.id,
          name: userData.name || "Volunteer",
          role: userData.role || "volunteer",
          status: userData.status || "active",
          currentTask: userData.currentTask || null,
          position: userData.position || { x: 20, y: 50 }
        } as Volunteer);

        // 2. Fetch Tasks assigned to this specific name found in Firestore
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

          // 3. Check for new Urgent/Pending tasks for notification
          const latestUrgent = taskList.find(t => t.priority === 'urgent' && t.status === 'pending');
          if (latestUrgent) setEmergencyNotification(latestUrgent);
        });
        return unsubTasks;
      }
    };
    fetchProfileAndTasks().then(unsub => {
      if (unsub) return () => unsub();
    });

    // 4. Fetch the volunteer's map data (status, position)
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
  }, []); // Run once on mount

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
        alert("Proof submitted for admin review!");
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
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Volunteer Dashboard</h1>
            <p className="text-slate-600">Welcome back, {volunteerData?.name || 'Volunteer'}</p>
            <button onClick={handleLogout} className="text-sm text-red-600 hover:underline">Logout</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-600 mb-1">Tasks Completed</div>
            <div className="text-2xl font-bold text-slate-900">{completedTasks.length}</div>
          </div>
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-600 mb-1">Active Tasks</div>
            <div className="text-2xl font-bold text-slate-900">{activeTasks.length}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
                        <span className={`px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]}`}>
                          {task.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">{task.description}</p>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${statusColors[task.status]}`}>
                          {task.status.replace('-', ' ')}
                        </span>
                        {task.status === 'in-progress' && (
                          <button
                            onClick={() => setSelectedTask(task)}
                            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2"
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
          </div>
        </div>
      </div>

      {emergencyNotification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full overflow-hidden border-4 border-red-500">
            <div className="p-6">
              <h2 className="font-bold text-xl text-red-600 mb-2">URGENT TASK</h2>
              <h3 className="font-bold text-slate-900">{emergencyNotification.title}</h3>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setEmergencyNotification(null)} className="flex-1 px-4 py-3 bg-slate-100 rounded-lg">Decline</button>
                <button onClick={handleAcceptEmergency} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg">Accept Task</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h2 className="font-semibold text-slate-900 mb-4">Submit Proof of Work</h2>
            <input
              type="text"
              placeholder="Enter image URL or completion notes..."
              className="w-full p-3 border rounded-lg mb-4"
              value={proofLink}
              onChange={(e) => setProofLink(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => setSelectedTask(null)} className="flex-1 px-4 py-3 bg-slate-100 rounded-lg">Cancel</button>
              <button onClick={handleSubmitProof} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}