import React, { useState } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Share2, 
  MoreHorizontal, 
  PlusCircle, 
  Play, 
  Pause, 
  Sparkles, 
  CheckCircle2, 
  UserPlus, 
  UserCheck, 
  Zap, 
  Activity, 
  Film, 
  Cpu, 
  Upload, 
  ChevronRight, 
  Flame, 
  MapPin, 
  MessageSquare,
  Filter,
  Users,
  Clock,
  Radio,
  Bell,
  Eye
} from 'lucide-react';
import { AthleteProfile, BiomechanicalScan, HighlightVideo, PlayerStory, SocialComment, SocialPost, TapeAnalysis, FollowerNotification } from '../types';
import { formatRelativeTime, formatExactUploadTime, formatShortUploadTime, useLiveTicker } from '../utils/timeUtils';

interface FeedViewProps {
  currentUser: AthleteProfile;
  posts: SocialPost[];
  stories: PlayerStory[];
  communityAthletes?: Record<string, AthleteProfile>;
  scans?: BiomechanicalScan[];
  followerNotifications?: FollowerNotification[];
  onStartScan: () => void;
  onSelectScan: (scan: BiomechanicalScan) => void;
  onViewAllScans: () => void;
  onOpenCreatePost: () => void;
  onOpenCreateStory?: () => void;
  onOpenPlayerProfile: (athleteId: string) => void;
  onToggleFollow: (athleteId: string) => void;
  onToggleLikePost: (postId: string) => void;
  onToggleSavePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onDeletePost?: (postId: string) => void;
  onOpenStory: (storyIndex: number) => void;
  onPlayVideo?: (item: HighlightVideo | TapeAnalysis) => void;
}

export const FeedView: React.FC<FeedViewProps> = ({
  currentUser,
  posts,
  stories,
  communityAthletes = {},
  scans = [],
  followerNotifications = [],
  onStartScan,
  onSelectScan,
  onViewAllScans,
  onOpenCreatePost,
  onOpenCreateStory,
  onOpenPlayerProfile,
  onToggleFollow,
  onToggleLikePost,
  onToggleSavePost,
  onAddComment,
  onDeletePost,
  onOpenStory,
}) => {
  // Real-time ticker to auto-update relative elapsed time every 3 seconds
  useLiveTicker(3000);

  // Feed view mode: 'social' | 'scans'
  const [feedMode, setFeedMode] = useState<'social' | 'scans'>('social');
  const [socialFilter, setSocialFilter] = useState<'all' | 'reels' | 'stories' | 'players' | 'admins'>('all');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [showFollowerDrawer, setShowFollowerDrawer] = useState(false);
  const [selectedJoint, setSelectedJoint] = useState<'knee' | 'hip' | 'ankle'>('knee');

  // Find user's own story in stories list
  const userStoryIndex = stories.findIndex(
    s => s.playerId === currentUser.id || s.id === 'story-user' || s.id === `story-${currentUser.id}`
  );
  const userStory = userStoryIndex >= 0 ? stories[userStoryIndex] : null;
  const hasUserStory = !!(userStory && userStory.stories && userStory.stories.length > 0);

  // Filter posts (Player & Admin posts & reels)
  const filteredPosts = posts.filter(post => {
    if (socialFilter === 'reels') return post.mediaType === 'video';

    const author = communityAthletes[post.authorId];
    const isAdminAuthor =
      author?.position === 'STAFF' ||
      author?.role?.toLowerCase().includes('coach') ||
      author?.role?.toLowerCase().includes('director') ||
      author?.role?.toLowerCase().includes('physio') ||
      post.authorPosition?.toLowerCase().includes('coach') ||
      post.authorPosition?.toLowerCase().includes('staff') ||
      post.authorId?.startsWith('ADM') ||
      post.authorId === 'APX-8831';

    if (socialFilter === 'players') return !isAdminAuthor;
    if (socialFilter === 'admins') return isAdminAuthor;

    return true;
  });

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setExpandedComments(prev => ({ ...prev, [postId]: true }));
  };

  const handleSharePost = (postId: string) => {
    navigator.clipboard?.writeText?.(window.location.href);
    setShareToast('Post link copied to clipboard!');
    setTimeout(() => setShareToast(null), 2500);
  };

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  return (
    <div className="min-h-screen bg-[#070b0f] pb-28 pt-1 px-3.5 sm:px-4 max-w-md mx-auto space-y-3.5">
      
      {/* Toast notification */}
      {shareToast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#00e5a3] text-black text-xs font-black px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{shareToast}</span>
        </div>
      )}

      {/* 🔴 REAL-TIME FOLLOWER & ACTIVITY LIVE TICKER BAR */}
      <div className="bg-gradient-to-r from-[#101720] via-[#141e2b] to-[#101720] border border-slate-800/90 rounded-2xl p-2.5 shadow-lg flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5a3] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00e5a3]"></span>
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase text-white tracking-wider">REAL-TIME SOCIAL FEED</span>
              <span className="text-[8px] bg-[#00e5a3]/20 text-[#00e5a3] px-1.5 py-0.2 rounded font-mono font-bold">LIVE</span>
            </div>
            <div className="text-[9px] text-slate-400">
              <span className="text-white font-mono font-bold">{currentUser.followersCount || 14200}</span> followers • <span className="text-white font-mono font-bold">{posts.length}</span> posts online
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowFollowerDrawer(!showFollowerDrawer)}
          className="bg-[#192433] hover:bg-[#ff5500] text-slate-300 hover:text-white px-2.5 py-1 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-1 border border-slate-700"
        >
          <Bell className="w-3 h-3 text-[#ff5500] group-hover:text-white" />
          <span>Activity ({followerNotifications.length})</span>
        </button>
      </div>

      {/* Real-time Follower Activity Drawer Dropdown */}
      {showFollowerDrawer && (
        <div className="bg-[#0e141c] border border-slate-800 rounded-2xl p-3 shadow-2xl space-y-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-[#00e5a3] animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase tracking-wider">Live Fan & Follower Stream</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono">Updated in real-time</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {followerNotifications.map((notif) => (
              <div key={notif.id} className="flex items-center justify-between bg-[#121922] p-2 rounded-xl border border-slate-800/60">
                <div className="flex items-center gap-2">
                  <img src={notif.avatar} alt={notif.name} className="w-7 h-7 rounded-full object-cover border border-[#ff5500]" referrerPolicy="no-referrer" />
                  <div>
                    <div className="text-[11px] font-black text-white">{notif.name}</div>
                    <div className="text-[9px] text-[#ff5500] font-mono">{notif.handle}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 font-mono block">
                    {formatRelativeTime(notif.timestamp)}
                  </span>
                  <span className="text-[8px] text-[#00e5a3] font-bold uppercase">Started Following</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 1. TOP INSTAGRAM-STYLE STORIES CAROUSEL & SEPARATE STORY / POST ACTION BAR */}
      <div className="bg-[#101720] border border-slate-800 rounded-3xl p-3.5 shadow-xl space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5500] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5500]"></span>
            </span>
            <span className="text-[11px] font-black uppercase text-white tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#ff5500]" />
              <span>SQUAD STORIES</span>
            </span>
          </div>

          {/* SEPARATE ACTIONS FOR STORY & POST */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenCreateStory ? onOpenCreateStory() : onOpenCreatePost()}
              className="bg-gradient-to-r from-[#ff5500] to-[#ff7700] hover:opacity-90 text-white text-[10px] font-black px-2.5 py-1 rounded-xl uppercase transition-all flex items-center gap-1 shadow-md shadow-orange-500/20"
            >
              <PlusCircle className="w-3 h-3" />
              <span>+ Story</span>
            </button>
            <button
              onClick={onOpenCreatePost}
              className="bg-[#192433] hover:bg-[#00e5a3] text-slate-300 hover:text-black border border-slate-700 text-[10px] font-black px-2.5 py-1 rounded-xl uppercase transition-all flex items-center gap-1"
            >
              <PlusCircle className="w-3 h-3 text-[#00e5a3]" />
              <span>+ Post</span>
            </button>
          </div>
        </div>

        {/* Stories Horizontal Scroll */}
        <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar py-1 px-0.5">
          
          {/* USER STORY CIRCLE */}
          {hasUserStory && userStory ? (
            <div className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group relative">
              <div
                onClick={() => onOpenStory(userStoryIndex)}
                className="relative w-15 h-15 rounded-full p-[2.5px] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] group-hover:scale-105 transition-transform shadow-lg shadow-pink-500/20"
              >
                <div className="w-full h-full rounded-full border-2 border-[#101720] overflow-hidden bg-slate-900">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Quick Add Slide Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenCreateStory) onOpenCreateStory();
                    else onOpenCreatePost();
                  }}
                  title="Add another story slide"
                  className="absolute bottom-0 right-0 bg-[#00e5a3] hover:bg-white text-black p-0.5 rounded-full shadow-md transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-bold text-white group-hover:text-[#ff5500] truncate max-w-[64px] block flex items-center justify-center gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00e5a3] inline-block" />
                  <span>Your Story</span>
                </span>
                <span className="text-[8px] text-[#00e5a3] font-mono block">
                  {userStory.stories.length} {userStory.stories.length === 1 ? 'slide' : 'slides'}
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={() => onOpenCreateStory ? onOpenCreateStory() : onOpenCreatePost()}
              className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group"
            >
              <div className="relative w-15 h-15 rounded-full p-0.5 border-2 border-dashed border-[#ff5500]/80 group-hover:border-[#ff5500] transition-colors">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-900">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform opacity-80 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="absolute bottom-0 right-0 bg-[#ff5500] text-white p-0.5 rounded-full shadow-md">
                  <PlusCircle className="w-3.5 h-3.5" />
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-300 group-hover:text-white truncate max-w-[62px]">
                Your Story
              </span>
            </div>
          )}

          {/* OTHER PLAYERS STORIES */}
          {stories.map((story, idx) => {
            if (idx === userStoryIndex) return null;
            const latestStory = story.stories[0];
            const timeAgo = formatRelativeTime(latestStory?.createdAt || latestStory?.timestamp);

            return (
              <div
                key={story.id}
                onClick={() => onOpenStory(idx)}
                className="flex flex-col items-center gap-1 cursor-pointer shrink-0 group"
              >
                <div className={`relative w-15 h-15 rounded-full p-[2.5px] transition-transform group-hover:scale-105 ${
                  story.hasUnseen
                    ? 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] shadow-md shadow-pink-500/20'
                    : 'border-2 border-slate-700 bg-slate-800'
                }`}>
                  <div className="w-full h-full rounded-full border-2 border-[#101720] overflow-hidden bg-slate-900">
                    <img
                      src={story.playerAvatar}
                      alt={story.playerName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-[10px] font-medium text-slate-300 group-hover:text-white truncate max-w-[64px] block">
                    {story.playerName.split(' ')[0]}
                  </span>
                  <span className="text-[8px] text-slate-500 font-mono block">
                    {timeAgo}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. MODE SELECTOR: SOCIAL SQUAD FEED vs BIOMECHANICAL SCANS HUD */}
      <div className="grid grid-cols-2 gap-1.5 bg-[#0c1015] p-1 rounded-2xl border border-slate-800">
        <button
          onClick={() => setFeedMode('social')}
          className={`py-2 px-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 ${
            feedMode === 'social'
              ? 'bg-[#ff5500] text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Social Feed ({filteredPosts.length})</span>
        </button>

        <button
          onClick={() => setFeedMode('scans')}
          className={`py-2 px-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-1.5 ${
            feedMode === 'scans'
              ? 'bg-[#ff5500] text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Kinetic Scans HUD</span>
        </button>
      </div>

      {/* ================= MODE 1: INSTAGRAM-STYLE SOCIAL FEED ================= */}
      {feedMode === 'social' && (
        <div className="space-y-4">
          
          {/* Sub-Filters: All | Reels | Stories | Players | Coaches */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar pb-1">
            <div className="flex bg-[#101720] p-0.5 rounded-xl border border-slate-800 shrink-0">
              <button
                onClick={() => setSocialFilter('all')}
                className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${
                  socialFilter === 'all'
                    ? 'bg-[#ff5500] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Posts ({posts.length})
              </button>
              <button
                onClick={() => setSocialFilter('reels')}
                className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg transition-all flex items-center gap-1 ${
                  socialFilter === 'reels'
                    ? 'bg-[#ff5500] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Film className="w-2.5 h-2.5 text-[#00e5a3]" />
                <span>Reels 🎬</span>
              </button>
              <button
                onClick={() => setSocialFilter('stories')}
                className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg transition-all flex items-center gap-1 ${
                  socialFilter === 'stories'
                    ? 'bg-gradient-to-r from-[#ff5500] to-[#f09433] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                <span>Stories ({stories.length}) 📸</span>
              </button>
              <button
                onClick={() => setSocialFilter('players')}
                className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${
                  socialFilter === 'players'
                    ? 'bg-[#ff5500] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Players ⚽
              </button>
              <button
                onClick={() => setSocialFilter('admins')}
                className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg transition-all ${
                  socialFilter === 'admins'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Coaches 📋
              </button>
            </div>

            <button
              onClick={onOpenCreatePost}
              className="bg-[#121922] hover:bg-[#00e5a3] hover:text-black border border-slate-700 hover:border-[#00e5a3] text-white text-[10px] font-black px-2.5 py-1 rounded-xl uppercase transition-all flex items-center gap-1 shadow-md shrink-0"
            >
              <PlusCircle className="w-3 h-3 text-[#00e5a3]" />
              <span>New Post</span>
            </button>
          </div>

          {/* DEDICATED STORIES GALLERY VIEW WHEN 'stories' FILTER IS SELECTED */}
          {socialFilter === 'stories' && (
            <div className="bg-[#101720] border border-slate-800 rounded-3xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff5500]" />
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    Squad Stories Archive ({stories.length})
                  </h3>
                </div>
                <button
                  onClick={() => onOpenCreateStory ? onOpenCreateStory() : onOpenCreatePost()}
                  className="text-[10px] font-black text-[#ff5500] hover:underline uppercase flex items-center gap-1"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>Add Story</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stories.map((storyItem, sIdx) => {
                  const firstSlide = storyItem.stories[0];
                  const timeStr = formatRelativeTime(firstSlide?.createdAt || firstSlide?.timestamp);
                  return (
                    <div
                      key={storyItem.id}
                      onClick={() => onOpenStory(sIdx)}
                      className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-slate-900 border-2 border-slate-800 hover:border-[#ff5500] cursor-pointer group transition-all shadow-lg"
                    >
                      <img
                        src={firstSlide?.mediaUrl}
                        alt={storyItem.playerName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                      
                      {/* Top Author Pill */}
                      <div className="absolute top-2 left-2 right-2 flex items-center gap-1.5">
                        <img
                          src={storyItem.playerAvatar}
                          alt={storyItem.playerName}
                          className="w-5 h-5 rounded-full border border-white/80 object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[10px] font-bold text-white truncate drop-shadow">
                          {storyItem.playerName.split(' ')[0]}
                        </span>
                      </div>

                      {/* Bottom Info & Telemetry */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 space-y-1">
                        {firstSlide?.telemetrySnippet && (
                          <span className="text-[8px] bg-[#ff5500] text-white px-1.5 py-0.5 rounded-full font-black block truncate">
                            {firstSlide.telemetrySnippet}
                          </span>
                        )}
                        <p className="text-[10px] font-bold text-white leading-tight truncate">
                          {firstSlide?.caption || 'Squad Story'}
                        </p>
                        <span className="text-[8px] text-slate-400 font-mono block">
                          {timeStr} • {storyItem.stories.length} {storyItem.stories.length === 1 ? 'slide' : 'slides'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Social Posts Stream (Instagram Archetype with Real-Time Timestamps) */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="bg-[#101720] border border-slate-800 rounded-3xl p-8 text-center space-y-3 shadow-xl">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-[#ff5500]">
                  <Film className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">
                    {socialFilter === 'reels'
                      ? 'No Video Reels Uploaded Yet'
                      : socialFilter === 'players'
                      ? 'No Player Posts Found'
                      : socialFilter === 'admins'
                      ? 'No Coach Posts Found'
                      : 'No Posts In Feed Yet'}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                    Upload matchday footage, training drills, or tactical videos to share with the squad.
                  </p>
                </div>
                <button
                  onClick={onOpenCreatePost}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff5500] hover:bg-[#ff4400] text-white text-xs font-black uppercase rounded-xl shadow-lg transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create First Post / Reel</span>
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => {
              const isCommentsOpen = expandedComments[post.id];
              const commentInput = commentInputs[post.id] || '';
              const relativeTime = formatRelativeTime(post.createdAt || post.timestamp);
              const exactTime = post.exactUploadTime || formatExactUploadTime(post.createdAt || post.timestamp);

              return (
                <div
                  key={post.id}
                  className="bg-[#101720] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all"
                >
                  {/* Post Header: Athlete Details, Follow Button & Exact Upload Timestamp */}
                  <div className="p-3.5 bg-[#0c1118] border-b border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div
                        onClick={() => onOpenPlayerProfile(post.authorId)}
                        className="flex items-center gap-2.5 cursor-pointer group"
                      >
                        <div className="relative w-10 h-10 rounded-full border border-[#ff5500] overflow-hidden bg-slate-900 shrink-0">
                          <img
                            src={post.authorAvatar}
                            alt={post.authorName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-black text-white uppercase group-hover:text-[#ff5500] transition-colors">
                              {post.authorName}
                            </span>
                            {post.isVerified && (
                              <CheckCircle2 className="w-3 h-3 text-[#00e5a3] fill-[#00e5a3]/20" />
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-400">
                            <span className="font-mono">{post.authorHandle}</span>
                            <span>•</span>
                            <span>{post.authorPosition}</span>
                          </div>
                        </div>
                      </div>

                      {/* Follow / Following Action Button & Options */}
                      <div className="flex items-center gap-1.5">
                        {post.authorId !== currentUser.id ? (
                          (() => {
                            const isFollowing = !!communityAthletes[post.authorId]?.isFollowing;
                            return (
                              <button
                                onClick={() => onToggleFollow(post.authorId)}
                                className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                                  isFollowing
                                    ? 'border-[#00e5a3]/50 text-[#00e5a3] bg-[#00e5a3]/10 hover:bg-rose-500/10 hover:border-rose-500/50 hover:text-rose-400'
                                    : 'border-slate-700 hover:border-[#ff5500] text-slate-300 hover:text-white bg-[#15202b]'
                                }`}
                              >
                                {isFollowing ? (
                                  <>
                                    <UserCheck className="w-3 h-3 text-[#00e5a3]" />
                                    <span>Following</span>
                                  </>
                                ) : (
                                  <>
                                    <UserPlus className="w-3 h-3 text-[#ff5500]" />
                                    <span>Follow</span>
                                  </>
                                )}
                              </button>
                            );
                          })()
                        ) : (
                          onDeletePost && (
                            <button
                              onClick={() => {
                                if (window.confirm('Delete this post?')) {
                                  onDeletePost(post.id);
                                }
                              }}
                              className="text-[9px] font-black text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/40 px-2 py-0.5 rounded-lg bg-slate-900/50 transition-colors uppercase"
                              title="Delete your post"
                            >
                              Delete
                            </button>
                          )
                        )}

                        <button
                          onClick={() => handleSharePost(post.id)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Prominent Exact Upload Banner */}
                    <div className="flex items-center justify-between text-[9px] bg-[#070b10] px-2.5 py-1 rounded-lg border border-slate-800/60 text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#00e5a3]" />
                        <span>Uploaded: <strong className="text-slate-200">{exactTime}</strong></span>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-[#ff5500] font-bold">
                        <span>⏱️ {relativeTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post Media: Action Photo or Interactive Video Reel */}
                  <div className="relative aspect-square sm:aspect-[4/3] bg-black overflow-hidden flex items-center justify-center">
                    {post.mediaType === 'video' ? (
                      <div className="relative w-full h-full">
                        {playingVideoId === post.id ? (
                          <video
                            src={post.mediaUrl}
                            controls
                            autoPlay
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            onClick={() => setPlayingVideoId(post.id)}
                            className="relative w-full h-full cursor-pointer group"
                          >
                            <img
                              src={post.thumbnailUrl || post.mediaUrl}
                              alt={post.caption}
                              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="w-12 h-12 rounded-full bg-[#ff5500] text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 fill-current translate-x-0.5" />
                              </div>
                            </div>
                            <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white text-[9px] font-mono px-2 py-0.5 rounded-md uppercase font-bold">
                              REEL • {post.viewsCount || '14k views'}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <img
                        src={post.mediaUrl}
                        alt={post.caption}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}

                    {/* Biometrical / Telemetry Tag on Media */}
                    {post.telemetryTag && (
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-xl flex items-center justify-between text-[9px] text-slate-200 pointer-events-none">
                        <div className="flex items-center gap-1.5">
                          <Zap className="w-3 h-3 text-[#ff5500]" />
                          <span className="font-mono font-bold">{post.telemetryTag}</span>
                        </div>
                        <span className="text-[#00e5a3] font-bold uppercase">{post.category}</span>
                      </div>
                    )}
                  </div>

                  {/* Post Actions Bar: Like, Comment, Share, Bookmark */}
                  <div className="p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Like Button */}
                        <button
                          onClick={() => onToggleLikePost(post.id)}
                          className={`flex items-center gap-1.5 text-xs font-black transition-all active:scale-125 ${
                            post.isLiked ? 'text-rose-500' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                          <span className="font-mono">{post.likesCount}</span>
                        </button>

                        {/* Comment Button */}
                        <button
                          onClick={() => toggleComments(post.id)}
                          className="flex items-center gap-1.5 text-xs font-black text-slate-300 hover:text-white transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="font-mono">{post.comments.length || post.commentsCount}</span>
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={() => handleSharePost(post.id)}
                          className="text-slate-300 hover:text-white transition-colors"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Save / Bookmark Button */}
                      <button
                        onClick={() => onToggleSavePost(post.id)}
                        className={`transition-colors ${post.isSaved ? 'text-[#ff5500]' : 'text-slate-400 hover:text-white'}`}
                      >
                        <Bookmark className={`w-5 h-5 ${post.isSaved ? 'fill-[#ff5500]' : ''}`} />
                      </button>
                    </div>

                    {/* Caption & Metadata */}
                    <div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        <span
                          onClick={() => onOpenPlayerProfile(post.authorId)}
                          className="font-black text-white uppercase mr-1.5 cursor-pointer hover:text-[#ff5500]"
                        >
                          {post.authorName}
                        </span>
                        <span>{post.caption}</span>
                      </p>
                      
                      <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-500">
                        {post.location && (
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{post.location}</span>
                          </span>
                        )}
                        <span>•</span>
                        <span className="font-mono text-[#00e5a3]">{relativeTime}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-400">{exactTime}</span>
                      </div>
                    </div>

                    {/* Comments Toggle & List */}
                    {post.comments.length > 0 && !isCommentsOpen && (
                      <button
                        onClick={() => toggleComments(post.id)}
                        className="text-[10px] text-slate-400 font-bold hover:text-slate-200"
                      >
                        View all {post.comments.length} comments
                      </button>
                    )}

                    {/* Expanded Comments List */}
                    {isCommentsOpen && (
                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="flex items-start gap-2 text-xs">
                            <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-800 shrink-0">
                              <img src={comment.authorAvatar} alt={comment.authorName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div className="flex-1 bg-[#080c10] p-2 rounded-xl border border-slate-800/60">
                              <div className="flex items-center justify-between">
                                <span className="font-black text-white text-[10px] uppercase">{comment.authorName}</span>
                                <span className="text-[8px] text-[#00e5a3] font-mono">
                                  {formatRelativeTime(comment.createdAt || comment.timestamp)}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-300 mt-0.5">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* In-Post Add Comment Form */}
                    <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="flex items-center gap-2 pt-1">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-800 shrink-0">
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="Add sports feedback or comment..."
                        className="flex-1 bg-[#080c10] border border-slate-800 rounded-full py-1.5 px-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#ff5500]"
                      />
                      <button
                        type="submit"
                        disabled={!commentInput.trim()}
                        className="p-1.5 text-[#ff5500] hover:text-white disabled:opacity-30 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>
      )}

      {/* ================= MODE 2: KINETIC SCANS & OPTICAL HUD ================= */}
      {feedMode === 'scans' && (
        <div className="space-y-4">
          {/* Top Metrics Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#121922] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
              <div>
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                  SYMMETRY
                </span>
                <div className="text-3xl font-black text-[#ff5500] tracking-tight mt-0.5">
                  {currentUser.stats.symmetry}%
                </div>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-[#ff5500] h-full rounded-full transition-all duration-1000"
                  style={{ width: `${currentUser.stats.symmetry}%` }}
                />
              </div>
            </div>

            <div className="bg-[#121922] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-lg">
              <div>
                <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                  INJURY RISK
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00e5a3] shadow-[0_0_8px_#00e5a3] animate-pulse" />
                  <span className="text-2xl font-black text-[#00e5a3] tracking-wide uppercase">
                    {currentUser.stats.injuryRisk}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Optimal kinematic envelope</p>
            </div>
          </div>

          {/* Force Balance & Start Scan CTA */}
          <div className="bg-[#121922] border border-slate-800 rounded-2xl p-4 shadow-lg text-center relative">
            <span className="text-[11px] font-bold text-slate-300 tracking-wider uppercase">
              FORCE BALANCE
            </span>

            <div className="grid grid-cols-2 divide-x divide-slate-700/60 mt-2 mb-2">
              <div className="pr-3">
                <div className="text-[11px] text-slate-400 font-medium">Left</div>
                <div className="text-2xl font-extrabold text-white">
                  {currentUser.stats.forceBalance.left}%
                </div>
              </div>
              <div className="pl-3">
                <div className="text-[11px] text-slate-400 font-medium">Right</div>
                <div className="text-2xl font-extrabold text-white">
                  {currentUser.stats.forceBalance.right}%
                </div>
              </div>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full flex overflow-hidden max-w-[200px] mx-auto mt-2 mb-3">
              <div className="bg-[#00e5a3] h-full" style={{ width: '48%' }} />
              <div className="bg-[#ff5500] h-full" style={{ width: '52%' }} />
            </div>

            <button
              onClick={onStartScan}
              className="w-full bg-gradient-to-r from-[#ff5500] to-[#ff6b2b] hover:from-[#ff4400] hover:to-[#ff5500] text-white font-extrabold py-3 px-6 rounded-xl shadow-[0_4px_25px_rgba(255,85,0,0.5)] flex items-center justify-center gap-2 active:scale-95 transition-all text-xs tracking-wider uppercase"
            >
              <Upload className="w-4 h-4 stroke-[3]" />
              <span>START NEW BIOMECHANICAL SCAN</span>
            </button>
          </div>

          {/* Interactive Biomechanics Wireframe HUD Graphic */}
          <div className="bg-gradient-to-b from-[#121922] to-[#0a0e13] border border-slate-800/80 rounded-2xl p-4 relative overflow-hidden shadow-xl hud-grid">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#ff5500]" />
                <span className="text-xs font-bold uppercase text-slate-200 tracking-wider">
                  Live Biomechanical HUD
                </span>
              </div>
              <span className="text-[10px] text-[#00e5a3] font-mono bg-[#00e5a3]/10 px-2 py-0.5 rounded border border-[#00e5a3]/30">
                60 FPS TELEMETRY
              </span>
            </div>

            <div className="relative h-44 w-full flex items-center justify-center my-1">
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#ff5500] to-transparent shadow-[0_0_12px_#ff5500] animate-scan-line z-10" />

              <svg viewBox="0 0 200 200" className="w-full h-full text-slate-600 opacity-90">
                <line x1="100" y1="30" x2="100" y2="70" stroke="#ff5500" strokeWidth="2.5" strokeDasharray="3 3" />
                <line x1="100" y1="70" x2="75" y2="110" stroke="#38bdf8" strokeWidth="2" />
                <line x1="100" y1="70" x2="125" y2="110" stroke="#38bdf8" strokeWidth="2" />
                <line x1="75" y1="110" x2="70" y2="160" stroke="#00e5a3" strokeWidth="2.5" />
                <line x1="125" y1="110" x2="130" y2="160" stroke="#ff5500" strokeWidth="2.5" />
                <circle cx="100" cy="20" r="12" fill="#1e293b" stroke="#ff5500" strokeWidth="2" />
                <circle cx="100" cy="40" r="4" fill="#ff5500" />
                <circle cx="70" cy="45" r="3" fill="#38bdf8" />
                <circle cx="130" cy="45" r="3" fill="#38bdf8" />
                <circle cx="100" cy="70" r="5" fill="#38bdf8" className="cursor-pointer" onClick={() => setSelectedJoint('hip')} />
                <circle cx="75" cy="110" r="6" fill="#00e5a3" className="cursor-pointer" onClick={() => setSelectedJoint('knee')} />
                <circle cx="125" cy="110" r="6" fill="#ff5500" className="cursor-pointer" onClick={() => setSelectedJoint('knee')} />
                <circle cx="70" cy="160" r="4" fill="#00e5a3" className="cursor-pointer" onClick={() => setSelectedJoint('ankle')} />
                <circle cx="130" cy="160" r="4" fill="#ff5500" className="cursor-pointer" onClick={() => setSelectedJoint('ankle')} />
              </svg>

              <div className="absolute top-2 left-2 bg-slate-900/90 border border-slate-700/80 p-2 rounded-lg text-[10px] space-y-0.5 backdrop-blur-sm">
                <p className="text-slate-400 font-mono">SUBJECT: <span className="text-white font-bold">{currentUser.name}</span></p>
                <p className="text-slate-400 font-mono">JOINT: <span className="text-[#ff5500] font-bold uppercase">{selectedJoint}</span></p>
                <p className="text-slate-400 font-mono">FLEXION: <span className="text-white font-bold">39°</span></p>
              </div>

              <div className="absolute bottom-2 right-2 bg-slate-900/90 border border-slate-700/80 p-2 rounded-lg text-[10px] space-y-0.5 text-right backdrop-blur-sm">
                <p className="text-slate-400 font-mono">TORQUE: <span className="text-[#00e5a3] font-bold">182 Nm</span></p>
                <p className="text-slate-400 font-mono">JOINT LOAD: <span className="text-[#ff5500] font-bold">945 N</span></p>
                <p className="text-slate-400 font-mono">VMO SYNC: <span className="text-white font-bold">96.4%</span></p>
              </div>
            </div>
          </div>

          {/* RECENT SCANS Header & Cards */}
          <div className="flex items-center justify-between mb-3 mt-4">
            <h2 className="text-sm font-extrabold italic uppercase tracking-wider text-white">
              RECENT SCANS
            </h2>
            <button
              onClick={onViewAllScans}
              className="text-xs font-bold text-[#ff5500] hover:text-[#ff7722] flex items-center gap-0.5 tracking-wider uppercase"
            >
              <span>VIEW ALL</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {scans.map((scan) => (
              <div
                key={scan.id}
                onClick={() => onSelectScan(scan)}
                className="group relative bg-[#121922] hover:bg-[#19232d] border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-200"
              >
                <div className="relative h-32 w-full overflow-hidden bg-slate-900">
                  <img
                    src={scan.imageUrl}
                    alt={scan.athleteName}
                    className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121922] via-[#121922]/70 to-transparent" />
                  
                  <div className="absolute top-3 right-3 bg-slate-950/80 border border-slate-700/80 px-2.5 py-1 rounded-md">
                    <span className="text-[10px] font-bold tracking-wider text-slate-200 uppercase">
                      {scan.scanType}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-black text-white tracking-wide uppercase">
                      {scan.athleteName}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Scan Date: {scan.scanDate}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-slate-800/80 flex items-center justify-between bg-[#0e141c]">
                  <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                    EFFICIENCY SCORE
                  </span>
                  <span
                    className={`text-lg font-black tracking-tight ${
                      scan.efficiencyScore > 90 ? 'text-[#00e5a3]' : 'text-[#ff5500]'
                    }`}
                  >
                    {scan.efficiencyScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
