import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Video,
  BookOpen,
  Sparkles,
  Layers,
  Save,
  Check,
  Eye,
  EyeOff,
  Clock,
  User,
  Image,
} from 'lucide-react';
import { Course, CourseChapter, CourseLesson } from '../types';

interface CourseEditorModalProps {
  isOpen: boolean;
  initialCourse?: Course | null;
  onClose: () => void;
  onSave: (courseData: Partial<Course>) => Promise<void>;
}

export const CourseEditorModal: React.FC<CourseEditorModalProps> = ({
  isOpen,
  initialCourse,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(initialCourse?.title || '');
  const [description, setDescription] = useState(initialCourse?.description || '');
  const [longDescription, setLongDescription] = useState(initialCourse?.longDescription || '');
  const [category, setCategory] = useState<Course['category']>(initialCourse?.category || 'Football');
  const [level, setLevel] = useState<Course['level']>(initialCourse?.level || 'ALL LEVELS');
  const [thumbnail, setThumbnail] = useState(
    initialCourse?.thumbnail || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80'
  );
  const [instructorName, setInstructorName] = useState(initialCourse?.instructorName || 'Coach Sarah Vance');
  const [instructorTitle, setInstructorTitle] = useState(
    initialCourse?.instructorTitle || 'Head Performance Coach'
  );
  const [instructorAvatar, setInstructorAvatar] = useState(
    initialCourse?.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80'
  );
  const [isPublished, setIsPublished] = useState(
    initialCourse?.isPublished !== undefined ? initialCourse.isPublished : true
  );
  const [badge, setBadge] = useState(initialCourse?.badge || 'NEW');

  const [chapters, setChapters] = useState<CourseChapter[]>(
    initialCourse?.chapters || [
      {
        id: `ch-${Date.now()}-1`,
        title: 'Chapter 1: Foundational Mechanics',
        description: 'Core kinetic drills and positioning.',
        order: 1,
        lessons: [
          {
            id: `les-${Date.now()}-1`,
            title: '1. Introduction & Video Analysis',
            description: 'Overview of tactical movement objectives.',
            durationMinutes: 10,
            durationLabel: '10:00',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
            order: 1,
          },
        ],
      },
    ]
  );

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'curriculum'>('info');

  if (!isOpen) return null;

  // Chapter handlers
  const handleAddChapter = () => {
    const newCh: CourseChapter = {
      id: `ch-${Date.now()}`,
      title: `Chapter ${chapters.length + 1}: New Chapter`,
      description: 'Module objectives and drills.',
      order: chapters.length + 1,
      lessons: [
        {
          id: `les-${Date.now()}-1`,
          title: '1. Lesson 1',
          description: '',
          durationMinutes: 10,
          durationLabel: '10:00',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          order: 1,
        },
      ],
    };
    setChapters([...chapters, newCh]);
  };

  const handleUpdateChapter = (chIdx: number, updates: Partial<CourseChapter>) => {
    const updated = [...chapters];
    updated[chIdx] = { ...updated[chIdx], ...updates };
    setChapters(updated);
  };

  const handleDeleteChapter = (chIdx: number) => {
    if (chapters.length <= 1) return;
    setChapters(chapters.filter((_, idx) => idx !== chIdx));
  };

  // Lesson handlers
  const handleAddLesson = (chIdx: number) => {
    const updated = [...chapters];
    const ch = updated[chIdx];
    const newLesson: CourseLesson = {
      id: `les-${Date.now()}`,
      title: `${ch.lessons.length + 1}. New Video Lesson`,
      description: '',
      durationMinutes: 10,
      durationLabel: '10:00',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      order: ch.lessons.length + 1,
    };
    ch.lessons = [...ch.lessons, newLesson];
    setChapters(updated);
  };

  const handleUpdateLesson = (chIdx: number, lesIdx: number, updates: Partial<CourseLesson>) => {
    const updated = [...chapters];
    const ch = updated[chIdx];
    ch.lessons[lesIdx] = { ...ch.lessons[lesIdx], ...updates };
    setChapters(updated);
  };

  const handleDeleteLesson = (chIdx: number, lesIdx: number) => {
    const updated = [...chapters];
    const ch = updated[chIdx];
    if (ch.lessons.length <= 1) return;
    ch.lessons = ch.lessons.filter((_, idx) => idx !== lesIdx);
    setChapters(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    try {
      await onSave({
        id: initialCourse?.id,
        title: title.trim(),
        description: description.trim(),
        longDescription: longDescription.trim() || description.trim(),
        category,
        level,
        thumbnail: thumbnail.trim(),
        instructorName: instructorName.trim(),
        instructorTitle: instructorTitle.trim(),
        instructorAvatar: instructorAvatar.trim(),
        isPublished,
        badge: badge.trim(),
        chapters,
      });
      onClose();
    } catch (err) {
      console.error('Failed to save course:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0e141b] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-slate-800 bg-[#070b0f]/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#ff5500]/15 border border-[#ff5500]/30 flex items-center justify-center text-[#ff5500]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                {initialCourse ? 'Edit Sports Masterclass' : 'Create New Sports Masterclass'}
              </h2>
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                100% Free Learning Portal • Admin Course Desk
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher: Info vs Curriculum */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-5 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'info'
                ? 'border-[#ff5500] text-[#ff5500]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Course Details & Info</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('curriculum')}
            className={`py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'curriculum'
                ? 'border-[#ff5500] text-[#ff5500]'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. Chapters & Video Lessons ({chapters.length})</span>
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Course Title */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-1">
                  Masterclass Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Elite Striker Movement & Finishing Masterclass"
                  className="w-full bg-[#070b0f] border border-slate-800 focus:border-[#ff5500] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              {/* Category & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-1">
                    Sport Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#070b0f] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Football">Football</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Athletics">Athletics</option>
                    <option value="Strength & Conditioning">Strength & Conditioning</option>
                    <option value="Biomechanics & Rehab">Biomechanics & Rehab</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="w-full bg-[#070b0f] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="ALL LEVELS">ALL LEVELS</option>
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-1">
                  Short Summary
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="A high-impact 1-2 sentence overview of what athletes will learn."
                  className="w-full bg-[#070b0f] border border-slate-800 focus:border-[#ff5500] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
                />
              </div>

              {/* Long Overview Description */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-1">
                  Detailed Course Overview
                </label>
                <textarea
                  rows={3}
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Detailed breakdown of syllabus, drills, optical metrics, and key focus points."
                  className="w-full bg-[#070b0f] border border-slate-800 focus:border-[#ff5500] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-300 mb-1">
                  Cover / Thumbnail Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-[#070b0f] border border-slate-800 focus:border-[#ff5500] rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  {thumbnail && (
                    <img
                      src={thumbnail}
                      alt="Preview"
                      className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                  )}
                </div>
              </div>

              {/* Instructor Information */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#070b0f] border border-slate-800 rounded-2xl">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Instructor Name
                  </label>
                  <input
                    type="text"
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Instructor Designation
                  </label>
                  <input
                    type="text"
                    value={instructorTitle}
                    onChange={(e) => setInstructorTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. MASTERCLASS, NEW"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Publication Status */}
              <div className="flex items-center justify-between p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-wider">Publish Status</p>
                  <p className="text-[11px] text-slate-400">
                    {isPublished
                      ? 'Live & Visible to all athletes in the Academy.'
                      : 'Draft / Unpublished (only visible to Admins/Coaches).'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPublished(!isPublished)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    isPublished
                      ? 'bg-[#00e5a3]/15 text-[#00e5a3] border border-[#00e5a3]/40'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{isPublished ? 'Published' : 'Draft'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-white">Course Chapters & Video Lessons</h3>
                  <p className="text-[10px] text-slate-400">Add chapters and link streaming videos for your athletes.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddChapter}
                  className="px-3 py-1.5 bg-[#ff5500] text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#ff6600] flex items-center gap-1 shadow-[0_0_12px_rgba(255,85,0,0.3)]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Chapter</span>
                </button>
              </div>

              {chapters.map((chapter, chIdx) => (
                <div key={chapter.id} className="p-4 bg-[#070b0f] border border-slate-800 rounded-2xl space-y-3">
                  {/* Chapter Header */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-[#ff5500] bg-[#ff5500]/10 px-2 py-0.5 rounded">
                        CH {chIdx + 1}
                      </span>
                      <input
                        type="text"
                        value={chapter.title}
                        onChange={(e) => handleUpdateChapter(chIdx, { title: e.target.value })}
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1 text-xs font-bold text-white focus:outline-none"
                        placeholder="Chapter Title"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAddLesson(chIdx)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3 text-[#ff5500]" />
                        <span>Add Video</span>
                      </button>
                      {chapters.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteChapter(chIdx)}
                          className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                          title="Delete Chapter"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Lessons in Chapter */}
                  <div className="space-y-2 pl-4 border-l-2 border-slate-800">
                    {chapter.lessons?.map((lesson, lesIdx) => (
                      <div key={lesson.id} className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 flex items-center gap-2">
                            <Video className="w-3.5 h-3.5 text-[#ff5500] shrink-0" />
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) => handleUpdateLesson(chIdx, lesIdx, { title: e.target.value })}
                              className="flex-1 bg-[#070b0f] border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-semibold text-white focus:outline-none"
                              placeholder="Lesson Title"
                            />
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Duration */}
                            <div className="flex items-center gap-1 bg-[#070b0f] border border-slate-800 rounded-lg px-2 py-1 text-[11px] font-mono text-slate-300">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <input
                                type="text"
                                value={lesson.durationLabel}
                                onChange={(e) =>
                                  handleUpdateLesson(chIdx, lesIdx, {
                                    durationLabel: e.target.value,
                                    durationMinutes: parseInt(e.target.value.split(':')[0]) || 10,
                                  })
                                }
                                className="w-12 bg-transparent text-center focus:outline-none font-mono"
                                placeholder="10:00"
                              />
                            </div>

                            {chapter.lessons.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteLesson(chIdx, lesIdx)}
                                className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Video Stream URL input */}
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="text-slate-400 uppercase font-black shrink-0">Video URL:</span>
                          <input
                            type="url"
                            value={lesson.videoUrl}
                            onChange={(e) => handleUpdateLesson(chIdx, lesIdx, { videoUrl: e.target.value })}
                            className="flex-1 bg-[#070b0f] border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-300 focus:outline-none"
                            placeholder="https://commondatastorage.googleapis.com/... or MP4 link"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-xs font-black uppercase text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#ff5500] hover:bg-[#ff6600] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(255,85,0,0.4)] active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Masterclass...' : 'Save & Publish Course'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
