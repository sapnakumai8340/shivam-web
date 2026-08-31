import React, { useState, useRef, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Sparkles, CheckCircle2, FastForward, Gauge, Heart, Activity } from 'lucide-react';
import { HighlightVideo, TapeAnalysis } from '../types';

interface VideoPlayerModalProps {
  item: HighlightVideo | TapeAnalysis | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ item, isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(15);
  const [isMuted, setIsMuted] = useState(false);
  const [showTacticalHUD, setShowTacticalHUD] = useState(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = playbackRate;
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [isOpen, item]);

  if (!isOpen || !item) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (!isNaN(videoRef.current.duration) && videoRef.current.duration > 0) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      const nextTime = Math.min(Math.max(0, videoRef.current.currentTime + seconds), duration);
      videoRef.current.currentTime = nextTime;
      setCurrentTime(nextTime);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Dynamic telemetry calculated from video playback position
  const progressRatio = duration > 0 ? (currentTime / duration) : 0;
  const currentSpeed = (24 + Math.sin(progressRatio * Math.PI) * 10.8).toFixed(1);
  const currentHeartRate = Math.round(145 + progressRatio * 38);
  const currentTorque = Math.round(120 + Math.sin(progressRatio * Math.PI * 2) * 65);
  const currentSymmetry = (94 + Math.sin(progressRatio * 4) * 2).toFixed(0);

  const videoSource = item.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#151c24] border border-slate-800 rounded-3xl p-4 sm:p-6 max-h-[95vh] overflow-y-auto shadow-2xl my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Title Header */}
        <div className="mb-3 pr-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#ff5500] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
              {item.category}
            </span>
            {item.isRealUpload && (
              <span className="bg-[#00e5a3]/20 border border-[#00e5a3]/40 text-[#00e5a3] text-[9px] font-black px-2 py-0.5 rounded uppercase">
                REAL VIDEO STREAM
              </span>
            )}
            <span className="text-[11px] text-slate-400 font-mono">Duration: {item.duration}</span>
          </div>
          <h2 className="text-base sm:text-xl font-black text-white uppercase tracking-tight leading-snug">
            {item.title}
          </h2>
        </div>

        {/* Real Video Player Viewport */}
        <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-slate-800 mb-3 flex items-center justify-center group shadow-inner">
          <video
            ref={videoRef}
            src={videoSource}
            playsInline
            muted={isMuted}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-full object-contain bg-black"
          />

          {/* Tactical Bounding Box & Vector Overlays */}
          {showTacticalHUD && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Dynamic Tracking Reticle */}
              <div
                className="absolute w-24 sm:w-32 h-28 sm:h-36 border-2 border-[#ff5500] rounded-xl shadow-[0_0_20px_rgba(255,85,0,0.6)] transition-all duration-300"
                style={{
                  top: `${28 + Math.sin(progressRatio * Math.PI) * 10}%`,
                  left: `${20 + progressRatio * 50}%`,
                }}
              >
                <div className="absolute -top-6 left-0 bg-[#ff5500] text-white text-[9px] sm:text-[10px] font-mono font-black px-1.5 py-0.5 rounded whitespace-nowrap shadow">
                  #9 • {currentSpeed} KM/H
                </div>
                <div className="absolute -bottom-5 left-0 bg-black/80 border border-slate-700 text-[#00e5a3] text-[8px] font-mono px-1 rounded">
                  SYM: {currentSymmetry}%
                </div>
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#00e5a3] rounded-full animate-ping" />
              </div>

              {/* HUD Telemetry Watermark Top-Left */}
              <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm border border-slate-800/80 rounded-xl px-2.5 py-1.5 text-[10px] font-mono text-slate-300 space-y-0.5">
                <div className="text-[#ff5500] font-black text-[9px] tracking-wider">OPTICAL TRACKER</div>
                <div className="flex gap-2">
                  <span>VEL: <strong className="text-white">{currentSpeed} km/h</strong></span>
                  <span>LOAD: <strong className="text-white">{currentTorque} Nm</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* Controls Bar Overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-6 flex flex-col justify-end transition-opacity">
            {/* Timeline Range Slider */}
            <div className="relative mb-2">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#ff5500]"
              />
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded-lg bg-[#ff5500] hover:bg-[#ff6611] text-white transition-transform active:scale-90"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>

                <button
                  onClick={() => handleSkip(-5)}
                  className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Rewind 5s"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleSkip(5)}
                  className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Forward 5s"
                >
                  <FastForward className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                <span className="font-mono text-[11px] text-slate-300">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Playback speed buttons */}
                <div className="flex items-center bg-black/60 rounded-lg p-0.5 border border-slate-800">
                  {[0.5, 1.0, 1.5, 2.0].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleSpeedChange(rate)}
                      className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${playbackRate === rate
                          ? 'bg-[#ff5500] text-white'
                          : 'text-slate-400 hover:text-white'
                        }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setShowTacticalHUD(!showTacticalHUD)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${showTacticalHUD
                      ? 'border-[#00e5a3]/50 bg-[#00e5a3]/20 text-[#00e5a3]'
                      : 'border-slate-700 text-slate-400 hover:text-white'
                    }`}
                >
                  {showTacticalHUD ? 'HUD ON' : 'HUD OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Synchronized Telemetry Gauges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <div className="p-2.5 rounded-xl bg-[#0c1015] border border-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff5500]/10 border border-[#ff5500]/30 flex items-center justify-center text-[#ff5500]">
              <Gauge className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-extrabold">Instant Velocity</div>
              <div className="text-sm font-black text-white font-mono">{currentSpeed} <span className="text-[10px] text-slate-400 font-normal">km/h</span></div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0c1015] border border-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-extrabold">Cardiac Stress</div>
              <div className="text-sm font-black text-white font-mono">{currentHeartRate} <span className="text-[10px] text-slate-400 font-normal">bpm</span></div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0c1015] border border-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-extrabold">Patellar Torque</div>
              <div className="text-sm font-black text-white font-mono">{currentTorque} <span className="text-[10px] text-slate-400 font-normal">Nm</span></div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0c1015] border border-slate-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00e5a3]/10 border border-[#00e5a3]/30 flex items-center justify-center text-[#00e5a3]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase font-extrabold">Symmetry Quotient</div>
              <div className="text-sm font-black text-white font-mono">{currentSymmetry}% <span className="text-[10px] text-[#00e5a3]">Optimal</span></div>
            </div>
          </div>
        </div>

        {/* AI Tactical Breakdown Insights */}
        <div className="bg-[#0c1015] border border-slate-800 rounded-2xl p-3.5 sm:p-4 mb-3">
          <h3 className="text-xs font-black uppercase text-white mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#ff5500]" />
            <span>AI Automated Video Telemetry</span>
          </h3>
          <ul className="text-xs text-slate-300 space-y-1.5">
            {(item as TapeAnalysis).keyInsights && (item as TapeAnalysis).keyInsights!.length > 0 ? (
              (item as TapeAnalysis).keyInsights!.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00e5a3] shrink-0 mt-0.5" />
                  <span>{insight}</span>
                </li>
              ))
            ) : (
              <>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00e5a3] shrink-0 mt-0.5" />
                  <span>Explosive acceleration reached top speed within 1.8 seconds of ball turnover.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00e5a3] shrink-0 mt-0.5" />
                  <span>Deceleration angle reduced shear stress on right knee by 24%.</span>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Dismiss button */}
        <button
          onClick={onClose}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors"
        >
          Close Video
        </button>
      </div>
    </div>
  );
};

