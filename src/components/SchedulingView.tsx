import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Filter, 
  AlertCircle, 
  ChevronRight, 
  Activity, 
  Trophy, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Radio, 
  Layers, 
  CloudSun,
  Shield
} from 'lucide-react';
import { FixtureSchedule, SportType, UserRole } from '../types';
import { SPORTS_CONFIG } from '../utils/sportsConfig';
import { SportTacticalField } from './SportTacticalField';

interface SchedulingViewProps {
  fixtures?: FixtureSchedule[];
  role?: UserRole;
  onNewFixture: () => void;
  onSelectFixture?: (fixture: FixtureSchedule) => void;
  onDeleteFixture?: (fixtureId: string) => void;
  onUpdateFixture?: (fixture: FixtureSchedule) => void;
  onSwitchRole?: (role: UserRole) => void;
  onOpenLogin?: () => void;
}

export const SchedulingView: React.FC<SchedulingViewProps> = ({
  fixtures: propFixtures,
  role = 'player',
  onNewFixture,
  onSelectFixture,
  onDeleteFixture,
  onUpdateFixture,
  onSwitchRole,
  onOpenLogin,
}) => {
  const isAdmin = role === 'admin' || role === 'coach';
  const [searchQuery, setSearchQuery] = useState('');
  const [sportFilter, setSportFilter] = useState<SportType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Scheduled' | 'In Progress' | 'Finished'>('ALL');
  const [fixtures, setFixtures] = useState<FixtureSchedule[]>(propFixtures || []);
  
  // Sync if prop changes
  React.useEffect(() => {
    if (propFixtures) {
      setFixtures(propFixtures);
    }
  }, [propFixtures]);

  const [selectedFixture, setSelectedFixture] = useState<FixtureSchedule>(
    fixtures[0] || (propFixtures && propFixtures[0])
  );

  // When fixtures update, ensure selected is updated
  React.useEffect(() => {
    if (fixtures.length > 0 && (!selectedFixture || !fixtures.find(f => f.id === selectedFixture.id))) {
      setSelectedFixture(fixtures[0]);
    }
  }, [fixtures]);

  // Filter fixtures
  const filteredFixtures = fixtures.filter((f) => {
    // Sport Filter
    if (sportFilter !== 'ALL' && (f.sport || 'FOOTBALL') !== sportFilter) {
      return false;
    }

    // Status Filter
    if (statusFilter !== 'ALL' && f.status !== statusFilter) {
      return false;
    }

    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchOpponent = f.opponent.toLowerCase().includes(q);
      const matchVenue = f.venue.toLowerCase().includes(q);
      const matchComp = f.competition.toLowerCase().includes(q);
      const matchSport = (f.sport || '').toLowerCase().includes(q);
      const matchLineup = f.assignedLineup?.some(
        (p) => p.playerId.toLowerCase().includes(q) || p.playerName.toLowerCase().includes(q) || p.position.toLowerCase().includes(q)
      );
      return matchOpponent || matchVenue || matchComp || matchSport || matchLineup;
    }

    return true;
  });

  // Handle Admin Status Toggle
  const handleToggleStatus = (fixture: FixtureSchedule, nextStatus: 'Scheduled' | 'In Progress' | 'Finished') => {
    const updated: FixtureSchedule = {
      ...fixture,
      status: nextStatus,
    };
    
    setFixtures(prev => prev.map(f => f.id === fixture.id ? updated : f));
    if (selectedFixture?.id === fixture.id) {
      setSelectedFixture(updated);
    }
    if (onUpdateFixture) {
      onUpdateFixture(updated);
    }
  };

  // Handle Admin Delete
  const handleDelete = (fixtureId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Remove this match fixture from the official schedule?')) {
      setFixtures(prev => prev.filter(f => f.id !== fixtureId));
      if (selectedFixture?.id === fixtureId) {
        const remaining = fixtures.filter(f => f.id !== fixtureId);
        if (remaining.length > 0) setSelectedFixture(remaining[0]);
      }
      if (onDeleteFixture) {
        onDeleteFixture(fixtureId);
      }
    }
  };

  const currentSport = selectedFixture?.sport || 'FOOTBALL';
  const currentSportConfig = SPORTS_CONFIG[currentSport] || SPORTS_CONFIG.FOOTBALL;

  return (
    <div className="min-h-screen bg-[#0b0f14] pb-28 pt-4 px-4 max-w-md mx-auto relative">
      {/* Title & Role Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
              isAdmin 
                ? 'bg-[#ff5500] text-white shadow-[0_0_10px_rgba(255,85,0,0.5)]' 
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}>
              {isAdmin ? 'ADMIN / COACH DESK' : 'ATHLETE VIEW'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Multi-Sport Central
            </span>
          </div>

          {/* Quick Schedule Button in Header (Admin Set Fixture) */}
          {isAdmin ? (
            <button
              onClick={onNewFixture}
              className="flex items-center gap-1.5 bg-[#ff5500] hover:bg-[#ff6a1a] text-white px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-[0_2px_10px_rgba(255,85,0,0.4)] transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Set Schedule</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenLogin && onOpenLogin()}
              className="flex items-center gap-1.5 bg-slate-900 text-slate-400 hover:text-[#ff5500] border border-slate-800 hover:border-[#ff5500]/50 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase transition-all"
            >
              <Shield className="w-3 h-3 text-[#ff5500]" />
              <span>Coach Login</span>
            </button>
          )}
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight uppercase mt-1">
          MATCH SCHEDULING
        </h1>
        <p className="text-xs text-slate-400">
          {isAdmin 
            ? 'Admin desk: Create official fixtures, set formations & assign starter rosters' 
            : 'Official team match calendar & tactical formations set by Head Coach / Admin'}
        </p>

        {/* Informative Admin / Athlete Banner */}
        <div className={`mt-2.5 p-2.5 rounded-xl border flex items-center justify-between text-xs ${
          isAdmin
            ? 'bg-[#ff5500]/10 border-[#ff5500]/30 text-[#ff5500]'
            : 'bg-slate-900/90 border-slate-800 text-slate-300'
        }`}>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 shrink-0 text-[#ff5500]" />
            <div>
              <div className="text-[10px] font-black uppercase">
                {isAdmin ? 'Admin Authorisation Active' : 'Official Schedule (Athlete Read-Only)'}
              </div>
              <div className="text-[9px] text-slate-400">
                {isAdmin 
                  ? 'You have full clearance to set matches, update live status, & assign lineups.' 
                  : 'Only Coaching Staff & Admins can set or edit match dates, venues, and lineups.'}
              </div>
            </div>
          </div>
          {!isAdmin && onOpenLogin && (
            <button
              onClick={() => onOpenLogin()}
              className="text-[9px] font-black text-[#ff5500] uppercase underline hover:text-[#ff7733] shrink-0 ml-2"
            >
              Coach Access
            </button>
          )}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-[#ff5500]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search matches, sports, venues, players..."
          className="w-full bg-[#151c24] border border-slate-800 focus:border-[#ff5500] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white text-xs"
          >
            Clear
          </button>
        )}
      </div>

      {/* Sport Category Filter Tabs (Pills) */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-xs">
          <button
            onClick={() => setSportFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              sportFilter === 'ALL'
                ? 'bg-white text-black shadow-md scale-105'
                : 'bg-[#151c24] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>🌐</span>
            <span>All Sports ({fixtures.length})</span>
          </button>

          {(Object.keys(SPORTS_CONFIG) as SportType[]).map((sportKey) => {
            const cfg = SPORTS_CONFIG[sportKey];
            const isSelected = sportFilter === sportKey;
            const count = fixtures.filter(f => (f.sport || 'FOOTBALL') === sportKey).length;

            return (
              <button
                key={sportKey}
                onClick={() => setSportFilter(sportKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#ff5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.5)] scale-105'
                    : 'bg-[#151c24] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{cfg.emoji}</span>
                <span>{cfg.name.split(' ')[0]}</span>
                <span className="text-[9px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* When NO fixtures exist in the entire database */}
      {fixtures.length === 0 ? (
        <div className="space-y-4 my-2">
          {isAdmin ? (
            /* ADMIN EMPTY STATE: SQUAD SCHEDULE CONTROLLER */
            <div className="bg-gradient-to-b from-[#161f2c] to-[#0f151d] border-2 border-[#ff5500]/40 rounded-3xl p-6 text-center shadow-[0_10px_35px_rgba(255,85,0,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff5500]/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="w-16 h-16 rounded-2xl bg-[#ff5500]/20 border border-[#ff5500]/50 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(255,85,0,0.3)]">
                <Calendar className="w-8 h-8 text-[#ff5500]" />
              </div>

              <span className="inline-block bg-[#ff5500] text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2">
                ADMIN / COACH DESK
              </span>

              <h2 className="text-xl font-black text-white uppercase tracking-tight">
                No Matches Scheduled
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 mb-5 max-w-sm mx-auto leading-relaxed">
                All pre-existing matches have been cleared. As Head Coach / Admin, you have full control to create official fixtures, assign formations, and select starting lineups for the squad.
              </p>

              <button
                onClick={onNewFixture}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#ff5500] hover:bg-[#ff6a1a] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,85,0,0.4)] active:scale-95 transition-all mb-4"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Schedule First Match</span>
              </button>

              {/* Step by step guide */}
              <div className="bg-[#0b0f14]/80 border border-slate-800 rounded-2xl p-3 text-left space-y-2 text-[11px]">
                <div className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider mb-1">
                  ADMIN SCHEDULE LIFECYCLE:
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-[#ff5500]/20 text-[#ff5500] font-black text-[9px] flex items-center justify-center shrink-0 mt-0.5">1</span>
                  <span><strong>Choose Sport & Opponent:</strong> Set Football, Basketball, Cricket, Tennis, Rugby or Track match details.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-[#ff5500]/20 text-[#ff5500] font-black text-[9px] flex items-center justify-center shrink-0 mt-0.5">2</span>
                  <span><strong>Pick Tactical Formation:</strong> Prescribe tactical structure & home/away venue pitch settings.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-300">
                  <span className="w-4 h-4 rounded-full bg-[#ff5500]/20 text-[#ff5500] font-black text-[9px] flex items-center justify-center shrink-0 mt-0.5">3</span>
                  <span><strong>Assign Starting Roster:</strong> Select confirmed squad starters and broadcast live match status.</span>
                </div>
              </div>
            </div>
          ) : (
            /* ATHLETE EMPTY STATE: WAITING FOR COACH PUBLICATION */
            <div className="bg-[#121820] border border-slate-800 rounded-3xl p-6 text-center shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-7 h-7 text-slate-400" />
              </div>

              <span className="inline-block bg-slate-800 text-slate-300 border border-slate-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-2">
                OFFICIAL MATCH CALENDAR
              </span>

              <h2 className="text-lg font-black text-white uppercase tracking-tight">
                No Upcoming Matches Scheduled
              </h2>
              <p className="text-xs text-slate-400 mt-1 mb-4 leading-relaxed">
                Your Coaching Staff & Admin have not published any match fixtures yet. Official match dates, tactical formations, and starting lineup assignments will appear here once scheduled by the Admin.
              </p>

              {onSwitchRole && (
                <div className="pt-2 border-t border-slate-800/80">
                  <p className="text-[10px] text-slate-400 mb-2">
                    Are you the coach or team admin?
                  </p>
                  <button
                    onClick={() => onSwitchRole('admin')}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-[#ff5500]/20 text-[#ff5500] hover:text-white border border-[#ff5500]/30 hover:border-[#ff5500] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#ff5500]" />
                    <span>Switch to Admin Mode to Set Schedule</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Selected Match Tactical Visualizer & Quick Admin Controls */}
          {selectedFixture && (
            <div className="mb-5 space-y-3">
              {/* Tactical Pitch / Court Component */}
              <SportTacticalField
                fixture={selectedFixture}
                onSelectPlayer={(playerId) => {
                  // Could trigger player inspection
                }}
              />

              {/* Admin Match Status & Directives Quick Controller */}
              <div className="bg-[#151c24] border border-slate-800 rounded-2xl p-3.5 shadow-xl">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedFixture.opponentLogo || currentSportConfig.emoji}</span>
                    <div>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#ff5500]">
                        {selectedFixture.sport || 'FOOTBALL'} • {selectedFixture.matchType || 'MATCH'}
                      </span>
                      <h3 className="text-sm font-black text-white leading-tight">
                        vs {selectedFixture.opponent}
                      </h3>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="text-right">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase border ${
                      selectedFixture.status === 'In Progress'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                        : selectedFixture.status === 'Finished'
                        ? 'bg-slate-700/50 text-slate-300 border-slate-600'
                        : 'bg-[#00e5a3]/15 text-[#00e5a3] border-[#00e5a3]/30'
                    }`}>
                      {selectedFixture.status === 'In Progress' ? '🔴 LIVE IN PROGRESS' : selectedFixture.status}
                    </span>
                  </div>
                </div>

                {/* Quick Match Specs Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#0c1015] p-2.5 rounded-xl border border-slate-800/80 mb-3">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-[#ff5500] shrink-0" />
                    <span className="truncate">{selectedFixture.dateTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{selectedFixture.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <CloudSun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{selectedFixture.weatherCondition || 'Clear 18°C'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{selectedFixture.refereeOfficial || 'Official Referee'}</span>
                  </div>
                </div>

                {/* Admin Live Status Controller Toggle */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <Shield className="w-3 h-3 text-[#ff5500]" />
                    <span>{isAdmin ? 'ADMIN MATCH STATUS:' : 'MATCH STATUS:'}</span>
                  </span>
                  {isAdmin ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleStatus(selectedFixture, 'Scheduled')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                          selectedFixture.status === 'Scheduled'
                            ? 'bg-slate-700 text-white'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        Scheduled
                      </button>
                      <button
                        onClick={() => handleToggleStatus(selectedFixture, 'In Progress')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors flex items-center gap-1 ${
                          selectedFixture.status === 'In Progress'
                            ? 'bg-rose-600 text-white shadow-[0_0_8px_rgba(225,29,72,0.5)]'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Radio className="w-2.5 h-2.5" />
                        <span>Live</span>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(selectedFixture, 'Finished')}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                          selectedFixture.status === 'Finished'
                            ? 'bg-emerald-700 text-white'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        Finished
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">
                      Status locked (Admin only)
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* UPCOMING & SCHEDULED FIXTURES LIST */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <span>SCHEDULED FIXTURES</span>
              <span className="text-[10px] text-slate-400 font-mono">
                ({filteredFixtures.length})
              </span>
            </h3>

            {/* Quick status tabs */}
            <div className="flex gap-1 text-[10px]">
              {(['ALL', 'Scheduled', 'In Progress'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-0.5 rounded font-bold uppercase transition-colors ${
                    statusFilter === st
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Fixtures List */}
          <div className="space-y-3">
            {filteredFixtures.length === 0 ? (
              <div className="bg-[#151c24] border border-slate-800 rounded-2xl p-6 text-center">
                <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <h4 className="text-sm font-black text-white uppercase">No Matches In This Filter</h4>
                <p className="text-xs text-slate-400 mt-1 mb-3">
                  No fixtures match the current sport or search filters.
                </p>
                {isAdmin && (
                  <button
                    onClick={onNewFixture}
                    className="bg-[#ff5500] hover:bg-[#ff6b2b] text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
                  >
                    Schedule New Match
                  </button>
                )}
              </div>
            ) : (
              filteredFixtures.map((fix) => {
                const fixSport = fix.sport || 'FOOTBALL';
                const cfg = SPORTS_CONFIG[fixSport] || SPORTS_CONFIG.FOOTBALL;
                const isSelected = selectedFixture?.id === fix.id;

                return (
                  <div
                    key={fix.id}
                    onClick={() => {
                      setSelectedFixture(fix);
                      if (onSelectFixture) onSelectFixture(fix);
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-[#18222d] border-[#ff5500] shadow-[0_0_15px_rgba(255,85,0,0.25)]'
                        : 'bg-[#151c24] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{fix.opponentLogo || cfg.emoji}</span>
                          <span className={`text-[8px] font-black px-1.5 py-0.2 rounded uppercase ${cfg.badgeBg} text-white border ${cfg.badgeBorder}`}>
                            {cfg.name.split(' ')[0]}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {fix.competition}
                          </span>
                        </div>

                        <h4 className="text-base font-black text-white mt-1">
                          vs {fix.opponent}
                        </h4>

                        <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-[#ff5500]" />
                            {fix.dateTime}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {fix.venue}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded uppercase border ${
                          fix.status === 'In Progress'
                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                            : 'bg-[#00e5a3]/10 text-[#00e5a3] border-[#00e5a3]/30'
                        }`}>
                          {fix.status}
                        </span>
                        <div className="text-xs font-bold text-slate-300 mt-1.5">
                          {fix.assignedLineup?.length || 0} Starters
                        </div>
                        <div className="text-[10px] font-mono text-[#00e5a3] mt-0.5">
                          ⚡ {fix.readinessScore}% Ready
                        </div>
                      </div>
                    </div>

                    {/* Lineup Starters Preview Strip */}
                    {fix.assignedLineup && fix.assignedLineup.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-slate-400 text-[11px] truncate mr-2">
                          <Users className="w-3.5 h-3.5 text-[#ff5500] shrink-0" />
                          <span className="truncate">
                            {fix.assignedLineup.slice(0, 3).map(p => `${p.playerName} (${p.position.split(' ')[0]})`).join(', ')}
                            {fix.assignedLineup.length > 3 ? ` +${fix.assignedLineup.length - 3} more` : ''}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Delete match button for admin only */}
                          {isAdmin && (
                            <button
                              onClick={(e) => handleDelete(fix.id, e)}
                              title="Delete Match (Admin only)"
                              className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Floating Action Button '+' to Schedule New Match (Admin Only) */}
      {isAdmin && (
        <button
          onClick={onNewFixture}
          aria-label="Admin: Schedule New Match"
          title="Admin: Schedule New Match"
          className="fixed bottom-24 right-6 w-14 h-14 rounded-2xl bg-[#ff5500] hover:bg-[#ff6b2b] text-white flex items-center justify-center shadow-[0_6px_25px_rgba(255,85,0,0.6)] active:scale-95 transition-all z-30 group"
        >
          <Plus className="w-7 h-7 stroke-[3] group-hover:rotate-90 transition-transform duration-200" />
        </button>
      )}
    </div>
  );
};
