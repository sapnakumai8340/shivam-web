import React, { useState } from 'react';
import { Search, UserCheck, ShieldAlert, Trophy, Award, TrendingUp, Filter, ChevronRight, Activity, BarChart2, Users, Download } from 'lucide-react';
import { AthleteProfile } from '../types';
import { REALTIME_WORKLOAD_7DAYS, REALTIME_ASYMMETRY_DATA } from '../utils/realtimeData';
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface RecordsViewProps {
  onSelectPlayer: (player: any) => void;
  communityAthletes?: Record<string, AthleteProfile>;
}

export const RecordsView: React.FC<RecordsViewProps> = ({ onSelectPlayer, communityAthletes }) => {
  const [viewMode, setViewMode] = useState<'roster' | 'analytics'>('roster');
  const [search, setSearch] = useState('');
  const [chartMetric, setChartMetric] = useState<'sprint' | 'acwr' | 'readiness'>('sprint');

  const athletesList: AthleteProfile[] = communityAthletes ? (Object.values(communityAthletes) as AthleteProfile[]) : [];
  
  const squadRoster = athletesList.filter(a => a && a.position !== 'STAFF' && a.role !== 'admin').map((a) => ({
      id: a.id || 'ATH-01',
      name: a.name || 'Athlete',
      position: `${a.position || 'FWD'}`,
      jersey: a.number || 10,
      topSpeed: a.stats?.topSpeed || 32.0,
      sprintDistanceM: 880,
      totalDistanceKm: 11.8,
      acwr: a.stats?.acwr || 1.14,
      symmetryPct: a.stats?.symmetry || 95,
      readinessScore: Math.round(a.overallRating || 88),
      injuryRiskScore: a.stats?.injuryRisk === 'LOW' ? 10 : (a.stats?.injuryRisk === 'MODERATE' ? 35 : 60),
      riskCategory: (a.stats?.injuryRisk as any) || 'LOW',
      jointStrain: 'NORMAL',
      status: a.status || 'ACTIVE'
  }));

  const filtered = squadRoster.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070b0f] pb-28 pt-2 px-3.5 sm:px-4 max-w-md mx-auto">
      {/* Title */}
      <div className="mb-3">
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ff5500]/10 border border-[#ff5500]/30 text-[#ff5500] text-[9px] font-black uppercase tracking-wider mb-1">
          <Activity className="w-3 h-3" />
          <span>ADMIN SQUAD TELEMETRY</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase leading-tight">
          SQUAD RECORDS & ANALYTICS
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Real-time biomechanical readiness & roster workload metrics.
        </p>
      </div>

      {/* Mode Switcher: Roster vs Analytic Charts */}
      <div className="grid grid-cols-2 gap-1.5 bg-[#0c1015] p-1 rounded-2xl border border-slate-800 mb-3.5">
        <button
          onClick={() => setViewMode('roster')}
          className={`py-2 px-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 ${
            viewMode === 'roster'
              ? 'bg-[#ff5500] text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Squad Roster</span>
        </button>

        <button
          onClick={() => setViewMode('analytics')}
          className={`py-2 px-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 ${
            viewMode === 'analytics'
              ? 'bg-[#ff5500] text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Analytic Charts</span>
        </button>
      </div>

      {/* Overview Metric Bento */}
      <div className="grid grid-cols-2 gap-2.5 mb-3.5">
        <div className="bg-[#121922] border border-slate-800 rounded-2xl p-3.5">
          <span className="text-[9px] font-black text-slate-400 uppercase">
            AVG SQUAD READINESS
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#00e5a3] font-mono mt-0.5">
            93.4%
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">10 of 11 Available</p>
        </div>

        <div className="bg-[#121922] border border-slate-800 rounded-2xl p-3.5">
          <span className="text-[9px] font-black text-slate-400 uppercase">
            INJURY ALERT FLAGS
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#ff5500] font-mono mt-0.5">
            1 Elevated
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">#3 Walker (Patellar)</p>
        </div>
      </div>

      {viewMode === 'roster' ? (
        <>
          {/* Search Bar */}
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-[#ff5500]" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter squad by name, jersey, position..."
              className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Roster Table */}
          <div className="bg-[#121922] border border-slate-800 rounded-2xl p-3.5 shadow-xl">
            <div className="grid grid-cols-12 text-[9px] font-black text-slate-400 uppercase pb-2 border-b border-slate-800">
              <span className="col-span-6">ATHLETE / ID</span>
              <span className="col-span-3 text-center">SYMMETRY</span>
              <span className="col-span-3 text-right">TOP SPEED</span>
            </div>

            <div className="divide-y divide-slate-800/60 max-h-[420px] overflow-y-auto">
              {filtered.map((player) => (
                <div
                  key={player.id}
                  onClick={() => onSelectPlayer(player)}
                  className="grid grid-cols-12 items-center py-2.5 hover:bg-slate-800/40 px-1 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="col-span-6">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-[#ff5500] font-black">#{player.jersey}</span>
                      <p className="text-xs font-black text-white leading-tight">{player.name}</p>
                    </div>
                    <p className="text-[9px] text-slate-400">ID: {player.id} • {player.position}</p>
                  </div>

                  <div className="col-span-3 text-center">
                    <span
                      className={`text-xs font-bold font-mono ${
                        player.symmetryPct >= 92 ? 'text-[#00e5a3]' : 'text-[#ff5500]'
                      }`}
                    >
                      {player.symmetryPct}%
                    </span>
                  </div>

                  <div className="col-span-3 text-right">
                    <span className="text-xs font-black text-white font-mono">
                      {player.topSpeed} <span className="text-[9px] text-slate-400 font-normal">km/h</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Real-Life Analytic Charts View */
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-[#121922] border border-slate-800 rounded-3xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-black text-white uppercase tracking-tight">
                SQUAD SPRINT DISTANCE &gt; 25.2 KM/H
              </h3>
              <span className="text-[9px] font-mono text-[#ff5500] font-bold">METERS</span>
            </div>

            <div className="h-52 w-full -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={squadRoster} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={8} tickFormatter={(n) => n.split(' ')[1] || n} />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1015',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="sprintDistanceM" name="Sprint Distance (m)" fill="#ff5500" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#121922] border border-slate-800 rounded-3xl p-4 shadow-xl">
            <h3 className="text-xs font-black text-white uppercase tracking-tight mb-1">
              7-DAY SQUAD WORKLOAD VS READINESS
            </h3>
            <p className="text-[10px] text-slate-400 mb-3">
              Acute Training Load progression across training days
            </p>

            <div className="h-44 w-full -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={REALTIME_WORKLOAD_7DAYS} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="recordsLoadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff5500" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ff5500" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1015',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                    }}
                  />
                  <Area type="monotone" dataKey="acuteLoad" name="Acute Load (AU)" stroke="#ff5500" fill="url(#recordsLoadGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

