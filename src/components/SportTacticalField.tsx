import React, { useState } from 'react';
import { FixtureSchedule, SportType } from '../types';
import { SPORTS_CONFIG } from '../utils/sportsConfig';
import { Shield, Sparkles, User, Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface SportTacticalFieldProps {
  fixture: FixtureSchedule;
  onSelectPlayer?: (playerId: string) => void;
}

export const SportTacticalField: React.FC<SportTacticalFieldProps> = ({
  fixture,
  onSelectPlayer,
}) => {
  const sportType: SportType = fixture.sport || 'FOOTBALL';
  const sportConfig = SPORTS_CONFIG[sportType] || SPORTS_CONFIG.FOOTBALL;
  const [activePlayerHover, setActivePlayerHover] = useState<string | null>(null);

  // Find tactical preset for formation
  const matchedPreset = sportConfig.tacticalPresets.find(
    (p) => p.formation.toLowerCase().includes((fixture.tacticalFormation || '').toLowerCase())
  ) || sportConfig.tacticalPresets[0];

  // Map assigned lineup or preset players
  const tacticalNodes = matchedPreset ? matchedPreset.players.map((preset, idx) => {
    const assigned = fixture.assignedLineup[idx];
    return {
      id: assigned?.playerId || `node-${idx}`,
      name: assigned?.playerName || preset.name,
      number: assigned?.number || preset.number,
      position: assigned?.position || preset.position,
      readiness: assigned?.readiness || 95,
      status: assigned?.status || 'Confirmed',
      x: preset.x,
      y: preset.y,
    };
  }) : [];

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-[#090e14]">
      {/* Field Top Info Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#0c1219] border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-sm">{sportConfig.emoji}</span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-white uppercase text-[10px] tracking-wider">
                {fixture.tacticalFormation || sportConfig.formations[0]}
              </span>
              <span className={`text-[8px] px-1.5 py-0.2 rounded font-bold uppercase ${sportConfig.badgeBg} text-white border ${sportConfig.badgeBorder}`}>
                {sportConfig.name}
              </span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">
              Surface: {fixture.surfaceType || sportConfig.defaultSurfaces[0]}
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] font-mono text-[#00e5a3] font-bold bg-[#00e5a3]/10 px-1.5 py-0.5 rounded border border-[#00e5a3]/20">
            {fixture.readinessScore}% SQUAD READY
          </span>
        </div>
      </div>

      {/* Dynamic Field Canvas Canvas Container */}
      <div className="relative h-64 w-full select-none overflow-hidden flex items-center justify-center p-2">
        {/* 1. FOOTBALL GRASS PITCH */}
        {sportConfig.pitchType === 'grass_pitch' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#082214] via-[#0b2b19] to-[#082214]">
            {/* Turf stripes */}
            <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(0,255,140,0.06)_20px,rgba(0,255,140,0.06)_40px)]" />
            {/* Pitch border */}
            <div className="absolute inset-3 border-2 border-emerald-500/30 rounded-lg" />
            {/* Center line and circle */}
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-500/30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-emerald-500/30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
            {/* Top Penalty Box */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-36 h-14 border-b border-x border-emerald-500/30 rounded-b" />
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-6 border-b border-x border-emerald-500/30 rounded-b" />
            {/* Bottom Penalty Box */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-36 h-14 border-t border-x border-emerald-500/30 rounded-t" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-16 h-6 border-t border-x border-emerald-500/30 rounded-t" />
          </div>
        )}

        {/* 2. BASKETBALL HARDWOOD COURT */}
        {sportConfig.pitchType === 'hardwood_court' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#2a1708] via-[#331c0a] to-[#2a1708]">
            {/* Hardwood planks pattern */}
            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(255,160,50,0.1)_8px,rgba(255,160,50,0.1)_16px)]" />
            {/* Court boundary */}
            <div className="absolute inset-3 border-2 border-amber-500/40 rounded-lg" />
            {/* Center court circle */}
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-0.5 bg-amber-500/40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-amber-500/40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-amber-500/30 font-black text-[10px]">APEX</span>
            </div>
            {/* Top 3-point Arc & Key */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-48 h-24 border-b-2 border-amber-500/40 rounded-b-full" />
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-18 bg-amber-950/40 border-b border-x border-amber-500/40" />
            <div className="absolute top-18 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border border-dashed border-amber-500/40" />
            {/* Bottom 3-point Arc & Key */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-48 h-24 border-t-2 border-amber-500/40 rounded-t-full" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-24 h-18 bg-amber-950/40 border-t border-x border-amber-500/40" />
            <div className="absolute bottom-18 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border border-dashed border-amber-500/40" />
          </div>
        )}

        {/* 3. CRICKET OVAL FIELD */}
        {sportConfig.pitchType === 'cricket_oval' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#092212] via-[#0d2e19] to-[#092212]">
            {/* Outer boundary rope */}
            <div className="absolute inset-3 border-2 border-dashed border-sky-400/40 rounded-[45px]" />
            {/* 30-yard inner circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-44 border border-sky-400/30 rounded-[35px]" />
            {/* 22-Yard Pitch Strip */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-32 bg-[#3b2d18] border border-amber-600/60 rounded flex flex-col justify-between py-1 px-1">
              <div className="h-0.5 bg-white/70 w-full" />
              <div className="text-[7px] text-amber-200 text-center font-mono font-bold">22 YARDS</div>
              <div className="h-0.5 bg-white/70 w-full" />
            </div>
            {/* Wickets */}
            <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-4 h-1 bg-amber-200 rounded-sm" />
            <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 w-4 h-1 bg-amber-200 rounded-sm" />
          </div>
        )}

        {/* 4. TENNIS COURT */}
        {sportConfig.pitchType === 'tennis_court' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0c243c] via-[#103050] to-[#0c243c]">
            {/* Outer court */}
            <div className="absolute inset-4 border-2 border-yellow-400/50" />
            {/* Singles sidelines */}
            <div className="absolute top-4 bottom-4 left-10 w-px bg-yellow-400/30" />
            <div className="absolute top-4 bottom-4 right-10 w-px bg-yellow-400/30" />
            {/* Center Net */}
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-1 bg-white/90 shadow-[0_0_8px_white] flex items-center justify-between px-2">
              <div className="w-2 h-2 rounded-full bg-slate-200" />
              <span className="text-[8px] text-slate-800 font-black">NET</span>
              <div className="w-2 h-2 rounded-full bg-slate-200" />
            </div>
            {/* Service lines */}
            <div className="absolute left-10 right-10 top-[28%] h-px bg-yellow-400/40" />
            <div className="absolute left-10 right-10 bottom-[28%] h-px bg-yellow-400/40" />
            <div className="absolute top-[28%] bottom-[28%] left-1/2 -translate-x-1/2 w-px bg-yellow-400/40" />
          </div>
        )}

        {/* 5. RUGBY / GRIDIRON FIELD */}
        {sportConfig.pitchType === 'rugby_field' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#061e12] via-[#092b1a] to-[#061e12]">
            <div className="absolute inset-3 border-2 border-emerald-400/40" />
            {/* Try / End zones */}
            <div className="absolute inset-x-3 top-3 h-7 bg-emerald-900/40 border-b border-emerald-400/40 text-center text-[7px] text-emerald-300 font-bold flex items-center justify-center">TRY ZONE</div>
            <div className="absolute inset-x-3 bottom-3 h-7 bg-emerald-900/40 border-t border-emerald-400/40 text-center text-[7px] text-emerald-300 font-bold flex items-center justify-center">TRY ZONE</div>
            {/* Halfway line & 10m lines */}
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-400/40" />
            <div className="absolute inset-x-3 top-[35%] h-px border-t border-dashed border-emerald-400/30" />
            <div className="absolute inset-x-3 bottom-[35%] h-px border-t border-dashed border-emerald-400/30" />
          </div>
        )}

        {/* 6. RUNNING TRACK */}
        {sportConfig.pitchType === 'running_track' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#3a1010] via-[#4d1616] to-[#3a1010]">
            {/* Oval Track Lanes */}
            <div className="absolute inset-3 border-4 border-red-500/40 rounded-[50px]" />
            <div className="absolute inset-6 border-2 border-red-400/30 rounded-[40px]" />
            <div className="absolute inset-9 border border-red-400/20 rounded-[30px]" />
            {/* Center Infield */}
            <div className="absolute inset-12 bg-emerald-950/60 border border-emerald-800/40 rounded-[20px] flex items-center justify-center">
              <span className="text-[9px] font-black text-purple-300/60 uppercase">400M TARTAN OVAL</span>
            </div>
            {/* Finish Line */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-9 bg-white shadow-[0_0_8px_white]" />
          </div>
        )}

        {/* 7. HOCKEY TURF */}
        {sportConfig.pitchType === 'hockey_turf' && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#06202c] via-[#093245] to-[#06202c]">
            <div className="absolute inset-3 border-2 border-cyan-400/40" />
            <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-0.5 bg-cyan-400/40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-cyan-400/30" />
            {/* Top D striking circle */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-16 border-b border-x border-cyan-400/40 rounded-b-full" />
            {/* Bottom D striking circle */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-32 h-16 border-t border-x border-cyan-400/40 rounded-t-full" />
          </div>
        )}

        {/* Tactical Player Nodes Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-auto">
          {tacticalNodes.map((node) => {
            const isHovered = activePlayerHover === node.id;
            const isStar = node.number === 9 || node.number === 1;

            return (
              <div
                key={node.id}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseEnter={() => setActivePlayerHover(node.id)}
                onMouseLeave={() => setActivePlayerHover(null)}
                onClick={() => onSelectPlayer && onSelectPlayer(node.id)}
                className="absolute flex flex-col items-center group cursor-pointer"
              >
                {/* Node Pin Badge */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all transform group-hover:scale-125 duration-150 ${
                    isStar
                      ? 'bg-[#ff5500] text-white border-2 border-amber-300 shadow-[0_0_12px_#ff5500]'
                      : 'bg-[#101720] text-white border border-slate-600 group-hover:border-[#ff5500] shadow-md'
                  }`}
                >
                  {node.number}
                </div>

                {/* Player Name Pill */}
                <div className="mt-0.5 bg-black/80 backdrop-blur-xs px-1.5 py-0.2 rounded border border-slate-700/80 text-[8px] font-bold text-slate-200 group-hover:text-[#ff5500] group-hover:border-[#ff5500] whitespace-nowrap transition-colors">
                  {node.name.split(' ')[0]}
                </div>

                {/* Detailed Hover Tooltip Card */}
                {isHovered && (
                  <div className="absolute bottom-full mb-1 z-30 bg-[#0d141e] border border-[#ff5500] rounded-xl p-2 shadow-2xl w-36 pointer-events-none animate-in fade-in zoom-in-95">
                    <div className="text-[10px] font-black text-white uppercase">{node.name}</div>
                    <div className="text-[8px] text-slate-400">{node.position}</div>
                    <div className="flex items-center justify-between mt-1 text-[8px]">
                      <span className="text-[#00e5a3] font-mono font-bold">⚡ {node.readiness}% Ready</span>
                      <span className="text-slate-400 uppercase font-mono">{node.status}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Field Directives Footer */}
      {fixture.adminDirectives && fixture.adminDirectives.length > 0 && (
        <div className="p-3 bg-[#0a0f15] border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ff5500]" />
            <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider">
              Coach & Tactical Directives
            </span>
          </div>
          <ul className="space-y-1 text-[11px] text-slate-400">
            {fixture.adminDirectives.map((dir, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-[#ff5500] font-bold">•</span>
                <span>{dir}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
