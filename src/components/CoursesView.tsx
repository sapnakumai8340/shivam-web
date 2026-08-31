import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Play,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Flame,
  Award,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Layers,
  ChevronRight,
  ShieldCheck,
  Star,
  GraduationCap,
  ListVideo,
  User,
} from 'lucide-react';
import { Course, UserCourseProgress, UserRole, AthleteProfile } from '../types';
import { apiService } from '../utils/apiService';
import { CourseDetailModal } from './CourseDetailModal';
import { CoursePlayerModal } from './CoursePlayerModal';
import { CourseEditorModal } from './CourseEditorModal';

interface CoursesViewProps {
  role: UserRole;
  athlete: AthleteProfile;
  onOpenLogin: () => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({ role, athlete, onOpenLogin }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, UserCourseProgress>>({});
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [adminViewMode, setAdminViewMode] = useState<'browse' | 'manage'>('browse');

  // Modals state
  const [selectedCourseForDetail, setSelectedCourseForDetail] = useState<Course | null>(null);
  const [activeCourseForPlayer, setActiveCourseForPlayer] = useState<Course | null>(null);
  const [playerInitialLessonId, setPlayerInitialLessonId] = useState<string | undefined>(undefined);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const isAdminOrCoach = role === 'admin' || role === 'coach' || athlete.position === 'STAFF';

  // Load courses & user progress
  const loadData = async () => {
    setLoading(true);
    try {
      const [coursesRes, progRes] = await Promise.all([
        apiService.getCourses(isAdminOrCoach),
        apiService.getUserCoursesProgress(athlete.id),
      ]);
      if (coursesRes.courses) {
        setCourses(coursesRes.courses);
      }
      if (progRes.progress) {
        setProgressMap(progRes.progress);
      }
    } catch (err) {
      console.error('Failed to load courses data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [athlete.id, role]);

  // Categories list
  const categories = [
    'ALL',
    'Football',
    'Cricket',
    'Basketball',
    'Biomechanics & Rehab',
    'Strength & Conditioning',
    'Tennis',
    'Athletics',
  ];

  // Filtered courses
  const filteredCourses = courses.filter((course) => {
    // Hide unpublished from normal athletes
    if (!isAdminOrCoach && !course.isPublished) return false;

    // Category filter
    if (selectedCategory !== 'ALL' && course.category !== selectedCategory) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(q);
      const matchDesc = course.description.toLowerCase().includes(q);
      const matchInstructor = course.instructorName.toLowerCase().includes(q);
      const matchCategory = course.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchInstructor && !matchCategory) return false;
    }

    return true;
  });

  // Enrolled in-progress courses for "Continue Watching"
  const inProgressCourses = courses
    .map((c) => ({
      course: c,
      progress: progressMap[c.id],
    }))
    .filter((item) => item.progress && item.progress.overallProgressPct < 100)
    .sort((a, b) => (b.progress?.lastWatchedTimestamp || 0) - (a.progress?.lastWatchedTimestamp || 0));

  // Handler: Enroll in course
  const handleEnroll = async (courseId: string) => {
    try {
      const res = await apiService.enrollCourse(courseId, athlete.id);
      if (res.progress) {
        setProgressMap((prev) => ({ ...prev, [courseId]: res.progress }));
      }
    } catch (err) {
      console.error('Failed to enroll:', err);
    }
  };

  // Handler: Update progress from player
  const handleUpdateProgress = async (
    courseId: string,
    lessonId: string,
    positionSec: number,
    completed: boolean
  ) => {
    try {
      const res = await apiService.updateCourseProgress(
        courseId,
        lessonId,
        positionSec,
        completed,
        athlete.id
      );
      if (res.progress) {
        setProgressMap((prev) => ({ ...prev, [courseId]: res.progress }));
      }
    } catch (err) {
      console.error('Failed to update course progress:', err);
    }
  };

  // Handler: Save course (Create or Edit)
  const handleSaveCourse = async (courseData: Partial<Course>) => {
    const res = await apiService.saveCourse(courseData);
    if (res.success && res.course) {
      setCourses((prev) => {
        const exists = prev.some((c) => c.id === res.course.id);
        if (exists) {
          return prev.map((c) => (c.id === res.course.id ? res.course : c));
        }
        return [res.course, ...prev];
      });
    }
  };

  // Handler: Delete course
  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this masterclass?')) {
      const res = await apiService.deleteCourse(courseId);
      if (res.success) {
        setCourses((prev) => prev.filter((c) => c.id !== courseId));
      }
    }
  };

  // Handler: Toggle publish status
  const handleTogglePublish = async (course: Course) => {
    const updated = { ...course, isPublished: !course.isPublished };
    await handleSaveCourse(updated);
  };

  return (
    <div className="min-h-screen bg-[#070b0f] text-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 pb-24">
      {/* Top Banner Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#121922] via-[#0c1015] to-[#070b0f] border border-slate-800/90 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff5500]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff5500]/15 border border-[#ff5500]/30 text-[#ff5500] text-[10px] font-black uppercase tracking-widest">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>SPORTS ACADEMY • 100% FREE LEARNING</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase italic tracking-wide">
              Elite Video Masterclasses & Biomechanics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Step-by-step video lessons taught by elite coaches and biomechanists. Master positional movement,
              explosive finishing, delivery strides, and injury prevention with optical breakdown drills.
            </p>
          </div>

          {/* Admin Create Action */}
          {isAdminOrCoach && (
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  setCourseToEdit(null);
                  setIsEditorOpen(true);
                }}
                className="px-5 py-3 rounded-2xl bg-[#ff5500] hover:bg-[#ff6600] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(255,85,0,0.4)] active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create New Masterclass</span>
              </button>

              <button
                onClick={() => setAdminViewMode(adminViewMode === 'browse' ? 'manage' : 'browse')}
                className={`px-4 py-3 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all ${adminViewMode === 'manage'
                    ? 'bg-slate-800 text-white border-slate-600'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white'
                  }`}
              >
                {adminViewMode === 'manage' ? 'Student Browse View' : 'Admin Desk View'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================== */}
      {/* CONTINUE WATCHING SECTION (If user has courses in progress) */}
      {/* ========================================================== */}
      {inProgressCourses.length > 0 && adminViewMode === 'browse' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#ff5500]" />
              <h2 className="text-sm font-black uppercase tracking-wider text-white">Continue Watching</h2>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {inProgressCourses.length} In-Progress
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgressCourses.map(({ course, progress }) => {
              // Find last watched lesson
              let lastLessonTitle = 'Next Lesson';
              course.chapters?.forEach((ch) => {
                const found = ch.lessons?.find((l) => l.id === progress?.lastWatchedLessonId);
                if (found) lastLessonTitle = found.title;
              });

              return (
                <div
                  key={course.id}
                  onClick={() => {
                    setActiveCourseForPlayer(course);
                    setPlayerInitialLessonId(progress?.lastWatchedLessonId);
                  }}
                  className="group relative bg-[#0e141b] border border-slate-800 hover:border-[#ff5500]/60 rounded-2xl p-4 flex gap-4 cursor-pointer transition-all hover:shadow-[0_0_20px_rgba(255,85,0,0.15)]"
                >
                  <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#ff5500] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#ff5500]">
                        {course.category}
                      </span>
                      <h3 className="text-xs font-bold text-white truncate group-hover:text-[#ff5500] transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">Resume: {lastLessonTitle}</p>
                    </div>

                    <div className="space-y-1 mt-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{progress?.overallProgressPct || 0}% Completed</span>
                        <span>{progress?.completedLessonIds?.length || 0} done</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#ff5500] to-[#00e5a3] h-full"
                          style={{ width: `${progress?.overallProgressPct || 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* ADMIN DESK VIEW (Manage all courses, publish, edit, delete) */}
      {/* ========================================================== */}
      {isAdminOrCoach && adminViewMode === 'manage' && (
        <div className="space-y-4 bg-[#0e141b] border border-slate-800 rounded-3xl p-5 sm:p-7">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#ff5500]" />
              <h2 className="text-base font-black uppercase tracking-wider text-white">
                Admin Masterclasses Manager ({courses.length})
              </h2>
            </div>
            <button
              onClick={() => {
                setCourseToEdit(null);
                setIsEditorOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-[#ff5500] text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Course</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-black tracking-wider">
                <tr>
                  <th className="py-3 px-3">Course / Masterclass</th>
                  <th className="py-3 px-3">Sport Category</th>
                  <th className="py-3 px-3">Curriculum</th>
                  <th className="py-3 px-3">Instructor</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-12 h-8 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate max-w-xs">{course.title}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{course.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {course.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-300">
                      {course.chapters?.length || 0} Ch • {course.totalLessonsCount || 0} Videos
                    </td>
                    <td className="py-3.5 px-3 text-slate-300 font-semibold">{course.instructorName}</td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        className={`inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border transition-all ${course.isPublished
                            ? 'bg-[#00e5a3]/15 text-[#00e5a3] border-[#00e5a3]/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                      >
                        {course.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{course.isPublished ? 'Live' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setCourseToEdit(course);
                            setIsEditorOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                          title="Edit Masterclass"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete Masterclass"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* BROWSE & SEARCH COURSES SECTION */}
      {/* ========================================================== */}
      {adminViewMode === 'browse' && (
        <div className="space-y-5">
          {/* Search & Category Filter Chips */}
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search masterclasses, topics, coaches..."
                className="w-full bg-[#0e141b] border border-slate-800 focus:border-[#ff5500] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>

            {/* Category Chips Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shrink-0 transition-all ${selectedCategory === cat
                      ? 'bg-[#ff5500] text-white shadow-[0_0_12px_rgba(255,85,0,0.4)]'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Card Grid */}
          {filteredCourses.length === 0 ? (
            <div className="text-center py-16 bg-[#0e141b] border border-slate-800 rounded-3xl space-y-3">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-black uppercase text-white">No Masterclasses Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No courses match your selected filter or search query. Try selecting &quot;ALL&quot; or clearing your search.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredCourses.map((course) => {
                const progress = progressMap[course.id];
                const isEnrolled = !!progress;
                const isCompleted = progress?.overallProgressPct === 100;

                return (
                  <div
                    key={course.id}
                    className="group bg-[#0e141b] border border-slate-800 hover:border-[#ff5500]/60 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-[0_10px_30px_rgba(255,85,0,0.15)] hover:-translate-y-1"
                  >
                    {/* Thumbnail + Overlay Badges */}
                    <div
                      onClick={() => setSelectedCourseForDetail(course)}
                      className="relative aspect-video w-full bg-slate-900 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-[#ff5500] text-white text-[9px] font-black uppercase tracking-wider shadow">
                          {course.category}
                        </span>
                        {course.badge && (
                          <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[#ff5500] text-[9px] font-black uppercase border border-[#ff5500]/30">
                            {course.badge}
                          </span>
                        )}
                      </div>

                      {/* Bottom Info Bar */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#ff5500]" />
                          {course.totalDurationMinutes}m
                        </span>
                        <span className="flex items-center gap-1 font-bold text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {course.rating || 4.9}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-black tracking-wider">
                          <span>{course.level}</span>
                          <span className="text-[#00e5a3]">100% Free</span>
                        </div>

                        <h3
                          onClick={() => setSelectedCourseForDetail(course)}
                          className="text-sm font-black text-white leading-snug line-clamp-2 cursor-pointer group-hover:text-[#ff5500] transition-colors"
                        >
                          {course.title}
                        </h3>

                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      {/* Instructor Info */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={course.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'}
                            alt={course.instructorName}
                            className="w-6 h-6 rounded-full object-cover border border-slate-700"
                          />
                          <span className="text-[11px] font-bold text-slate-300 truncate">
                            {course.instructorName}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {course.chapters?.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0) || course.totalLessonsCount} vids
                        </span>
                      </div>

                      {/* Enrolled Progress Bar */}
                      {isEnrolled && (
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span>Progress</span>
                            <span className="text-[#00e5a3] font-bold">{progress?.overallProgressPct || 0}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#ff5500] to-[#00e5a3] h-full"
                              style={{ width: `${progress?.overallProgressPct || 0}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          if (isEnrolled) {
                            setActiveCourseForPlayer(course);
                            setPlayerInitialLessonId(progress?.lastWatchedLessonId);
                          } else {
                            handleEnroll(course.id);
                            setActiveCourseForPlayer(course);
                          }
                        }}
                        className={`w-full py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all mt-2 active:scale-98 ${isEnrolled
                            ? isCompleted
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                              : 'bg-[#ff5500] hover:bg-[#ff6600] text-white shadow-[0_0_15px_rgba(255,85,0,0.3)]'
                            : 'bg-slate-900 hover:bg-[#ff5500] text-slate-200 hover:text-white border border-slate-800 hover:border-transparent'
                          }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>{isEnrolled ? (isCompleted ? 'Replay' : 'Resume') : 'Start Masterclass'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================== */}
      {/* MODALS */}
      {/* ========================================================== */}

      {/* 1. Course Details Modal */}
      <CourseDetailModal
        isOpen={!!selectedCourseForDetail}
        course={selectedCourseForDetail}
        progress={selectedCourseForDetail ? progressMap[selectedCourseForDetail.id] : null}
        onClose={() => setSelectedCourseForDetail(null)}
        onEnroll={handleEnroll}
        onStartLearning={(course, lessonId) => {
          setSelectedCourseForDetail(null);
          setActiveCourseForPlayer(course);
          setPlayerInitialLessonId(lessonId);
        }}
      />

      {/* 2. Course Classroom & Video Player Modal */}
      <CoursePlayerModal
        isOpen={!!activeCourseForPlayer}
        course={activeCourseForPlayer}
        initialLessonId={playerInitialLessonId}
        initialPositionSec={
          activeCourseForPlayer ? progressMap[activeCourseForPlayer.id]?.lastWatchedPositionSec || 0 : 0
        }
        progress={activeCourseForPlayer ? progressMap[activeCourseForPlayer.id] : null}
        onClose={() => setActiveCourseForPlayer(null)}
        onUpdateProgress={handleUpdateProgress}
      />

      {/* 3. Course Editor Modal (Admin & Coach) */}
      <CourseEditorModal
        isOpen={isEditorOpen}
        initialCourse={courseToEdit}
        onClose={() => {
          setIsEditorOpen(false);
          setCourseToEdit(null);
        }}
        onSave={handleSaveCourse}
      />
    </div>
  );
};
