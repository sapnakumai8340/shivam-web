import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Plus,
  CheckCircle2,
  Shield,
  Sparkles,
  Clock,
  Trophy,
  ChevronRight,
  CloudSun,
  Compass,
  Layers,
  UserCheck,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { FixtureSchedule, SportType, FixtureLineupPlayer } from '../types';
import { SPORTS_CONFIG } from '../utils/sportsConfig';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFixture: (fixture: FixtureSchedule) => void;
}

const AVAILABLE_SQUAD_PLAYERS = [
  { id: 'APX-9942', name: 'Rahul Kumar', defaultNumber: 9, defaultReadiness: 98, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' },
  { id: 'APX-7710', name: 'Elena Voss', defaultNumber: 7, defaultReadiness: 97, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80' },
  { id: 'APX-8831', name: 'Sarah Vance', defaultNumber: 11, defaultReadiness: 94, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80' },
  { id: 'APX-6604', name: 'David Sterling', defaultNumber: 10, defaultReadiness: 92, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80' },
  { id: 'APX-5512', name: 'Mateo Silva', defaultNumber: 8, defaultReadiness: 90, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80' },
  { id: 'APX-4421', name: 'Tariq Al-Mansoor', defaultNumber: 6, defaultReadiness: 95, avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&q=80' },
  { id: 'APX-3310', name: 'Lucas Walker', defaultNumber: 3, defaultReadiness: 88, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80' },
  { id: 'APX-2209', name: 'Leo Kante', defaultNumber: 4, defaultReadiness: 96, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&q=80' },
  { id: 'APX-2208', name: 'Victor Sanchez', defaultNumber: 5, defaultReadiness: 93, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80' },
  { id: 'APX-1104', name: 'Jordan Banks', defaultNumber: 2, defaultReadiness: 89, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80' },
  { id: 'APX-0011', name: 'Kasper Lind', defaultNumber: 1, defaultReadiness: 99, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80' },
];

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onAddFixture }) => {
  const [selectedSport, setSelectedSport] = useState<SportType>('FOOTBALL');
  const [tab, setTab] = useState<'details' | 'roster' | 'tactics'>('details');

  // Form Fields
  const [opponent, setOpponent] = useState('Titan United');
  const [opponentLogo, setOpponentLogo] = useState('⚡');
  const [opponentColor, setOpponentColor] = useState('#3b82f6');
  const [matchType, setMatchType] = useState('Championship Derby');
  const [competition, setCompetition] = useState('Premier Championship');
  const [dateTime, setDateTime] = useState('Saturday, Nov 11 • 19:45');
  const [venue, setVenue] = useState(' Stadium (Home)');
  const [surfaceType, setSurfaceType] = useState('Hybrid Natural Grass');
  const [weatherCondition, setWeatherCondition] = useState('Floodlights • 18°C Clear');
  const [isHome, setIsHome] = useState(true);
  const [tacticalFormation, setTacticalFormation] = useState('4-3-3 Attacking Press');
  const [refereeOfficial, setRefereeOfficial] = useState('FIFA Licensed Official');
  const [targetReadinessMin, setTargetReadinessMin] = useState(90);

  // Tactical Directives List
  const [directives, setDirectives] = useState<string[]>([
    'High-intensity defensive pressing in the opening 20 minutes.',
    'Fast transition on turnovers and aggressive wing play.',
    'Maintain physical load balance above target threshold.'
  ]);
  const [newDirectiveInput, setNewDirectiveInput] = useState('');

  // Selected Starters Lineup
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([
    'APX-9942',
    'APX-7710',
    'APX-8831',
    'APX-6604',
    'APX-5512',
  ]);

  // When sport changes, update defaults
  useEffect(() => {
    const config = SPORTS_CONFIG[selectedSport];
    if (config) {
      setCompetition(config.defaultCompetitions[0]);
      setMatchType(config.defaultMatchTypes[0]);
      setTacticalFormation(config.formations[0]);
      setSurfaceType(config.defaultSurfaces[0]);
      setVenue(config.defaultVenue);
      setOpponentLogo(config.emoji);

      // Sport specific opponent suggestions
      if (selectedSport === 'BASKETBALL') {
        setOpponent('Golden Bay Hoops');
        setOpponentColor('#f59e0b');
        setWeatherCondition('Indoor Arena • Climate 21°C');
      } else if (selectedSport === 'CRICKET') {
        setOpponent('Kings XI Cricket Club');
        setOpponentColor('#0284c7');
        setWeatherCondition('Sunny Clear • 26°C Low Wind');
      } else if (selectedSport === 'TENNIS') {
        setOpponent('Dominic Thiem / Alcaraz');
        setOpponentColor('#eab308');
        setWeatherCondition('Court Roof Open • 22°C');
      } else if (selectedSport === 'RUGBY') {
        setOpponent('Waikato Chiefs Pack');
        setOpponentColor('#059669');
        setWeatherCondition('Overcast • 16°C Light Dew');
      } else if (selectedSport === 'ATHLETICS') {
        setOpponent('National Sprint Invitational');
        setOpponentColor('#a855f7');
        setWeatherCondition('Track Tailwind +1.4 m/s • 24°C');
      } else if (selectedSport === 'HOCKEY') {
        setOpponent('Rotterdam Elite HC');
        setOpponentColor('#06b6d4');
        setWeatherCondition('Floodlights • 17°C Watered Turf');
      } else {
        setOpponent('Titan United FC');
        setOpponentColor('#ff5500');
        setWeatherCondition('Floodlights • 18°C Clear');
      }
    }
  }, [selectedSport]);

  if (!isOpen) return null;

  const currentSportConfig = SPORTS_CONFIG[selectedSport];

  // Quick Date Presets
  const handleQuickDate = (preset: string) => {
    setDateTime(preset);
  };

  // Toggle player starter selection
  const handleTogglePlayer = (playerId: string) => {
    setSelectedPlayerIds(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId);
      } else {
        return [...prev, playerId];
      }
    });
  };

  // Add directive
  const handleAddDirective = () => {
    if (!newDirectiveInput.trim()) return;
    setDirectives(prev => [...prev, newDirectiveInput.trim()]);
    setNewDirectiveInput('');
  };

  // Remove directive
  const handleRemoveDirective = (idx: number) => {
    setDirectives(prev => prev.filter((_, i) => i !== idx));
  };

  // Calculate squad readiness score
  const assignedPlayers: FixtureLineupPlayer[] = AVAILABLE_SQUAD_PLAYERS
    .filter(p => selectedPlayerIds.includes(p.id))
    .map((p, idx) => {
      const positionName = currentSportConfig.positionOptions[idx % currentSportConfig.positionOptions.length] || `Position #${idx + 1}`;
      return {
        playerId: p.id,
        playerName: p.name,
        number: p.defaultNumber,
        position: positionName,
        role: 'Starter',
        readiness: p.defaultReadiness,
        status: 'Confirmed',
      };
    });

  const calculatedReadiness = assignedPlayers.length > 0
    ? Math.round(assignedPlayers.reduce((acc, p) => acc + p.readiness, 0) / assignedPlayers.length)
    : 95;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFix: FixtureSchedule = {
      id: `fix-${Date.now()}`,
      sport: selectedSport,
      opponent,
      opponentLogo,
      opponentColor,
      matchType,
      competition,
      dateTime,
      venue,
      surfaceType,
      weatherCondition,
      isHome,
      tacticalFormation,
      assignedLineup: assignedPlayers,
      adminDirectives: directives,
      refereeOfficial,
      targetReadinessMin,
      readinessScore: calculatedReadiness,
      status: 'Scheduled',
    };

    onAddFixture(newFix);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#121820] border border-slate-800 rounded-3xl p-5 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff5500] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              ADMIN / COACH DESK
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Multi-Sport Scheduler
            </span>
          </div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight mt-1">
            SCHEDULE MATCH FIXTURE
          </h2>
          <p className="text-xs text-slate-400">
            Configure multi-sport matches, tactical formations, and squad starters
          </p>
        </div>

        {/* Sport Selector Bar (Multi-Sport Tabs) */}
        <div className="mb-3 shrink-0">
          <label className="block text-[9px] font-extrabold uppercase text-slate-400 mb-1.5 tracking-wider">
            1. SELECT SPORT CATEGORY
          </label>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {(Object.keys(SPORTS_CONFIG) as SportType[]).map((sportKey) => {
              const cfg = SPORTS_CONFIG[sportKey];
              const isSelected = selectedSport === sportKey;
              return (
                <button
                  key={sportKey}
                  type="button"
                  onClick={() => setSelectedSport(sportKey)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${isSelected
                      ? 'bg-gradient-to-r from-[#ff5500] to-[#ff7722] text-white shadow-[0_2px_10px_rgba(255,85,0,0.4)] scale-105'
                      : 'bg-[#18222d] text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                >
                  <span>{cfg.emoji}</span>
                  <span>{cfg.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-[#0c1015] p-1 rounded-xl mb-3 shrink-0 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setTab('details')}
            className={`py-1.5 rounded-lg font-bold transition-colors ${tab === 'details' ? 'bg-[#1f2a37] text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            Match Details
          </button>
          <button
            type="button"
            onClick={() => setTab('tactics')}
            className={`py-1.5 rounded-lg font-bold transition-colors ${tab === 'tactics' ? 'bg-[#1f2a37] text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            Tactics & Setup
          </button>
          <button
            type="button"
            onClick={() => setTab('roster')}
            className={`py-1.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-1 ${tab === 'roster' ? 'bg-[#1f2a37] text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
          >
            <span>Roster</span>
            <span className="text-[9px] bg-[#ff5500] text-white px-1.5 py-0.2 rounded-full font-mono">
              {selectedPlayerIds.length}
            </span>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-1 space-y-3.5 scrollbar-thin">
          {/* TAB 1: MATCH DETAILS */}
          {tab === 'details' && (
            <div className="space-y-3">
              {/* Opponent Club */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-300 mb-1">
                  Opponent / Rival Team Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-base">{opponentLogo}</span>
                  <input
                    type="text"
                    value={opponent}
                    onChange={(e) => setOpponent(e.target.value)}
                    required
                    placeholder="e.g. Titan United"
                    className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Competition & Match Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-300 mb-1">
                    Competition / League
                  </label>
                  <input
                    type="text"
                    value={competition}
                    onChange={(e) => setCompetition(e.target.value)}
                    className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-300 mb-1">
                    Match Format / Type
                  </label>
                  <select
                    value={matchType}
                    onChange={(e) => setMatchType(e.target.value)}
                    className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {currentSportConfig.defaultMatchTypes.map((mt) => (
                      <option key={mt} value={mt}>{mt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-300 mb-1">
                  Match Date & Kickoff Time
                </label>
                <input
                  type="text"
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3.5 py-2.5 text-xs text-white mb-1.5"
                />
                {/* Quick Date Chips */}
                <div className="flex gap-1.5 overflow-x-auto text-[10px] pb-1">
                  {['Tonight 19:45', 'Tomorrow 16:00', 'Saturday 15:00', 'Sunday 18:30', 'Next Wed 20:00'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleQuickDate(chip)}
                      className="bg-[#18222d] hover:bg-[#202e3d] text-slate-300 px-2 py-1 rounded-lg border border-slate-800 whitespace-nowrap"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Venue & Home/Away */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[10px] font-extrabold uppercase text-slate-300 mb-1">
                    Venue / Stadium / Arena
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-300 mb-1">
                    Side
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isHome;
                      setIsHome(next);
                      if (next) {
                        setVenue(currentSportConfig.defaultVenue);
                      } else {
                        setVenue('Away Stadium Arena');
                      }
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold border transition-colors ${isHome
                        ? 'bg-[#00e5a3]/15 text-[#00e5a3] border-[#00e5a3]/40'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                      }`}
                  >
                    {isHome ? '🏠 HOME' : '✈️ AWAY'}
                  </button>
                </div>
              </div>

              {/* Surface & Weather */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-300 mb-1">
                    Playing Surface
                  </label>
                  <select
                    value={surfaceType}
                    onChange={(e) => setSurfaceType(e.target.value)}
                    className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {currentSportConfig.defaultSurfaces.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase text-slate-300 mb-1">
                    Weather & Climate
                  </label>
                  <input
                    type="text"
                    value={weatherCondition}
                    onChange={(e) => setWeatherCondition(e.target.value)}
                    className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TACTICS & SETUP */}
          {tab === 'tactics' && (
            <div className="space-y-3">
              {/* Tactical Formation */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-300 mb-1">
                  Tactical Formation / Strategy Model
                </label>
                <select
                  value={tacticalFormation}
                  onChange={(e) => setTacticalFormation(e.target.value)}
                  className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3.5 py-2.5 text-xs text-white"
                >
                  {currentSportConfig.formations.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Target Squad Readiness Minimum */}
              <div className="bg-[#0c1015] border border-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-300">
                    Target Squad Readiness Threshold
                  </span>
                  <span className="text-xs font-mono font-bold text-[#00e5a3]">
                    {targetReadinessMin}%
                  </span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="99"
                  value={targetReadinessMin}
                  onChange={(e) => setTargetReadinessMin(Number(e.target.value))}
                  className="w-full accent-[#ff5500]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Athletes below this readiness score will be flagged with recovery protocols.
                </p>
              </div>

              {/* Match Referee / Officiating Official */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-300 mb-1">
                  Officiating Referee / Jury
                </label>
                <input
                  type="text"
                  value={refereeOfficial}
                  onChange={(e) => setRefereeOfficial(e.target.value)}
                  placeholder="e.g. FIFA Official / Chief Umpire"
                  className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              {/* Coach Tactical Directives */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase text-slate-300 mb-1">
                  Coach Tactical Directives ({directives.length})
                </label>
                <div className="space-y-1.5 mb-2">
                  {directives.map((dir, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-[#151c24] border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200">
                      <span className="flex-1 pr-2 text-[11px]">• {dir}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDirective(idx)}
                        className="text-slate-400 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new directive input */}
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newDirectiveInput}
                    onChange={(e) => setNewDirectiveInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDirective();
                      }
                    }}
                    placeholder="Add tactical directive (e.g., Press high in first 15m)..."
                    className="flex-1 bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-lg px-3 py-2 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddDirective}
                    className="bg-slate-800 hover:bg-[#ff5500] text-white px-3 rounded-lg text-xs font-bold transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SQUAD ROSTER & STARTERS */}
          {tab === 'roster' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[#0c1015] p-2.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Starters</span>
                  <span className="text-sm font-black text-white">{selectedPlayerIds.length} Athletes Selected</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Team Readiness</span>
                  <span className="text-sm font-black font-mono text-[#00e5a3]">{calculatedReadiness}%</span>
                </div>
              </div>

              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {AVAILABLE_SQUAD_PLAYERS.map((player, idx) => {
                  const isSelected = selectedPlayerIds.includes(player.id);
                  const assignedPos = currentSportConfig.positionOptions[idx % currentSportConfig.positionOptions.length];

                  return (
                    <div
                      key={player.id}
                      onClick={() => handleTogglePlayer(player.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${isSelected
                          ? 'bg-[#18222d] border-[#ff5500] shadow-[0_0_10px_rgba(255,85,0,0.2)]'
                          : 'bg-[#0c1015] border-slate-800/80 hover:border-slate-700 opacity-70'
                        }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-[#ff5500] text-white' : 'border border-slate-600 text-transparent'
                            }`}
                        >
                          ✓
                        </div>
                        <img
                          src={player.avatar}
                          alt={player.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="text-xs font-black text-white">{player.name}</div>
                          <div className="text-[10px] text-slate-400">
                            #{player.defaultNumber} • {assignedPos}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono font-bold text-[#00e5a3] bg-[#00e5a3]/10 px-1.5 py-0.5 rounded border border-[#00e5a3]/20">
                          {player.defaultReadiness}%
                        </span>
                        <div className="text-[9px] text-slate-400 mt-0.5">
                          {isSelected ? 'Starter' : 'Bench'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#ff5500] to-[#ff6b2b] hover:from-[#ff4400] hover:to-[#ff5500] text-white font-black py-3.5 rounded-xl uppercase text-xs tracking-wider shadow-[0_4px_20px_rgba(255,85,0,0.45)] active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Confirm & Publish {currentSportConfig.name} Match</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
