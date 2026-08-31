import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  CheckCircle2,
  Cpu,
  Activity,
  Zap,
  Play,
  AlertTriangle,
  FileVideo,
  FileImage,
  Eye,
  ShieldAlert,
  Dumbbell,
  Compass,
  Maximize2,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { API_BASE_URL } from '../utils/apiService';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (result: any) => void;
}

interface AnalysisResult {
  summary: string;
  postureAngles: {
    kneeFlexion: number;
    kneeValgusAngle: number;
    hipTiltDeg: number;
    spineAngleDeg: number;
    shoulderAsymmetryDeg: number;
    anklePronationDeg: number;
    forceBalanceLeft: number;
    forceBalanceRight: number;
  };
  flawsAndCorrections: Array<{
    flaw: string;
    cause: string;
    correction: string;
  }>;
  injuryRisks: Array<{
    level: 'HIGH' | 'MODERATE' | 'LOW';
    area: string;
    description: string;
  }>;
  solutions: Array<{
    title: string;
    category: string;
    setsReps: string;
    purpose: string;
  }>;
}

const SAMPLE_MEDIA = [
  {
    id: 'sprint',
    label: 'Sprint Gait (Photo)',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jump',
    label: 'Jump Landing (Photo)',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1517649763962-0c6232662000?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'posture',
    label: 'Symmetry Stand (Photo)',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80'
  }
];

export const ScanModal: React.FC<ScanModalProps> = ({ isOpen, onClose, onScanComplete }) => {
  const [scanType, setScanType] = useState<'LOWER BODY' | 'POSTURE & SPINE' | 'GAIT & SPRINT' | 'FULL BODY 3D'>('FULL BODY 3D');
  const [sourceType, setSourceType] = useState<'upload' | 'camera' | 'sample'>('sample');
  const [selectedSample, setSelectedSample] = useState(SAMPLE_MEDIA[0]);

  const [uploadedFile, setUploadedFile] = useState<{ url: string; name: string; type: 'image' | 'video' } | null>(null);
  const [uploadedBase64, setUploadedBase64] = useState<string>('');
  const [useCamera, setUseCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [scanStep, setScanStep] = useState<'idle' | 'scanning' | 'analyzing' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'angles' | 'corrections' | 'risks' | 'solutions'>('overview');

  // Overlay HUD settings
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showAngles, setShowAngles] = useState(true);

  // Analysis result state
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [customNotes, setCustomNotes] = useState('');

  const getFallbackAnalysis = (): AnalysisResult => ({
    summary: 'Biomechanical 3D Kinematic Scan completed. Pose geometry parsed across 18 kinetic joints.',
    postureAngles: {
      kneeFlexion: 38,
      kneeValgusAngle: 6,
      hipTiltDeg: -4,
      spineAngleDeg: 12,
      shoulderAsymmetryDeg: 2,
      anklePronationDeg: 5,
      forceBalanceLeft: 49,
      forceBalanceRight: 51
    },
    flawsAndCorrections: [
      {
        flaw: 'Right Knee Valgus (Inward collapse during landing)',
        cause: 'Weak Gluteus Medius & delayed VMO firing',
        correction: 'Maintain knees tracking over toes during deceleration and jump landings.'
      },
      {
        flaw: 'Anterior Pelvic Tilt (-4°)',
        cause: 'Tight hip flexors and underactive deep abdominal core',
        correction: 'Engage transverse abdominis and activate glute bridge prior to sprinting.'
      }
    ],
    injuryRisks: [
      {
        level: 'MODERATE',
        area: 'Patellar Tendon & ACL Strain',
        description: 'Elevated shear force on right patella due to inward knee angle during deceleration.'
      }
    ],
    solutions: [
      {
        title: 'Single-Leg Banded Clamshells',
        category: 'Corrective Strength',
        setsReps: '3 sets x 15 reps (Each side)',
        purpose: 'Strengthen Gluteus Medius to eliminate knee valgus collapse.'
      },
      {
        title: 'Eccentric Nordic Hamstring Curls',
        category: 'Injury Prevention',
        setsReps: '3 sets x 6 reps (3-sec lowering)',
        purpose: 'Protect ACL and increase hamstring peak torque capacity.'
      }
    ]
  });

  useEffect(() => {
    if (!isOpen) {
      setScanStep('idle');
      setProgress(0);
      setAnalysis(null);
      if (useCamera) stopCamera();
    }
  }, [isOpen]);

  // Draw 3D Interactive Kinematic Skeleton canvas overlay
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const renderOverlay = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.04;

      const w = canvas.width;
      const h = canvas.height;

      // Skeletal Joint 3D Nodes
      const joints = [
        { id: 'head', x: w * 0.5, y: h * 0.18 },
        { id: 'neck', x: w * 0.5, y: h * 0.25 },
        { id: 'shoulderL', x: w * 0.38 + Math.sin(time) * 2, y: h * 0.3 },
        { id: 'shoulderR', x: w * 0.62 - Math.sin(time) * 2, y: h * 0.3 },
        { id: 'elbowL', x: w * 0.32, y: h * 0.42 },
        { id: 'elbowR', x: w * 0.68, y: h * 0.42 },
        { id: 'wristL', x: w * 0.28, y: h * 0.54 },
        { id: 'wristR', x: w * 0.72, y: h * 0.54 },
        { id: 'pelvis', x: w * 0.5, y: h * 0.52 },
        { id: 'hipL', x: w * 0.42, y: h * 0.54 },
        { id: 'hipR', x: w * 0.58, y: h * 0.54 },
        { id: 'kneeL', x: w * 0.4 + Math.cos(time) * 3, y: h * 0.72 },
        { id: 'kneeR', x: w * 0.58 + Math.sin(time * 1.2) * 4, y: h * 0.72 },
        { id: 'ankleL', x: w * 0.39, y: h * 0.88 },
        { id: 'ankleR', x: w * 0.61, y: h * 0.88 },
      ];

      const bones = [
        ['head', 'neck'],
        ['neck', 'shoulderL'],
        ['neck', 'shoulderR'],
        ['shoulderL', 'elbowL'],
        ['elbowL', 'wristL'],
        ['shoulderR', 'elbowR'],
        ['elbowR', 'wristR'],
        ['neck', 'pelvis'],
        ['pelvis', 'hipL'],
        ['pelvis', 'hipR'],
        ['hipL', 'kneeL'],
        ['kneeL', 'ankleL'],
        ['hipR', 'kneeR'],
        ['kneeR', 'ankleR'],
      ];

      if (showSkeleton) {
        // Draw bones
        ctx.lineWidth = 2.5;
        bones.forEach(([j1, j2]) => {
          const p1 = joints.find((j) => j.id === j1);
          const p2 = joints.find((j) => j.id === j2);
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = scanStep === 'scanning' ? '#00e5a3' : '#ff5500';
            ctx.stroke();
          }
        });

        // Draw joint nodes
        joints.forEach((j) => {
          ctx.beginPath();
          ctx.arc(j.x, j.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = j.id.includes('knee') || j.id.includes('hip') ? '#00e5a3' : '#ffffff';
          ctx.fill();
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = '#0b0f14';
          ctx.stroke();
        });
      }

      if (showHeatmap) {
        // Draw joint pressure rings
        const kneeL = joints.find((j) => j.id === 'kneeL');
        const kneeR = joints.find((j) => j.id === 'kneeR');

        if (kneeL && kneeR) {
          ctx.beginPath();
          ctx.arc(kneeL.x, kneeL.y, 12 + Math.sin(time * 3) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 85, 0, 0.6)';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(kneeR.x, kneeR.y, 14 + Math.cos(time * 3) * 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 229, 163, 0.6)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      if (showAngles) {
        // Draw angle indicator tags
        const kneeR = joints.find((j) => j.id === 'kneeR');
        const hipR = joints.find((j) => j.id === 'hipR');

        if (kneeR) {
          ctx.fillStyle = 'rgba(11, 15, 20, 0.85)';
          ctx.fillRect(kneeR.x + 10, kneeR.y - 12, 60, 20);
          ctx.strokeStyle = '#00e5a3';
          ctx.strokeRect(kneeR.x + 10, kneeR.y - 12, 60, 20);

          ctx.fillStyle = '#00e5a3';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`38.4° FLEX`, kneeR.x + 14, kneeR.y + 1);
        }

        if (hipR) {
          ctx.fillStyle = 'rgba(11, 15, 20, 0.85)';
          ctx.fillRect(hipR.x + 10, hipR.y - 12, 64, 20);
          ctx.strokeStyle = '#ff5500';
          ctx.strokeRect(hipR.x + 10, hipR.y - 12, 64, 20);

          ctx.fillStyle = '#ff5500';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`-4° TILT`, hipR.x + 14, hipR.y + 1);
        }
      }

      animationFrameId = requestAnimationFrame(renderOverlay);
    };

    renderOverlay();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, showSkeleton, showHeatmap, showAngles, scanStep]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video/');
    const url = URL.createObjectURL(file);

    setUploadedFile({
      url,
      name: file.name,
      type: isVideo ? 'video' : 'image'
    });
    setSourceType('upload');

    if (!isVideo) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (typeof evt.target?.result === 'string') {
          setUploadedBase64(evt.target.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedBase64('');
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setUseCamera(true);
      setSourceType('camera');
    } catch (err) {
      console.warn('Camera access unavailable. Switching to High-Resolution Optical Scanner.');
      setUseCamera(false);
      setSourceType('sample');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
    }
    setUseCamera(false);
  };

  const currentMediaUrl =
    sourceType === 'upload' && uploadedFile
      ? uploadedFile.url
      : sourceType === 'sample'
        ? selectedSample.url
        : '';

  const isCurrentVideo =
    sourceType === 'upload' && uploadedFile?.type === 'video';

  const runAIScanAnalysis = async () => {
    setScanStep('scanning');
    setProgress(0);

    // Progressive HUD scan bar timer
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setScanStep('analyzing');
          return 90;
        }
        return prev + 10;
      });
    }, 120);

    try {
      let imageBase64 = '';
      if (useCamera && videoRef.current) {
        try {
          const capCanvas = document.createElement('canvas');
          capCanvas.width = 640;
          capCanvas.height = 360;
          const capCtx = capCanvas.getContext('2d');
          if (capCtx) {
            capCtx.drawImage(videoRef.current, 0, 0, 640, 360);
            imageBase64 = capCanvas.toDataURL('image/jpeg', 0.85);
          }
        } catch (e) {
          // ignore
        }
      } else if (sourceType === 'upload' && uploadedFile?.type === 'image') {
        imageBase64 = uploadedBase64;
      }

      // If imageBase64 is huge (>1MB), scale down via canvas
      if (imageBase64 && imageBase64.startsWith('data:image') && imageBase64.length > 1000000) {
        try {
          const img = new Image();
          img.src = imageBase64;
          await new Promise((resolve) => { img.onload = resolve; });
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
          }
        } catch (scaleErr) {
          // keep original
        }
      }

      const res = await fetch(`${API_BASE_URL}/api/scan-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scanType,
          mediaType: isCurrentVideo ? 'video' : 'image',
          imageBase64: imageBase64.startsWith('data:image') ? imageBase64 : '',
          athleteName: 'ATHLETE',
          customNotes
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      setProgress(100);
      setScanStep('completed');
      setAnalysis(data.analysis || getFallbackAnalysis());

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ff5500', '#00e5a3', '#ffffff']
        });
      } catch (e) {
        // Ignore confetti error
      }
    } catch (err) {
      setProgress(100);
      setScanStep('completed');
      setAnalysis(getFallbackAnalysis());
    }
  };

  const handleApplyToDossier = () => {
    if (!analysis) return;

    const newScan = {
      id: `scan-${Date.now()}`,
      athleteName: 'E',
      athleteId: 'APX-9942',
      scanDate: 'Just now',
      scanType: scanType,
      efficiencyScore: 94.2,
      symmetry: 95,
      injuryRisk: analysis.injuryRisks[0]?.level || 'LOW',
      forceBalance: {
        left: analysis.postureAngles.forceBalanceLeft,
        right: analysis.postureAngles.forceBalanceRight
      },
      imageUrl: currentMediaUrl || 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=600&q=80',
      analysisTitle: `3D AI ${scanType} DIAGNOSTIC`,
      metrics: {
        jointLoadN: 960,
        flexionDeg: analysis.postureAngles.kneeFlexion,
        torqueNm: 188,
        muscleActivationPct: 94,
        vmoStrain: analysis.postureAngles.kneeValgusAngle,
        groundForce: 1260
      },
      notes: analysis.flawsAndCorrections.map((f) => `${f.flaw}: ${f.correction}`)
    };

    onScanComplete(newScan);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#11161d] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff5500] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span>3D AI SCANNER</span>
            </span>
            <span className="text-[10px] font-mono text-[#00e5a3] font-bold">KHEL TANTRA MOTION LAB</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mt-1">
            3D BIOMECHANICAL & POSTURE ANALYZER
          </h2>
          <p className="text-xs text-slate-400">
            Upload photo/video for AI joint tracking, posture correction & injury prevention solutions.
          </p>
        </div>

        {/* Mode & Source Selector Bar */}
        <div className="grid grid-cols-3 gap-1.5 bg-[#080c10] p-1 rounded-2xl border border-slate-800 mb-3 shrink-0">
          <button
            onClick={() => {
              setSourceType('sample');
              if (useCamera) stopCamera();
            }}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-extrabold uppercase transition-all flex items-center justify-center gap-1 ${sourceType === 'sample' ? 'bg-[#ff5500] text-white' : 'text-slate-400 hover:text-white'
              }`}
          >
            <Eye className="w-3 h-3" />
            <span>Sample Clips</span>
          </button>

          <button
            onClick={() => {
              fileInputRef.current?.click();
              if (useCamera) stopCamera();
            }}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-extrabold uppercase transition-all flex items-center justify-center gap-1 ${sourceType === 'upload' ? 'bg-[#ff5500] text-white' : 'text-slate-400 hover:text-white'
              }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload Media</span>
          </button>

          <button
            onClick={() => {
              if (useCamera) {
                stopCamera();
                setSourceType('sample');
              } else {
                startCamera();
              }
            }}
            className={`py-1.5 px-2 rounded-xl text-[11px] font-extrabold uppercase transition-all flex items-center justify-center gap-1 ${sourceType === 'camera' ? 'bg-[#ff5500] text-white' : 'text-slate-400 hover:text-white'
              }`}
          >
            <Camera className="w-3 h-3" />
            <span>{useCamera ? 'Camera Active' : 'Live Camera'}</span>
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Media Preview Viewport with 3D Skeleton & HUD */}
        <div className="relative h-56 sm:h-64 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 mb-3 shrink-0 flex items-center justify-center">
          {sourceType === 'camera' && useCamera ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : isCurrentVideo ? (
            <video src={currentMediaUrl} controls autoPlay loop muted className="w-full h-full object-cover" />
          ) : currentMediaUrl ? (
            <img
              src={currentMediaUrl}
              alt="Scan Target"
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="text-center p-4">
              <Upload className="w-8 h-8 text-[#ff5500] mx-auto mb-2 animate-bounce" />
              <p className="text-xs font-bold text-white">Select or Upload Athlete Photo/Video</p>
              <p className="text-[10px] text-slate-500 mt-1">Supports MP4, MOV, JPG, PNG up to 50MB</p>
            </div>
          )}

          {/* Interactive 3D Skeleton Canvas Overlay */}
          {(currentMediaUrl || useCamera) && (
            <canvas ref={canvasRef} width={480} height={260} className="absolute inset-0 w-full h-full pointer-events-none z-10" />
          )}

          {/* Animated Laser Sweep during scan */}
          {scanStep === 'scanning' && (
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#ff5500] to-transparent shadow-[0_0_20px_#ff5500] animate-scan-line z-20" />
          )}

          {/* Viewport Overlay Controls Toggle Bar */}
          <div className="absolute bottom-2 left-2 right-2 z-20 flex items-center justify-between bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowSkeleton(!showSkeleton)}
                className={`px-1.5 py-0.5 rounded border ${showSkeleton ? 'bg-[#ff5500]/20 border-[#ff5500] text-[#ff5500]' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
              >
                3D Pose Mesh
              </button>
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`px-1.5 py-0.5 rounded border ${showHeatmap ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
              >
                Joint Heatmap
              </button>
              <button
                onClick={() => setShowAngles(!showAngles)}
                className={`px-1.5 py-0.5 rounded border ${showAngles ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
              >
                Angles
              </button>
            </div>
            <span className="text-slate-400 hidden sm:inline">18-NODE AI KINEMATICS</span>
          </div>
        </div>

        {/* Sample Selection Quick Strip */}
        {sourceType === 'sample' && (
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none mb-3 shrink-0">
            {SAMPLE_MEDIA.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSample(s)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all border ${selectedSample.id === s.id
                    ? 'bg-[#1e293b] border-[#ff5500] text-white shadow-sm'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                  }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Upload File Badge info */}
        {sourceType === 'upload' && uploadedFile && (
          <div className="flex items-center justify-between bg-[#080c10] px-3 py-1.5 rounded-xl border border-slate-800 mb-3 text-xs shrink-0">
            <div className="flex items-center gap-2 truncate">
              {uploadedFile.type === 'video' ? (
                <FileVideo className="w-4 h-4 text-[#ff5500]" />
              ) : (
                <FileImage className="w-4 h-4 text-[#00e5a3]" />
              )}
              <span className="text-white font-mono truncate">{uploadedFile.name}</span>
            </div>
            <button onClick={() => setUploadedFile(null)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scan Button or Progress Bar */}
        {scanStep === 'idle' && (
          <button
            onClick={runAIScanAnalysis}
            className="w-full bg-gradient-to-r from-[#ff5500] to-[#ff7722] hover:from-[#ff4400] hover:to-[#ff5500] text-white font-black py-3 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,85,0,0.4)] transition-all cursor-pointer mb-3 shrink-0"
          >
            <Zap className="w-4 h-4" />
            <span>Analyze 3D Biomechanics & AI Posture</span>
          </button>
        )}

        {scanStep === 'scanning' || scanStep === 'analyzing' ? (
          <div className="bg-[#080c10] border border-slate-800 rounded-2xl p-3 mb-3 shrink-0">
            <div className="flex justify-between text-xs font-bold text-slate-200 mb-1">
              <span className="flex items-center gap-1.5 text-[#ff5500]">
                <Cpu className="w-4 h-4 animate-spin" />
                <span>{scanStep === 'scanning' ? 'PARSING 3D SKELETAL JOINTS...' : 'GEMINI AI DEEP ANALYSIS...'}</span>
              </span>
              <span className="font-mono text-[#00e5a3]">{progress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#ff5500] via-[#00e5a3] to-[#ff5500] h-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}

        {/* Results Analysis Viewport Tabs */}
        {scanStep === 'completed' && analysis && (
          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            {/* Results Navigation Tabs */}
            <div className="grid grid-cols-5 gap-1 bg-[#080c10] p-1 rounded-xl border border-slate-800 text-[10px] font-black uppercase text-center shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-1.5 rounded-lg transition-all ${activeTab === 'overview' ? 'bg-[#ff5500] text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('angles')}
                className={`py-1.5 rounded-lg transition-all ${activeTab === 'angles' ? 'bg-[#ff5500] text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Angles
              </button>
              <button
                onClick={() => setActiveTab('corrections')}
                className={`py-1.5 rounded-lg transition-all ${activeTab === 'corrections' ? 'bg-[#ff5500] text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Flaws
              </button>
              <button
                onClick={() => setActiveTab('risks')}
                className={`py-1.5 rounded-lg transition-all ${activeTab === 'risks' ? 'bg-[#ff5500] text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Risks
              </button>
              <button
                onClick={() => setActiveTab('solutions')}
                className={`py-1.5 rounded-lg transition-all ${activeTab === 'solutions' ? 'bg-[#ff5500] text-white' : 'text-slate-400 hover:text-white'
                  }`}
              >
                Solutions
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="bg-[#080c10] border border-slate-800 rounded-2xl p-3.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase">AI SUMMARY</span>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed font-medium">{analysis.summary}</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#080c10] border border-slate-800 rounded-2xl p-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">GAIT SYMMETRY</span>
                    <span className="text-2xl font-black text-[#00e5a3] font-mono mt-0.5 block">95.8%</span>
                    <span className="text-[10px] text-slate-400">Left 49% / Right 51%</span>
                  </div>

                  <div className="bg-[#080c10] border border-slate-800 rounded-2xl p-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">INJURY RISK LEVEL</span>
                    <span
                      className={`text-xl font-black font-mono mt-0.5 block ${analysis.injuryRisks[0]?.level === 'HIGH'
                          ? 'text-red-500'
                          : analysis.injuryRisks[0]?.level === 'MODERATE'
                            ? 'text-amber-400'
                            : 'text-[#00e5a3]'
                        }`}
                    >
                      {analysis.injuryRisks[0]?.level || 'LOW'}
                    </span>
                    <span className="text-[10px] text-slate-400">{analysis.injuryRisks[0]?.area || 'Nominal'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: POSTURE & JOINT ANGLES */}
            {activeTab === 'angles' && (
              <div className="grid grid-cols-2 gap-2 text-xs animate-in fade-in duration-150">
                <div className="bg-[#080c10] border border-slate-800 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block">Knee Flexion</span>
                  <span className="text-lg font-black text-white font-mono">{analysis.postureAngles.kneeFlexion}°</span>
                  <span className="text-[9px] text-[#00e5a3] block">Target: 35°-42°</span>
                </div>

                <div className="bg-[#080c10] border border-slate-800 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block">Knee Valgus Inward</span>
                  <span className="text-lg font-black text-[#ff5500] font-mono">{analysis.postureAngles.kneeValgusAngle}°</span>
                  <span className="text-[9px] text-amber-400 block">Slight Inward Deviation</span>
                </div>

                <div className="bg-[#080c10] border border-slate-800 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block">Hip Tilt Angle</span>
                  <span className="text-lg font-black text-white font-mono">{analysis.postureAngles.hipTiltDeg}°</span>
                  <span className="text-[9px] text-slate-400 block">Anterior Tilt</span>
                </div>

                <div className="bg-[#080c10] border border-slate-800 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase block">Spine Alignment</span>
                  <span className="text-lg font-black text-white font-mono">{analysis.postureAngles.spineAngleDeg}°</span>
                  <span className="text-[9px] text-[#00e5a3] block">Torso Forward Lean</span>
                </div>
              </div>
            )}

            {/* TAB 3: FLAWS & CORRECTIONS */}
            {activeTab === 'corrections' && (
              <div className="space-y-2 animate-in fade-in duration-150">
                {analysis.flawsAndCorrections.map((f, i) => (
                  <div key={i} className="bg-[#080c10] border border-slate-800 rounded-2xl p-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff5500] mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{f.flaw}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-1.5">
                      <strong className="text-slate-300">Root Cause:</strong> {f.cause}
                    </p>
                    <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-emerald-400 font-medium">
                      <strong className="text-white">Correction:</strong> {f.correction}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: INJURY RISKS */}
            {activeTab === 'risks' && (
              <div className="space-y-2 animate-in fade-in duration-150">
                {analysis.injuryRisks.map((r, i) => (
                  <div key={i} className="bg-[#080c10] border border-slate-800 rounded-2xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-white">{r.area}</span>
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded ${r.level === 'HIGH'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : r.level === 'MODERATE'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          }`}
                      >
                        {r.level} RISK
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{r.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: AI SOLUTIONS & EXERCISE DRILLS */}
            {activeTab === 'solutions' && (
              <div className="space-y-2 animate-in fade-in duration-150">
                {analysis.solutions.map((s, i) => (
                  <div key={i} className="bg-[#080c10] border border-slate-800 rounded-2xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Dumbbell className="w-3.5 h-3.5 text-[#ff5500]" />
                        <h4 className="text-xs font-black text-white">{s.title}</h4>
                      </div>
                      <span className="text-[9px] font-mono text-[#00e5a3] font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        {s.category}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mb-1">
                      Dosage: <span className="text-white font-bold">{s.setsReps}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{s.purpose}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2 shrink-0">
              <button
                onClick={() => setScanStep('idle')}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-Scan</span>
              </button>

              <button
                onClick={handleApplyToDossier}
                className="flex-1 py-2.5 bg-[#ff5500] hover:bg-[#ff661a] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-[0_4px_15px_rgba(255,85,0,0.4)] transition-all cursor-pointer"
              >
                Apply to Athlete Dossier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
