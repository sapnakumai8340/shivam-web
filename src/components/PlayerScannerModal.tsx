import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Scan,
  Search,
  User,
  Zap,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Activity,
  Award,
  ShieldCheck,
  Camera,
  Hash,
  ChevronRight,
  Sparkles,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { AthleteProfile } from '../types';

interface PlayerScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityAthletes: Record<string, AthleteProfile>;
  onOpenPlayerProfile: (playerId: string) => void;
}

type ScanState = 'idle' | 'scanning' | 'found' | 'not_found';

export const PlayerScannerModal: React.FC<PlayerScannerModalProps> = ({
  isOpen,
  onClose,
  communityAthletes,
  onOpenPlayerProfile,
}) => {
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [inputCode, setInputCode] = useState('');
  const [foundPlayer, setFoundPlayer] = useState<AthleteProfile | null>(null);
  const [recentScans, setRecentScans] = useState<AthleteProfile[]>([]);
  const [animFrame, setAnimFrame] = useState(0);
  const animRef = useRef<number | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Animate scan line
  useEffect(() => {
    if (scanState === 'scanning') {
      let start = Date.now();
      const tick = () => {
        const elapsed = (Date.now() - start) % 2000;
        setScanProgress((elapsed / 2000) * 100);
        animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
      return () => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
      };
    }
  }, [scanState]);

  useEffect(() => {
    if (isOpen) {
      setScanState('idle');
      setInputCode('');
      setFoundPlayer(null);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const allPlayers: AthleteProfile[] = Object.values(communityAthletes);

  const searchPlayer = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return;

    setScanState('scanning');
    setScanProgress(0);

    setTimeout(() => {
      const found =
        allPlayers.find((p) => p.id.toLowerCase() === q) ||
        allPlayers.find((p) => p.code?.toLowerCase() === q || p.code?.toLowerCase().replace('#', '') === q) ||
        allPlayers.find(
          (p) =>
            p.id.toLowerCase().includes(q) ||
            p.name.toLowerCase().includes(q) ||
            (p.handle && p.handle.toLowerCase().includes(q)) ||
            String(p.number) === q
        );

      if (found) {
        setFoundPlayer(found);
        setScanState('found');
        setRecentScans((prev) => [found, ...prev.filter((p) => p.id !== found.id)].slice(0, 5));
      } else {
        setScanState('not_found');
      }
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchPlayer(inputCode);
  };

  const handleQuickScan = (player: AthleteProfile) => {
    setInputCode(player.id);
    setFoundPlayer(player);
    setScanState('found');
  };

  const handleOpenProfile = () => {
    if (foundPlayer) {
      onOpenPlayerProfile(foundPlayer.id);
      onClose();
    }
  };

  const statusColorMap: Record<string, string> = {
    ACTIVE: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    RESTING: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    INJURED: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
    RECOVERING: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0a0f17] border border-slate-800/80 rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ff5500]/15 via-[#0a0f17] to-[#0a0f17] border-b border-slate-800/80 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff5500] to-[#e64400] flex items-center justify-center shadow-lg shadow-[#ff5500]/30">
              <QrCode className="w-5 h-5 text-white stroke-[2]" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-tight">Player Scanner</h2>
              <p className="text-[10px] text-slate-400 font-medium">Scan ID • Name • Jersey • Handle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Scanner Viewport */}
          <div className="relative bg-[#050a10] border border-slate-800 rounded-2xl overflow-hidden aspect-[4/3] flex items-center justify-center">
            {/* Corner brackets */}
            {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-6 h-6 border-2 border-[#ff5500] rounded-sm opacity-70`} 
                style={{
                  borderRight: i % 2 === 0 ? 'none' : undefined,
                  borderLeft: i % 2 !== 0 ? 'none' : undefined,
                  borderBottom: i < 2 ? 'none' : undefined,
                  borderTop: i >= 2 ? 'none' : undefined,
                }}
              />
            ))}

            {scanState === 'idle' && (
              <div className="flex flex-col items-center gap-3 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#ff5500]/10 border border-[#ff5500]/30 flex items-center justify-center">
                  <Scan className="w-8 h-8 text-[#ff5500]" />
                </div>
                <p className="text-xs text-slate-400 font-medium">Enter player ID, name, jersey number, or handle below to scan & find</p>
              </div>
            )}

            {scanState === 'scanning' && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                {/* Animated scan line */}
                <div className="absolute inset-0">
                  <div
                    className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-[#ff5500] to-transparent opacity-80 shadow-[0_0_8px_2px_#ff5500]"
                    style={{ top: `${scanProgress}%`, transition: 'top 0.1s linear' }}
                  />
                </div>

                {/* Grid dots */}
                <div className="absolute inset-4 grid grid-cols-8 gap-2 opacity-10">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-[#ff5500]" />
                  ))}
                </div>

                <div className="relative flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full border-2 border-[#ff5500] border-t-transparent animate-spin" />
                  <span className="text-xs text-[#ff5500] font-black uppercase tracking-widest animate-pulse">Scanning...</span>
                </div>
              </div>
            )}

            {scanState === 'found' && foundPlayer && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 bg-[#050a10]">
                <div className="relative">
                  <img
                    src={foundPlayer.avatar}
                    alt={foundPlayer.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#00e5a3] shadow-lg shadow-[#00e5a3]/20"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#00e5a3] flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-black stroke-[2.5]" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-[#00e5a3] font-black uppercase tracking-widest mb-0.5">✓ Player Found</p>
                  <h3 className="text-sm font-black text-white">{foundPlayer.name}</h3>
                  <p className="text-[10px] text-slate-400">#{foundPlayer.number} · {foundPlayer.position} · {foundPlayer.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${statusColorMap[foundPlayer.status] || 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                    {foundPlayer.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#ff5500]/15 text-[#ff5500] border border-[#ff5500]/30">
                    {foundPlayer.overallRating?.toFixed(1)} OVR
                  </span>
                </div>
              </div>
            )}

            {scanState === 'not_found' && (
              <div className="flex flex-col items-center gap-3 px-6 text-center">
                <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-rose-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-rose-400">Player Not Found</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Try a different ID, name, or jersey number</p>
                </div>
              </div>
            )}
          </div>

          {/* Search Input */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Hash className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="APX-9942 / Rahul / #9 / @handle"
                className="w-full bg-[#0e141c] border border-slate-700 focus:border-[#ff5500] rounded-xl pl-8 pr-3 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={scanState === 'scanning' || !inputCode.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff661a] disabled:opacity-40 text-white text-xs font-black uppercase flex items-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-[#ff5500]/30"
            >
              <Search className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Scan</span>
            </button>
          </form>

          {/* Open Profile Button */}
          {scanState === 'found' && foundPlayer && (
            <button
              onClick={handleOpenProfile}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#00e5a3] to-[#00c48a] hover:brightness-110 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#00e5a3]/25"
            >
              <User className="w-4 h-4 stroke-[2.5]" />
              <span>Open Full Player Profile</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          {/* Quick Access — All Players */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#ff5500]" />
              Quick Access — All Squad Players
            </p>
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {allPlayers.filter((p) => p.position !== 'STAFF').map((player) => (
                <button
                  key={player.id}
                  onClick={() => handleQuickScan(player)}
                  className="w-full flex items-center gap-3 bg-[#0e141c] hover:bg-[#131c28] border border-slate-800 hover:border-slate-700 rounded-xl px-3 py-2.5 text-left transition-all group"
                >
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-white truncate">{player.name}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase border ${statusColorMap[player.status] || 'text-slate-500 bg-slate-800 border-slate-700'}`}>
                        {player.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">#{player.number} · {player.position} · {player.id}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-[#ff5500]">{player.overallRating?.toFixed(0)}</div>
                    <div className="text-[8px] text-slate-500 font-bold uppercase">OVR</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
