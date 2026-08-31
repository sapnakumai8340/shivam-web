import React, { useState } from 'react';
import { X, UserPlus, UserCheck, Heart, MessageCircle, Play, Trophy, Shield, Zap, Activity, CheckCircle2, Share2, Grid, Film, Sparkles } from 'lucide-react';
import { AthleteProfile, HighlightVideo, SocialPost, TapeAnalysis } from '../types';

interface PlayerProfileModalProps {
  isOpen: boolean;
  athlete: AthleteProfile;
  posts: SocialPost[];
  onClose: () => void;
  onToggleFollow: (athleteId: string) => void;
  onPlayVideo?: (video: HighlightVideo | TapeAnalysis) => void;
  onSelectPost?: (post: SocialPost) => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({
  isOpen,
  athlete,
  posts,
  onClose,
  onToggleFollow,
  onPlayVideo,
  onSelectPost
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'stats'>('posts');
  const [copiedToast, setCopiedToast] = useState(false);

  if (!isOpen) return null;

  const playerPosts = posts.filter((p) => p.authorId === athlete.id);
  const reels = playerPosts.filter((p) => p.mediaType === 'video');

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#101720] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">

        {/* Top App Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0c1118]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#ff5500] font-black">
              {athlete.handle || `@${athlete.name.toLowerCase().replace(/\s+/g, '')}_${athlete.number}`}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a3]" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              title="Share Profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {copiedToast && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-[#00e5a3] text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
            Profile Link Copied!
          </div>
        )}

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 space-y-4 text-xs">

          {/* Header Profile Stats (Instagram Archetype) */}
          <div className="flex items-center gap-4">
            {/* Avatar with gradient ring */}
            <div className="relative shrink-0">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-tr from-[#ff5500] via-[#ffaa00] to-[#00e5a3]">
                <div className="w-full h-full rounded-full border-2 border-[#101720] overflow-hidden bg-slate-900">
                  <img
                    src={athlete.avatar}
                    alt={athlete.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <span className="absolute bottom-0 right-0 bg-[#ff5500] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full font-mono shadow">
                #{athlete.number}
              </span>
            </div>

            {/* Counts: Posts, Followers, Following */}
            <div className="flex-1 grid grid-cols-3 text-center">
              <div>
                <div className="text-base sm:text-lg font-black text-white font-mono">
                  {athlete.postsCount !== undefined ? athlete.postsCount : playerPosts.length}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Posts</div>
              </div>

              <div>
                <div className="text-base sm:text-lg font-black text-white font-mono">
                  {typeof athlete.followersCount === 'number'
                    ? athlete.followersCount >= 10000
                      ? `${(athlete.followersCount / 1000).toFixed(1)}k`
                      : athlete.followersCount
                    : 0}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Followers</div>
              </div>

              <div>
                <div className="text-base sm:text-lg font-black text-white font-mono">
                  {typeof athlete.followingCount === 'number'
                    ? athlete.followingCount >= 10000
                      ? `${(athlete.followingCount / 1000).toFixed(1)}k`
                      : athlete.followingCount
                    : 0}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Following</div>
              </div>
            </div>
          </div>

          {/* Name & Bio Details */}
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                {athlete.name}
              </h1>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00e5a3] fill-[#00e5a3]/20" />
            </div>
            <div className="text-[11px] text-[#ff5500] font-bold">
              {athlete.role} • {athlete.position} | {athlete.club || ' Premier Squad'}
            </div>

            {/* Sport Speciality Pill */}
            <div className="mt-1.5 flex items-center">
              <span className="bg-[#ff5500]/15 border border-[#ff5500]/40 text-[#ff7733] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1">
                <Trophy className="w-3 h-3 text-[#ff5500]" />
                <span>Speciality: {athlete.sportSpecialty || (athlete.position === 'STAFF' ? 'Tactical Coach' : 'Football (Striker)')}</span>
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {athlete.bio || 'High-performance professional athlete focusing on match sprint velocity, kinetic symmetry, and tactical finishing.'}
            </p>

            {/* Unique QR for this player's or staff/admin profile */}
            <div className="mt-3 flex items-center gap-3 p-2.5 rounded-xl bg-[#080c10] border border-slate-800">
              <div className="bg-white p-1.5 rounded-lg shrink-0">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=0&data=${encodeURIComponent(`apex://profile/${athlete.id}`)}`}
                  alt={`QR code for ${athlete.name}`}
                  className="w-20 h-20"
                />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-black text-white uppercase tracking-wider">Profile QR Code</div>
                <div className="text-[9px] text-slate-400 mt-1">Scan to identify this profile</div>
                <div className="text-[8px] text-[#ff5500] font-mono mt-1 break-all">{athlete.id}</div>
              </div>
            </div>
          </div>

          {/* Follow / Following CTA Button */}
          <div className="flex gap-2">
            <button
              onClick={() => onToggleFollow(athlete.id)}
              className={`flex-1 py-2 px-4 rounded-xl font-black uppercase text-xs tracking-wider flex items-center justify-center gap-2 transition-all ${athlete.isFollowing
                  ? 'bg-[#15202b] text-slate-300 border border-slate-700 hover:border-rose-500 hover:text-rose-400'
                  : 'bg-[#ff5500] hover:bg-[#ff6a1a] text-white shadow-lg shadow-[#ff5500]/30 active:scale-98'
                }`}
            >
              {athlete.isFollowing ? (
                <>
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Follow Player</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="py-2 px-3 rounded-xl bg-[#15202b] border border-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Biometrics Bar */}
          <div className="grid grid-cols-4 gap-1.5 p-2.5 bg-[#080c10] rounded-2xl border border-slate-800 text-center">
            <div>
              <div className="text-[8px] font-bold text-slate-400 uppercase">Symmetry</div>
              <div className="text-xs font-black text-[#00e5a3] font-mono">{athlete?.stats?.symmetry ?? 95}%</div>
            </div>
            <div>
              <div className="text-[8px] font-bold text-slate-400 uppercase">Top Speed</div>
              <div className="text-xs font-black text-[#ff5500] font-mono">{athlete?.stats?.topSpeed ?? 32.0} <span className="text-[7px]">km/h</span></div>
            </div>
            <div>
              <div className="text-[8px] font-bold text-slate-400 uppercase">Games</div>
              <div className="text-xs font-black text-white font-mono">{athlete?.stats?.games ?? 0}</div>
            </div>
            <div>
              <div className="text-[8px] font-bold text-slate-400 uppercase">Goals</div>
              <div className="text-xs font-black text-white font-mono">{athlete?.stats?.goals ?? 0}</div>
            </div>
          </div>

          {/* Grid vs Reels vs Stats Tabs */}
          <div className="grid grid-cols-3 border-t border-slate-800 pt-2 text-center">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-2 flex items-center justify-center gap-1.5 text-xs font-bold uppercase transition-all ${activeTab === 'posts'
                  ? 'text-[#ff5500] border-b-2 border-[#ff5500]'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Posts ({playerPosts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reels')}
              className={`py-2 flex items-center justify-center gap-1.5 text-xs font-bold uppercase transition-all ${activeTab === 'reels'
                  ? 'text-[#ff5500] border-b-2 border-[#ff5500]'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Reels ({reels.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`py-2 flex items-center justify-center gap-1.5 text-xs font-bold uppercase transition-all ${activeTab === 'stats'
                  ? 'text-[#ff5500] border-b-2 border-[#ff5500]'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Bio Specs</span>
            </button>
          </div>

          {/* Tab 1: Instagram-like Photo Grid */}
          {activeTab === 'posts' && (
            <div className="grid grid-cols-3 gap-1.5">
              {playerPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => onSelectPost?.(post)}
                  className="group relative aspect-square bg-slate-900 rounded-xl overflow-hidden cursor-pointer border border-slate-800/80 hover:border-[#ff5500] transition-all"
                >
                  <img
                    src={post.thumbnailUrl || post.mediaUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {post.mediaType === 'video' && (
                    <div className="absolute top-1.5 right-1.5 bg-black/70 text-white rounded p-0.5">
                      <Play className="w-2.5 h-2.5 fill-current" />
                    </div>
                  )}
                  {/* Hover stats overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 text-white font-bold transition-opacity">
                    <div className="flex items-center gap-1 text-[10px]">
                      <Heart className="w-3 h-3 fill-white" />
                      <span>{post.likesCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px]">
                      <MessageCircle className="w-3 h-3 fill-white" />
                      <span>{post.commentsCount}</span>
                    </div>
                  </div>
                </div>
              ))}
              {playerPosts.length === 0 && (
                <div className="col-span-3 py-8 text-center text-slate-500 text-xs">
                  No posts shared yet by this athlete.
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Video Reels */}
          {activeTab === 'reels' && (
            <div className="grid grid-cols-2 gap-2">
              {reels.map((reel) => (
                <div
                  key={reel.id}
                  onClick={() => onSelectPost?.(reel)}
                  className="group relative aspect-[9/14] bg-slate-900 rounded-2xl overflow-hidden cursor-pointer border border-slate-800 hover:border-[#ff5500] transition-all"
                >
                  <img
                    src={reel.thumbnailUrl || reel.mediaUrl}
                    alt={reel.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-2.5">
                    <div className="self-end bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[9px] font-mono text-white flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>{reel.viewsCount || '14k'}</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white line-clamp-2">{reel.caption}</p>
                      <span className="text-[8px] text-[#ff5500] font-mono mt-0.5 block">{reel.telemetryTag}</span>
                    </div>
                  </div>
                </div>
              ))}
              {reels.length === 0 && (
                <div className="col-span-2 py-8 text-center text-slate-500 text-xs">
                  No video reels uploaded yet.
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Detailed Bio Specs */}
          {activeTab === 'stats' && (
            <div className="space-y-2.5 bg-[#080c10] p-3.5 rounded-2xl border border-slate-800 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Position & Number</span>
                <span className="font-bold text-white">{athlete.position} (#{athlete.number})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Height & Weight</span>
                <span className="font-bold text-white">{athlete.height || "180 cm"} • {athlete.weight || "75 kg"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Preferred Foot</span>
                <span className="font-bold text-white">{athlete.preferredFoot || 'Right'}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                <span className="text-slate-400">Injury Risk Rating</span>
                <span className="font-bold text-[#00e5a3]">{athlete.stats.injuryRisk}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Force Distribution</span>
                <span className="font-mono text-[#ff5500] font-bold">
                  {athlete.stats.forceBalance.left}% L / {athlete.stats.forceBalance.right}% R
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
