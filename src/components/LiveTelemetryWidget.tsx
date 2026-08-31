import React from 'react';
import { 
  Activity, 
  Heart, 
  Zap, 
  Gauge, 
  Radio, 
  Play, 
  Pause, 
  Crosshair, 
  TrendingUp, 
  Flame, 
  ShieldCheck,
  Compass
} from 'lucide-react';
import { LiveTelemetrySnapshot } from '../utils/realtimeStore';

interface LiveTelemetryWidgetProps {
  telemetry: LiveTelemetrySnapshot;
  onToggleSession: () => void;
  onOpenScan?: () => void;
}

export const LiveTelemetryWidget: React.FC<LiveTelemetryWidgetProps> = ({
  telemetry,
  onToggleSession,
  onOpenScan,
}) => {
  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-b from-[#111720] to-[#0d1219] border border-slate-800/80 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden mb-4">
      {/* Background Subtle Radar Pulse Effect */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff5500]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#00e5a3]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Live Status Indicator */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${telemetry.isSessionActive ? 'bg-[#00e5a3]' : 'bg-slate-500'}`} />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${telemetry.isSessionActive ? 'bg-[#00e5a3]' : 'bg-slate-600'}`} />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                LIVE BIO-SENSOR TELEMETRY STREAM
              </h3>
              <span className="bg-[#ff5500]/20 text-[#ff5500] text-[8px] font-black px-1.5 py-0.2 rounded font-mono">
                100 Hz
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              {telemetry.isSessionActive ? `ACTIVE WORKOUT SESSION • ${formatDuration(telemetry.activeSessionDurationSec)}` : 'STANDBY / BASELINE RECOVERY'}
            </p>
          </div>
        </div>

        {/* Live Controller Button */}
        <button
          onClick={onToggleSession}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md ${
            telemetry.isSessionActive
              ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
              : 'bg-[#00e5a3]/20 border border-[#00e5a3]/40 text-[#00e5a3] hover:bg-[#00e5a3]/30'
          }`}
        >
          {telemetry.isSessionActive ? (
            <>
              <Pause className="w-3 h-3" />
              <span>Pause Live</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3" />
              <span>Start Session</span>
            </>
          )}
        </button>
      </div>

      {/* Grid of Real-Time Biometric Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5">
        {/* Metric 1: Heart Rate */}
        <div className="bg-[#080d12]/90 border border-slate-800 rounded-2xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
              HEART RATE
            </span>
            <Heart className={`w-3.5 h-3.5 ${telemetry.isSessionActive ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {telemetry.heartRate}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase">BPM</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-[#00e5a3]">
            <TrendingUp className="w-2.5 h-2.5" />
            <span>HRV: {telemetry.hrvMs}ms</span>
          </div>
        </div>

        {/* Metric 2: Live Velocity & Acceleration */}
        <div className="bg-[#080d12]/90 border border-slate-800 rounded-2xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
              SPRINT VELOCITY
            </span>
            <Zap className="w-3.5 h-3.5 text-[#ff5500]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#ff5500] tracking-tight">
              {telemetry.currentSpeed}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase">KM/H</span>
          </div>
          <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-slate-300">
            <span>Acc: {telemetry.speedDelta > 0 ? `+${telemetry.speedDelta}` : telemetry.speedDelta} m/s²</span>
          </div>
        </div>

        {/* Metric 3: Bilateral Symmetry */}
        <div className="bg-[#080d12]/90 border border-slate-800 rounded-2xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
              BILATERAL SYMMETRY
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#00e5a3]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black font-mono text-[#00e5a3] tracking-tight">
              {telemetry.bilateralSymmetry}%
            </span>
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mt-1">
            <span>L: {telemetry.groundForceLeft}N</span>
            <span>R: {telemetry.groundForceRight}N</span>
          </div>
        </div>

        {/* Metric 4: Intensity Zone */}
        <div className="bg-[#080d12]/90 border border-slate-800 rounded-2xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
              INTENSITY ZONE
            </span>
            <Flame className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xs font-black font-mono text-amber-400 tracking-wide mt-1 line-clamp-1">
            {telemetry.intensityZone}
          </div>
          <div className="flex items-center gap-1 mt-1.5 text-[9px] font-bold text-slate-300">
            <span>ACWR: </span>
            <span className="text-[#00e5a3] font-mono font-bold">{telemetry.acwrLive} (Optimal)</span>
          </div>
        </div>
      </div>

      {/* Mini Real-Time Pitch Heatmap Tracker & Joint Torque Status */}
      <div className="bg-[#080d12]/80 border border-slate-800/80 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Pitch Tracking Visual */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-28 h-16 bg-[#0c1f14] border border-emerald-900/60 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
            {/* Pitch Lines */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-emerald-700/40" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-emerald-700/40" />
            <div className="absolute left-0 top-1/4 bottom-1/4 w-3 border-r border-y border-emerald-700/40" />
            <div className="absolute right-0 top-1/4 bottom-1/4 w-3 border-l border-y border-emerald-700/40" />

            {/* Dynamic Player Real-Time Dot */}
            <div
              className="absolute w-3 h-3 bg-[#ff5500] rounded-full border-2 border-white shadow-[0_0_10px_#ff5500] transition-all duration-700 ease-out"
              style={{
                left: `${telemetry.pitchX}%`,
                top: `${telemetry.pitchY}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          </div>

          <div>
            <div className="text-[10px] font-black uppercase text-slate-300 flex items-center gap-1">
              <Compass className="w-3 h-3 text-[#ff5500]" />
              <span>LIVE GPS PITCH LOCALIZATION</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Attacking Third • Position ({telemetry.pitchX}m, {telemetry.pitchY}m) • Cadence {telemetry.cadenceRpm} RPM
            </p>
          </div>
        </div>

        {/* Quick Optical Scan Trigger */}
        {onOpenScan && (
          <button
            onClick={onOpenScan}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff6b2b] text-white text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_2px_12px_rgba(255,85,0,0.35)] hover:scale-105 transition-all flex-shrink-0"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Launch Live Optical Scan</span>
          </button>
        )}
      </div>
    </div>
  );
};
