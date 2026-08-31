import React, { useState, useEffect } from 'react';
import { Bell, ShieldCheck, UserCheck, RefreshCw, X, CheckCircle2, AlertTriangle, Activity, Wifi, Radio, Search, Sun, Moon } from 'lucide-react';
import { AthleteProfile, UserRole } from '../types';
import { socketService } from '../utils/socketService';

interface HeaderProps {
  role: UserRole;
  athlete?: AthleteProfile;
  onToggleRole: (newRole: UserRole) => void;
  onOpenLogin: () => void;
  onSearchPlayer?: (query: string) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ role, athlete, onToggleRole, onOpenLogin, onSearchPlayer, theme = 'dark', onToggleTheme }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [liveNotifications, setLiveNotifications] = useState<any[]>([]);
  const [isSocketConnected, setIsSocketConnected] = useState(socketService.isConnected);
  const [onlineCount, setOnlineCount] = useState(socketService.onlineUsersCount);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubConn = socketService.subscribe('connection:status', (data: { isConnected: boolean }) => {
      setIsSocketConnected(data.isConnected);
    });

    const unsubPres = socketService.subscribe('presence:count', (count: number) => { setOnlineCount(count); });
    const unsubNotif = socketService.subscribe('notification:created', (n: any) => { setLiveNotifications(prev => [n, ...prev].slice(0, 12)); setUnreadCount(c => c + 1); });

    return () => {
      unsubConn();
      unsubPres();
      unsubNotif();
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchPlayer && searchQuery.trim()) {
      onSearchPlayer(searchQuery);
      setSearchQuery('');
    }
  };

  const notifications = liveNotifications.length ? liveNotifications.map((n: any) => ({ id: n.id, title: n.message?.split(':')[0] || 'Live update', desc: n.message || 'New Kheltantra update', time: 'Just now', type: n.type })) : [
    {
      id: 1,
      title: 'Biomechanical Scan Ready',
      desc: 'Player lower-body scan completed (Symmetry 96%).',
      time: 'Just now',
      type: 'scan',
    },
    {
      id: 2,
      title: 'Fixture Update',
      desc: 'Titan United FC confirmed for tomorrow 19:30.',
      time: '1h ago',
      type: 'match',
    },
    {
      id: 3,
      title: 'Tactical Tape Annotated',
      desc: 'Coach added 3 key markers on high-tempo attacking transitions.',
      time: '3h ago',
      type: 'tape',
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f14]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5">
      <div className="max-w-md mx-auto flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          {/* Left: Avatar & Role Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (role === 'player') {
                  onOpenLogin();
                } else {
                  onToggleRole('player');
                }
              }}
              title={role === 'player' ? "Sign in as Coach / Admin to access Admin features" : "Switch to Athlete View"}
              className="relative group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-full border-2 border-[#ff5500] p-0.5 overflow-hidden bg-slate-900 group-hover:scale-105 transition-transform">
                <img
                  src={
                    athlete?.avatar ||
                    (role === 'player'
                      ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&q=80'
                      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&q=80')
                  }
                  alt={athlete?.name || "Profile"}
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className={`absolute -bottom-1 -right-1 text-[8px] font-black px-1 rounded text-white uppercase tracking-wider ${role === 'admin' ? 'bg-indigo-600' : role === 'coach' ? 'bg-blue-600' : 'bg-[#ff5500]'
                }`}>
                {role === 'player' ? 'ATH' : role === 'coach' ? 'COA' : 'ADM'}
              </span>
            </button>

            {/* Socket.IO Real-time Connection Indicator Pill */}
            <div
              className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-black tracking-wider transition-all ${isSocketConnected
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}
              title={isSocketConnected ? `Socket.IO Live Sync • ${onlineCount} active peer(s)` : 'Connecting to Socket.IO...'}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSocketConnected ? 'bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]' : 'bg-amber-400'}`} />
              <Radio className="w-2.5 h-2.5" />
              <span>{isSocketConnected ? 'LIVE IO' : 'CONNECTING'}</span>
            </div>
          </div>

          {/* Center: Brand Title */}
          <div className="text-center select-none cursor-pointer">
            <h1 className="text-lg sm:text-xl font-black italic tracking-wide text-[#ff5500] uppercase drop-shadow-[0_2px_10px_rgba(255,85,0,0.3)]">
              kheltantra
            </h1>
          </div>

          {/* Right: Notifications & Quick Switch */}
          <div className="flex items-center gap-1.5 relative">
            <div
              className={`flex sm:hidden items-center gap-1 px-1.5 py-0.5 rounded-full border text-[8px] font-black ${isSocketConnected
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSocketConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>IO</span>
            </div>

            <button
              onClick={onToggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setUnreadCount(0);
              }}
              aria-label="Notifications"
              className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#ff5500] rounded-full ring-2 ring-[#0b0f14] animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-[#151c24] border border-slate-700/80 rounded-xl shadow-2xl z-50 p-3 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/60 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-[#ff5500]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Live Activity Stream</span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 transition-colors border border-slate-700/30">
                      <div className="flex items-start justify-between gap-1">
                        <p className="text-xs font-semibold text-white">{n.title}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 mt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                  <button
                    onClick={onOpenLogin}
                    className="text-slate-400 hover:text-[#ff5500] font-medium"
                  >
                    Switch Account
                  </button>
                  <button
                    onClick={() => {
                      if (role === 'player') {
                        onOpenLogin();
                      } else {
                        onToggleRole('player');
                      }
                    }}
                    className="text-[#ff5500] font-bold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Mode: {role === 'player' ? 'Athlete (Switch to Coach)' : 'Coach'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Bar Row */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-[#ff5500]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search player by ID or Name (e.g. APX-9942)"
            className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
        </form>
      </div>
    </header>
  );
};

