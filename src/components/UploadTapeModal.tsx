import React, { useState, useRef } from 'react';
import { apiService } from '../utils/apiService';
import { X, Upload, CheckCircle2, Film, Sparkles, Video, Play, RefreshCw, AlertCircle, FileVideo } from 'lucide-react';
import { TapeAnalysis } from '../types';

interface UploadTapeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (tape: TapeAnalysis) => void;
}

const PRESET_DEMO_VIDEOS = [
  {
    name: 'Counter-Attack Sprint (MP4)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80',
    duration: '0:15',
    category: 'MATCH' as const,
  },
  {
    name: 'Agility & Turning Drill',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    duration: '0:15',
    category: 'TRAINING' as const,
  },
  {
    name: 'Tactical High Pressing Camera',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=600&q=80',
    duration: '0:15',
    category: 'TACTICAL CAM' as const,
  },
];

export const UploadTapeModal: React.FC<UploadTapeModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'TACTICAL CAM' | 'TRAINING' | 'MATCH' | 'BIOMECHANICS'>('TACTICAL CAM');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
  const [videoDurationStr, setVideoDurationStr] = useState('0:30');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      setErrorMessage('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }

    setErrorMessage(null);
    setSelectedFile(file);

    // Create real object URL for local playback
    const objectUrl = URL.createObjectURL(file);
    setPreviewVideoUrl(objectUrl);

    // Auto-populate title if empty
    if (!title.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleLoadedMetadata = () => {
    if (videoPreviewRef.current) {
      const dur = videoPreviewRef.current.duration;
      if (!isNaN(dur)) {
        const mins = Math.floor(dur / 60);
        const secs = Math.floor(dur % 60);
        setVideoDurationStr(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_DEMO_VIDEOS[0]) => {
    setSelectedFile(null);
    setPreviewVideoUrl(preset.url);
    setTitle(preset.name);
    setCategory(preset.category === 'MATCH' ? 'MATCH' : preset.category);
    setVideoDurationStr(preset.duration);
    setErrorMessage(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const extractFrames = async (file: File): Promise<string[]> => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => reject(new Error('Unable to read video frames'));
    });
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = Math.max(360, Math.round((video.videoHeight / video.videoWidth) * 640) || 360);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is unavailable');
    const duration = Number.isFinite(video.duration) ? video.duration : 1;
    const points = [0.12, 0.38, 0.64, 0.88];
    const frames: string[] = [];
    for (const point of points) {
      video.currentTime = Math.min(duration - 0.05, Math.max(0, duration * point));
      await new Promise<void>((resolve) => { video.onseeked = () => resolve(); });
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      frames.push(canvas.toDataURL('image/jpeg', 0.72));
    }
    URL.revokeObjectURL(url);
    return frames;
  };

  const handleUploadAndAnalyze = async () => {
    if (!previewVideoUrl && !selectedFile) {
      setErrorMessage('Please select or upload a video file first.');
      return;
    }
    setIsUploading(true);
    setUploadProgress(12);
    try {
      let frames: string[] = [];
      if (selectedFile) {
        setUploadProgress(30);
        frames = await extractFrames(selectedFile);
      }
      setUploadProgress(55);
      const finalTitle = title.trim() || 'Uploaded Match Telemetry Tape';
      const result = await apiService.analyzeVideo({
        userId: localStorage.getItem('apex_current_user_id') || 'APX-9942',
        title: finalTitle,
        frames,
        videoUrl: selectedFile ? undefined : previewVideoUrl || undefined,
      });
      setUploadProgress(100);
      if (!result.success) throw new Error(result.error || 'AI analysis failed');
      const ai = result.review?.aiReview;
      const newTape: TapeAnalysis = {
        id: result.review.id,
        title: finalTitle,
        category,
        duration: videoDurationStr || '1:15',
        dateAdded: 'Just Now',
        thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80',
        videoUrl: previewVideoUrl || undefined,
        fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : 'Remote video',
        playerHighlight: 'AI Performance Review',
        isRealUpload: !!selectedFile,
        keyInsights: ai?.improvements || ai?.strengths || ['AI review completed successfully.'],
        telemetryPoints: [],
      };
      onUploadSuccess(newTape);
      setTimeout(() => { setIsUploading(false); onClose(); }, 250);
    } catch (e: any) {
      setErrorMessage(e?.message || 'Could not analyze this video. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#151c24] border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl my-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ff5500]/10 border border-[#ff5500]/30 text-[#ff5500] text-[10px] font-black uppercase tracking-widest mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>Real-Life Video Ingestion</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            UPLOAD & ANALYZE VIDEO TAPE
          </h2>
          <p className="text-xs text-slate-400">
            Upload real match clips or training footage for instant AI biomechanical tracking
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-3 p-2.5 rounded-xl bg-red-950/70 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Hidden Real File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileSelect(e.target.files[0]);
            }
          }}
        />

        {/* Video Upload Dropzone or Live Video Preview */}
        {!previewVideoUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all mb-4 ${
              isDragging
                ? 'border-[#ff5500] bg-[#ff5500]/10'
                : 'border-slate-700 hover:border-[#ff5500] bg-[#0c1015]'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#ff5500]/10 border border-[#ff5500]/30 flex items-center justify-center mx-auto mb-2 text-[#ff5500]">
              <Upload className="w-6 h-6 stroke-[2.5]" />
            </div>
            <p className="text-sm font-extrabold text-white">
              Choose Real Video File or Drag & Drop
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports MP4, MOV, WebM, MKV • 4K 60FPS Enabled
            </p>
            <div className="mt-3">
              <span className="inline-block px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors">
                Browse Video from Device
              </span>
            </div>
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-black mb-4">
            <video
              ref={videoPreviewRef}
              src={previewVideoUrl}
              controls
              onLoadedMetadata={handleLoadedMetadata}
              className="w-full max-h-48 object-contain bg-black"
            />
            <div className="p-2.5 bg-[#0c1015] border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <FileVideo className="w-4 h-4 text-[#ff5500]" />
                <span className="font-mono text-[11px] truncate max-w-[200px]">
                  {selectedFile ? selectedFile.name : 'Sample Reel Footage'}
                </span>
                <span className="text-[10px] text-slate-400">({videoDurationStr})</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewVideoUrl(null);
                }}
                className="text-[11px] text-[#ff5500] font-bold hover:underline"
              >
                Change Video
              </button>
            </div>
          </div>
        )}

        {/* Quick Demo Video Presets for Instant Testing */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Or pick sample match reel:
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {PRESET_DEMO_VIDEOS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-2 rounded-xl border text-left transition-all ${
                  previewVideoUrl === preset.url
                    ? 'border-[#ff5500] bg-[#ff5500]/10 text-white'
                    : 'border-slate-800 bg-[#0c1015] text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-200 truncate">
                  <Play className="w-2.5 h-2.5 text-[#ff5500] shrink-0" />
                  <span className="truncate">{preset.name.split(' ')[0]}</span>
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5 font-mono">{preset.duration} • {preset.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Video Metadata Form Fields */}
        <div className="space-y-3 mb-4">
          <div>
            <label className="block text-[10px] font-extrabold uppercase text-slate-300 mb-1">
              Session / Tape Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Counter-Press Cutback vs Metro City"
              className="w-full bg-[#0c1015] border border-slate-800 focus:border-[#ff5500] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase text-slate-300 mb-1">
              Category Tag
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['TACTICAL CAM', 'TRAINING', 'MATCH', 'BIOMECHANICS'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-2 rounded-xl text-[10px] font-bold uppercase transition-all truncate text-center ${
                    category === cat
                      ? 'bg-[#ff5500] text-white shadow-[0_2px_10px_rgba(255,85,0,0.3)]'
                      : 'bg-[#0c1015] text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {cat.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress or Submit Button */}
        {isUploading ? (
          <div className="p-3 bg-[#0c1015] border border-slate-800 rounded-xl">
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ff5500] animate-spin" />
                <span>EXTRACTING 60FPS KINEMATIC VECTORS...</span>
              </span>
              <span className="text-[#ff5500] font-mono">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#ff5500] to-[#ff7722] h-full transition-all duration-150"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <button
            onClick={handleUploadAndAnalyze}
            className="w-full bg-gradient-to-r from-[#ff5500] to-[#ff6b2b] hover:from-[#ff4400] hover:to-[#ff5500] text-white font-black py-3.5 rounded-xl uppercase text-xs tracking-wider shadow-[0_4px_20px_rgba(255,85,0,0.45)] flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Film className="w-4 h-4" />
            <span>Process Video & Run Telemetry</span>
          </button>
        )}
      </div>
    </div>
  );
};

