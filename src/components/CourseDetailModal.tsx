import React from 'react';
import {
  X,
  Play,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  User,
  Star,
  CheckCircle2,
  ChevronDown,
  Layers,
  ArrowRight,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { Course, UserCourseProgress } from '../types';

interface CourseDetailModalProps {
  isOpen: boolean;
  course: Course | null;
  progress?: UserCourseProgress | null;
  onClose: () => void;
  onEnroll: (courseId: string) => void;
  onStartLearning: (course: Course, lessonId?: string) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  isOpen,
  course,
  progress,
  onClose,
  onEnroll,
  onStartLearning,
}) => {
  if (!isOpen || !course) return null;

  const isEnrolled = !!progress;
  const isCompleted = progress?.overallProgressPct === 100;

  // Calculate total lessons
  let totalLessons = 0;
  let totalMinutes = 0;
  course.chapters?.forEach((ch) => {
    (ch.lessons || []).forEach((les) => {
      totalLessons += 1;
      totalMinutes += les.durationMinutes || 0;
    });
  });

  const handleAction = () => {
    if (isEnrolled) {
      onStartLearning(course, progress?.lastWatchedLessonId);
    } else {
      onEnroll(course.id);
      onStartLearning(course);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0e141b] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Course Banner Image Header */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-900 overflow-hidden shrink-0">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e141b] via-[#0e141b]/60 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-sm text-slate-300 hover:text-white hover:bg-black/90 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner Tag Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#ff5500] text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
              {course.category}
            </span>
            {course.badge && (
              <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-[#ff5500]/40 text-[#ff5500] text-[10px] font-black uppercase tracking-wider">
                {course.badge}
              </span>
            )}
          </div>

          {/* Bottom Banner Title */}
          <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1 font-mono text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {course.rating || 4.9}
              </span>
              <span>•</span>
              <span className="font-mono">{totalLessons} Lessons</span>
              <span>•</span>
              <span className="font-mono">{totalMinutes || course.totalDurationMinutes} Mins</span>
              <span>•</span>
              <span className="text-[#00e5a3] font-bold uppercase tracking-wider">100% Free</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">{course.title}</h1>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Action Bar (Enroll / Resume) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-[#121922] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={course.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                alt={course.instructorName}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#ff5500]"
              />
              <div>
                <p className="text-xs font-black text-white">{course.instructorName}</p>
                <p className="text-[11px] text-slate-400">{course.instructorTitle || 'High Performance Coach'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleAction}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#ff5500] hover:bg-[#ff6600] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,85,0,0.4)] active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isEnrolled ? (isCompleted ? 'Replay Course' : 'Resume Masterclass') : 'Start Learning (Free)'}</span>
              </button>
            </div>
          </div>

          {/* Course Overview */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">About This Masterclass</h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {course.longDescription || course.description}
            </p>
          </div>

          {/* Curriculum / Chapters Accordion */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Curriculum ({course.chapters?.length || 0} Chapters • {totalLessons} Lessons)
              </h3>
              <span className="text-[11px] font-mono text-[#00e5a3] font-bold">All Videos Unlocked</span>
            </div>

            <div className="space-y-3">
              {course.chapters?.map((chapter, chIdx) => (
                <div
                  key={chapter.id}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden"
                >
                  <div className="p-4 flex items-center justify-between bg-slate-900/90 border-b border-slate-800/60">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#ff5500]">
                        Chapter {chIdx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white">{chapter.title}</h4>
                      {chapter.description && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{chapter.description}</p>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-400 shrink-0">
                      {chapter.lessons?.length || 0} Videos
                    </span>
                  </div>

                  <div className="divide-y divide-slate-800/40">
                    {chapter.lessons?.map((lesson, lIdx) => {
                      const isCompleted = progress?.completedLessonIds?.includes(lesson.id);

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            if (!isEnrolled) onEnroll(course.id);
                            onStartLearning(course, lesson.id);
                          }}
                          className="p-3.5 flex items-center justify-between hover:bg-slate-800/40 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-2">
                            <div className="w-6 h-6 rounded-full bg-[#ff5500]/10 text-[#ff5500] flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                              {lIdx + 1}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-200 truncate">{lesson.title}</p>
                              {lesson.description && (
                                <p className="text-[11px] text-slate-400 truncate">{lesson.description}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {lesson.durationLabel}
                            </span>
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4 text-[#00e5a3]" />
                            ) : (
                              <Play className="w-3.5 h-3.5 text-[#ff5500] fill-current" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
