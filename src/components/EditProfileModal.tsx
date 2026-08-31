import React, { useState } from 'react';
import {
  X,
  User,
  Upload,
  Check,
  Shield,
  Sparkles,
  Camera,
  CheckCircle2,
  Sliders,
  Flame,
  Trophy,
  Activity,
  Package
} from 'lucide-react';
import { AthleteProfile } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  athlete: AthleteProfile;
  onClose: () => void;
  onSaveProfile?: (updatedAthlete: Partial<AthleteProfile>) => void;
  onSave?: (updatedAthlete: AthleteProfile) => void;
}

const PRESET_AVATARS = [
  {
    label: 'Player A',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    action: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Sarah V.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    action: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Mateo S.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    action: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Elena V.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    action: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
  },
  {
    label: 'Tariq S.',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
    action: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=600&q=80',
  },
];

const POSITIONS = [
  { code: 'FWD', role: 'STRIKER' },
  { code: 'FWD', role: 'LEFT WING' },
  { code: 'FWD', role: 'RIGHT WING' },
  { code: 'MID', role: 'ATTACKING MID' },
  { code: 'MID', role: 'CENTRAL MID' },
  { code: 'MID', role: 'DEFENSIVE MID' },
  { code: 'DEF', role: 'CENTER BACK' },
  { code: 'DEF', role: 'FULL BACK' },
  { code: 'GK', role: 'GOALKEEPER' },
];

const getSportFromSpecialty = (specialty?: string): 'Cricket' | 'Basketball' | 'Football' => {
  const spec = (specialty || '').toLowerCase();
  if (spec.includes('cricket')) return 'Cricket';
  if (spec.includes('basketball')) return 'Basketball';
  return 'Football';
};


export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  athlete,
  onClose,
  onSaveProfile,
  onSave,
}) => {
  const [name, setName] = useState(athlete.name);
  const [number, setNumber] = useState(athlete.number);
  const [selectedPosRole, setSelectedPosRole] = useState(athlete.role || 'STRIKER');
  const [selectedPosCode, setSelectedPosCode] = useState(athlete.position || 'FWD');
  const [club, setClub] = useState(athlete.club || 'Premier Squad');
  const [avatar, setAvatar] = useState(athlete.avatar);
  const [actionImage, setActionImage] = useState(athlete.actionImage);
  const [age, setAge] = useState<number>(athlete.age || 23);
  const [height, setHeight] = useState(athlete.height || "186 cm / 6'1\"");
  const [weight, setWeight] = useState(athlete.weight || '82 kg / 181 lbs');
  const [preferredFoot, setPreferredFoot] = useState<'Right' | 'Left' | 'Both'>(athlete.preferredFoot || 'Right');
  const [bio, setBio] = useState(athlete.bio || '');
  const [sportSpecialty, setSportSpecialty] = useState(
    athlete.sportSpecialty || (athlete.position === 'STAFF' ? 'High Performance Tactical Coach' : 'Football (Striker)')
  );
  const [games, setGames] = useState(athlete.stats.games);
  const [goals, setGoals] = useState(athlete.stats.goals);
  const [assists, setAssists] = useState(athlete.stats.assists);
  const [runs, setRuns] = useState(athlete.stats.runs || 0);
  const [wickets, setWickets] = useState(athlete.stats.wickets || 0);
  const [points, setPoints] = useState(athlete.stats.points || 0);

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePositionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = POSITIONS.find((p) => p.role === e.target.value);
    if (selected) {
      setSelectedPosRole(selected.role);
      setSelectedPosCode(selected.code);
    }
  };

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(url);
      setActionImage(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);

    const updatedData: Partial<AthleteProfile> = {
      name: name.toUpperCase(),
      number: Number(number),
      position: selectedPosCode,
      role: selectedPosRole,
      club,
      sportSpecialty,
      avatar,
      actionImage,
      age: Number(age),
      height,
      weight,
      preferredFoot,
      bio,
      kitIssued: athlete.kitIssued,
      stats: {
        ...athlete.stats,
        games: Number(games),
        goals: Number(goals),
        assists: Number(assists),
        runs: Number(runs),
        wickets: Number(wickets),
        points: Number(points),
      },
    };

    setTimeout(() => {
      if (typeof onSaveProfile === 'function') {
        onSaveProfile(updatedData);
      }
      if (typeof onSave === 'function') {
        onSave({
          ...athlete,
          ...updatedData,
          stats: {
            ...athlete.stats,
            ...(updatedData.stats || {}),
          },
        } as AthleteProfile);
      }
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#121922] border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#17212e] to-[#121922] px-5 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/30 text-[#ff5500] flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight">
                Edit Athlete Profile
              </h2>
              <p className="text-[11px] text-slate-400">
                Personal identity, bio, position, and physical profile
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {savedSuccess && (
            <div className="p-3 bg-[#00e5a3]/20 border border-[#00e5a3]/50 text-[#00e5a3] text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Profile updated successfully across squad database!</span>
            </div>
          )}

          {/* Profile Card Live Preview */}
          <div className="bg-[#0c1015] border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full border-2 border-[#ff5500] overflow-hidden bg-slate-900 shadow-md">
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-[#ff5500] text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                #{number || 0}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] font-mono font-bold text-[#ff5500] bg-[#ff5500]/10 px-1.5 py-0.2 rounded uppercase">
                  {selectedPosCode} • {selectedPosRole}
                </span>
                <span className="text-[9px] font-mono text-slate-400 uppercase">
                  {athlete.code}
                </span>
              </div>
              <h3 className="text-sm font-black text-white uppercase truncate">
                {name || 'Athlete Name'}
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                {club} • {age} yrs • {height}
              </p>
            </div>
          </div>

          {/* Avatar Preset Selector */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
              Select Player Avatar Photo
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-none">
              {PRESET_AVATARS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setAvatar(p.avatar);
                    setActionImage(p.action);
                  }}
                  className={`relative p-0.5 rounded-full border-2 transition-all shrink-0 ${avatar === p.avatar
                    ? 'border-[#ff5500] ring-2 ring-[#ff5500]/40 scale-105'
                    : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                    }`}
                >
                  <img
                    src={p.avatar}
                    alt={p.label}
                    className="w-10 h-10 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {avatar === p.avatar && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff5500] text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                      ✓
                    </span>
                  )}
                </button>
              ))}

              {/* Local File Upload Avatar */}
              <label className="w-10 h-10 rounded-full border-2 border-dashed border-slate-700 hover:border-[#ff5500] flex items-center justify-center text-slate-400 hover:text-[#ff5500] cursor-pointer shrink-0 transition-colors bg-slate-900/50">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCustomFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Primary Identity Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                Full Athlete Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. RAHUL KUMAR"
                className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-2 text-xs font-bold text-white uppercase focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                Jersey Number (#)
              </label>
              <input
                type="number"
                value={number}
                onChange={(e) => setNumber(Number(e.target.value))}
                min={1}
                max={99}
                required
                className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Sport Speciality & Discipline */}
          <div>
            <label className="block text-[10px] font-black text-[#ff5500] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>Sport & Speciality (Player / Coach Discipline)</span>
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={sportSpecialty}
                onChange={(e) => setSportSpecialty(e.target.value)}
                placeholder="e.g. Football (Striker), Cricket, High Performance Coach, Basketball"
                className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
              />
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Quick Presets:</span>
                {[
                  '⚽ Football (Striker)',
                  '⚽ Football (Midfielder)',
                  '⚽ Football (Goalkeeper)',
                  '🏏 Cricket (Batsman/Bowler)',
                  '🏀 Basketball (Guard)',
                  '🏃 Athletics & Sprinting',
                  '📋 High Performance Coach',
                  '💪 Rehab & Conditioning Specialist'
                ].map((preset, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setSportSpecialty(preset.replace(/^[^\s]+\s/, ''))}
                    className="text-[9px] font-bold bg-slate-900 hover:bg-[#ff5500]/20 text-slate-300 hover:text-[#ff5500] border border-slate-800 hover:border-[#ff5500]/40 px-2 py-0.5 rounded-full transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Position & Tactical Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                Tactical Position & Role
              </label>
              <select
                value={selectedPosRole}
                onChange={handlePositionChange}
                className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
              >
                {POSITIONS.map((p, idx) => (
                  <option key={idx} value={p.role}>
                    {p.code} - {p.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
                Club / Organization
              </label>
              <input
                type="text"
                value={club}
                onChange={(e) => setClub(e.target.value)}
                placeholder="e.g. Premier Squad"
                className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Physical Profile (Age, Height, Weight, Foot) */}
          <div className="p-3.5 bg-[#0c1015] border border-slate-800 rounded-2xl space-y-3">
            <span className="text-[10px] font-black text-[#ff5500] uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Physical Attributes</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                  Age (Years)
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  min={14}
                  max={45}
                  className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                  Height
                </label>
                <input
                  type="text"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="186 cm / 6'1''"
                  className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                  Weight
                </label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="82 kg / 181 lbs"
                  className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                  Preferred Foot
                </label>
                <select
                  value={preferredFoot}
                  onChange={(e) => setPreferredFoot(e.target.value as any)}
                  className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-lg px-2 py-1.5 text-xs font-bold text-white focus:outline-none"
                >
                  <option value="Right">Right</option>
                  <option value="Left">Left</option>
                  <option value="Both">Both (Dual)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Athlete Bio */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">
              Athlete Bio & Ambition
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe tactical playing style, strengths, and season objectives..."
              className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Match Track Record (Personal stats) */}
          <div className="p-3.5 bg-[#0c1015] border border-slate-800 rounded-2xl">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">
              Career Match Record Stats
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                  Games Played
                </label>
                <input
                  type="number"
                  value={games}
                  onChange={(e) => setGames(Number(e.target.value))}
                  min={0}
                  className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                />
              </div>

              {getSportFromSpecialty(sportSpecialty) === 'Cricket' ? (
                <>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                      Runs Scored
                    </label>
                    <input
                      type="number"
                      value={runs}
                      onChange={(e) => setRuns(Number(e.target.value))}
                      min={0}
                      className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                      Wickets Taken
                    </label>
                    <input
                      type="number"
                      value={wickets}
                      onChange={(e) => setWickets(Number(e.target.value))}
                      min={0}
                      className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </>
              ) : getSportFromSpecialty(sportSpecialty) === 'Basketball' ? (
                <>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                      Points Scored
                    </label>
                    <input
                      type="number"
                      value={points}
                      onChange={(e) => setPoints(Number(e.target.value))}
                      min={0}
                      className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                      Assists
                    </label>
                    <input
                      type="number"
                      value={assists}
                      onChange={(e) => setAssists(Number(e.target.value))}
                      min={0}
                      className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                      Goals
                    </label>
                    <input
                      type="number"
                      value={goals}
                      onChange={(e) => setGoals(Number(e.target.value))}
                      min={0}
                      className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">
                      Assists
                    </label>
                    <input
                      type="number"
                      value={assists}
                      onChange={(e) => setAssists(Number(e.target.value))}
                      min={0}
                      className="w-full bg-[#121922] border border-slate-800 focus:border-[#ff5500] rounded-lg px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </>
              )}
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
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#ff5500] to-[#e64400] hover:from-[#ff6a1a] hover:to-[#ff5500] shadow-lg shadow-[#ff5500]/30 transition-all uppercase tracking-wider flex items-center gap-1.5 active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
