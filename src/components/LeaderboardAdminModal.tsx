import React, { useEffect, useState } from 'react';
import { X, Trophy, Save, ShieldCheck } from 'lucide-react';
import { AthleteProfile } from '../types';

interface LeaderboardAdminModalProps {
  isOpen: boolean;
  players: AthleteProfile[];
  onClose: () => void;
  onSave: (players: AthleteProfile[]) => void;
}

export const LeaderboardAdminModal: React.FC<LeaderboardAdminModalProps> = ({
  isOpen, players, onClose, onSave
}) => {
  const [draft, setDraft] = useState<AthleteProfile[]>(players);

  useEffect(() => {
    if (isOpen) setDraft(players);
  }, [isOpen, players]);

  if (!isOpen) return null;

  const updateRating = (id: string, value: number) => {
    setDraft(prev => prev.map(p => p.id === id ? {
      ...p,
      overallRating: Math.max(0, Math.min(99.9, value))
    } : p));
  };

  const sorted = [...draft].sort((a, b) => b.overallRating - a.overallRating);

  return (
    <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-3">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-[#ff5500]/50 bg-[#0d141c] shadow-2xl">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#ff5500] text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Admin Control
            </div>
            <h2 className="text-xl font-black text-white uppercase italic">Leaderboard Control</h2>
            <p className="text-[11px] text-slate-400">Change player ratings. Ranking updates automatically.</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[68vh] space-y-2">
          {sorted.map((player, index) => (
            <div key={player.id} className="grid grid-cols-[34px_1fr_90px] items-center gap-3 p-3 rounded-2xl bg-[#111b25] border border-slate-800">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                index === 0 ? 'bg-yellow-400 text-black' : index === 1 ? 'bg-slate-300 text-black' : index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {index + 1}
              </div>
              <div className="flex items-center gap-3 min-w-0">
                <img src={player.avatar} className="w-10 h-10 rounded-xl object-cover border border-slate-700" />
                <div className="min-w-0">
                  <p className="text-sm font-black text-white truncate">{player.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase">{player.position} • #{player.number}</p>
                </div>
              </div>
              <div>
                <label className="text-[8px] uppercase font-black text-slate-500 block mb-1">Rating</label>
                <input
                  type="number" min="0" max="99.9" step="0.1"
                  value={player.overallRating}
                  onChange={e => updateRating(player.id, Number(e.target.value))}
                  className="w-full rounded-xl bg-[#080d12] border border-slate-700 px-2 py-2 text-sm text-white font-black text-center focus:outline-none focus:border-[#ff5500]"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800 flex gap-2">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl bg-slate-800 text-slate-300 font-black text-xs uppercase">Cancel</button>
          <button onClick={() => { onSave(draft); onClose(); }} className="flex-1 py-3 rounded-2xl bg-[#ff5500] text-white font-black text-xs uppercase flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Save Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};
