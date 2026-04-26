# Community Helper 🤝
A streamlined, terminal-inspired administration dashboard designed for NGOs to manage community resources and personnel. This project solves the problem of cluttered administrative interfaces by providing a clean, command-line-style environment for tracking volunteer directories and real-time emergency tasks.

## 🛠️ Technologies Used
Vite - For a lightning-fast development environment and bundling.

TypeScript - Providing type safety across the terminal and data components.

Firebase - Powering real-time database updates and authentication.

React - The core library for the UI.

Tailwind CSS - Used for the "NGO Admin Terminal" aesthetic and organized layouts.

Lucide React - Minimalist iconography

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

Bash
git clone https://github.com/nirupamdutta746-web/Community-Helper.git
Navigate into the project directory:

Bash
cd Community-Helper
Install the dependencies:

Bash
npm install
Start the development server:

Bash
npm start

## 💡 Usage Examples
Accessing the Dashboard
Once the server is running, navigate to http://localhost:3000 in your browser. The interface is designed as an interactive terminal.

Managing Volunteers
The Volunteer Directory is located in the primary viewing area. You can view all registered members in a spread-out, organized layout designed for maximum visibility.

Handling Emergencies
The Emergency Feed is a distinct, high-priority section. Tasks are organized by urgency to help administrators delegate community help where it is needed most.

Developed with a focus on accessibility and efficient data visualization.