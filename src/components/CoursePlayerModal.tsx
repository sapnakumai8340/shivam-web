import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  CheckCircle2,
  Circle,
  Clock,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Sparkles,
  ListVideo,
  Check,
} from 'lucide-react';
import { Course, CourseLesson, UserCourseProgress } from '../types';

interface CoursePlayerModalProps {
  isOpen: boolean;
  course: Course | null;
  initialLessonId?: string;
  initialPositionSec?: number;
  progress?: UserCourseProgress | null;
  onClose: () => void;
  onUpdateProgress: (courseId: string, lessonId: string, positionSec: number, completed: boolean) => void;
}

export const CoursePlayerModal: React.FC<CoursePlayerModalProps> = ({
  isOpen,
  course,
  initialLessonId,
  initialPositionSec = 0,
  progress,
  onClose,
  onUpdateProgress,
}) => {
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten lessons list for next/prev navigation
  const allLessons: CourseLesson[] = [];
  course?.chapters?.forEach((ch) => {
    (ch.lessons || []).forEach((les) => allLessons.push(les));
  });

  const currentLesson = allLessons.find((l) => l.id === currentLessonId) || allLessons[0];
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);
  const hasNextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1;
  const hasPrevLesson = currentIndex > 0;

  // Set initial lesson
  useEffect(() => {
    if (isOpen && course) {
      const targetLessonId =
        initialLessonId ||
        progress?.lastWatchedLessonId ||
        course.chapters?.[0]?.lessons?.[0]?.id ||
        '';
      setCurrentLessonId(targetLessonId);

      // Expand all chapters initially
      const initialExpanded: Record<string, boolean> = {};
      course.chapters?.forEach((ch) => {
        initialExpanded[ch.id] = true;
      });
      setExpandedChapters(initialExpanded);
    }
  }, [isOpen, course, initialLessonId, progress?.lastWatchedLessonId]);

  // Set initial playback position on video ready
  useEffect(() => {
    if (videoRef.current && initialPositionSec > 0) {
      videoRef.current.currentTime = initialPositionSec;
    }
  }, [currentLessonId, initialPositionSec]);

  // Auto-save progress every 4 seconds
  useEffect(() => {
    if (!isOpen || !course || !currentLesson) return;

    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        const pos = videoRef.current.currentTime;
        const dur = videoRef.current.duration || 1;
        const isComplete = pos >= dur * 0.9;
        onUpdateProgress(course.id, currentLesson.id, pos, isComplete);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpen, course, currentLesson, onUpdateProgress]);

  if (!isOpen || !course || !currentLesson) return null;

  const isLessonCompleted = (lessonId: string) => {
    return progress?.completedLessonIds?.includes(lessonId) || false;
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
    setDuration(videoRef.current.duration || 0);

    // Auto mark completed if watched 90%
    if (
      videoRef.current.duration > 0 &&
      videoRef.current.currentTime >= videoRef.current.duration * 0.9 &&
      !isLessonCompleted(currentLesson.id)
    ) {
      onUpdateProgress(course.id, currentLesson.id, videoRef.current.currentTime, true);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleSelectLesson = (lesson: CourseLesson) => {
    if (videoRef.current) {
      onUpdateProgress(course.id, currentLesson.id, videoRef.current.currentTime, isLessonCompleted(currentLesson.id));
    }
    setCurrentLessonId(lesson.id);
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const handleNextLesson = () => {
    if (hasNextLesson) {
      handleSelectLesson(allLessons[currentIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (hasPrevLesson) {
      handleSelectLesson(allLessons[currentIndex - 1]);
    }
  };

  const handleToggleComplete = (lessonId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentlyDone = isLessonCompleted(lessonId);
    onUpdateProgress(course.id, lessonId, currentTime, !currentlyDone);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl bg-[#0e141b] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-slate-800 bg-[#070b0f]/80 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/30 flex items-center justify-center text-[#ff5500] shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#ff5500] bg-[#ff5500]/10 px-2 py-0.5 rounded-md">
                  {course.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Lesson {currentIndex + 1} of {allLessons.length}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white truncate">{course.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Progress Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <div className="w-20 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#ff5500] to-[#00e5a3] h-full transition-all duration-300"
                  style={{ width: `${progress?.overallProgressPct || 0}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-slate-300">
                {progress?.overallProgressPct || 0}% Done
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Grid: Video Player + Playlist Sidebar */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          {/* Left: Video Classroom (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col bg-black overflow-y-auto">
            {/* Video Container */}
            <div className="relative aspect-video bg-black flex items-center justify-center group">
              <video
                ref={videoRef}
                src={currentLesson.videoUrl}
                poster={currentLesson.thumbnailUrl || course.thumbnail}
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleNextLesson}
                autoPlay
                playsInline
                className="w-full h-full object-contain cursor-pointer"
                onClick={handlePlayPause}
              />

              {/* Watermark badge */}
              <div className="absolute top-3 left-3 pointer-events-none bg-black/60 backdrop-blur-sm border border-slate-800 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#ff5500]" />
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-200">
                  ACADEMY • 1080P HD
                </span>
              </div>

              {/* Center Play Overlay when Paused */}
              {!isPlaying && (
                <button
                  onClick={handlePlayPause}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#ff5500]/90 text-white flex items-center justify-center shadow-[0_0_30px_rgba(255,85,0,0.6)] hover:scale-110 active:scale-95 transition-all"
                >
                  <Play className="w-8 h-8 fill-current ml-1" />
                </button>
              )}

              {/* Bottom Video Controls Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-4 space-y-2 opacity-95 transition-opacity">
                {/* Timeline Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-300 shrink-0">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1.5 bg-slate-700/80 accent-[#ff5500] rounded-lg cursor-pointer appearance-none"
                  />
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">{formatTime(duration)}</span>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePlayPause}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <button
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.muted = !isMuted;
                          setIsMuted(!isMuted);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* Speed Selector */}
                    <div className="flex items-center bg-slate-900/90 border border-slate-700 rounded-lg p-0.5">
                      {[1.0, 1.25, 1.5, 2.0].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSpeedChange(s)}
                          className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded ${playbackSpeed === s ? 'bg-[#ff5500] text-white' : 'text-slate-400 hover:text-white'
                            }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Prev / Next controls */}
                  <div className="flex items-center gap-2">
                    {hasPrevLesson && (
                      <button
                        onClick={handlePrevLesson}
                        className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors"
                      >
                        Previous
                      </button>
                    )}
                    {hasNextLesson && (
                      <button
                        onClick={handleNextLesson}
                        className="px-3 py-1 rounded-lg bg-[#ff5500] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#ff6600] transition-colors"
                      >
                        <span>Next Lesson</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Details Info */}
            <div className="p-4 sm:p-6 space-y-4 bg-[#0e141b] border-t border-slate-800/80">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Chapter Lesson • {currentLesson.durationLabel}
                    </span>
                    {isLessonCompleted(currentLesson.id) && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#00e5a3] bg-[#00e5a3]/10 px-2 py-0.5 rounded-full border border-[#00e5a3]/30">
                        <Check className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                  <h1 className="text-base sm:text-xl font-black text-white">{currentLesson.title}</h1>
                </div>

                {/* Mark Completed Toggle Button */}
                <button
                  onClick={(e) => handleToggleComplete(currentLesson.id, e)}
                  className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${isLessonCompleted(currentLesson.id)
                    ? 'bg-[#00e5a3]/15 text-[#00e5a3] border border-[#00e5a3]/40 hover:bg-[#00e5a3]/25'
                    : 'bg-[#ff5500] text-white hover:bg-[#ff6600] shadow-[0_0_15px_rgba(255,85,0,0.3)]'
                    }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isLessonCompleted(currentLesson.id) ? 'Completed' : 'Mark as Done'}</span>
                </button>
              </div>

              {currentLesson.description && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/70">
                  {currentLesson.description}
                </p>
              )}

              {/* Instructor Bio Card */}
              <div className="flex items-center justify-between p-3 bg-slate-900/80 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={course.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                    alt={course.instructorName}
                    className="w-10 h-10 rounded-full object-cover border border-[#ff5500]/40"
                  />
                  <div>
                    <p className="text-xs font-black text-white">{course.instructorName}</p>
                    <p className="text-[11px] text-slate-400">{course.instructorTitle || 'Performance Coach'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#00e5a3] uppercase tracking-wider">100% Free Masterclass</span>
                  <p className="text-[10px] text-slate-400 font-mono">No subscription needed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Chapter Syllabus & Playlist (4 Cols) */}
          <div className="lg:col-span-4 bg-[#070b0f] border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col overflow-hidden">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
              <div className="flex items-center gap-2">
                <ListVideo className="w-4 h-4 text-[#ff5500]" />
                <span className="text-xs font-black uppercase tracking-wider text-white">Course Curriculum</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {allLessons.length} Videos
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2.5">
              {course.chapters?.map((chapter, chIdx) => {
                const isExpanded = expandedChapters[chapter.id] !== false;
                const chapterCompletedCount = (chapter.lessons || []).filter((l) => isLessonCompleted(l.id)).length;
                const isChapterDone = chapterCompletedCount === chapter.lessons.length && chapter.lessons.length > 0;

                return (
                  <div key={chapter.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden">
                    {/* Chapter Header Toggle */}
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#ff5500]">
                          <span>Chapter {chIdx + 1}</span>
                          {isChapterDone && <Check className="w-3 h-3 text-[#00e5a3]" />}
                        </div>
                        <h4 className="text-xs font-bold text-slate-200 truncate">{chapter.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono text-slate-400">
                          {chapterCompletedCount}/{chapter.lessons?.length || 0}
                        </span>
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      </div>
                    </button>

                    {/* Chapter Lessons List */}
                    {isExpanded && (
                      <div className="border-t border-slate-800/60 divide-y divide-slate-800/40">
                        {chapter.lessons?.map((lesson) => {
                          const isActive = lesson.id === currentLesson.id;
                          const isDone = isLessonCompleted(lesson.id);

                          return (
                            <div
                              key={lesson.id}
                              onClick={() => handleSelectLesson(lesson)}
                              className={`p-2.5 sm:p-3 flex items-center gap-3 cursor-pointer transition-all ${isActive
                                ? 'bg-[#ff5500]/15 border-l-4 border-[#ff5500] text-white'
                                : 'hover:bg-slate-800/40 text-slate-300'
                                }`}
                            >
                              {/* Completed Status Checkbox */}
                              <button
                                onClick={(e) => handleToggleComplete(lesson.id, e)}
                                className="shrink-0 p-1 rounded-full text-slate-400 hover:text-[#00e5a3] transition-colors"
                                title={isDone ? 'Completed' : 'Mark complete'}
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-[#00e5a3]" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                                )}
                              </button>

                              {/* Lesson Info */}
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-bold leading-snug truncate ${isActive ? 'text-white font-extrabold' : 'text-slate-300'}`}>
                                  {lesson.title}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" />
                                    {lesson.durationLabel}
                                  </span>
                                </div>
                              </div>

                              {isActive && (
                                <div className="shrink-0 text-[#ff5500] animate-pulse">
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Progress Summary */}
            <div className="p-3 border-t border-slate-800 bg-[#0c1015] text-center">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="font-bold uppercase text-[10px] tracking-wider">Overall Progress</span>
                <span className="font-mono text-[#00e5a3] font-black">{progress?.overallProgressPct || 0}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#ff5500] to-[#00e5a3] h-full transition-all duration-300"
                  style={{ width: `${progress?.overallProgressPct || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
