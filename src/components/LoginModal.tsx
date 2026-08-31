import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  X,
  User,
  Shield,
  Hash,
  Sparkles,
  AlertCircle,
  AtSign,
  Users,
  Phone,
  Activity,
} from 'lucide-react';
import { AthleteProfile, UserRole } from '../types';
import { apiService } from '../utils/apiService';

export interface UserAuthData {
  role: UserRole;
  email: string;
  name?: string;
  position?: string;
  jerseyNumber?: number;
  club?: string;
  isNewUser?: boolean;
  user?: AthleteProfile;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (role: UserRole, email: string, authData?: UserAuthData, userProfile?: AthleteProfile) => void;
  initialRole?: UserRole;
  initialMode?: 'signup' | 'login';
  isAuthGate?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialRole = 'player',
  initialMode = 'signup',
  isAuthGate = false,
}) => {
  const [authMode, setAuthMode] = useState<'signup' | 'login'>(initialMode);
  const [role, setRole] = useState<UserRole>(initialRole);

  // Sign Up & Login Form States
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [clubName, setClubName] = useState('Kheltantra Athletes FC');
  const [position, setPosition] = useState('Forward (LW)');
  const [jerseyNumber, setJerseyNumber] = useState('10');
  const [adminTitle, setAdminTitle] = useState('Head Performance Coach');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [sportSpecialty, setSportSpecialty] = useState('Football');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [consentBiometrics, setConsentBiometrics] = useState(true);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Available registered accounts in the database for quick switching
  const [existingUsers, setExistingUsers] = useState<AthleteProfile[]>([]);

  useEffect(() => {
    if (isOpen) {
      apiService.getUsers().then((res) => {
        if (res.users) {
          setExistingUsers(res.users);
        }
      });
    }
  }, [isOpen]);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setErrorMessage(null);
    if (newRole === 'admin') {
      if (!adminTitle) setAdminTitle('Head Performance Admin');
      if (!clubName) setClubName('Kheltantra Performance Academy');
    } else if (newRole === 'coach') {
      if (!adminTitle) setAdminTitle('Head Coach');
      if (!clubName) setClubName('Kheltantra Training Center');
    } else {
      if (!position) setPosition('Forward (LW)');
      if (!clubName) setClubName('Kheltantra Athletes FC');
    }
  };

  const handleModeSwitch = (mode: 'signup' | 'login') => {
    setAuthMode(mode);
    setErrorMessage(null);
  };

  const handleSelectExistingUser = async (u: AthleteProfile) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const userRole: UserRole =
        u.position === 'STAFF' ||
          u.role === 'HEAD PERFORMANCE COACH' ||
          u.role?.toLowerCase().includes('coach')
          ? 'admin'
          : 'player';
      onLoginSuccess(
        userRole,
        `${u.handle?.replace('@', '') || u.id}@kheltantra.in`,
        {
          role: userRole,
          email: `${u.handle?.replace('@', '') || u.id}@kheltantra.in`,
          name: u.name,
          user: u,
        },
        u
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to switch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation for sign up
    if (authMode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full legal or athlete name.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (!consentBiometrics) {
        setErrorMessage('Biometric analytics consent is required for telemetry registration.');
        return;
      }

      setLoading(true);
      try {
        const signupRes = await apiService.signup({
          name: fullName.trim(),
          username: username.trim() || undefined,
          email: email.trim(),
          phone: phoneNumber.trim() || undefined,
          password,
          role,
          position: role === 'player' ? position : (adminTitle.trim() || 'Head Performance Coach'),
          jerseyNumber: parseInt(jerseyNumber) || (role === 'player' ? 9 : 1),
          club: clubName.trim(),
          sportSpecialty: sportSpecialty,
        });

        if (!signupRes.success || !signupRes.user) {
          setErrorMessage(signupRes.error || 'Failed to create account in database.');
          setLoading(false);
          return;
        }

        setLoading(false);
        const createdUser = signupRes.user;
        onLoginSuccess(
          role,
          email.trim(),
          {
            role,
            email: email.trim(),
            name: createdUser.name,
            position: createdUser.position,
            jerseyNumber: createdUser.number,
            club: createdUser.club,
            isNewUser: true,
            user: createdUser,
          },
          createdUser
        );
      } catch (err: any) {
        setLoading(false);
        setErrorMessage(err.message || 'Server connection error during signup.');
      }
    } else {
      // Login flow
      setLoading(true);
      try {
        const loginRes = await apiService.login(email.trim(), password);
        if (!loginRes.success || !loginRes.user) {
          setErrorMessage(loginRes.error || 'Invalid credentials or user not found in database.');
          setLoading(false);
          return;
        }

        setLoading(false);
        const loggedInUser = loginRes.user;
        const resolvedRole: UserRole =
          loggedInUser.position === 'STAFF' ||
            loggedInUser.role === 'HEAD PERFORMANCE COACH' ||
            loggedInUser.role?.toLowerCase().includes('coach')
            ? 'admin'
            : 'player';

        onLoginSuccess(
          resolvedRole,
          email.trim(),
          {
            role: resolvedRole,
            email: email.trim(),
            name: loggedInUser.name,
            user: loggedInUser,
          },
          loggedInUser
        );
      } catch (err: any) {
        setLoading(false);
        setErrorMessage(err.message || 'Server connection error during login.');
      }
    }
  };

  if (!isOpen) return null;

  // Card content (shared between modal and full-page mode)
  const cardContent = (
    <>
      {/* Close Button - only in modal mode */}
      {!isAuthGate && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Brand Header */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ff5500]/10 border border-[#ff5500]/30 text-[#ff5500] text-[10px] font-black uppercase tracking-widest mb-1.5">
          <Sparkles className="w-3 h-3" />
          <span>Database & Role Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black italic tracking-wide text-[#ff5500] uppercase drop-shadow-[0_2px_12px_rgba(255,85,0,0.4)]">
          KHELTANTRA
        </h1>
        <p className="text-[11px] font-bold text-slate-300 tracking-widest uppercase mt-0.5">
          {authMode === 'signup'
            ? role === 'player'
              ? 'CREATE PLAYER / ATHLETE ACCOUNT'
              : 'CREATE COACH / ADMIN ACCOUNT'
            : 'ACCOUNT SIGN IN'}
        </p>
      </div>

      {/* Auth Mode Toggle: Sign Up vs Sign In */}
      <div className="grid grid-cols-2 gap-1 bg-[#0c1015] p-1 rounded-2xl mb-4 border border-slate-800">
        <button
          type="button"
          onClick={() => handleModeSwitch('signup')}
          className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${authMode === 'signup'
            ? 'bg-[#ff5500] text-white shadow-[0_2px_12px_rgba(255,85,0,0.4)]'
            : 'text-slate-400 hover:text-white'
            }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sign Up</span>
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch('login')}
          className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${authMode === 'login'
            ? 'bg-[#ff5500] text-white shadow-[0_2px_12px_rgba(255,85,0,0.4)]'
            : 'text-slate-400 hover:text-white'
            }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </button>
      </div>

      {/* Role Selector: Player vs Coach vs Admin */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Select Role to {authMode === 'signup' ? 'Create' : 'Sign In'}
          </span>
          <span className="text-[10px] font-bold text-[#ff5500]">
            {role === 'player' ? '⚽ Athlete Profile' : role === 'coach' ? '📋 Coach Portal' : '👑 Admin Portal'}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 bg-[#0c1015] p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => handleRoleChange('player')}
            className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 ${role === 'player'
              ? 'bg-[#ff5500]/20 text-white border-2 border-[#ff5500] shadow-[0_2px_12px_rgba(255,85,0,0.3)]'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
          >
            <User className="w-4 h-4 text-[#ff5500]" />
            <span>Athlete</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('coach')}
            className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 ${role === 'coach'
              ? 'bg-blue-600/30 text-white border-2 border-blue-500 shadow-[0_2px_12px_rgba(59,130,246,0.4)]'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
          >
            <Activity className="w-4 h-4 text-blue-400" />
            <span>Coach</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 ${role === 'admin'
              ? 'bg-indigo-600/30 text-white border-2 border-indigo-500 shadow-[0_2px_12px_rgba(99,102,241,0.4)]'
              : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
          >
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Error Notification */}
      {errorMessage && (
        <div className="mb-4 p-2.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Sign Up Exclusive Fields */}
        {authMode === 'signup' && (
          <>
            {/* Full Name & Username */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-300 mb-1">
                Full Name (e.g. Rahul Kumar)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (!username) {
                      setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''));
                    }
                  }}
                  required
                  className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-300 mb-1">
                Username Handle (e.g. @rahulkumar)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <AtSign className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  placeholder="username"
                />
              </div>
            </div>

            {/* Contact Mobile / Phone Number */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-300 mb-1">
                Mobile / Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Dynamic details row */}
            {role === 'player' ? (
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-300 mb-1">
                    Position
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition-colors"
                  >
                    <option value="Forward (LW)">Forward (LW)</option>
                    <option value="Striker (ST)">Striker (ST)</option>
                    <option value="Forward (RW)">Forward (RW)</option>
                    <option value="Midfielder (CAM)">Midfielder (CAM)</option>
                    <option value="Midfielder (CM)">Midfielder (CM)</option>
                    <option value="Defender (CB)">Defender (CB)</option>
                    <option value="Goalkeeper (GK)">Goalkeeper (GK)</option>
                    <option value="Cricket All-Rounder">Cricket All-Rounder</option>
                    <option value="Cricket Batsman">Cricket Batsman</option>
                    <option value="Cricket Fast Bowler">Cricket Fast Bowler</option>
                    <option value="Basketball Guard">Basketball Guard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-300 mb-1">
                    Jersey #
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Hash className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={jerseyNumber}
                      onChange={(e) => setJerseyNumber(e.target.value)}
                      className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl pl-8 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                      placeholder="10"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2">
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-300 mb-1">
                    Staff Designation / Title
                  </label>
                  <input
                    type="text"
                    value={adminTitle}
                    onChange={(e) => setAdminTitle(e.target.value)}
                    className="w-full bg-[#0c1015] border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                    placeholder="e.g. Head Coach / Tactician"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-300 mb-1">
                    Coach ID #
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <Hash className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={jerseyNumber}
                      onChange={(e) => setJerseyNumber(e.target.value)}
                      className="w-full bg-[#0c1015] border border-slate-800 focus:border-indigo-500 rounded-xl pl-7 pr-2 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                      placeholder="1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Club / Academy */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-300 mb-1">
                Club or Academy
              </label>
              <input
                type="text"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                placeholder="Kheltantra Athletes FC"
              />
            </div>

            {/* Sport Specialty */}
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-300 mb-1">
                Sport Specialty
              </label>
              <select
                value={sportSpecialty}
                onChange={(e) => setSportSpecialty(e.target.value)}
                className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none transition-colors appearance-none"
              >
                <option value="Football">Football</option>
                <option value="Cricket">Cricket</option>
                <option value="Basketball">Basketball</option>
                <option value="Tennis">Tennis</option>
                <option value="Athletics">Athletics</option>
                <option value="Rugby">Rugby</option>
                <option value="Hockey">Hockey</option>
                <option value="Badminton">Badminton</option>
                <option value="High Performance Rehab">High Performance Rehab</option>
              </select>
            </div>
          </>
        )}

        {/* Email Address */}
        <div>
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-300 mb-1">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              placeholder={authMode === 'signup' ? 'your.name@kheltantra.in' : 'Enter your email'}
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-300">
              Password
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Sign Up: Confirm Password */}
        {authMode === 'signup' && (
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>
        )}

        {/* Biometric consent for Sign Up */}
        {authMode === 'signup' && (
          <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={consentBiometrics}
              onChange={(e) => setConsentBiometrics(e.target.checked)}
              className="mt-0.5 rounded border-slate-700 text-[#ff5500] focus:ring-[#ff5500] bg-slate-900"
            />
            <span className="text-[11px] text-slate-400 leading-tight">
              Authorize live database profile creation with {role === 'player' ? 'Athlete Telemetry' : 'Coach Tactical Panel'} access.
            </span>
          </label>
        )}

        {/* Primary Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm tracking-wider uppercase transition-all mt-2 active:scale-[0.98] ${role === 'admin'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-[0_4px_25px_rgba(99,102,241,0.5)]'
              : role === 'coach'
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-[0_4px_25px_rgba(59,130,246,0.5)]'
                : 'bg-gradient-to-r from-[#ff5500] to-[#ff6b2b] hover:from-[#ff4400] hover:to-[#ff5500] text-white shadow-[0_4px_25px_rgba(255,85,0,0.5)]'
            }`}
        >
          <span>
            {loading
              ? authMode === 'signup'
                ? 'Creating Database Record...'
                : 'Authenticating...'
              : authMode === 'signup'
                ? `Create ${role === 'admin' ? 'Admin' : role === 'coach' ? 'Coach' : 'Player'} Account in DB`
                : `Sign In as ${role === 'admin' ? 'Admin' : role === 'coach' ? 'Coach' : 'Athlete / Player'}`}
          </span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </form>



      {/* Mode Switch Toggle Link */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 text-center">
        {authMode === 'signup' ? (
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className="text-[#ff5500] font-bold hover:underline"
            >
              Sign In Here
            </button>
          </p>
        ) : (
          <p className="text-xs text-slate-400">
            Need to register a new account?{' '}
            <button
              type="button"
              onClick={() => handleModeSwitch('signup')}
              className="text-[#ff5500] font-bold hover:underline"
            >
              Sign Up First
            </button>
          </p>
        )}
      </div>

      {/* Footer Security Badge */}
      <div className="mt-3 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-[#00e5a3]" />
        <span>Kheltantra Authoritative Role & Identity Protocol</span>
      </div>
    </>
  );

  // Full-page Auth Gate mode
  if (isAuthGate) {
    return (
      <div className="min-h-screen bg-[#070b0f] flex items-center justify-center p-3 sm:p-4 overflow-y-auto relative">
        {/* Ambient background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#ff5500]/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-900/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff5500]/5 rounded-full blur-[80px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#ff5500 1px, transparent 1px), linear-gradient(90deg, #ff5500 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>
        {/* Top brand bar */}
        <div className="fixed top-0 left-0 right-0 flex items-center justify-center py-3 z-20 border-b border-slate-800/50 bg-[#070b0f]/80 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff5500] to-[#ff6b2b] flex items-center justify-center shadow-[0_0_12px_rgba(255,85,0,0.4)]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-black uppercase tracking-widest text-white">Kheltantra</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Performance Platform</span>
          </div>
        </div>
        {/* Auth Card */}
        <div className="relative w-full max-w-md bg-[#151c24] border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl z-10 mt-14 mb-6">
          {cardContent}
        </div>
      </div>
    );
  }

  // Normal Modal mode
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      {/* Background stadium ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ff5500]/20 rounded-full blur-[110px]" />
      </div>

      {/* Main Card Container */}
      <div className="relative w-full max-w-md bg-[#151c24] border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl z-10 my-4 max-h-[92vh] overflow-y-auto">
        {cardContent}
      </div>
    </div>
  );
};

