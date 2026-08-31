import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Send, Sparkles, Activity, Clock } from 'lucide-react';
import { PlayerStory } from '../types';
import { formatRelativeTime } from '../utils/timeUtils';

interface StoryViewerModalProps {
  isOpen: boolean;
  stories: PlayerStory[];
  initialIndex: number;
  onClose: () => void;
}

export const StoryViewerModal: React.FC<StoryViewerModalProps> = ({
  isOpen,
  stories,
  initialIndex,
  onClose
}) => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialIndex || 0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySent, setReplySent] = useState(false);

  useEffect(() => {
    setCurrentStoryIndex(initialIndex || 0);
    setCurrentSlideIndex(0);
    setLiked(false);
  }, [initialIndex, isOpen]);

  if (!isOpen || !stories || stories.length === 0) return null;

  const currentStory = stories[currentStoryIndex] || stories[0];
  const slides = currentStory?.stories || [];
  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
      setCurrentSlideIndex(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    } else if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
      setCurrentSlideIndex(0);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setReplySent(true);
    setReplyText('');
    setTimeout(() => setReplySent(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm h-full max-h-[85vh] bg-[#0c1015] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-slate-800 mx-3">
        
        {/* Progress Bars */}
        <div className="absolute top-3 inset-x-3 z-30 flex gap-1">
          {slides.map((_, idx) => (
            <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className={`h-full bg-white transition-all duration-300 ${
                  idx < currentSlideIndex ? 'w-full' : idx === currentSlideIndex ? 'w-full animate-pulse' : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Top Header */}
        <div className="absolute top-6 inset-x-3 z-30 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-[#ff5500] overflow-hidden bg-slate-900">
              <img src={currentStory.playerAvatar} alt={currentStory.playerName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-tight block">{currentStory.playerName}</span>
              <span className="text-[9px] text-[#00e5a3] font-mono flex items-center gap-1">
                <Clock className="w-2.5 h-2.5" />
                <span>{formatRelativeTime(currentSlide?.createdAt || currentSlide?.timestamp)}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Media Background */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          {currentSlide?.mediaUrl && (
            <img
              src={currentSlide.mediaUrl}
              alt="Story"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}

          {/* Left / Right Tap Areas for Navigation */}
          <div className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer" onClick={handlePrev} />
          <div className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer" onClick={handleNext} />

          {/* Overlay Gradient for Text */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

          {/* Story Caption & Sports Telemetry Tag */}
          <div className="absolute bottom-20 inset-x-4 z-20 text-white space-y-1.5">
            {currentSlide?.telemetrySnippet && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ff5500]/90 text-white text-[10px] font-black uppercase tracking-wide backdrop-blur-md shadow-lg">
                <Activity className="w-3 h-3" />
                <span>{currentSlide.telemetrySnippet}</span>
              </div>
            )}
            {currentSlide?.caption && (
              <p className="text-sm font-bold leading-snug drop-shadow-md">
                {currentSlide.caption}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Reply Bar */}
        <div className="absolute bottom-3 inset-x-3 z-30 flex items-center gap-2">
          {replySent ? (
            <div className="flex-1 py-2 px-3 rounded-full bg-[#00e5a3] text-black font-black text-xs text-center">
              Reply Sent to {currentStory.playerName}!
            </div>
          ) : (
            <form onSubmit={handleSendReply} className="flex-1 relative">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Send message to ${currentStory.playerName}...`}
                className="w-full bg-black/60 backdrop-blur-md border border-white/20 rounded-full py-2 pl-4 pr-9 text-xs text-white placeholder-white/70 focus:outline-none focus:border-[#ff5500]"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-2 text-white/80 hover:text-white"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <button
            onClick={() => setLiked(!liked)}
            className={`p-2 rounded-full backdrop-blur-md border transition-all ${
              liked
                ? 'bg-rose-600 border-rose-500 text-white'
                : 'bg-black/60 border-white/20 text-white hover:bg-black/80'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
