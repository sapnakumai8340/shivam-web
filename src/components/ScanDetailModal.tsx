import React from 'react';
import { X, Activity, ShieldCheck, Zap, ArrowUpRight, Cpu, CheckCircle2 } from 'lucide-react';
import { BiomechanicalScan } from '../types';

interface ScanDetailModalProps {
  scan: BiomechanicalScan | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ScanDetailModal: React.FC<ScanDetailModalProps> = ({ scan, isOpen, onClose }) => {
  if (!isOpen || !scan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#151c24] border border-slate-800 rounded-3xl p-5 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scan Header Image */}
        <div className="relative h-40 -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-3xl bg-slate-950">
          <img
            src={scan.imageUrl}
            alt={scan.athleteName}
            className="w-full h-full object-cover opacity-70"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151c24] via-transparent to-black/60" />

          <div className="absolute top-4 left-4">
            <span className="bg-[#ff5500] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              {scan.scanType}
            </span>
          </div>

          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-xl font-black text-white uppercase">{scan.athleteName}</h2>
            <p className="text-xs text-slate-300 font-medium">
              Scan Date: {scan.scanDate} • {scan.analysisTitle}
            </p>
          </div>
        </div>

        {/* Score & Risk Row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#0c1015] border border-slate-800 rounded-2xl p-3.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              EFFICIENCY SCORE
            </span>
            <div className="text-3xl font-black text-[#00e5a3] mt-0.5">
              {scan.efficiencyScore}
            </div>
          </div>

          <div className="bg-[#0c1015] border border-slate-800 rounded-2xl p-3.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              INJURY RISK
            </span>
            <div className="text-2xl font-black text-[#00e5a3] mt-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00e5a3] animate-pulse" />
              <span>{scan.injuryRisk}</span>
            </div>
          </div>
        </div>

        {/* Sensor Diagnostics Breakdown */}
        <div className="bg-[#0c1015] border border-slate-800 rounded-2xl p-4 mb-4">
          <h3 className="text-xs font-black uppercase text-white mb-3 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#ff5500]" />
            <span>Kinematic Telemetry Readings</span>
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Joint Load</span>
              <span className="text-base font-black text-white font-mono">{scan.metrics.jointLoadN} N</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Flexion Angle</span>
              <span className="text-base font-black text-white font-mono">{scan.metrics.flexionDeg}°</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Torque Peak</span>
              <span className="text-base font-black text-[#00e5a3] font-mono">{scan.metrics.torqueNm} Nm</span>
            </div>

            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Muscle Activation</span>
              <span className="text-base font-black text-[#ff5500] font-mono">{scan.metrics.muscleActivationPct}%</span>
            </div>
          </div>
        </div>

        {/* Clinical Notes & Recommendations */}
        <div className="bg-[#0c1015] border border-slate-800 rounded-2xl p-4 mb-4">
          <h3 className="text-xs font-black uppercase text-white mb-2 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#ff5500]" />
            <span>Biomechanical Observations</span>
          </h3>
          <ul className="text-xs text-slate-300 space-y-2">
            {scan.notes.map((note, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00e5a3] shrink-0 mt-0.5" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors"
        >
          Close Diagnostic
        </button>
      </div>
    </div>
  );
};
