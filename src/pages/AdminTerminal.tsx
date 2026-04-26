// src/pages/AdminTerminal.tsx
import { useEffect, useState } from 'react';
import { collection, onSnapshot, updateDoc, doc, addDoc } from "firebase/firestore";
import { db } from '../firebase';
import { Users, CheckSquare, AlertCircle, Activity } from 'lucide-react';
import VolunteerMap from '../app/components/VolunteerMap';
import TaskCard from '../app/components/TaskCard';
import AssignTaskModal from '../app/components/AssignTaskModal';
import VolunteerList from '../app/components/VolunteerList';
import TaskManagement from '../app/components/TaskManagement';
import type { Volunteer, Task } from '../app/App';
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase';

export default function AdminTerminal() {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Listen to Tasks
        const unsubTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
            const taskData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Task[];
            setTasks(taskData);
        });

        // 2. Listen to Volunteers with "Position Safety"
        const unsubVols = onSnapshot(collection(db, "volunteers"), (snapshot) => {
            const volList = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    // SAFETY: Fallback position prevents the 'x' undefined error
                    position: data.position || { x: 50, y: 50 }
                } as Volunteer;
            });
            setVolunteers(volList);
            setLoading(false); // Data is ready, stop loading
        }, (error) => {
            console.error("Firestore error:", error);
            setLoading(false);
        });

        return () => {
            unsubTasks();
            unsubVols();
        };
    }, []);

    const handleAssignTask = async (volunteer: Volunteer) => {
        if (!selectedTask) return;

        try {
            const taskRef = doc(db, "tasks", selectedTask.id);
            const volRef = doc(db, "volunteers", volunteer.id);
            const userProfileRef = doc(db, "users", volunteer.id); // The Volunteer's profile

            await updateDoc(taskRef, {
                assignedTo: volunteer.name,
                assignedToId: volunteer.id, // 👈 ADD THIS
                status: 'in-progress'
            });
            await updateDoc(volRef, {
                currentTask: selectedTask.title,
                status: 'busy' // Ensure status is set to 'busy'
            });
            await updateDoc(userProfileRef, {
                currentTask: selectedTask.title
            });
            setSelectedTask(null);
        } catch (error) {
            console.error("Error assigning task:", error);
        }
    };

    const handleVerifyTask = async (taskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        const taskRef = doc(db, "tasks", taskId);
        const volunteer = volunteers.find(v => v.name === task.assignedTo);

        try {
            await updateDoc(taskRef, { status: 'completed', 
                assignedTo: null, 
                priority: 'low' });
            if (volunteer) {
                await updateDoc(doc(db, "volunteers", volunteer.id),
                 { currentTask: null , status: 'active' });
            }
            await updateDoc(doc(db, "users", volunteer.id), { 
                currentTask: null,
                status: 'active' 
            });  
            alert(`Task verified! Volunteer is now available.`);
        } catch (error) {
            console.error("Error verifying task:", error);
        }
    };

    const handleSubmitForReview = async (taskId: string) => {
        const proof = prompt("Enter proof link:");
        if (!proof) return;
        try {
            await updateDoc(doc(db, "tasks", taskId), { status: 'awaiting-review', proofUrl: proof });
        } catch (error) {
            console.error(error);
        }
    };

    const urgentTasks = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed');
    const availableVolunteers = volunteers.filter(v => !v.currentTask);
    const activeVolunteers = volunteers.filter(v => v.status?.toLowerCase() === 'active' || v.status?.toLowerCase() === 'available');

    const handleLogout = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                await updateDoc(doc(db, "volunteers", user.uid), {
                    status: "offline"
                });
            }
            await signOut(auth);
            navigate('/login'); // Redirect to login after signing out
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };
    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    return (
        <div className="size-full bg-gradient-to-br from-slate-50 to-slate-100 p-6 overflow-auto">
            <div className="max-w-[1800px] mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">NGO Admin Terminal</h1>
                    <p className="text-slate-600">Real-time volunteer coordination and verification</p>
                    {/* Logout Button */}
                    <div className='text-right'>
                        <button
                            onClick={handleLogout}
                            className="bg-white text-red-600 border border-red-200 px-6 py-2 rounded-lg font-bold hover:bg-red-50 transition-all"
                        >
                            Logout
                        </button>
                    </div>

                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <StatCard label="Active" value={activeVolunteers.length} icon={<Users className="text-blue-600" />} bg="bg-blue-100" />
                    <StatCard label="Available" value={availableVolunteers.length} icon={<Activity className="text-green-600" />} bg="bg-green-100" />
                    <StatCard label="Urgent" value={urgentTasks.length} icon={<AlertCircle className="text-red-600" />} bg="bg-red-100" />
                    <StatCard label="In Review" value={tasks.filter(t => t.status === 'awaiting-review').length} icon={<CheckSquare className="text-amber-600" />} bg="bg-amber-100" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">Live Map</h2>
                            <div className="h-[400px]">
                                <VolunteerMap
                                    volunteers={volunteers}
                                    onVolunteerClick={(volunteer: Volunteer) => {
                                        console.log("Selected volunteer:", volunteer.name);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                            <h2 className="font-semibold text-slate-900 mb-4">Urgent Tasks</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {urgentTasks.map(task => (
                                    <TaskCard key={task.id} task={task} onAssign={() => setSelectedTask(task)} onReview={() => handleSubmitForReview(task.id)} onVerify={() => handleVerifyTask(task.id)} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                            <h2 className="font-semibold text-slate-900 mb-4">Task Pipeline</h2>
                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                {tasks.filter(t => t.status !== 'completed').map(task => (
                                    <TaskCard key={task.id} task={task} onAssign={() => setSelectedTask(task)} onReview={() => handleSubmitForReview(task.id)} onVerify={() => handleVerifyTask(task.id)} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* BOTTOM MANAGEMENT SECTION */}
                <div className="mt-10 space-y-10">
                    {/* TASK MANAGEMENT BLOCK */}
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <TaskManagement
                            tasks={tasks} // Provides the live list of tasks
                            onAddTask={async (taskData) => {
                                try {
                                    // Saves the new task data directly to Firestore
                                    await addDoc(collection(db, "tasks"), {
                                        ...taskData,
                                        createdAt: new Date().toISOString()
                                    });
                                } catch (error) {
                                    console.error("Error adding task:", error);
                                }
                            }}
                        />
                    </div>

                    <VolunteerList
                        volunteers={volunteers}
                        onAddVolunteer={async (newVol: Volunteer) => {
                            try {
                                const { id, ...data } = newVol as any;
                                await addDoc(collection(db, "volunteers"), data);
                            } catch (error) {
                                console.error("Error adding volunteer:", error);
                            }
                        }}
                    />
                </div>
            </div>

            {selectedTask && (
                <AssignTaskModal
                    task={selectedTask}
                    volunteers={availableVolunteers}
                    onAssign={handleAssignTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}
        </div>
    );
}

function StatCard({ label, value, icon, bg }: any) {
    return (
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm text-slate-600 mb-1">{label}</div>
                    <div className="font-bold text-slate-900">{value}</div>
                </div>
                <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>{icon}</div>
            </div>
        </div>
    );
}