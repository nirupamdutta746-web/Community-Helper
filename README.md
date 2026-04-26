# Community Helper 🤝
Community Helper is a robust, terminal-inspired dashboard designed to streamline NGO operations. By providing a centralized, command-line-style interface, it simplifies the management of volunteer databases and high-priority emergency tasks, ensuring that community aid is coordinated with precision and speed.

## ✨ Key Features
- Terminal-Centric Dashboard: A clean, high-efficiency UI for rapid data oversight.

- Volunteer Management: Full-width directory tracking and specialized volunteer views.

- Real-Time Task Feed: Organized emergency task management to prioritize urgent community needs.

- Secure Infrastructure: Integrated with Firebase for real-time data syncing and secure user authentication.

## 🛣️ Future Prospects & Roadmap
We are actively working to evolve Community Helper into a full-scale coordination suite. Upcoming features include:

- Live Volunteer Mapping: Integration of a real-time geospatial system to track and display the live location of all active volunteers for better task delegation.

- Volunteer Honor System: A points-based gamification engine that tracks the completion rate and reliability of every team member.

- Volunteer Leaderboard: A competitive ranking system to recognize top contributors and boost community engagement through "Honor Points."

## 🛠️ Technologies Used
- Vite & React: High-performance frontend framework.

- TypeScript: Type-safe development for scalable architecture.

- Firebase: Backend-as-a-Service for Auth and Real-time DB.

- Tailwind CSS: Professional, terminal-grade styling.

- Lucide React - Minimalist iconography

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