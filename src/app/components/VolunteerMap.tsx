import { MapPin, User } from 'lucide-react';

interface Volunteer {
  id: number;
  name: string;
  role: string;
  status: string;
  position: { x: number; y: number };
  currentTask: string | null;
}

interface VolunteerMapProps {
  volunteers: Volunteer[];
  onVolunteerClick: (volunteer: Volunteer) => void;
}

export default function VolunteerMap({ volunteers, onVolunteerClick }: VolunteerMapProps) {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden border border-slate-200">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgb3BhY2l0eT0iMC4wMyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>

      <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md border border-slate-200 z-10">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-slate-700">{volunteers.length} Volunteers Active</span>
        </div>
      </div>

      <div className="relative w-full h-full p-8">
        {volunteers.map((volunteer) => (
          <button
            key={volunteer.id}
            onClick={() => onVolunteerClick(volunteer)}
            className="absolute group cursor-pointer transition-transform hover:scale-110"
            style={{
              left: `${volunteer.position.x}%`,
              top: `${volunteer.position.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white px-3 py-2 rounded-lg shadow-lg border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
              <div className="text-xs font-semibold text-slate-900">{volunteer.name}</div>
              <div className="text-xs text-slate-500">{volunteer.status}</div>
              {volunteer.currentTask && (
                <div className="text-xs text-blue-600 mt-1">Task: {volunteer.currentTask}</div>
              )}
            </div>

            {volunteer.status === 'active' && (
              <div className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
