import React, { useState, useEffect } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Film, 
  Sparkles, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Flame, 
  Zap, 
  Clock, 
  Camera, 
  Layers, 
  Heart, 
  Activity, 
  Send,
  Eye,
  Plus
} from 'lucide-react';
import { AthleteProfile, SocialPost, PlayerStory } from '../types';
import { formatExactUploadTime } from '../utils/timeUtils';

interface CreatePostModalProps {
  isOpen: boolean;
  currentUser: AthleteProfile;
  initialTab?: 'story' | 'post';
  onClose: () => void;
  onCreatePost: (newPost: SocialPost) => void;
  onCreateStory?: (newStoryItem: {
    mediaUrl: string;
    mediaType: 'photo' | 'video';
    caption?: string;
    telemetrySnippet?: string;
  }) => void;
}

const PRESET_MEDIA = [
  {
    type: 'photo' as const,
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=80',
    title: 'Matchday Strike',
    tag: '⚡ 34.8 km/h Sprint Peak • 95% Symmetry'
  },
  {
    type: 'photo' as const,
    url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
    title: 'Warmup & Agility',
    tag: 'Cadence: 4.6 steps/sec • HR 162 BPM'
  },
  {
    type: 'photo' as const,
    url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
    title: 'Free Kick Drill',
    tag: '🎯 Ball Velocity: 104 km/h • 98% Chain'
  },
  {
    type: 'photo' as const,
    url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1000&q=80',
    title: 'Recovery & Mobility',
    tag: '🩺 Recovery Score: 96% • Cryo Done'
  },
  {
    type: 'video' as const,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1000&q=80',
    title: 'Training Reel (Video)',
    tag: '⚡ Optical Velocity Tracking 60 FPS'
  },
  {
    type: 'video' as const,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1000&q=80',
    title: 'Speed Cuts Reel (Video)',
    tag: 'Ground Contact: 88ms • 94% Symmetry'
  }
];

const TELEMETRY_STICKERS = [
  '⚡ 34.8 km/h Sprint Peak',
  '🔥 Matchday Heatmap Ready',
  '🎯 98% Chain Accuracy',
  '🩺 Recovery Score: 96%',
  '⚽ Goal Highlight Moment',
  '🏋️ Biomechanics & Gym Session',
  '⏱️ Match Countdown 48H',
  '🏆 Derby Win 3-1'
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  currentUser,
  initialTab = 'story',
  onClose,
  onCreatePost,
  onCreateStory
}) => {
  // Tab state: 'story' | 'post'
  const [activeTab, setActiveTab] = useState<'story' | 'post'>(initialTab);

  // Story Form State
  const [storyMediaType, setStoryMediaType] = useState<'photo' | 'video'>('photo');
  const [storyMediaUrl, setStoryMediaUrl] = useState(PRESET_MEDIA[0].url);
  const [storyCaption, setStoryCaption] = useState('Matchday training locked in! Ready for kickoff 🚀 #ApexFC');
  const [storyTelemetry, setStoryTelemetry] = useState('⚡ 34.8 km/h Sprint Peak • 95% Symmetry');
  const [storyIsSubmitting, setStoryIsSubmitting] = useState(false);

  // Post Form State
  const [postMediaType, setPostMediaType] = useState<'photo' | 'video'>('photo');
  const [postMediaUrl, setPostMediaUrl] = useState(PRESET_MEDIA[0].url);
  const [postThumbnailUrl, setPostThumbnailUrl] = useState<string | undefined>(undefined);
  const [postCaption, setPostCaption] = useState('');
  const [postCategory, setPostCategory] = useState<SocialPost['category']>('MATCHDAY');
  const [postLocation, setPostLocation] = useState('Apex High-Performance Arena');
  const [postTelemetryTag, setPostTelemetryTag] = useState('95% Symmetry • 34.8 km/h Sprint Peak');
  const [postIsSubmitting, setPostIsSubmitting] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setErrorMsg(null);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  // Custom File Upload Handler
  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'story' | 'post') => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const objectUrl = URL.createObjectURL(file);
      if (target === 'story') {
        setStoryMediaType(isVideo ? 'video' : 'photo');
        setStoryMediaUrl(objectUrl);
      } else {
        setPostMediaType(isVideo ? 'video' : 'photo');
        setPostMediaUrl(objectUrl);
        if (isVideo) {
          setPostThumbnailUrl('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80');
        }
      }
    }
  };

  // Submit Story Handler
  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    setStoryIsSubmitting(true);
    setErrorMsg(null);

    setTimeout(() => {
      if (onCreateStory) {
        onCreateStory({
          mediaUrl: storyMediaUrl,
          mediaType: storyMediaType,
          caption: storyCaption.trim() || undefined,
          telemetrySnippet: storyTelemetry.trim() || undefined
        });
      }
      setStoryIsSubmitting(false);
      onClose();
    }, 450);
  };

  // Submit Post Handler
  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postCaption.trim()) {
      setErrorMsg('Please write a caption or training note for your squad post.');
      return;
    }

    setPostIsSubmitting(true);
    setErrorMsg(null);
    const now = Date.now();

    const newPost: SocialPost = {
      id: `post-${now}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorHandle: currentUser.handle || `@${currentUser.name.toLowerCase().replace(/\s+/g, '')}_${currentUser.number}`,
      authorClub: currentUser.club || 'Apex Premier Squad',
      authorPosition: `${currentUser.role} (#${currentUser.number})`,
      authorNumber: currentUser.number,
      isVerified: true,
      mediaType: postMediaType,
      mediaUrl: postMediaUrl,
      thumbnailUrl: postThumbnailUrl,
      caption: postCaption.trim(),
      category: postCategory,
      timestamp: 'Just now',
      createdAt: now,
      exactUploadTime: formatExactUploadTime(now),
      likesCount: 1,
      isLiked: true,
      commentsCount: 0,
      comments: [],
      location: postLocation.trim() || 'Apex Athletic Arena',
      telemetryTag: postTelemetryTag.trim() || 'Match Readiness 98% • Active Telemetry',
      viewsCount: '1'
    };

    setTimeout(() => {
      setPostIsSubmitting(false);
      onCreatePost(newPost);
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#0e141c] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
        
        {/* TOP HEADER WITH SEGMENTED TABS: STORY vs POST */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800/90 bg-[#090d13] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff5500] animate-pulse" />
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                Create Sports Content
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TWO MAIN SECTION SWITCH TABS: STORY vs POST */}
          <div className="grid grid-cols-2 gap-1.5 bg-[#05080c] p-1 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('story')}
              className={`py-2 px-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${
                activeTab === 'story'
                  ? 'bg-gradient-to-r from-[#ff5500] via-[#ff7700] to-[#ff9900] text-white shadow-lg ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>📸 Instagram Story (24h)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('post')}
              className={`py-2 px-3 rounded-xl text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${
                activeTab === 'post'
                  ? 'bg-gradient-to-r from-[#00e5a3] to-[#00b882] text-black shadow-lg ring-1 ring-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>📝 Feed Post / Reel</span>
            </button>
          </div>
        </div>

        {/* ERROR NOTIFICATION IF ANY */}
        {errorMsg && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 1: INSTAGRAM-STYLE STORY CREATOR                 */}
        {/* ======================================================== */}
        {activeTab === 'story' && (
          <form onSubmit={handleSubmitStory} className="p-4 overflow-y-auto space-y-4 text-xs">
            
            {/* Story Badge Info Banner */}
            <div className="bg-gradient-to-r from-[#ff5500]/15 via-[#ff9900]/10 to-transparent border border-[#ff5500]/30 rounded-2xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff5500] to-[#ffaa00] p-0.5 flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#ff5500]" />
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-black text-white uppercase block">Instant Squad Story</span>
                  <span className="text-[9px] text-slate-400">Appears in top Stories bar for 24h</span>
                </div>
              </div>
              <span className="text-[9px] bg-[#ff5500]/20 text-[#ff5500] px-2 py-0.5 rounded-full font-mono font-bold">
                STORY MODE
              </span>
            </div>

            {/* Visual 9:16 Story Phone Preview Frame */}
            <div className="flex justify-center">
              <div className="relative w-56 h-80 rounded-3xl overflow-hidden border-2 border-[#ff5500]/50 shadow-2xl bg-black flex flex-col justify-between p-3 group">
                
                {/* Background Media */}
                {storyMediaType === 'photo' ? (
                  <img
                    src={storyMediaUrl}
                    alt="Story Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <video
                    src={storyMediaUrl}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                )}

                {/* Dark Vignette Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

                {/* Top Story Bar in Preview */}
                <div className="relative z-10 space-y-1.5">
                  <div className="w-full h-1 bg-white/40 rounded-full overflow-hidden">
                    <div className="w-2/3 h-full bg-[#ff5500]" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-5 h-5 rounded-full object-cover border border-[#ff5500]"
                      referrerPolicy="no-referrer"
                    />
                    <span className="text-[10px] font-bold text-white drop-shadow truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <span className="text-[8px] text-white/75 font-mono">Just now</span>
                  </div>
                </div>

                {/* Live Telemetry Sticker & Caption in Preview */}
                <div className="relative z-10 space-y-1">
                  {storyTelemetry && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ff5500]/90 text-white text-[8px] font-black uppercase tracking-wide backdrop-blur-md shadow-md">
                      <Activity className="w-2.5 h-2.5" />
                      <span className="truncate max-w-[170px]">{storyTelemetry}</span>
                    </div>
                  )}
                  {storyCaption && (
                    <p className="text-[11px] font-bold text-white leading-tight drop-shadow-md bg-black/40 backdrop-blur-sm p-1.5 rounded-xl border border-white/15">
                      {storyCaption}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Media Type Toggle */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                Story Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStoryMediaType('photo')}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold uppercase transition-all ${
                    storyMediaType === 'photo'
                      ? 'bg-[#ff5500]/20 border-[#ff5500] text-white'
                      : 'bg-[#080c10] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#ff5500]" />
                  <span>Action Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStoryMediaType('video')}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold uppercase transition-all ${
                    storyMediaType === 'video'
                      ? 'bg-[#ff5500]/20 border-[#ff5500] text-white'
                      : 'bg-[#080c10] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-[#ff5500]" />
                  <span>Video Clip</span>
                </button>
              </div>
            </div>

            {/* Choose Media Preset or Custom Upload */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Select Story Clip or Upload
                </label>
                <label className="cursor-pointer text-[10px] font-black text-[#ff5500] hover:underline flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => handleCustomUpload(e, 'story')}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {PRESET_MEDIA.map((preset, idx) => {
                  const isSelected = storyMediaUrl === preset.url;
                  const thumb = preset.type === 'video' ? (preset as any).thumbnail : preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setStoryMediaType(preset.type);
                        setStoryMediaUrl(preset.url);
                        setStoryTelemetry(preset.tag);
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 text-left transition-all ${
                        isSelected
                          ? 'border-[#ff5500] ring-2 ring-[#ff5500]/40'
                          : 'border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={thumb} alt={preset.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {isSelected && (
                        <span className="absolute top-1 left-1 bg-[#ff5500] text-white rounded-full p-0.5 shadow">
                          <CheckCircle2 className="w-3 h-3" />
                        </span>
                      )}
                      <span className="absolute bottom-1 inset-x-1 bg-black/80 text-[8px] font-bold text-white px-1 py-0.5 rounded truncate text-center">
                        {preset.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Sports Telemetry Stickers */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                ⚡ Add Telemetry Sticker
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TELEMETRY_STICKERS.map((sticker, idx) => {
                  const isSelected = storyTelemetry === sticker;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setStoryTelemetry(sticker)}
                      className={`text-[9px] font-bold px-2 py-1 rounded-full border transition-all ${
                        isSelected
                          ? 'bg-[#ff5500] border-[#ff5500] text-white shadow-sm'
                          : 'bg-[#080c10] border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {sticker}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Story Caption Input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Story Text / Caption
              </label>
              <input
                type="text"
                value={storyCaption}
                onChange={(e) => setStoryCaption(e.target.value)}
                placeholder="Add text to your story..."
                className="w-full bg-[#080c10] border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#ff5500]"
              />
            </div>

            {/* Submit Story CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={storyIsSubmitting}
                className="w-full bg-gradient-to-r from-[#ff5500] via-[#ff7700] to-[#ffaa00] hover:opacity-95 text-white font-black py-3 px-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-wider shadow-[0_4px_20px_rgba(255,85,0,0.4)] active:scale-95 transition-all disabled:opacity-50"
              >
                {storyIsSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>ADDING TO YOUR STORY...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>SHARE TO YOUR STORY</span>
                  </span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* SECTION 2: FEED POST & VIDEO REEL CREATOR                */}
        {/* ======================================================== */}
        {activeTab === 'post' && (
          <form onSubmit={handleSubmitPost} className="p-4 overflow-y-auto space-y-4 text-xs">
            
            {/* User Info Row */}
            <div className="flex items-center gap-3 p-2.5 bg-[#080c10] rounded-2xl border border-slate-800/80">
              <div className="w-10 h-10 rounded-full border border-[#00e5a3] overflow-hidden bg-slate-900 shrink-0">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-black text-white uppercase text-xs">{currentUser.name}</span>
                  <span className="text-[10px] text-[#00e5a3] font-mono font-bold">#{currentUser.number}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">
                  {currentUser.handle || `@${currentUser.name.toLowerCase().replace(/\s+/g, '')}_${currentUser.number}`}
                </p>
              </div>
            </div>

            {/* Media Format Toggle */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                Feed Media Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPostMediaType('photo')}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold uppercase transition-all ${
                    postMediaType === 'photo'
                      ? 'bg-[#00e5a3]/20 border-[#00e5a3] text-white'
                      : 'bg-[#080c10] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#00e5a3]" />
                  <span>Action Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPostMediaType('video')}
                  className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold uppercase transition-all ${
                    postMediaType === 'video'
                      ? 'bg-[#00e5a3]/20 border-[#00e5a3] text-white'
                      : 'bg-[#080c10] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-[#00e5a3]" />
                  <span>Video Reel</span>
                </button>
              </div>
            </div>

            {/* Preset Sports Media Options */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Choose Match/Training Clip or Upload
                </label>
                <label className="cursor-pointer text-[10px] font-black text-[#00e5a3] hover:underline flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>Upload File</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => handleCustomUpload(e, 'post')}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {PRESET_MEDIA.map((preset, idx) => {
                  const isSelected = postMediaUrl === preset.url;
                  const thumb = preset.type === 'video' ? (preset as any).thumbnail : preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setPostMediaType(preset.type);
                        setPostMediaUrl(preset.url);
                        setPostThumbnailUrl(preset.type === 'video' ? (preset as any).thumbnail : undefined);
                        setPostTelemetryTag(preset.tag);
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-video border-2 text-left transition-all ${
                        isSelected ? 'border-[#00e5a3] ring-2 ring-[#00e5a3]/40' : 'border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={thumb} alt={preset.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {preset.type === 'video' && (
                        <span className="absolute bottom-1 right-1 bg-black/80 text-[8px] font-bold text-white px-1 rounded">
                          REEL
                        </span>
                      )}
                      {isSelected && (
                        <span className="absolute top-1 left-1 bg-[#00e5a3] text-black rounded-full p-0.5 shadow">
                          <CheckCircle2 className="w-3 h-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Caption Input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Caption & Athlete Notes *
              </label>
              <textarea
                rows={3}
                value={postCaption}
                onChange={(e) => setPostCaption(e.target.value)}
                placeholder="Share matchday thoughts, training milestone, or tactical breakdown... #Matchday #ApexFC"
                className="w-full bg-[#080c10] border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5a3] resize-none transition-colors"
              />
            </div>

            {/* Category & Location */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Category
                </label>
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value as any)}
                  className="w-full bg-[#080c10] border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-[#00e5a3]"
                >
                  <option value="MATCHDAY">MATCHDAY</option>
                  <option value="TRAINING">TRAINING</option>
                  <option value="GOAL">GOAL / HIGHLIGHT</option>
                  <option value="BIOMECHANICS">BIOMECHANICS</option>
                  <option value="RECOVERY">RECOVERY</option>
                  <option value="LIFESTYLE">LIFESTYLE</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="w-3 h-3 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={postLocation}
                    onChange={(e) => setPostLocation(e.target.value)}
                    placeholder="Arena"
                    className="w-full bg-[#080c10] border border-slate-800 rounded-xl py-1.5 pl-7 pr-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5a3]"
                  />
                </div>
              </div>
            </div>

            {/* Biomechanical Telemetry Tag */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Biometrical / Telemetry HUD Tag
              </label>
              <div className="relative">
                <Zap className="w-3 h-3 absolute left-2.5 top-2.5 text-[#00e5a3]" />
                <input
                  type="text"
                  value={postTelemetryTag}
                  onChange={(e) => setPostTelemetryTag(e.target.value)}
                  placeholder="e.g. 95% Symmetry • 34.8 km/h Sprint Peak"
                  className="w-full bg-[#080c10] border border-slate-800 rounded-xl py-1.5 pl-7 pr-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#00e5a3]"
                />
              </div>
            </div>

            {/* Submit Post CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={postIsSubmitting}
                className="w-full bg-gradient-to-r from-[#00e5a3] to-[#00b882] hover:opacity-95 text-black font-black py-3 px-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-wider shadow-[0_4px_20px_rgba(0,229,163,0.3)] active:scale-95 transition-all disabled:opacity-50"
              >
                {postIsSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>PUBLISHING POST...</span>
                  </span>
                ) : (
                  <span>SHARE TO SQUAD FEED</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
