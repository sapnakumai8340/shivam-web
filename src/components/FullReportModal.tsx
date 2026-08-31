import React from 'react';
import { X, Award, ShieldCheck, Activity, Zap, Download, Printer, CheckCircle2, TrendingUp, Cpu } from 'lucide-react';
import { AthleteProfile } from '../types';

interface FullReportModalProps {
  athlete: AthleteProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const FullReportModal: React.FC<FullReportModalProps> = ({ athlete, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#151c24] border border-slate-800 rounded-3xl p-5 max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="mb-4 pr-8">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff5500] text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
              CONFIDENTIAL
            </span>
            <span className="text-xs font-mono text-slate-400">#APX-9942</span>
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight mt-1">
            BIOMECHANICAL PERFORMANCE DOSSIER
          </h2>
          <p className="text-xs text-slate-400">Athlete: {athlete.name} • Striker #9</p>
        </div>

        {/* Executive Summary Score */}
        <div className="bg-[#0c1015] border border-slate-800 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                OVERALL KINEMATIC READINESS
              </span>
              <div className="text-3xl font-black text-[#00e5a3] mt-0.5">
                94.2 / 100
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-[#ff5500] uppercase block">
                PEAK FORM
              </span>
              <span className="text-xs text-slate-300 font-medium">90 min clear</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center">
            <div>
              <span className="text-[9px] text-slate-400 uppercase">Symmetry</span>
              <p className="text-sm font-bold text-[#ff5500]">{athlete?.stats?.symmetry ?? 95}%</p>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase">Injury Risk</span>
              <p className="text-sm font-bold text-[#00e5a3]">{athlete?.stats?.injuryRisk ?? 'LOW'}</p>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase">Top Speed</span>
              <p className="text-sm font-bold text-white">{athlete?.stats?.topSpeed ?? 32.0} km/h</p>
            </div>
          </div>
        </div>

        {/* Biomechanical Radar / Kinetic Chain Breakdown */}
        <div className="bg-[#0c1015] border border-slate-800 rounded-2xl p-4 mb-4">
          <h3 className="text-xs font-black uppercase text-white mb-3 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-[#ff5500]" />
            <span>Kinetic Axis Evaluation</span>
          </h3>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">Sprint Deceleration Absorption</span>
                <span className="font-mono text-[#00e5a3] font-bold">96%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#00e5a3] h-full rounded-full" style={{ width: '96%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">Patellar Tracking & VMO Symmetry</span>
                <span className="font-mono text-[#ff5500] font-bold">94%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#ff5500] h-full rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">Rotational Core Torque (Nm)</span>
                <span className="font-mono text-[#00e5a3] font-bold">92%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#00e5a3] h-full rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-slate-300">Q4 Sprint Velocity Preservation</span>
                <span className="font-mono text-[#00e5a3] font-bold">97%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#00e5a3] h-full rounded-full" style={{ width: '97%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Recovery & Deload Prescription */}
        <div className="bg-[#0c1015] border border-slate-800 rounded-2xl p-4 mb-4">
          <h3 className="text-xs font-black uppercase text-white mb-2 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#ff5500]" />
            <span>Targeted Recovery Protocol</span>
          </h3>
          <ul className="text-[11px] text-slate-300 space-y-1.5">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00e5a3] shrink-0 mt-0.5" />
              <span>15-minute contrast hydrotherapy post high-speed sprinting sessions.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00e5a3] shrink-0 mt-0.5" />
              <span>Eccentric hamstring Nordic curls (2 sets x 5 reps) on Matchday-2.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00e5a3] shrink-0 mt-0.5" />
              <span>Continue unilateral left quad loading to maintain 48L / 52R balance.</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-[#ff5500] hover:bg-[#ff6a1a] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_2px_15px_rgba(255,85,0,0.4)]"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={() => window.print()}
            className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-xl text-xs font-bold"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
