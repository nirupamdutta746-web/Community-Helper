# Community Helper 🤝
Community Helper is a robust, terminal-inspired dashboard designed to streamline NGO operations. By providing a centralized interface, it simplifies the management of volunteer databases and high-priority emergency tasks, ensuring community aid is coordinated with precision and speed.

## ✨ Key Features
- **Terminal-Centric Dashboard**: A clean, high-efficiency UI for rapid data oversight and management.
- **Volunteer Registry**: A comprehensive database tracking the total number of registered volunteers and their real-time availability.
- **Dynamic Task Dispatch**: Advanced task creation including specific location details and estimated time requirements.
- **Proof of Work Verification**: Seamless submission and review process for task completion with supporting links/evidence.
- **Secure Infrastructure**: Integrated with Firebase for real-time data syncing and secure user authentication.

## 🛣️ Future Prospects & Roadmap
We are actively working to evolve Community Helper into a full-scale coordination suite:
- **Volunteer Honor System**: A points-based gamification engine tracking completion rates and reliability.
- **Volunteer Leaderboard**: A competitive ranking system to recognize top contributors through "Honor Points."
- **Real-Time Volunteer Mapping**: A live geospatial system tracking active volunteers for optimized task delegation.
- **Offline Mode**: Local caching for areas with limited connectivity.

## 🛠️ Technologies Used
- **Vite & React**: High-performance frontend framework.
- **TypeScript**: Type-safe development for scalable architecture.
- **Firebase**: Backend-as-a-Service for Auth and Real-time Firestore DB.
- **Tailwind CSS**: Professional, terminal-grade styling.
- **Lucide React**: Minimalist iconography.

## 🔑 Environment Variables
To run this project, you must set up the following environment variables in your `.env` file (local) or your deployment platform (e.g., Vercel):

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
## 📂 Project Structure
```
├── src/
│   ├── app/
│   │   └── components/
│   │       ├── TaskManagement.tsx    # Management of emergency tasks
│   │       ├── VolunteerList.tsx      # Full-width volunteer database
│   │       └── VolunteerMap.tsx       # Geospatial view of volunteers
│   │   └── App.tsx                    # Main app logic
│   ├── pages/
│   │   ├── AdminTerminal.tsx          # Core terminal dashboard interface
│   │   ├── LoginPage.tsx              # Authentication portal
│   │   └── VolunteerPage.tsx          # Public-facing volunteer view
│   ├── styles/                        # Custom CSS and themes
│   ├── firebase.ts                    # Backend configuration & initialization
│   └── main.tsx                       # React DOM entry point
├── package.json                       # Project dependencies
├── vite.config.ts                     # Build tool configuration
└── tsconfig.json                      # TypeScript configuration
```

## 🚀 Installation Instructions
Follow these steps to get the project running on your local machine:

Clone the repository:

```Bash
git clone https://github.com/nirupamdutta746-web/Community-Helper.git
```

Navigate into the project directory:

```Bash
cd Community-Helper
```

Install the dependencies:

```Bash
npm install
```

Start the development server:

```Bash
npm start
```

## 💡 Usage Examples
Accessing the Dashboard
Once the server is running, navigate to http://localhost:3000 in your browser. The interface is designed as an interactive terminal.

Managing Volunteers
The Volunteer Directory is located in the primary viewing area. You can view all registered members in a spread-out, organized layout designed for maximum visibility.

Handling Emergencies
The Emergency Feed is a distinct, high-priority section. Tasks are organized by urgency to help administrators delegate community help where it is needed most.

Developed with a focus on accessibility and efficient data visualization.
