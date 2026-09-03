import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  Activity,
  Rss,
  Bot,
  Calendar,
  User,
  CreditCard,
  ArrowRight,
  Trophy,
  Zap,
  ShieldCheck,
  Flame,
  Plus,
  Upload,
  Shield,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
  GraduationCap,
  ChevronLeft,
  Crown,
  Settings2
} from 'lucide-react';
import { AthleteProfile, BiomechanicalScan, HighlightVideo, TapeAnalysis, UserRole } from '../types';
import { UserAuthData } from './LoginModal';

const SPORTS_SLIDES = [
  { image: '/assets/sports/football.svg', title: 'Football Performance', text: 'Train harder. Track every movement. Own the pitch.' },
  { image: '/assets/sports/cricket.svg', title: 'Cricket Excellence', text: 'Every run, wicket and session builds your ranking.' },
  { image: '/assets/sports/basketball.svg', title: 'Basketball Intensity', text: 'Speed, power and consistency turn into results.' },
  { image: '/assets/sports/tennis.svg', title: 'Tennis Precision', text: 'Focus on technique, fitness and match readiness.' },
];

interface HomeViewProps {
  athlete: AthleteProfile;
  role: UserRole;
  telemetry?: any;
  onToggleSession?: () => void;
  scans?: BiomechanicalScan[];
  onOpenUploadTape: () => void;
  onOpenScan: () => void;
  onNavigateToPerformance: () => void;
  onNavigateToSchedule: () => void;
  onNavigateToProfile: () => void;
  onNavigateToFeed?: () => void;
  onNavigateToChatbot?: () => void;
  onNavigateToManagement?: () => void;
  onNavigateToCourses?: () => void;
  onOpenEditProfile?: () => void;
  onPlayVideo: (item: HighlightVideo | TapeAnalysis) => void;
  onSelectScan: (scan: BiomechanicalScan) => void;
  onLoginSuccess?: (role: UserRole, email: string, authData?: UserAuthData) => void;
  communityAthletes?: Record<string, AthleteProfile>;
  onOpenLeaderboardAdmin?: () => void;
  onNavigateToSplash?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  athlete,
  role,
  onOpenUploadTape,
  onOpenScan,
  onNavigateToPerformance,
  onNavigateToSchedule,
  onNavigateToProfile,
  onNavigateToFeed,
  onNavigateToChatbot,
  onNavigateToManagement,
  onNavigateToCourses,
  onOpenEditProfile,
  communityAthletes = {},
  onOpenLeaderboardAdmin,
  onNavigateToSplash,
}) => {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide(prev => (prev + 1) % SPORTS_SLIDES.length), 4500);
    return () => window.clearInterval(timer);
  }, []);

  const leaderboard = (Object.values(communityAthletes) as AthleteProfile[])
    .filter((p: AthleteProfile) => p.position !== 'STAFF' && !p.role?.toLowerCase().includes('coach') && !p.role?.toLowerCase().includes('admin'))
    .sort((a: AthleteProfile, b: AthleteProfile) => b.overallRating - a.overallRating)
    .slice(0, 5);
  const roleTitle = role === 'admin' ? 'Club Administrator' : role === 'coach' ? 'Head Coach & Tactician' : 'Athlete / Player';
  const roleBadgeColor = role === 'admin' ? 'bg-indigo-600 text-white' : role === 'coach' ? 'bg-blue-600 text-white' : 'bg-[#ff5500] text-white';

  return (
    <div className="min-h-screen bg-[#070b0f] text-slate-100 pb-28 pt-2 px-3.5 sm:px-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">

      {/* 0. SPORTS MOTIVATION SLIDER */}
      <div className="relative h-56 sm:h-64 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
        {SPORTS_SLIDES.map((item, index) => (
          <div key={item.title} className={`absolute inset-0 transition-opacity duration-700 ${index === slide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/35 to-black/10" />
            <div className="absolute left-5 sm:left-8 top-1/2 -translate-y-1/2 max-w-md">
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#ff7733]">KHELTANTRA SPORTS SPOTLIGHT</span>
              <h2 className="text-2xl sm:text-4xl font-black italic uppercase text-white mt-1">{item.title}</h2>
              <p className="text-xs sm:text-sm text-slate-200 mt-2">{item.text}</p>
              {onNavigateToSplash && (
                <button
                  onClick={onNavigateToSplash}
                  className="mt-3 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ff5500] to-amber-500 text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-orange-500/20 hover:brightness-110 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>View Splash Page</span>
                </button>
              )}
            </div>
          </div>
        ))}
        <button onClick={() => setSlide((slide - 1 + SPORTS_SLIDES.length) % SPORTS_SLIDES.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button onClick={() => setSlide((slide + 1) % SPORTS_SLIDES.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronRight className="w-5 h-5" />
        </button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {SPORTS_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} className={`h-1.5 rounded-full transition-all ${i === slide ? 'w-7 bg-[#ff5500]' : 'w-2 bg-white/50'}`} />
          ))}
        </div>
      </div>

      {/* 1. PLAYER LEADERBOARD */}
      <section className="bg-gradient-to-br from-[#101923] via-[#0d141c] to-[#090f15] border border-[#ff5500]/20 rounded-3xl p-4 sm:p-5 shadow-xl">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 text-[#ff5500] text-[10px] font-black uppercase tracking-widest">
              <Trophy className="w-4 h-4" /> Player Leaderboard
            </div>
            <h2 className="text-xl font-black italic uppercase text-white">Top Performers</h2>
            <p className="text-[10px] text-slate-500">Admin-controlled performance ranking</p>
          </div>
          {role === 'admin' && (
            <button onClick={onOpenLeaderboardAdmin} className="px-3 py-2 rounded-xl bg-[#ff5500]/10 border border-[#ff5500]/30 text-[#ff7733] text-[9px] font-black uppercase flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5" /> Control
            </button>
          )}
        </div>

        {leaderboard.length > 0 ? (
          <div className="space-y-2">
            {leaderboard.map((player, index) => (
              <div key={player.id} className={`grid grid-cols-[32px_1fr_auto] items-center gap-3 p-2.5 rounded-2xl border ${player.id === athlete.id ? 'border-[#ff5500]/50 bg-[#ff5500]/10' : 'border-slate-800 bg-[#0a1118]'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${index === 0 ? 'bg-yellow-400 text-black' : index === 1 ? 'bg-slate-300 text-black' : index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {index === 0 ? <Crown className="w-4 h-4" /> : index + 1}
                </div>
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={player.avatar} alt={player.name} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">{player.name} {player.id === athlete.id && <span className="text-[#ff5500]">• YOU</span>}</p>
                    <p className="text-[9px] text-slate-500 uppercase">{player.position} • #{player.number}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black font-mono text-white">{player.overallRating.toFixed(1)}</p>
                  <p className="text-[8px] text-[#00e5a3] font-bold uppercase">RATING</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">Player rankings will appear after players are registered.</div>
        )}
      </section>


      {/* 2. AUTHENTICATED USER WELCOME CAPSULE */}
      <div className="bg-[#0e141c] border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div
            onClick={onOpenEditProfile || onNavigateToProfile}
            className="w-14 h-14 rounded-2xl border-2 border-[#ff5500] overflow-hidden bg-slate-900 shadow-md cursor-pointer hover:scale-105 transition-transform shrink-0"
            title="Edit profile avatar"
          >
            <img
              src={athlete.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
              alt={athlete.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-black text-white truncate">{athlete.name}</h2>
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${roleBadgeColor}`}>
                {role.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate">
              {athlete.position} • {athlete.club || 'Kheltantra FC'}
            </p>
            <p className="text-[10px] text-emerald-400 font-mono font-bold mt-0.5">
              ● Active Database Session
            </p>
          </div>
        </div>

        {/* Action Button to launch Analytics */}
        <button
          onClick={onNavigateToPerformance}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-[#ff5500] to-[#ff6b2b] hover:from-[#ff4400] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,85,0,0.35)] active:scale-95 transition-all shrink-0"
        >
          <span>Enter Dashboard</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      {/* 3. PLATFORM FEATURE LAUNCHPAD TILES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
            Platform Modules & Fast Navigation
          </h3>
          <span className="text-[10px] font-mono text-slate-500 font-bold">1-TAP ACCESS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tile 1: Performance Analytics */}
          <div
            onClick={onNavigateToPerformance}
            className="relative h-44 rounded-3xl overflow-hidden border border-slate-800 hover:border-[#ff5500]/60 cursor-pointer transition-all shadow-lg group flex flex-col justify-end p-5"
          >
            <img src="/tile_performance.jpg" alt="Performance Analytics" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="relative z-10 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white group-hover:text-[#ff5500] transition-colors flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-[#ff5500]" />
                  <span>Performance Analytics</span>
                </h4>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-[10px] text-slate-200 leading-relaxed line-clamp-2">
                Real database metrics, training session durations & match stat tracking for all sports.
              </p>
            </div>
          </div>

          {/* Tile 2: Community Social Feed */}
          <div
            onClick={onNavigateToFeed || onNavigateToPerformance}
            className="relative h-44 rounded-3xl overflow-hidden border border-slate-800 hover:border-pink-500/60 cursor-pointer transition-all shadow-lg group flex flex-col justify-end p-5"
          >
            <img src="/tile_community.jpg" alt="Community Feed" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="relative z-10 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white group-hover:text-pink-400 transition-colors flex items-center gap-1.5">
                  <Rss className="w-4 h-4 text-pink-400" />
                  <span>Community Feed</span>
                </h4>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-[10px] text-slate-200 leading-relaxed line-clamp-2">
                Post match videos, share training reels, like and comment with fellow athletes.
              </p>
            </div>
          </div>

          {/* Tile 3: AI Tactician & Coach */}
          <div
            onClick={onNavigateToChatbot || onNavigateToPerformance}
            className="relative h-44 rounded-3xl overflow-hidden border border-slate-800 hover:border-sky-500/60 cursor-pointer transition-all shadow-lg group flex flex-col justify-end p-5"
          >
            <img src="/tile_ai_coach.jpg" alt="AI Tactics & Coach" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="relative z-10 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-sky-400" />
                  <span>AI Tactics & Coach</span>
                </h4>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-[10px] text-slate-200 leading-relaxed line-clamp-2">
                Get intelligent training drills, recovery advice, and tactical match formation guidance.
              </p>
            </div>
          </div>

          {/* Tile 4: Match Fixtures & Scheduling */}
          <div
            onClick={onNavigateToSchedule}
            className="relative h-44 rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-500/60 cursor-pointer transition-all shadow-lg group flex flex-col justify-end p-5"
          >
            <img src="/tile_schedule.jpg" alt="Fixture Schedule" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="relative z-10 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Fixture Schedule</span>
                </h4>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-[10px] text-slate-200 leading-relaxed line-clamp-2">
                Upcoming league fixtures, opponent analysis, starting XI lineups & match countdown.
              </p>
            </div>
          </div>

          {/* Tile 5: Player Profile & Highlights */}
          <div
            onClick={onNavigateToProfile}
            className="relative h-44 rounded-3xl overflow-hidden border border-slate-800 hover:border-emerald-500/60 cursor-pointer transition-all shadow-lg group flex flex-col justify-end p-5"
          >
            <img src="/tile_profile.jpg" alt="Athlete Profile" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="relative z-10 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Digital Id</span>
                </h4>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-[10px] text-slate-200 leading-relaxed line-clamp-2">
                Edit biography, upload highlight videos, view match milestones and bio.
              </p>
            </div>
          </div>

          {/* Tile 6: Academy & Video Masterclasses */}
          <div
            onClick={onNavigateToCourses || onNavigateToPerformance}
            className="relative h-44 rounded-3xl overflow-hidden border border-slate-800 hover:border-[#ff5500]/60 cursor-pointer transition-all shadow-lg group flex flex-col justify-end p-5"
          >
            <img src="/tile_academy.jpg" alt="Academy Masterclasses" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="relative z-10 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white group-hover:text-[#ff5500] transition-colors flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-[#ff5500]" />
                  <span>Academy Masterclasses</span>
                </h4>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
              </div>
              <p className="text-[10px] text-slate-200 leading-relaxed line-clamp-2">
                100% Free video lessons on finishing, fast bowling, knee rehab & spatial vision.
              </p>
            </div>
          </div>

          {/* Tile 7: Admin Desk (or Video Upload for Athletes) */}
          {role === 'admin' && onNavigateToManagement ? (
            <div
              onClick={onNavigateToManagement}
              className="relative h-44 rounded-3xl overflow-hidden border border-slate-800 hover:border-indigo-500/60 cursor-pointer transition-all shadow-lg group flex flex-col justify-end p-5"
            >
              <img src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80" alt="Admin Management Desk" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span>Admin Desk</span>
                  </h4>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-[10px] text-slate-200 leading-relaxed line-clamp-2">
                  Squad rosters, player fees, inventory allocation & official club oversight.
                </p>
              </div>
            </div>
          ) : (
            <div
              onClick={onOpenUploadTape}
              className="relative h-44 rounded-3xl overflow-hidden border border-slate-800 hover:border-purple-500/60 cursor-pointer transition-all shadow-lg group flex flex-col justify-end p-5"
            >
              <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80" alt="Upload Match Tape" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-white group-hover:text-purple-400 transition-colors flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-purple-400" />
                    <span>Upload Match Tape</span>
                  </h4>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-[10px] text-slate-200 leading-relaxed line-clamp-2">
                  Upload raw video reels or match recordings for tactical analysis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. PLATFORM PILLARS / VERIFIED HIGHLIGHTS */}
      <div className="bg-[#0e141c] border border-slate-800/90 rounded-3xl p-5 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-black text-white uppercase">Real Database Powered</h5>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              No fake or hardcoded numbers. All analytics derive from real logged activity.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#ff5500]/15 text-[#ff5500] shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-black text-white uppercase">Multi-Sport Matrix</h5>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Built for Football, Cricket, Volleyball, Basketball, Athletics & more.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs font-black text-white uppercase">Real-Time Sync</h5>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Instant live socket updates for posts, match scores, and comments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
