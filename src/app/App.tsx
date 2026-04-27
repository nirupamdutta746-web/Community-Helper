import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import AdminTerminal from '../pages/AdminTerminal';
import LoginPage from '../pages/LoginPage';
import VolunteerPage from '../pages/VolunteerPage';

export interface Volunteer {
  id: string;
  name: string;
  role: string;
  status: string;
  position: { x: number; y: number };
  currentTask: string | null;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  location: string;
  timeRequired: string;
  estimatedTime: string;
  assignedTo: string | null;
  status: 'pending' | 'in-progress' | 'awaiting-review' | 'completed';
  proofUrl?: string;
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Fetch the role from the 'users' collection in Firestore
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
        setUser(currentUser);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 font-medium">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Admin Route */}
        <Route
          path="/admin"
          element={user && role === 'admin' ? <AdminTerminal /> : <Navigate to="/login" />}
        />

        {/* Protected Volunteer Route */}
        <Route path="/volunteer" element={
          role === 'volunteer' ? <VolunteerPage /> : <Navigate to="/login" />
        } />

        {/* Catch-all redirect */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}