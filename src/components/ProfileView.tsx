import React, { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  ChevronRight,
  Shield,
  Play,
  Upload,
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  Activity,
  User,
  Sliders,
  Flame,
  AlertCircle,
  FileText,
  Calendar,
  Users,
  Eye,
  Crosshair,
  BadgeCheck,
  Layers,
  Settings,
  Package
} from 'lucide-react';
import { AthleteProfile, HighlightVideo, TapeAnalysis, MatchRecord, UserRole } from '../types';

interface ProfileViewProps {
  athlete: AthleteProfile;
  role: UserRole;
  communityAthletes?: Record<string, AthleteProfile>;
  onOpenFullReport: () => void;
  onPlayHighlight: (video: HighlightVideo) => void;
  onPlayTape: (tape: TapeAnalysis) => void;
  onUploadTape: () => void;
  onViewAllMatches: () => void;
  onViewAllHighlights: () => void;
  onEditProfile: () => void;
  onAdminDecidePerformance: () => void;
  onNavigateToSchedule?: () => void;
  onSelectPlayerProfile?: (playerId: string) => void;
}

const getSportFromSpecialty = (specialty?: string): 'Cricket' | 'Basketball' | 'Football' => {
  const spec = (specialty || '').toLowerCase();
  if (spec.includes('cricket')) return 'Cricket';
  if (spec.includes('basketball')) return 'Basketball';
  return 'Football';
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  athlete,
  role,
  communityAthletes = {},
  onOpenFullReport,
  onPlayHighlight,
  onPlayTape,
  onUploadTape,
  onViewAllMatches,
  onViewAllHighlights,
  onEditProfile,
  onAdminDecidePerformance,
  onNavigateToSchedule,
  onSelectPlayerProfile,
}) => {
  const [selectedPoint, setSelectedPoint] = useState<number | null>(5); // Default to OCT

  const isAdmin =
    role === 'admin' ||
    role === 'coach' ||
    athlete.position === 'STAFF' ||
    athlete.role?.toLowerCase().includes('coach') ||
    athlete.role?.toLowerCase().includes('admin') ||
    athlete.role?.toLowerCase().includes('staff') ||
    athlete.code?.startsWith('#ADM');

  // Athletes under coach supervision
  const squadAthletes: AthleteProfile[] = (Object.values(communityAthletes) as AthleteProfile[]).filter(
    (a: AthleteProfile) =>
      a.id !== athlete.id &&
      a.position !== 'STAFF' &&
      !a.role?.toLowerCase().includes('coach') &&
      !a.role?.toLowerCase().includes('admin')
  );

  return (
    <div className="min-h-screen bg-[#0b0f14] pb-28 pt-2 px-4 max-w-md mx-auto space-y-4">
      {/* 1. Hero Profile Card (Tailored for Admin vs Player) */}
      <div className="relative bg-[#151c24] border border-slate-800/90 rounded-3xl p-5 overflow-hidden shadow-2xl">
        {/* Diagonal geometric backdrop */}
        <div
          className={`absolute -top-12 -right-12 w-64 h-64 rounded-3xl rotate-45 pointer-events-none ${isAdmin
            ? 'bg-gradient-to-br from-indigo-500/20 via-[#ff5500]/10 to-transparent'
            : 'bg-gradient-to-br from-[#ff5500]/25 via-[#ff5500]/10 to-transparent'
            }`}
        />

        {/* Top Right Quick Edit / Admin Actions */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 z-10">
          <button
            onClick={onEditProfile}
            title="Edit Profile Information"
            className="flex items-center gap-1 bg-slate-900/90 hover:bg-[#ff5500] text-slate-300 hover:text-white border border-slate-700/80 hover:border-[#ff5500] px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            <User className="w-3 h-3" />
            <span>Edit</span>
          </button>

          {isAdmin && (
            <button
              onClick={onAdminDecidePerformance}
              title="Admin Performance Calibration & Clearance Desk"
              className="flex items-center gap-1 bg-[#ff5500]/20 hover:bg-[#ff5500] text-[#ff5500] hover:text-white border border-[#ff5500]/40 hover:border-[#ff5500] px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Decide</span>
            </button>
          )}
        </div>

        {/* Circular Action Photo / Avatar */}
        <div className="flex justify-center mb-3 relative">
          <div
            className={`w-32 h-32 rounded-full p-1 bg-gradient-to-tr shadow-lg relative group cursor-pointer ${isAdmin
              ? 'from-indigo-500 via-[#ff5500] to-slate-700 shadow-[0_0_25px_rgba(99,102,241,0.35)]'
              : 'from-[#ff5500] to-slate-700 shadow-[0_0_25px_rgba(255,85,0,0.35)]'
              }`}
            onClick={onEditProfile}
            title="Click to edit profile"
          >
            <img
              src={athlete.actionImage || athlete.avatar}
              alt={athlete.name}
              className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            {/* Status indicator dot */}
            <span
              className={`absolute bottom-1 right-2 w-4 h-4 rounded-full border-2 border-[#151c24] shadow-md ${isAdmin
                ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                : athlete.status === 'ACTIVE'
                  ? 'bg-[#00e5a3] shadow-[0_0_8px_#00e5a3]'
                  : athlete.status === 'RESTING'
                    ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]'
                    : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                }`}
            />
          </div>
        </div>

        {/* Status Pill Row */}
        <div className="flex items-center justify-center gap-2 mb-1.5 flex-wrap">
          {isAdmin ? (
            <>
              <span className="bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Shield className="w-3 h-3 text-indigo-400" />
                <span>OFFICIAL COACH / STAFF</span>
              </span>
              <span className="bg-slate-900 border border-slate-700/80 text-emerald-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ON DUTY</span>
              </span>
            </>
          ) : (
            <>
              <span className="bg-slate-900 border border-slate-700/80 text-slate-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {athlete.position} • {athlete.role || 'ATHLETE'}
              </span>
              <span
                className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${athlete.status === 'ACTIVE'
                  ? 'text-[#ff5500]'
                  : athlete.status === 'RESTING'
                    ? 'text-amber-400'
                    : 'text-rose-400'
                  }`}
              >
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${athlete.status === 'ACTIVE'
                    ? 'bg-[#ff5500]'
                    : athlete.status === 'RESTING'
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                    }`}
                />
                {athlete.status}
              </span>
            </>
          )}
        </div>

        {/* Name & ID */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-black text-white tracking-wide uppercase drop-shadow-sm">
              {athlete.name}
            </h2>
            <span className="bg-slate-800/80 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-700/60">
              {athlete.code}
            </span>
          </div>
          <p className="text-xs font-bold text-[#ff5500] uppercase tracking-widest mt-0.5">
            {athlete.handle || `@${athlete.name.toLowerCase().replace(/\s+/g, '')}_${athlete.number || 9}`} •{' '}
            {athlete.club || (isAdmin ? 'Performance Desk' : ' Premier Squad')}
          </p>

          {/* Personal profile QR code - unique for every player and admin */}
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(`apex://profile/${athlete.id}`)}`}
                alt={`QR code for ${athlete.name}`}
                className="w-28 h-28"
              />
            </div>
            <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
              {isAdmin ? 'Admin Profile QR' : 'Player Profile QR'}
            </div>
            <div className="text-[8px] text-slate-600 font-mono">ID: {athlete.id}</div>
          </div>

          {/* Sport Speciality / Discipline Badge */}
          <div className="flex items-center justify-center mt-2">
            <span className="bg-[#ff5500]/15 border border-[#ff5500]/40 text-[#ff7733] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wide flex items-center gap-1.5 shadow-md">
              <Award className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>
                SPECIALITY: {athlete.sportSpecialty || (isAdmin ? 'High Performance Tactical Coach' : 'Football (Striker)')}
              </span>
            </span>
          </div>
        </div>

        {/* Social Metrics Bar (Authoritative Real DB Counts) */}
        <div className="grid grid-cols-3 gap-2 bg-[#0c1118] p-2.5 rounded-2xl border border-slate-800/80 my-3 text-center">
          <div>
            <div className="text-sm font-black text-white font-mono">{athlete.postsCount ?? 0}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase">Posts</div>
          </div>
          <div>
            <div className="text-sm font-black text-white font-mono">
              {typeof athlete.followersCount === 'number'
                ? athlete.followersCount >= 10000
                  ? `${(athlete.followersCount / 1000).toFixed(1)}k`
                  : athlete.followersCount
                : 0}
            </div>
            <div className="text-[9px] font-bold text-slate-400 uppercase">Followers</div>
          </div>
          <div>
            <div className="text-sm font-black text-white font-mono">
              {typeof athlete.followingCount === 'number'
                ? athlete.followingCount >= 10000
                  ? `${(athlete.followingCount / 1000).toFixed(1)}k`
                  : athlete.followingCount
                : 0}
            </div>
            <div className="text-[9px] font-bold text-slate-400 uppercase">Following</div>
          </div>
        </div>

        {/* Action Button Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {isAdmin ? (
            <>
              <button
                onClick={onAdminDecidePerformance}
                className="w-full bg-[#ff5500] hover:bg-[#ff6a1a] active:scale-[0.98] text-white font-black py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs tracking-wider uppercase shadow-[0_4px_20px_rgba(255,85,0,0.35)] transition-all"
              >
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>CALIBRATE SQUAD</span>
              </button>

              {onNavigateToSchedule && (
                <button
                  onClick={onNavigateToSchedule}
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 active:scale-[0.98] font-black py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs tracking-wider uppercase transition-all"
                >
                  <Calendar className="w-4 h-4 text-[#ff5500]" />
                  <span>MANAGE FIXTURES</span>
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={onOpenFullReport}
                className="w-full bg-[#ff5500] hover:bg-[#ff6a1a] active:scale-[0.98] text-white font-black py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs tracking-wider uppercase shadow-[0_4px_20px_rgba(255,85,0,0.35)] transition-all"
              >
                <BarChart2 className="w-4 h-4 stroke-[3]" />
                <span>FULL REPORT</span>
              </button>

              <button
                onClick={onEditProfile}
                className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 active:scale-[0.98] font-black py-2.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs tracking-wider uppercase transition-all"
              >
                <User className="w-4 h-4" />
                <span>EDIT PROFILE</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADMIN EXCLUSIVE: SQUAD ROSTER & PERFORMANCE CLEARANCE OVERSIGHT DECK */}
      {/* ========================================================================= */}
      {isAdmin && (
        <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                <Users className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest block">
                  STAFF MANAGEMENT DECK
                </span>
                <span className="text-xs font-black text-white uppercase">
                  SQUAD ROSTER & CLEARANCES ({squadAthletes.length} ATHLETES)
                </span>
              </div>
            </div>

            <button
              onClick={onAdminDecidePerformance}
              className="text-[10px] font-black text-[#ff5500] hover:text-[#ff7722] uppercase tracking-wider flex items-center gap-1 bg-[#ff5500]/10 px-2 py-1 rounded-lg border border-[#ff5500]/20 transition-colors"
            >
              <Sliders className="w-3 h-3" />
              <span>Calibrate</span>
            </button>
          </div>

          {/* List of squad athletes */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1 divide-y divide-slate-800/50">
            {squadAthletes.map((pl) => (
              <div
                key={pl.id}
                className="pt-2 first:pt-0 flex items-center justify-between gap-2 group hover:bg-slate-800/30 p-1.5 rounded-xl transition-colors"
              >
                <div
                  className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
                  onClick={() => onSelectPlayerProfile && onSelectPlayerProfile(pl.id)}
                >
                  <img
                    src={pl.avatar}
                    alt={pl.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-black text-white truncate">{pl.name}</p>
                      <span className="text-[9px] font-mono text-[#ff5500] font-bold shrink-0">
                        #{pl.number}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold truncate">
                      {pl.position} • {pl.club || 'Premier Squad'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase font-mono ${pl.adminDecision?.clearanceStatus === 'MATCH READY' || !pl.adminDecision
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : pl.adminDecision?.clearanceStatus === 'RESTRICTED MINUTES'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}
                  >
                    {pl.adminDecision?.clearanceStatus || 'MATCH READY'}
                  </span>

                  <button
                    onClick={onAdminDecidePerformance}
                    title="Calibrate this athlete's clearance & workload"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#ff5500] text-slate-300 hover:text-white transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Admin Capabilities Summary */}
          <div className="bg-[#0c1015] p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>ADMIN CLEARANCE PRIVILEGES</span>
              <span className="text-emerald-400 font-mono">LEVEL 5 UNRESTRICTED</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              As an authenticated Staff Director, you have authoritative rights to set matchday lineups, adjust ACWR workload thresholds, prescribe training focus, and approve medical return-to-play clearances.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ADMIN PERFORMANCE DECISION & CLEARANCE STATUS (For Player or Admin View) */}
      {/* ========================================================================= */}
      {athlete.adminDecision && !isAdmin && (
        <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#ff5500]/15 text-[#ff5500] border border-[#ff5500]/30">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                  STAFF EVALUATION & CLEARANCE
                </span>
                <span className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                  <span>{athlete.adminDecision.clearanceStatus}</span>
                  {athlete.adminDecision.isVerified && (
                    <span className="bg-[#00e5a3]/15 text-[#00e5a3] border border-[#00e5a3]/30 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded">
                      VERIFIED
                    </span>
                  )}
                </span>
              </div>
            </div>

            {(role === 'admin' || role === 'coach') && (
              <button
                onClick={onAdminDecidePerformance}
                className="text-[10px] font-black text-[#ff5500] hover:text-[#ff7722] uppercase tracking-wider flex items-center gap-1 bg-[#ff5500]/10 px-2 py-1 rounded-lg border border-[#ff5500]/20"
              >
                <Sliders className="w-3 h-3" />
                <span>Adjust</span>
              </button>
            )}
          </div>

          <div className="space-y-2 text-xs">
            {/* Prescribed Training Focus */}
            <div className="bg-[#0c1015] p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[9px] font-bold text-[#ff5500] uppercase tracking-wider block mb-0.5">
                Prescribed Focus:
              </span>
              <p className="text-[11px] text-slate-200 font-medium leading-snug">
                {athlete.adminDecision.trainingFocus}
              </p>
            </div>

            {/* Directive Notes */}
            <div className="bg-[#0c1015] p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Official Coach Directives:
              </span>
              <p className="text-[11px] text-slate-300 italic leading-snug">
                "{athlete.adminDecision.notes}"
              </p>
            </div>

            {/* Staff sign-off & limits */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
              <span>Sign-off: {athlete.adminDecision.evaluatedBy}</span>
              <span className="text-white font-bold">Max Load: {athlete.adminDecision.maxWorkloadM}m</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Physical Attributes Bento Strip (Only for Player or when editing specs) */}
      <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-3.5 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Activity className="w-3 h-3 text-[#ff5500]" />
            <span>{isAdmin ? 'COACHING PROFILE & SPECS' : 'PHYSICAL PROFILE & BIOMETRICS'}</span>
          </span>
          <button
            onClick={onEditProfile}
            className="text-[10px] font-bold text-slate-400 hover:text-[#ff5500] transition-colors uppercase"
          >
            Edit Specs
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-[#0c1015] border border-slate-800/80 rounded-xl p-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">AGE</span>
            <span className="text-xs font-black text-white">{athlete.age || (isAdmin ? 32 : 23)} yrs</span>
          </div>

          <div className="bg-[#0c1015] border border-slate-800/80 rounded-xl p-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">HEIGHT</span>
            <span className="text-xs font-black text-white">{athlete.height || "180 cm"}</span>
          </div>

          <div className="bg-[#0c1015] border border-slate-800/80 rounded-xl p-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">WEIGHT</span>
            <span className="text-xs font-black text-white">{athlete.weight || "75 kg"}</span>
          </div>

          <div className="bg-[#0c1015] border border-slate-800/80 rounded-xl p-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase block">
              {isAdmin ? 'ROLE' : 'FOOT'}
            </span>
            <span className="text-xs font-black text-[#ff5500]">
              {isAdmin ? 'STAFF' : athlete.preferredFoot || 'Right'}
            </span>
          </div>
        </div>

        {/* Bio quote */}
        {athlete.bio && (
          <p className="mt-2.5 text-[11px] text-slate-300 bg-[#0c1015] p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
            "{athlete.bio}"
          </p>
        )}
      </div>

      {/* 3.5. Kit & Gear Allocation (Admin Decided Only) */}
      <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-3.5 shadow-md space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-[#ff5500]" />
            <span>Assigned Kit & Match Gear</span>
          </span>
          <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
            Admin Allocated Only
          </span>
        </div>

        {athlete.kitIssued && (athlete.kitIssued.jerseySize || athlete.kitIssued.bootSize) ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-[#0c1015] border border-slate-800/80 rounded-xl p-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">JERSEY SIZE</span>
                <span className="text-xs font-black text-white">{athlete.kitIssued.jerseySize || 'Pending'}</span>
              </div>
              <div className="bg-[#0c1015] border border-slate-800/80 rounded-xl p-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">BOOT SIZE</span>
                <span className="text-xs font-black text-[#ff5500]">{athlete.kitIssued.bootSize || 'Pending'}</span>
              </div>
              <div className="bg-[#0c1015] border border-slate-800/80 rounded-xl p-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">KIT BAG</span>
                <span className={`text-xs font-black ${athlete.kitIssued.kitBagAssigned ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {athlete.kitIssued.kitBagAssigned ? 'ISSUED' : 'PENDING'}
                </span>
              </div>
              <div className="bg-[#0c1015] border border-slate-800/80 rounded-xl p-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">TRAINING BALL</span>
                <span className={`text-xs font-black ${athlete.kitIssued.ballAssigned ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {athlete.kitIssued.ballAssigned ? 'ISSUED' : 'PENDING'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
              <span className="text-slate-500 font-bold uppercase text-[9px]">Admin Gear Status:</span>
              <span className={`px-2 py-0.5 rounded-md font-semibold border ${athlete.kitIssued.shinGuards ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#0c1015] border-slate-800 text-slate-500'}`}>
                {athlete.kitIssued.shinGuards ? '✓ Shin Guards Issued' : 'Shin Guards: Pending'}
              </span>
              <span className={`px-2 py-0.5 rounded-md font-semibold border ${athlete.kitIssued.gripSocks ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#0c1015] border-slate-800 text-slate-500'}`}>
                {athlete.kitIssued.gripSocks ? '✓ Grip Socks Issued' : 'Grip Socks: Pending'}
              </span>
              <span className={`px-2 py-0.5 rounded-md font-semibold border ${athlete.kitIssued.gpsTrackerAssigned ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-[#0c1015] border-slate-800 text-slate-500'}`}>
                {athlete.kitIssued.gpsTrackerAssigned ? '✓ GPS Pod Issued' : 'GPS Pod: Pending'}
              </span>
            </div>
          </>
        ) : (
          <div className="bg-[#0c1015] border border-slate-800/80 rounded-xl p-3 text-center space-y-1">
            <p className="text-xs font-bold text-slate-300">Awaiting Official Kit & Gear Allocation</p>
            <p className="text-[11px] text-slate-500">
              Training jersey, boot sizing, and matchday equipment are decided and assigned directly by the Academy Admin / Head Coach.
            </p>
          </div>
        )}
      </div>

      {/* 4. Overall Rating & Performance Stats */}
      <div className="space-y-3">
        {/* Overall Rating Card */}
        <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                {isAdmin ? 'SQUAD PERFORMANCE INDEX' : 'OVERALL RATING'}
              </span>
              {isAdmin && (
                <span className="text-[9px] font-mono text-indigo-400 bg-indigo-950 px-1.5 py-0.2 rounded font-bold uppercase border border-indigo-800">
                  Staff Verified
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-4xl font-black text-white tracking-tight">
                {athlete.overallRating.toFixed(1)}
              </span>
              <span
                className={`text-sm font-black flex items-center ${athlete.ratingChange >= 0 ? 'text-[#ff5500]' : 'text-rose-500'
                  }`}
              >
                {athlete.ratingChange >= 0 ? `↑ ${athlete.ratingChange}` : `↓ ${Math.abs(athlete.ratingChange)}`}
              </span>
            </div>
          </div>
          <button
            onClick={isAdmin ? onAdminDecidePerformance : onOpenFullReport}
            className="p-3 bg-[#ff5500]/10 hover:bg-[#ff5500]/20 rounded-2xl border border-[#ff5500]/20 text-[#ff5500] transition-colors"
          >
            <Award className="w-6 h-6" />
          </button>
        </div>

        {/* 4-Grid Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-3.5 shadow-md">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {isAdmin ? 'SQUAD MATCHES' : 'GAMES'}
            </span>
            <p className="text-2xl font-black text-white mt-0.5">
              {athlete.stats?.games ?? 0}
            </p>
          </div>

          {getSportFromSpecialty(athlete.sportSpecialty) === 'Cricket' ? (
            <>
              <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-3.5 shadow-md">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {isAdmin ? 'TOTAL RUNS' : 'RUNS'}
                </span>
                <p className="text-2xl font-black text-white mt-0.5">
                  {athlete.stats?.runs ?? 0}
                </p>
              </div>

              <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-3.5 shadow-md">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {isAdmin ? 'TOTAL WICKETS' : 'WICKETS'}
                </span>
                <p className="text-2xl font-black text-white mt-0.5">
                  {athlete.stats?.wickets ?? 0}
                </p>
              </div>
            </>
          ) : getSportFromSpecialty(athlete.sportSpecialty) === 'Basketball' ? (
            <>
              <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-3.5 shadow-md">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {isAdmin ? 'POINTS SCORED' : 'POINTS'}
                </span>
                <p className="text-2xl font-black text-white mt-0.5">
                  {athlete.stats?.points ?? 0}
                </p>
              </div>

              <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-3.5 shadow-md">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {isAdmin ? 'TACTICAL ASSISTS' : 'ASSISTS'}
                </span>
                <p className="text-2xl font-black text-white mt-0.5">
                  {athlete.stats?.assists ?? 0}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-3.5 shadow-md">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {isAdmin ? 'GOALS MANAGED' : 'GOALS'}
                </span>
                <p className="text-2xl font-black text-white mt-0.5">
                  {athlete.stats?.goals ?? 0}
                </p>
              </div>

              <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-3.5 shadow-md">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {isAdmin ? 'TACTICAL ASSISTS' : 'ASSISTS'}
                </span>
                <p className="text-2xl font-black text-white mt-0.5">
                  {athlete.stats?.assists ?? 0}
                </p>
              </div>
            </>
          )}

          <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-3.5 shadow-md">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {isAdmin ? 'TOP VELOCITY CAP' : 'TOP SPD'}
            </span>
            <p className="text-2xl font-black text-white mt-0.5">
              {athlete.stats?.topSpeed ?? 32.0}{' '}
              <span className="text-xs font-semibold text-slate-400">km/h</span>
            </p>
          </div>
        </div>

        {/* Kinetic Symmetry & Bilateral Force Strip */}
        <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-3.5 shadow-md">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
            <span className="text-slate-400">Kinetic Symmetry</span>
            <span className="text-[#00e5a3] font-mono font-black">
              {athlete.stats?.symmetry ?? 95}% Symmetrical
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-[#ff5500] to-[#00e5a3] h-full rounded-full transition-all duration-500"
              style={{ width: `${athlete.stats?.symmetry ?? 95}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mt-1.5">
            <span>Left: {athlete.stats?.forceBalance?.left ?? 50}%</span>
            <span>Right: {athlete.stats?.forceBalance?.right ?? 50}%</span>
          </div>
        </div>
      </div>

      {/* 5. RECENT MATCHES (If any exist) */}
      {athlete.recentMatches && athlete.recentMatches.length > 0 && (
        <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              RECENT MATCHES
            </h3>
            <button
              onClick={onViewAllMatches}
              className="text-[11px] font-bold text-[#ff5500] hover:text-[#ff7722] flex items-center gap-0.5 uppercase tracking-wider"
            >
              <span>VIEW ALL</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-12 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800">
            <span className="col-span-7">OPPONENT</span>
            <span className="col-span-3 text-center">RESULT</span>
            <span className="col-span-2 text-right">RATING</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {athlete.recentMatches.slice(0, 3).map((match) => (
              <div
                key={match.id}
                className="grid grid-cols-12 items-center py-3 hover:bg-slate-800/30 transition-colors rounded-lg px-1 cursor-pointer"
                onClick={onViewAllMatches}
              >
                <div className="col-span-7 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-400 shrink-0">
                    <Shield className="w-4 h-4 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-snug">{match.opponent}</p>
                    <p className="text-[10px] text-slate-400">{match.date}</p>
                  </div>
                </div>

                <div className="col-span-3 text-center">
                  <span
                    className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${match.result.startsWith('W')
                      ? 'text-white font-mono'
                      : 'text-slate-300 font-mono'
                      }`}
                  >
                    {match.result}
                  </span>
                </div>

                <div className="col-span-2 text-right">
                  <span className="text-sm font-black text-white font-mono">
                    {match.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. PERFORMANCE ANALYTICS CHART */}
      <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-white">
            PERFORMANCE ANALYTICS
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#ff5500]" />
            <span>CALIBRATION PROGRESS</span>
          </div>
        </div>

        {/* SVG Curve Chart */}
        <div className="relative h-48 w-full my-2">
          <svg viewBox="0 0 320 160" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff5500" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ff5500" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <line x1="30" y1="20" x2="310" y2="20" stroke="#1f2937" strokeWidth="1" strokeDasharray="2 2" />
            <text x="5" y="23" fill="#64748b" fontSize="8" fontFamily="monospace">100</text>

            <line x1="30" y1="50" x2="310" y2="50" stroke="#1f2937" strokeWidth="1" strokeDasharray="2 2" />
            <text x="10" y="53" fill="#64748b" fontSize="8" fontFamily="monospace">95</text>

            <line x1="30" y1="80" x2="310" y2="80" stroke="#1f2937" strokeWidth="1" strokeDasharray="2 2" />
            <text x="10" y="83" fill="#64748b" fontSize="8" fontFamily="monospace">90</text>

            <line x1="30" y1="110" x2="310" y2="110" stroke="#1f2937" strokeWidth="1" strokeDasharray="2 2" />
            <text x="10" y="113" fill="#64748b" fontSize="8" fontFamily="monospace">85</text>

            <line x1="30" y1="140" x2="310" y2="140" stroke="#1f2937" strokeWidth="1" strokeDasharray="2 2" />
            <text x="10" y="143" fill="#64748b" fontSize="8" fontFamily="monospace">80</text>

            <path
              d="M 45 70 L 95 62 L 145 44 L 195 48 L 245 32 L 295 24 L 295 140 L 45 140 Z"
              fill="url(#curveGradient)"
            />

            <path
              d="M 45 70 L 95 62 L 145 44 L 195 48 L 245 32 L 295 24"
              fill="none"
              stroke="#ff5500"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {[
              { x: 45, y: 70, month: 'MAY', val: 92.0, idx: 0 },
              { x: 95, y: 62, month: 'JUN', val: 93.1, idx: 1 },
              { x: 145, y: 44, month: 'JUL', val: 95.4, idx: 2 },
              { x: 195, y: 48, month: 'AUG', val: 94.8, idx: 3 },
              { x: 245, y: 32, month: 'SEP', val: 96.5, idx: 4 },
              { x: 295, y: 24, month: 'OCT', val: 97.2, idx: 5 },
            ].map((p) => {
              const isSelected = selectedPoint === p.idx;
              return (
                <g key={p.month} className="cursor-pointer" onClick={() => setSelectedPoint(p.idx)}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isSelected ? 6 : 4}
                    fill={isSelected ? '#ffffff' : '#ff5500'}
                    stroke="#ff5500"
                    strokeWidth={isSelected ? 3 : 1}
                    className="transition-all"
                  />
                  {isSelected && (
                    <circle cx={p.x} cy={p.y} r={10} fill="#ff5500" opacity="0.3" className="animate-ping" />
                  )}
                  <text
                    x={p.x}
                    y="155"
                    fill={isSelected ? '#ff5500' : '#64748b'}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    fontSize="9"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {p.month}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-3 bg-[#111822] border border-slate-800 rounded-xl p-3 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#ff5500]/10 text-[#ff5500] shrink-0 mt-0.5">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Performance Calibration Baseline</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
              {athlete.name} registered rating baseline active at {athlete.overallRating.toFixed(1)} under biomechanical tracking.
            </p>
          </div>
        </div>
      </div>

      {/* 7. TOP HIGHLIGHTS (If any exist) */}
      {athlete.highlights && athlete.highlights.length > 0 && (
        <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white">
              {isAdmin ? 'STAFF TACTICAL REELS' : 'TOP HIGHLIGHTS'}
            </h3>
            <button
              onClick={onViewAllHighlights}
              className="text-[11px] font-bold text-[#ff5500] hover:text-[#ff7722] flex items-center gap-0.5 uppercase tracking-wider"
            >
              <span>VIEW ALL</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            onClick={() => onPlayHighlight(athlete.highlights[0])}
            className="relative rounded-2xl overflow-hidden group cursor-pointer border border-slate-800 mb-3 shadow-lg"
          >
            <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
              <img
                src={athlete.highlights[0].thumbnail}
                alt={athlete.highlights[0].title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-[#ff5500] text-white flex items-center justify-center shadow-[0_0_25px_rgba(255,85,0,0.6)] group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <span className="bg-[#ff5500] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider inline-block mb-1">
                  FEATURED REEL
                </span>
                <h4 className="text-sm font-black text-white leading-tight">
                  {athlete.highlights[0].title}
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. TAPE & ANALYSIS / DRILLS */}
      <div className="bg-[#151c24] border border-slate-800/90 rounded-2xl p-4 shadow-xl">
        <h3 className="text-xs font-black uppercase tracking-wider text-white mb-3">
          {isAdmin ? 'COACHING TAPES & TACTICAL ANALYSIS' : 'TAPE & BIOMECHANICAL ANALYSIS'}
        </h3>

        {/* Upload Tape Card */}
        <div
          onClick={onUploadTape}
          className="border-2 border-dashed border-slate-700 hover:border-[#ff5500] rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 bg-slate-900/30 hover:bg-[#ff5500]/5 mb-3 group"
        >
          <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-[#ff5500]/20 text-slate-300 group-hover:text-[#ff5500] flex items-center justify-center mx-auto mb-2 transition-colors">
            <Upload className="w-5 h-5 stroke-[2.5]" />
          </div>
          <h4 className="text-sm font-black text-white group-hover:text-[#ff5500] transition-colors">
            {isAdmin ? 'Upload Tactical Drill / Tape' : 'Upload Video Tape'}
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
            Ingest MP4, MOV for automated optical telemetry
          </p>
        </div>

        {/* Tape Video Cards List */}
        {athlete.tapes && athlete.tapes.length > 0 && (
          <div className="space-y-3">
            {athlete.tapes.map((tape) => (
              <div
                key={tape.id}
                onClick={() => onPlayTape(tape)}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden group cursor-pointer shadow-md transition-all"
              >
                <div className="relative h-32 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={tape.thumbnail}
                    alt={tape.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-[#ff5500] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                      {tape.category}
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3">
                    <h4 className="text-xs font-black text-white leading-tight drop-shadow-md">
                      {tape.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{tape.duration} • {tape.dateAdded}</span>
                      {tape.playerHighlight && (
                        <span className="text-slate-300 font-mono text-[9px] bg-slate-800/80 px-1.5 py-0.5 rounded">
                          {tape.playerHighlight}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
