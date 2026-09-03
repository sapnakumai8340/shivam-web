import React from 'react';
import { Home, Layers, Smartphone, Sparkles, User, Calendar, Bot, Activity, LogIn, Upload, BarChart3, ShieldCheck, QrCode } from 'lucide-react';
import { ActiveScreen, UserRole } from '../types';

interface ScreenSwitcherProps {
  currentScreen: ActiveScreen;
  currentRole: UserRole;
  onSelectScreen: (screen: ActiveScreen) => void;
  onToggleRole: () => void;
  onOpenLogin: () => void;
  onOpenScan: () => void;
  onOpenReport: () => void;
  onOpenUploadTape?: () => void;
  onOpenPlayerScanner?: () => void;
}

export const ScreenSwitcher: React.FC<ScreenSwitcherProps> = ({
  currentScreen,
  currentRole,
  onSelectScreen,
  onToggleRole,
  onOpenLogin,
  onOpenScan,
  onOpenReport,
  onOpenUploadTape,
  onOpenPlayerScanner,
}) => {
  return (
    <div className="bg-[#0e141b] border-b border-slate-800/80 px-3 py-2 text-xs">
      <div className="max-w-md mx-auto flex items-center justify-between gap-1.5 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] font-mono text-[#ff5500] font-bold uppercase">
            NAV:
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Splash Page */}
          <button
            onClick={() => onSelectScreen('splash')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center gap-1 ${
              currentScreen === 'splash'
                ? 'bg-[#ff5500] text-white shadow-[0_0_10px_rgba(255,85,0,0.5)]'
                : 'bg-slate-900 text-amber-400 hover:text-white border border-amber-500/40'
            }`}
          >
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            <span>Splash</span>
          </button>

          {/* Home View */}
          <button
            onClick={() => onSelectScreen('home')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
              currentScreen === 'home'
                ? 'bg-[#ff5500] text-white shadow-[0_0_10px_rgba(255,85,0,0.5)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Home
          </button>

          {/* Performance Analytics */}
          <button
            onClick={() => onSelectScreen('performance')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
              currentScreen === 'performance'
                ? 'bg-[#ff5500] text-white shadow-[0_0_10px_rgba(255,85,0,0.5)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Analytics
          </button>

          {/* Feed / HUD */}
          <button
            onClick={() => onSelectScreen('feed')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
              currentScreen === 'feed'
                ? 'bg-[#ff5500] text-white shadow-[0_0_10px_rgba(255,85,0,0.5)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            HUD
          </button>

          {/* Profile */}
          <button
            onClick={() => onSelectScreen('profile')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
              currentScreen === 'profile'
                ? 'bg-[#ff5500] text-white shadow-[0_0_10px_rgba(255,85,0,0.5)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Profile
          </button>

          {/* Schedule */}
          <button
            onClick={() => onSelectScreen('schedule')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
              currentScreen === 'schedule'
                ? 'bg-[#ff5500] text-white shadow-[0_0_10px_rgba(255,85,0,0.5)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Schedule
          </button>

          {/* Courses / Academy */}
          <button
            onClick={() => onSelectScreen('courses')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
              currentScreen === 'courses'
                ? 'bg-[#ff5500] text-white shadow-[0_0_10px_rgba(255,85,0,0.5)]'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Academy
          </button>

          {/* Admin Management & Fees */}
          <button
            onClick={() => onSelectScreen('management')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center gap-1 ${
              currentScreen === 'management'
                ? 'bg-[#ff5500] text-white shadow-[0_0_10px_rgba(255,85,0,0.5)]'
                : 'bg-slate-900 text-[#ff7733] hover:text-white border border-[#ff5500]/40'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-[#ff5500]" />
            <span>Admin Desk</span>
          </button>

          {/* Player Scanner - Admin/Coach Only */}
          {(currentRole === 'admin' || currentRole === 'coach') && onOpenPlayerScanner && (
            <button
              onClick={onOpenPlayerScanner}
              className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-emerald-400 hover:text-white border border-emerald-500/40 flex items-center gap-0.5 hover:border-emerald-400 transition-all"
            >
              <QrCode className="w-2.5 h-2.5" />
              <span>Scanner</span>
            </button>
          )}

          {/* Upload Tape Modal */}
          {onOpenUploadTape && (
            <button
              onClick={onOpenUploadTape}
              className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-slate-300 hover:text-[#ff5500] border border-slate-800 flex items-center gap-0.5"
            >
              <Upload className="w-2.5 h-2.5 text-[#ff5500]" />
              <span>Upload Tape</span>
            </button>
          )}

          {/* Sign Up / Login Modal */}
          <button
            onClick={onOpenLogin}
            className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-slate-300 hover:text-[#ff5500] border border-slate-800 flex items-center gap-0.5"
          >
            <LogIn className="w-2.5 h-2.5 text-[#ff5500]" />
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};
