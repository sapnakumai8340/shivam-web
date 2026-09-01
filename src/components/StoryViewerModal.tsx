import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Send, 
  Sparkles, 
  Activity, 
  Clock, 
  Trash2, 
  Plus, 
  Share2, 
  Smile,
  Flame,
  Zap,
  Trophy,
  CheckCircle2
} from 'lucide-react';
import { AthleteProfile, PlayerStory } from '../types';
import { formatRelativeTime } from '../utils/timeUtils';

interface StoryViewerModalProps {
  isOpen: boolean;
  stories: PlayerStory[];
  initialIndex: number;
  currentUser?: AthleteProfile;
  onClose: () => void;
  onDeleteSlide?: (storyId: string, slideIndex: number) => void;
  onOpenCreateStory?: () => void;
}

const QUICK_REACTIONS = [
  { emoji: '🔥', label: 'Fire' },
  { emoji: '👏', label: 'Clap' },
  { emoji: '⚡', label: 'Speed' },
  { emoji: '⚽', label: 'Goal' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '💯', label: '100' }
];

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  isOpen,
  stories,
  initialIndex,
  currentUser,
  onClose,
  onDeleteSlide,
  onOpenCreateStory
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex || 0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [liked, setLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [floatingReaction, setFloatingReaction] = useState<string | null>(null);
  const [replySent, setReplySent] = useState(false);
  const [progress, setProgress] = useState(0);

  const SLIDE_DURATION_MS = 5000;
  const progressTimerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const pausedProgressRef = useRef<number>(0);

  useEffect(() => {
    setCurrentStoryIndex(initialIndex || 0);
    setCurrentSlideIndex(0);
    setProgress(0);
    setLiked(false);
    pausedProgressRef.current = 0;
  }, [initialIndex, isOpen]);

  // Story slide timer effect
  useEffect(() => {
    if (!isOpen || isPaused) return;

    const interval = 50;
    const increment = (interval / SLIDE_DURATION_MS) * 100;

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, currentStoryIndex, currentSlideIndex, stories.length]);

  if (!isOpen || !stories || stories.length === 0) return null;

  const currentStory = stories[currentStoryIndex] || stories[0];
  const slides = currentStory?.stories || [];
  const currentSlide = slides[currentSlideIndex] || slides[0];
  const isOwnStory = currentUser && (currentStory.playerId === currentUser.id || currentStory.id === 'story-user');

  const handleNextSlide = () => {
    setProgress(0);
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentSlideIndex(0);
    } else {
      onClose();
    }
  };

  const handlePrevSlide = () => {
    setProgress(0);
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      const prevStorySlides = stories[currentStoryIndex - 1]?.stories || [];
      setCurrentSlideIndex(Math.max(0, prevStorySlides.length - 1));
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplySent(true);
    setReplyText('');
    setTimeout(() => setReplySent(false), 2200);
  };

  const handleSendReaction = (emoji: string) => {
    setFloatingReaction(emoji);
    setTimeout(() => setFloatingReaction(null), 1800);
  };

  const handleDeleteCurrentSlide = () => {
    if (onDeleteSlide && currentStory) {
      onDeleteSlide(currentStory.id, currentSlideIndex);
      if (slides.length <= 1) {
        onClose();
      } else {
        setCurrentSlideIndex(prev => Math.max(0, prev - 1));
        setProgress(0);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Outer Story Container */}
      <div 
        className="relative w-full max-w-sm h-full max-h-[88vh] bg-[#090d13] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-slate-800 mx-3 select-none"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        
        {/* 1. TOP PROGRESS BARS FOR ALL SLIDES IN CURRENT STORY */}
        <div className="absolute top-3 inset-x-3 z-30 flex gap-1">
          {slides.map((_, idx) => {
            let fillWidth = '0%';
            if (idx < currentSlideIndex) {
              fillWidth = '100%';
            } else if (idx === currentSlideIndex) {
              fillWidth = `${progress}%`;
            }

            return (
              <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-gradient-to-r from-[#ff5500] to-white transition-all duration-75"
                  style={{ width: fillWidth }}
                />
              </div>
            );
          })}
        </div>

        {/* 2. TOP STORY HEADER (AVATAR, NAME, TIME, ACTIONS) */}
        <div className="absolute top-6 inset-x-3.5 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-[#ff5500] via-[#ffaa00] to-[#00e5a3] shadow-md">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border border-black">
                <img
                  src={currentStory.playerAvatar}
                  alt={currentStory.playerName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-tight block">
                  {currentStory.playerName}
                </span>
                {isOwnStory && (
                  <span className="text-[8px] bg-[#ff5500] text-white px-1.5 py-0.2 rounded-full font-bold">
                    YOU
                  </span>
                )}
              </div>
              <div className="text-[9px] text-[#00e5a3] font-mono flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                <span>{formatRelativeTime(currentSlide?.createdAt || currentSlide?.timestamp)}</span>
                <span className="text-slate-400">• Slide {currentSlideIndex + 1}/{slides.length}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Own Story Actions: Add Slide & Delete */}
            {isOwnStory && (
              <>
                {onOpenCreateStory && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                      onOpenCreateStory();
                    }}
                    title="Add another story slide"
                    className="p-1.5 bg-black/50 backdrop-blur-md rounded-full text-[#00e5a3] hover:bg-black/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCurrentSlide();
                  }}
                  title="Delete this slide"
                  className="p-1.5 bg-black/50 backdrop-blur-md rounded-full text-rose-400 hover:bg-black/80 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. MEDIA BACKGROUND (IMAGE / VIDEO) */}
        <div className="relative flex-1 w-full h-full overflow-hidden bg-black flex items-center justify-center">
          {currentSlide?.mediaType === 'video' ? (
            <video
              src={currentSlide.mediaUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            />
          ) : (
            <img
              src={currentSlide?.mediaUrl}
              alt="Story Slide"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}

          {/* Floating Emoji Reaction Animation */}
          {floatingReaction && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 animate-in zoom-in-50 fade-out duration-1000">
              <span className="text-7xl drop-shadow-2xl animate-bounce">{floatingReaction}</span>
            </div>
          )}

          {/* Left / Right Tap Navigation Areas */}
          <div
            className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer"
            onClick={handlePrevSlide}
          />
          <div
            className="absolute inset-y-0 right-0 w-2/3 z-20 cursor-pointer"
            onClick={handleNextSlide}
          />

          {/* Vignette Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/85 pointer-events-none" />

          {/* 4. STORY CAPTION & SPORTS TELEMETRY BADGE */}
          <div className="absolute bottom-24 inset-x-4 z-20 text-white space-y-2 pointer-events-none">
            {currentSlide?.telemetrySnippet && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff5500]/95 text-white text-[10px] font-black uppercase tracking-wide backdrop-blur-md shadow-xl border border-white/20">
                <Activity className="w-3 h-3 text-white animate-pulse" />
                <span>{currentSlide.telemetrySnippet}</span>
              </div>
            )}
            {currentSlide?.caption && (
              <div className="bg-black/50 backdrop-blur-md border border-white/15 p-2.5 rounded-2xl shadow-xl">
                <p className="text-xs font-bold leading-relaxed text-white drop-shadow-md">
                  {currentSlide.caption}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 5. QUICK REACTION EMOJIS ROW */}
        <div className="absolute bottom-14 inset-x-3 z-30 flex items-center justify-center gap-2 py-1">
          {QUICK_REACTIONS.map((item) => (
            <button
              key={item.emoji}
              onClick={() => handleSendReaction(item.emoji)}
              className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-sm hover:scale-125 transition-transform shadow-md"
            >
              {item.emoji}
            </button>
          ))}
        </div>

        {/* 6. BOTTOM REPLY INPUT & LIKE BUTTON */}
        <div className="absolute bottom-3 inset-x-3 z-30 flex items-center gap-2">
          {replySent ? (
            <div className="flex-1 py-2 px-3 rounded-full bg-[#00e5a3] text-black font-black text-xs text-center flex items-center justify-center gap-1.5 shadow-lg">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Reply sent to {currentStory.playerName}!</span>
            </div>
          ) : (
            <form onSubmit={handleSendReply} className="flex-1 relative">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Send message to ${currentStory.playerName.split(' ')[0]}...`}
                className="w-full bg-black/70 backdrop-blur-md border border-white/25 rounded-full py-2 pl-4 pr-9 text-xs text-white placeholder-white/70 focus:outline-none focus:border-[#ff5500]"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-2 text-white/80 hover:text-[#ff5500] transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <button
            onClick={() => setLiked(!liked)}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              liked
                ? 'bg-rose-600 border-rose-500 text-white scale-110 shadow-[0_0_12px_rgba(225,29,72,0.8)]'
                : 'bg-black/70 border-white/25 text-white hover:bg-black/90'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
