import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Trophy, 
  Users, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  GraduationCap, 
  Bot, 
  ArrowRight,
  Flame,
  Award,
  Layers,
  X
} from 'lucide-react';
import { UserRole } from '../types';

interface SplashViewProps {
  onEnterApp: () => void;
  onSelectRole?: (role: UserRole) => void;
  onOpenLogin?: () => void;
  currentRole?: UserRole;
  isModal?: boolean;
  onClose?: () => void;
}

export const SplashView: React.FC<SplashViewProps> = ({
  onEnterApp,
  onSelectRole,
  onOpenLogin,
  currentRole = 'player',
  isModal = false,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'roles'>('overview');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const handleStart = () => {
    if (onSelectRole && selectedRole !== currentRole) {
      onSelectRole(selectedRole);
    }
    onEnterApp();
  };

  const content = (
    <div className="relative min-h-screen w-full bg-[#0b0f14] text-slate-100 flex flex-col justify-between overflow-x-hidden font-sans select-none">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-orange-600/20 via-amber-500/10 to-transparent rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tl from-emerald-600/20 via-cyan-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 hud-grid opacity-30 pointer-events-none" />

      {/* Header Bar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-[2px] shadow-lg shadow-orange-500/20">
            <div className="w-full h-full bg-[#0b0f14] rounded-[10px] flex items-center justify-center">
              <Zap className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-wider text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-orange-400">
                KHELTANTRA
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">
                PRO 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">AI Sports Biomechanics & Academy OS</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onOpenLogin && (
            <>
              <button
                onClick={onOpenLogin}
                className="px-5 py-2.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all shadow-md"
              >
                Sign In
              </button>
              <button
                onClick={onOpenLogin}
                className="px-5 py-2.5 text-xs font-extrabold text-black bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 hover:brightness-110 rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2"
              >
                Sign Up
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-8 flex-1 flex flex-col justify-center">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-900/80 border border-slate-800 p-1.5 rounded-2xl flex items-center gap-1 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'features'
                  ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Capabilities
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'roles'
                  ? 'bg-orange-500 text-black shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Role Selection
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW HERO */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-orange-500/30 text-orange-400 text-xs font-semibold backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-orange-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span>Next-Gen Athletic Intelligence & Computer Vision</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Master Your Game With{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
                  Precision AI Analytics
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                Kheltantra combines computer-vision biomechanical scanning, live tactical tracking, video highlight breakdown, and academy management into a unified athletic intelligence hub.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onOpenLogin || handleStart}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:brightness-110 text-slate-950 font-black rounded-2xl shadow-xl shadow-orange-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-3 text-base"
                >
                  <Zap className="w-5 h-5 fill-slate-950" />
                  Sign Up / Sign In To Access
                  <ChevronRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setActiveTab('features')}
                  className="px-6 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold rounded-2xl transition-all flex items-center gap-2 text-sm backdrop-blur-md"
                >
                  <Layers className="w-4 h-4 text-orange-400" />
                  Explore System Capabilities
                </button>
              </div>

              {/* Quick Feature Badges */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Pose Symmetry</div>
                    <div className="text-xs text-slate-400">AI Kinematics</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Tactical Field</div>
                    <div className="text-xs text-slate-400">Realtime Heatmaps</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">AI Assistant</div>
                    <div className="text-xs text-slate-400">Instant Insights</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual HUD Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-2xl backdrop-blur-xl glow-orange">
                {/* HUD Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Live Biomechanical Telemetry</span>
                  </div>
                  <span className="text-[11px] font-mono bg-slate-800 text-orange-400 px-2 py-0.5 rounded-md border border-slate-700">
                    STATUS: OPTIMAL
                  </span>
                </div>

                {/* Biomechanics Visual Preview */}
                <div className="my-5 relative h-56 rounded-2xl bg-[#080b0f] border border-slate-800 overflow-hidden flex items-center justify-center group">
                  <div className="absolute inset-0 hud-grid opacity-40" />
                  
                  {/* Scan Line Animation */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-scan-line shadow-lg shadow-orange-500" />

                  {/* Silhouetted HUD Avatar */}
                  <div className="relative z-10 text-center space-y-3">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-orange-500/20 to-cyan-500/20 border-2 border-dashed border-orange-400/60 flex items-center justify-center p-3 animate-pulse">
                      <Activity className="w-12 h-12 text-orange-400" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                        Overall Symmetry: 96.4%
                      </span>
                      <p className="text-[11px] text-slate-400 pt-1">Lower Limb Load Balance: 51% L / 49% R</p>
                    </div>
                  </div>

                  {/* Floating Metric Tags */}
                  <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-800 rounded-lg p-2 text-[10px] font-mono text-slate-300 shadow">
                    <div className="text-orange-400 font-bold">V-JUMP: 68 cm</div>
                    <div className="text-slate-400">FORCE: 2.8 kN</div>
                  </div>

                  <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-800 rounded-lg p-2 text-[10px] font-mono text-slate-300 shadow">
                    <div className="text-emerald-400 font-bold">ACCEL: 8.9 m/s²</div>
                    <div className="text-slate-400">STABILITY: High</div>
                  </div>
                </div>

                {/* Bottom Stats Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-800/50 border border-slate-800 p-3 rounded-xl">
                    <div className="text-[11px] text-slate-400">Fitness Index</div>
                    <div className="text-lg font-black text-white flex items-center justify-between mt-0.5">
                      <span>94 / 100</span>
                      <Flame className="w-4 h-4 text-orange-400" />
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-800 p-3 rounded-xl">
                    <div className="text-[11px] text-slate-400">Pro Level Rating</div>
                    <div className="text-lg font-black text-amber-400 flex items-center justify-between mt-0.5">
                      <span>ELITE</span>
                      <Award className="w-4 h-4 text-amber-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FEATURES CAPABILITIES */}
        {activeTab === 'features' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-black text-white">Comprehensive Sports Platform</h2>
              <p className="text-slate-400 text-sm max-w-xl mx-auto">
                Everything athletes, coaches, and academy managers need in a single connected environment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Feature 1 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-orange-500/40 transition-all hover:scale-[1.02] group">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4 group-hover:bg-orange-500 group-hover:text-black transition-all">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Optical Pose Scanning</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Realtime camera-based biomechanical scan analyzing joint alignment, posture, symmetry, and injury risk markers.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 transition-all hover:scale-[1.02] group">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Tactical Match Field</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Interactive pitch simulator for player positioning, tactical heatmaps, strategy boards, and match telemetry.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/40 transition-all hover:scale-[1.02] group">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:bg-cyan-500 group-hover:text-black transition-all">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Academy OS & Roster</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Manage player fee records, jersey kits, equipment inventory, attendance logs, and staff permissions effortlessly.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-purple-500/40 transition-all hover:scale-[1.02] group">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 group-hover:bg-purple-500 group-hover:text-black transition-all">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">AI Tactical Coach</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Smart AI assistant providing custom drill suggestions, recovery guidance, and statistical performance summaries.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition-all hover:scale-[1.02] group">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-500 group-hover:text-black transition-all">
                  <Play className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Video Reel Review</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Upload match tapes, tag key highlights, view frame-by-frame video breakdowns, and share clips with coaches.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 transition-all hover:scale-[1.02] group">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-500 group-hover:text-black transition-all">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Tactical Masterclasses</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Access specialized drills, fitness modules, positional playbooks, and video tutorials curated for all sport levels.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ROLE SELECTION */}
        {activeTab === 'roles' && (
          <div className="max-w-3xl mx-auto space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-white">Choose Your Workspace Role</h2>
              <p className="text-slate-400 text-sm">
                Select how you'd like to experience Kheltantra. You can switch roles anytime from the header.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {/* Player Role */}
              <button
                onClick={() => setSelectedRole('player')}
                className={`p-6 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  selectedRole === 'player'
                    ? 'bg-orange-500/10 border-orange-500 text-white shadow-xl shadow-orange-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {selectedRole === 'player' && (
                  <div className="absolute top-3 right-3 text-orange-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="text-lg font-bold text-white">Athlete / Player</div>
                <p className="text-xs text-slate-400 mt-1">
                  Track biomechanics, view personal metrics, log training sessions, and upload video reels.
                </p>
              </button>

              {/* Coach Role */}
              <button
                onClick={() => setSelectedRole('coach')}
                className={`p-6 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  selectedRole === 'coach'
                    ? 'bg-emerald-500/10 border-emerald-500 text-white shadow-xl shadow-emerald-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {selectedRole === 'coach' && (
                  <div className="absolute top-3 right-3 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="text-lg font-bold text-white">Coach / Scout</div>
                <p className="text-xs text-slate-400 mt-1">
                  Analyze squad scans, assign tactical drills, update fixtures, and review player video tapes.
                </p>
              </button>

              {/* Admin Role */}
              <button
                onClick={() => setSelectedRole('admin')}
                className={`p-6 rounded-2xl border text-left transition-all relative overflow-hidden ${
                  selectedRole === 'admin'
                    ? 'bg-cyan-500/10 border-cyan-500 text-white shadow-xl shadow-cyan-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {selectedRole === 'admin' && (
                  <div className="absolute top-3 right-3 text-cyan-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-lg font-bold text-white">Academy Admin</div>
                <p className="text-xs text-slate-400 mt-1">
                  Full control over academy operations, membership fee billing, kit inventory, and roster setup.
                </p>
              </button>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                onClick={() => {
                  if (onSelectRole) onSelectRole(selectedRole);
                  if (onOpenLogin) onOpenLogin();
                }}
                className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold rounded-xl shadow-lg shadow-orange-500/20 hover:brightness-110 transition-all flex items-center gap-2"
              >
                Sign Up / Sign In as {selectedRole.toUpperCase()}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Banner */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-900/40 backdrop-blur-md py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              System Operational (v2.4)
            </span>
            <span>•</span>
            <span>Realtime Socket Engine: Active</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button onClick={() => setActiveTab('overview')} className="hover:text-white transition-colors">
              Overview
            </button>
            <button onClick={() => setActiveTab('features')} className="hover:text-white transition-colors">
              Features
            </button>
            <button onClick={() => setActiveTab('roles')} className="hover:text-white transition-colors">
              Role Setup
            </button>
            {onOpenLogin && (
              <button onClick={onOpenLogin} className="text-orange-400 font-semibold hover:underline">
                Account Sign In
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-0">
        {content}
      </div>
    );
  }

  return content;
};
