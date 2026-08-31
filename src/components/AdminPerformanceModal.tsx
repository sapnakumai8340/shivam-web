import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Award,
  Zap,
  Activity,
  TrendingUp,
  AlertTriangle,
  Heart,
  Gauge,
  CheckCircle2,
  Sliders,
  Scale,
  Clock,
  Check,
  Sparkles,
  Lock,
  UserCheck
} from 'lucide-react';
import { AthleteProfile, AdminDecision } from '../types';

interface AdminPerformanceModalProps {
  isOpen: boolean;
  athlete: AthleteProfile;
  onClose: () => void;
  onSaveAdminPerformance?: (updatedAthlete: Partial<AthleteProfile>) => void;
  onSave?: (decision: any) => void;
}

export const AdminPerformanceModal: React.FC<AdminPerformanceModalProps> = ({
  isOpen,
  athlete,
  onClose,
  onSaveAdminPerformance,
  onSave,
}) => {
  // Overall Rating & Trend
  const [overallRating, setOverallRating] = useState<number>(athlete?.overallRating ?? 88.0);
  const [ratingChange, setRatingChange] = useState<number>(athlete?.ratingChange ?? 0.0);
  const [status, setStatus] = useState<AthleteProfile['status']>(athlete?.status || 'ACTIVE');

  // Biomechanical & Kinematic Stats
  const [symmetry, setSymmetry] = useState<number>(athlete?.stats?.symmetry ?? 95);
  const [leftForce, setLeftForce] = useState<number>(athlete?.stats?.forceBalance?.left ?? 50);
  const [rightForce, setRightForce] = useState<number>(athlete?.stats?.forceBalance?.right ?? 50);
  const [topSpeed, setTopSpeed] = useState<number>(athlete?.stats?.topSpeed ?? 32.0);
  const [stamina, setStamina] = useState<number>(athlete?.stats?.stamina ?? 85);
  const [passAccuracy, setPassAccuracy] = useState<number>(athlete?.stats?.passAccuracy ?? 80);
  const [shotConversion, setShotConversion] = useState<number>(athlete?.stats?.shotConversion ?? 20);
  const [injuryRisk, setInjuryRisk] = useState<AthleteProfile['stats']['injuryRisk']>(athlete?.stats?.injuryRisk || 'LOW');

  // Admin Decision & Matchday Clearance
  const [clearanceStatus, setClearanceStatus] = useState<AdminDecision['clearanceStatus']>(
    athlete.adminDecision?.clearanceStatus || 'MATCH READY'
  );
  const [maxWorkloadM, setMaxWorkloadM] = useState<number>(athlete.adminDecision?.maxWorkloadM || 920);
  const [targetPaceKmH, setTargetPaceKmH] = useState<number>(athlete.adminDecision?.targetPaceKmH || 34.5);
  const [trainingFocus, setTrainingFocus] = useState<string>(
    athlete.adminDecision?.trainingFocus || 'Maximal sprint deceleration symmetry and right hamstring eccentric loading.'
  );
  const [notes, setNotes] = useState<string>(
    athlete.adminDecision?.notes || 'Cleared for starting 11 matchday intensity. Nominal bilateral force distribution.'
  );
  const [evaluatedBy, setEvaluatedBy] = useState<string>(
    athlete.adminDecision?.evaluatedBy || 'Performance Staff & Head Coach'
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  // Presets
  const applyPreset = (type: 'match_ready' | 'peak_boost' | 'deload_precaution' | 'rehab') => {
    if (type === 'match_ready') {
      setOverallRating(95.0);
      setRatingChange(2.4);
      setStatus('ACTIVE');
      setSymmetry(96);
      setLeftForce(50);
      setRightForce(50);
      setTopSpeed(34.8);
      setStamina(94);
      setInjuryRisk('LOW');
      setClearanceStatus('MATCH READY');
      setMaxWorkloadM(950);
      setTrainingFocus('Tactical matchday pressing and dynamic transition drills.');
      setNotes('Full matchday clearance granted for starting lineup.');
    } else if (type === 'peak_boost') {
      setOverallRating(97.5);
      setRatingChange(3.2);
      setStatus('ACTIVE');
      setSymmetry(98);
      setLeftForce(49);
      setRightForce(51);
      setTopSpeed(35.5);
      setStamina(96);
      setInjuryRisk('LOW');
      setClearanceStatus('MATCH READY');
      setMaxWorkloadM(1100);
      setTrainingFocus('Elite sprint acceleration & finishing.');
      setNotes('Peak physical conditioning verified by optical motion telemetry.');
    } else if (type === 'deload_precaution') {
      setOverallRating(91.5);
      setRatingChange(-1.0);
      setStatus('RESTING');
      setSymmetry(89);
      setLeftForce(44);
      setRightForce(56);
      setTopSpeed(31.0);
      setStamina(82);
      setInjuryRisk('MODERATE');
      setClearanceStatus('RESTRICTED MINUTES');
      setMaxWorkloadM(600);
      setTrainingFocus('Hamstring eccentric load management and light aerobic recovery.');
      setNotes('Restricted to max 45 minutes to prevent acute tissue fatigue.');
    } else if (type === 'rehab') {
      setOverallRating(87.0);
      setRatingChange(-3.5);
      setStatus('RECOVERING');
      setSymmetry(82);
      setLeftForce(41);
      setRightForce(59);
      setTopSpeed(26.5);
      setStamina(70);
      setInjuryRisk('ELEVATED');
      setClearanceStatus('MEDICAL CLEARANCE REQUIRED');
      setMaxWorkloadM(400);
      setTrainingFocus('Isokinetic joint stabilization & physiotherapy protocol.');
      setNotes('Not cleared for contact play. Daily scan monitoring mandated.');
    }
  };

  const handleLeftForceChange = (newLeft: number) => {
    const clamped = Math.max(30, Math.min(70, newLeft));
    setLeftForce(clamped);
    setRightForce(100 - clamped);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);

    const updatedData: Partial<AthleteProfile> = {
      overallRating: Number(overallRating),
      ratingChange: Number(ratingChange),
      status,
      adminDecision: {
        evaluatedBy,
        decisionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        clearanceStatus,
        maxWorkloadM: Number(maxWorkloadM),
        targetPaceKmH: Number(targetPaceKmH),
        trainingFocus,
        notes,
        isVerified: true,
      },
      stats: {
        ...athlete.stats,
        symmetry: Number(symmetry),
        topSpeed: Number(topSpeed),
        stamina: Number(stamina),
        passAccuracy: Number(passAccuracy),
        shotConversion: Number(shotConversion),
        injuryRisk,
        forceBalance: {
          left: Number(leftForce),
          right: Number(rightForce),
        },
      },
    };

    setTimeout(() => {
      if (typeof onSaveAdminPerformance === 'function') {
        onSaveAdminPerformance(updatedData);
      }
      if (typeof onSave === 'function') {
        onSave({
          overallRating: updatedData.overallRating ?? athlete.overallRating,
          ratingChange: updatedData.ratingChange ?? athlete.ratingChange,
          symmetry: updatedData.stats?.symmetry ?? athlete.stats.symmetry,
          forceLeft: updatedData.stats?.forceBalance.left ?? athlete.stats.forceBalance.left,
          forceRight: updatedData.stats?.forceBalance.right ?? athlete.stats.forceBalance.right,
          topSpeed: updatedData.stats?.topSpeed ?? athlete.stats.topSpeed,
          acwr: updatedData.stats?.acwr ?? athlete.stats.acwr,
          status: updatedData.status ?? athlete.status,
          adminDecision: updatedData.adminDecision ?? athlete.adminDecision,
          ...updatedData,
        });
      }
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#121922] border-2 border-[#ff5500]/60 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-6 flex flex-col max-h-[92vh]">
        {/* Header with Admin Badge */}
        <div className="bg-gradient-to-r from-[#1f130b] via-[#17212e] to-[#121922] px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ff5500] text-white flex items-center justify-center font-bold shadow-md shadow-[#ff5500]/40">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono font-black uppercase bg-[#ff5500]/20 text-[#ff5500] px-1.5 py-0.2 rounded border border-[#ff5500]/30">
                  ADMIN / COACH AUTHORITY
                </span>
                <span className="text-[10px] text-slate-400 font-mono">#{athlete.number} {athlete.name}</span>
              </div>
              <h2 className="text-base font-black text-white uppercase tracking-tight">
                Decide & Calibrate Performance
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {savedSuccess && (
            <div className="p-3 bg-[#00e5a3]/20 border border-[#00e5a3]/50 text-[#00e5a3] text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Performance parameters calibrated and locked by Admin!</span>
            </div>
          )}

          {/* Quick Preset Buttons */}
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1.5">
              Quick Calibration Profiles:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('match_ready')}
                className="py-1.5 px-2 bg-[#0c1015] hover:bg-[#ff5500]/10 border border-slate-800 hover:border-[#ff5500] rounded-xl text-[9px] font-black text-slate-300 hover:text-[#ff5500] uppercase transition-all"
              >
                ⚡ 100% Fit Ready
              </button>
              <button
                type="button"
                onClick={() => applyPreset('peak_boost')}
                className="py-1.5 px-2 bg-[#0c1015] hover:bg-[#00e5a3]/10 border border-slate-800 hover:border-[#00e5a3] rounded-xl text-[9px] font-black text-slate-300 hover:text-[#00e5a3] uppercase transition-all"
              >
                🔥 Peak Form
              </button>
              <button
                type="button"
                onClick={() => applyPreset('deload_precaution')}
                className="py-1.5 px-2 bg-[#0c1015] hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500 rounded-xl text-[9px] font-black text-slate-300 hover:text-amber-400 uppercase transition-all"
              >
                ⚠️ Deload (45m)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('rehab')}
                className="py-1.5 px-2 bg-[#0c1015] hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500 rounded-xl text-[9px] font-black text-slate-300 hover:text-rose-400 uppercase transition-all"
              >
                🩹 Rehab / Hold
              </button>
            </div>
          </div>

          {/* SECTION 1: INDEX & OVERALL RATING */}
          <div className="bg-[#0c1015] border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-[#ff5500] uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>1. Performance Index</span>
              </span>
              <span className="text-xl font-black font-mono text-white">
                {Number(overallRating).toFixed(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">
                  Overall Rating (60 - 99.9)
                </label>
                <input
                  type="range"
                  min="60"
                  max="99.9"
                  step="0.1"
                  value={overallRating}
                  onChange={(e) => setOverallRating(Number(e.target.value))}
                  className="w-full accent-[#ff5500] h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">
                  Weekly Trend Change (+/-)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={ratingChange}
                  onChange={(e) => setRatingChange(Number(e.target.value))}
                  className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-1.5 text-xs font-bold font-mono text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Athlete Activity Status */}
            <div className="pt-2 border-t border-slate-800/80">
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">
                Roster Activity Status
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['ACTIVE', 'RESTING', 'INJURED', 'RECOVERING'] as const).map((st) => (
                  <button
                    type="button"
                    key={st}
                    onClick={() => setStatus(st)}
                    className={`py-1.5 px-1 rounded-xl text-[9px] font-black uppercase transition-all ${status === st
                      ? st === 'ACTIVE'
                        ? 'bg-[#00e5a3] text-black font-bold'
                        : st === 'RESTING'
                          ? 'bg-amber-400 text-black font-bold'
                          : st === 'INJURED'
                            ? 'bg-rose-500 text-white font-bold'
                            : 'bg-blue-500 text-white font-bold'
                      : 'bg-[#121922] text-slate-400 hover:text-white border border-slate-800'
                      }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 2: BIOMECHANICAL & KINEMATIC BENCHMARKS */}
          <div className="bg-[#0c1015] border border-slate-800 rounded-2xl p-4 space-y-3">
            <span className="text-[10px] font-black text-[#ff5500] uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              <span>2. Biomechanical & Kinematic Benchmarks</span>
            </span>

            {/* Symmetry & Bilateral Force Balance */}
            <div className="space-y-2.5">
              <div>
                <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase mb-1">
                  <span>Kinetic Symmetry:</span>
                  <span className="font-mono text-[#00e5a3] text-xs font-black">{symmetry}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={symmetry}
                  onChange={(e) => setSymmetry(Number(e.target.value))}
                  className="w-full accent-[#00e5a3] h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase mb-1">
                  <span>Force Balance (L / R):</span>
                  <span className="font-mono text-white text-xs font-black">{leftForce}% L / {rightForce}% R</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="70"
                  value={leftForce}
                  onChange={(e) => handleLeftForceChange(Number(e.target.value))}
                  className="w-full accent-[#ff5500] h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Top Speed, Stamina, Injury Risk */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                  Top Speed (km/h)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={topSpeed}
                  onChange={(e) => setTopSpeed(Number(e.target.value))}
                  className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-xl px-2.5 py-1.5 text-xs font-bold font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                  Stamina (%)
                </label>
                <input
                  type="number"
                  value={stamina}
                  onChange={(e) => setStamina(Number(e.target.value))}
                  min={1}
                  max={100}
                  className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-xl px-2.5 py-1.5 text-xs font-bold font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                  Injury Risk
                </label>
                <select
                  value={injuryRisk}
                  onChange={(e) => setInjuryRisk(e.target.value as any)}
                  className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-xl px-2 py-1.5 text-xs font-bold text-white focus:outline-none"
                >
                  <option value="LOW">LOW</option>
                  <option value="MODERATE">MODERATE</option>
                  <option value="ELEVATED">ELEVATED</option>
                </select>
              </div>
            </div>

            {/* Pass Accuracy & Shot Conversion */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                  Pass Accuracy (%)
                </label>
                <input
                  type="number"
                  value={passAccuracy}
                  onChange={(e) => setPassAccuracy(Number(e.target.value))}
                  className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-xl px-2.5 py-1.5 text-xs font-bold font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                  Shot Conversion (%)
                </label>
                <input
                  type="number"
                  value={shotConversion}
                  onChange={(e) => setShotConversion(Number(e.target.value))}
                  className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-xl px-2.5 py-1.5 text-xs font-bold font-mono text-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: MATCHDAY CLEARANCE & COACH DIRECTIVES */}
          <div className="bg-[#0c1015] border border-slate-800 rounded-2xl p-4 space-y-3">
            <span className="text-[10px] font-black text-[#ff5500] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>3. Matchday Clearance & Tactical Directives</span>
            </span>

            {/* Clearance Status Selector */}
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">
                Medical & Match Clearance
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'MATCH READY', color: 'text-[#00e5a3] border-[#00e5a3]/40' },
                  { label: 'RESTRICTED MINUTES', color: 'text-amber-400 border-amber-400/40' },
                  { label: 'BENCH ROTATION', color: 'text-blue-400 border-blue-400/40' },
                  { label: 'MEDICAL CLEARANCE REQUIRED', color: 'text-rose-400 border-rose-400/40' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() => setClearanceStatus(item.label as any)}
                    className={`py-2 px-2 rounded-xl text-[9px] font-black uppercase text-left transition-all border ${clearanceStatus === item.label
                      ? 'bg-[#ff5500] text-white border-[#ff5500] shadow-md'
                      : 'bg-[#121922] text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Workload & Pace caps */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                  Max Sprint Workload (Meters)
                </label>
                <input
                  type="number"
                  value={maxWorkloadM}
                  onChange={(e) => setMaxWorkloadM(Number(e.target.value))}
                  placeholder="920"
                  className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-xl px-2.5 py-1.5 text-xs font-bold font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                  Staff Sign-off Evaluator
                </label>
                <input
                  type="text"
                  value={evaluatedBy}
                  onChange={(e) => setEvaluatedBy(e.target.value)}
                  placeholder="Coach Sarah Vance"
                  className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-xl px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Training Focus & Staff Notes */}
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                Prescribed Training Focus
              </label>
              <input
                type="text"
                value={trainingFocus}
                onChange={(e) => setTrainingFocus(e.target.value)}
                placeholder="Deceleration stability and bilateral power drills"
                className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                Official Coach Directive Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tactical instructions and medical clearance remarks..."
                className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-slate-400 hover:text-white bg-slate-800/80 transition-colors uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#ff5500] to-[#e64400] hover:from-[#ff6a1a] hover:to-[#ff5500] shadow-lg shadow-[#ff5500]/40 transition-all uppercase tracking-wider flex items-center gap-1.5 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Lock Admin Performance Decision</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
