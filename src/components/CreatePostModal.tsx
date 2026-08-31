import React, { useState } from 'react';
import { X, Image as ImageIcon, Film, Sparkles, MapPin, Tag, CheckCircle2, AlertCircle, Upload, Flame, Zap, Clock } from 'lucide-react';
import { AthleteProfile, SocialPost } from '../types';
import { formatExactUploadTime } from '../utils/timeUtils';

interface CreatePostModalProps {
  isOpen: boolean;
  currentUser: AthleteProfile;
  onClose: () => void;
  onCreatePost: (newPost: SocialPost) => void;
}

const PRESET_MEDIA = [
  {
    type: 'photo' as const,
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=80',
    title: 'Matchday Strike',
    tag: '34.8 km/h Sprint Peak • 95% Symmetry'
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
    tag: 'Ball Velocity: 104 km/h • 98% Chain'
  },
  {
    type: 'video' as const,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1000&q=80',
    title: 'Training Reel (Video)',
    tag: 'Optical Velocity Tracking 60 FPS'
  },
  {
    type: 'video' as const,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1000&q=80',
    title: 'Speed Cuts Reel (Video)',
    tag: 'Ground Contact: 88ms • 94% Symmetry'
  }
];

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onCreatePost
}) => {
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [mediaUrl, setMediaUrl] = useState(PRESET_MEDIA[0].url);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(undefined);
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<SocialPost['category']>('MATCHDAY');
  const [location, setLocation] = useState('Arena Stadium');
  const [telemetryTag, setTelemetryTag] = useState('95% Symmetry • 34.8 km/h Sprint Peak');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESET_MEDIA[0]) => {
    setMediaType(preset.type);
    setMediaUrl(preset.url);
    setThumbnailUrl(preset.type === 'video' ? (preset as any).thumbnail : undefined);
    setTelemetryTag(preset.tag);
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const objectUrl = URL.createObjectURL(file);
      setMediaType(isVideo ? 'video' : 'photo');
      setMediaUrl(objectUrl);
      if (isVideo) {
        setThumbnailUrl('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      setErrorMsg('Please write a caption or training note for your post.');
      return;
    }

    setIsSubmitting(true);
    const now = Date.now();

    const newPost: SocialPost = {
      id: `post-${now}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorHandle: currentUser.handle || `@${currentUser.name.toLowerCase().replace(/\s+/g, '')}_${currentUser.number}`,
      authorClub: currentUser.club || 'Premier Squad',
      authorPosition: `${currentUser.role} (#${currentUser.number})`,
      authorNumber: currentUser.number,
      isVerified: true,
      mediaType,
      mediaUrl,
      thumbnailUrl,
      caption: caption.trim(),
      category,
      timestamp: 'Just now',
      createdAt: now,
      exactUploadTime: formatExactUploadTime(now),
      likesCount: 1,
      isLiked: true,
      commentsCount: 0,
      comments: [],
      location: location.trim() || 'Athletic Facility',
      telemetryTag: telemetryTag.trim() || 'Match Readiness 98% • Active Telemetry',
      viewsCount: '1'
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onCreatePost(newPost);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#101720] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#0c1118]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-pulse" />
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              Create Sports Post / Reel
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Current User Info Row */}
          <div className="flex items-center gap-3 p-2.5 bg-[#080c10] rounded-2xl border border-slate-800/80">
            <div className="w-10 h-10 rounded-full border border-[#ff5500] overflow-hidden bg-slate-900 shrink-0">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-black text-white uppercase text-xs">{currentUser.name}</span>
                <span className="text-[10px] text-[#ff5500] font-mono font-bold">#{currentUser.number}</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                {currentUser.handle || `@${currentUser.name.toLowerCase().replace(/\s+/g, '')}_${currentUser.number}`}
              </p>
            </div>
          </div>

          {/* Media Format Toggle */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
              Media Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMediaType('photo')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold uppercase transition-all ${mediaType === 'photo'
                  ? 'bg-[#ff5500]/20 border-[#ff5500] text-white'
                  : 'bg-[#080c10] border-slate-800 text-slate-400 hover:text-white'
                  }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#ff5500]" />
                <span>Action Photo</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 font-bold uppercase transition-all ${mediaType === 'video'
                  ? 'bg-[#ff5500]/20 border-[#ff5500] text-white'
                  : 'bg-[#080c10] border-slate-800 text-slate-400 hover:text-white'
                  }`}
              >
                <Film className="w-3.5 h-3.5 text-[#ff5500]" />
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
              <label className="cursor-pointer text-[10px] font-black text-[#ff5500] hover:underline flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Custom File</span>
                <input type="file" accept="image/*,video/*" onChange={handleCustomUpload} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {PRESET_MEDIA.map((preset, idx) => {
                const isSelected = mediaUrl === preset.url;
                const thumb = preset.type === 'video' ? (preset as any).thumbnail : preset.url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`relative rounded-xl overflow-hidden aspect-video border-2 text-left transition-all ${isSelected ? 'border-[#ff5500] ring-2 ring-[#ff5500]/40' : 'border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                  >
                    <img src={thumb} alt={preset.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    {preset.type === 'video' && (
                      <span className="absolute bottom-1 right-1 bg-black/80 text-[8px] font-bold text-white px-1 rounded">
                        REEL
                      </span>
                    )}
                    {isSelected && (
                      <span className="absolute top-1 left-1 bg-[#ff5500] text-white rounded-full p-0.5 shadow">
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
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Share matchday thoughts, training milestone, or tactical breakdown... #Matchday #ApexFC"
              className="w-full bg-[#080c10] border border-slate-800 rounded-xl p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-[#ff5500] resize-none transition-colors"
            />
          </div>

          {/* Sports Category Tag */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-[#080c10] border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-[#ff5500]"
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
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Arena"
                  className="w-full bg-[#080c10] border border-slate-800 rounded-xl py-1.5 pl-7 pr-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#ff5500]"
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
              <Zap className="w-3 h-3 absolute left-2.5 top-2.5 text-[#ff5500]" />
              <input
                type="text"
                value={telemetryTag}
                onChange={(e) => setTelemetryTag(e.target.value)}
                placeholder="e.g. 95% Symmetry • 34.8 km/h Sprint Peak"
                className="w-full bg-[#080c10] border border-slate-800 rounded-xl py-1.5 pl-7 pr-2 text-white placeholder-slate-600 focus:outline-none focus:border-[#ff5500]"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#ff5500] to-[#ff6b2b] hover:from-[#ff4400] hover:to-[#ff5500] text-white font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 uppercase tracking-wider shadow-[0_4px_18px_rgba(255,85,0,0.4)] active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>PUBLISHING POST...</span>
                </span>
              ) : (
                <span>SHARE TO SQUAD FEED</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
