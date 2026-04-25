import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase'; // Import db
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login attempt started...");
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
            const user = userCredential.user;
            console.log("Auth Success! UID:", user.uid);

            // Fetch the role directly here to decide where to go
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists()) {
                const role = userDoc.data().role;
                console.log("Role found:", role);

                if (role === 'admin') {
                    navigate('/admin');
                } else if (role === 'volunteer') {
                    navigate('/volunteer');
                } else {
                    console.error("Unknown role:", role);
                    navigate('/'); // Fallback
                }
            } else {
                console.error("No user document found in Firestore for this UID.");
                alert("Account authenticated but no profile found. Please contact admin.");
            }
        } catch (error: any) {
            console.error("Login failed:", error.code);
            alert(error.message);
        }
    };

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
            <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md border border-slate-200 w-96">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 text-center">NGO Portal Login</h2>
                <div className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors">
                        Sign In
                    </button>
                </div>
            </form>
        </div>
    );
}