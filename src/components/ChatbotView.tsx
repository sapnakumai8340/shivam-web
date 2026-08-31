import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  Radio,
  Activity,
  Calendar,
  Dumbbell,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Trash2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Flame,
  Heart,
  Zap,
  RotateCcw,
  Languages
} from 'lucide-react';
import { socketService } from '../utils/socketService';
import { apiService } from '../utils/apiService';
import { ChatMessage, AthleteProfile, FixtureSchedule, BiomechanicalScan } from '../types';
import { LiveTelemetrySnapshot } from '../utils/realtimeStore';

export type CoachMode = 'tactics' | 'biomechanics' | 'conditioning' | 'nutrition';

interface ChatbotViewProps {
  athlete?: AthleteProfile;
  telemetry?: LiveTelemetrySnapshot;
  fixtures?: FixtureSchedule[];
  scans?: BiomechanicalScan[];
  onTriggerAction?: (actionType: 'schedule' | 'profile' | 'scan' | 'performance' | 'management') => void;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({
  athlete,
  telemetry,
  fixtures = [],
  scans = [],
  onTriggerAction,
}) => {
  const [activeMode, setActiveMode] = useState<CoachMode>('tactics');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('apex_chat_history_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { }

    const athleteName = athlete?.name || 'Rahul Kumar';
    const symmetry = athlete?.stats?.symmetry || 96;
    const nextOpp = fixtures[0]?.opponent || 'Titan United FC';

    return [
      {
        id: 'welcome-apex',
        sender: 'apex',
        text: `**Sports AI Director (Powered by Google Gemini 2.5 Flash)** ⚡\n\nWelcome **${athleteName}**. Connected directly to your live sensor stream, 3D kinematic database, and tactical match matrix.\n\n• **Bilateral Force Symmetry**: **${symmetry}%** (49%L / 51%R)\n• **Next Match**: **${nextOpp}** (${fixtures[0]?.dateTime || 'Friday 19:30 IST'})\n• **Live Telemetry**: **${telemetry?.heartRate || 152} BPM** • **${telemetry?.intensityZone || 'Threshold (Z4)'}**\n• **Workload Status**: **0.82 ACWR** • Injury Risk: **LOW**\n\nSelect a coaching mode above or ask about tactical setups, 3D joint kinematic scans, sprint drills, or recovery fueling. Hindi & Hinglish fully supported!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: [
          { label: '⚡ Live Telemetry', actionType: 'performance' },
          { label: '🔬 View 3D Scan', actionType: 'scan' },
          { label: '📅 Match Schedule', actionType: 'schedule' },
        ],
      },
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingStatus, setTypingStatus] = useState<string>(' AI is analyzing live telemetry & match tactics...');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [autoVoice, setAutoVoice] = useState(false);
  const [isSocketLive, setIsSocketLive] = useState(socketService.isConnected);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Save to local storage on update
  useEffect(() => {
    try {
      localStorage.setItem('apex_chat_history_v3', JSON.stringify(messages.slice(-30)));
    } catch (e) { }
  }, [messages]);

  // Socket.IO message and real-time typing subscription
  useEffect(() => {
    socketService.connect();
    setIsSocketLive(socketService.isConnected);

    const unsubMsg = socketService.subscribe('chat:message', (msg: ChatMessage) => {
      setMessages((prev) => {
        // Prevent duplicate user messages or exact matching IDs
        if (
          prev.some(
            (m) =>
              m.id === msg.id ||
              (m.sender === 'user' && msg.sender === 'user' && m.text.trim() === msg.text.trim())
          )
        ) {
          return prev;
        }
        return [...prev, msg];
      });

      if (msg.sender === 'apex') {
        setIsLoading(false);
        if (autoVoice) {
          speakText(msg.text, msg.id);
        }
      }
    });

    const unsubTyping = socketService.subscribe('chat:typing', (data: { isTyping: boolean; sender?: string; mode?: string }) => {
      setIsLoading(data.isTyping);
      if (data.isTyping) {
        if (data.mode === 'biomechanics') {
          setTypingStatus('Analyzing 3D joint kinetics & 49%L/51%R force symmetry...');
        } else if (data.mode === 'conditioning') {
          setTypingStatus('Computing ACWR workload & high-velocity sprint splits...');
        } else if (data.mode === 'nutrition') {
          setTypingStatus('Calculating electrolyte balance & recovery fueling...');
        } else {
          setTypingStatus('Synthesizing match tactics & live telemetry...');
        }
      }
    });

    const unsubStatus = socketService.subscribe('connection:status', (data: { isConnected: boolean }) => {
      setIsSocketLive(data.isConnected);
    });

    return () => {
      unsubMsg();
      unsubTyping();
      unsubStatus();
    };
  }, [autoVoice]);

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Works great for Indian English, Hindi & Hinglish

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Toggle Speech Recognition
  const toggleVoiceInput = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Could not start recognition:', err);
      }
    }
  };

  // Text-To-Speech (TTS)
  const speakText = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();

    // Clean markdown symbols for cleaner TTS
    const cleanText = text
      .replace(/\*\*/g, '')
      .replace(/[#•*_]/g, '')
      .replace(/\[.*?\]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    // Pick best English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Male'))
    );
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      setSpeakingMsgId(null);
    };

    utterance.onerror = () => {
      setSpeakingMsgId(null);
    };

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (confirm('Clear entire AI sports intelligence chat history?')) {
      window.speechSynthesis?.cancel();
      setSpeakingMsgId(null);
      const resetMsg: ChatMessage = {
        id: `welcome-${Date.now()}`,
        sender: 'apex',
        text: `**Conversation Reset.** AI is ready for new match tactics, telemetry scans, or training queries.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([resetMsg]);
      localStorage.removeItem('apex_chat_history_v3');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    if (!textToSend) setInputText('');
    setIsLoading(true);

    const userMsgId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => {
      if (prev.some((m) => m.id === userMsg.id)) return prev;
      return [...prev, userMsg];
    });

    const historyPayload = messages.slice(-6).map((m) => ({
      sender: m.sender,
      text: m.text,
    }));

    if (socketService.isConnected) {
      socketService.sendChatMessage(query.trim(), 'user', {
        id: userMsgId,
        userId: athlete?.id || 'APX-9942',
        mode: activeMode,
        history: historyPayload,
      });
    } else {
      // Direct REST fallback
      try {
        const res = await apiService.sendChatMessage({
          message: query.trim(),
          userId: athlete?.id || 'APX-9942',
          mode: activeMode,
          history: historyPayload,
        });

        if (res.success && res.message) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === res.message.id)) return prev;
            return [...prev, res.message];
          });
          if (autoVoice) {
            speakText(res.message.text, res.message.id);
          }
        }
      } catch (err) {
        console.error('Error sending message via REST:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Render markdown text with high-contrast formatting
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');

    return (
      <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          // Bullet item
          if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
            const textAfter = trimmed.substring(1).trim();
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
                <span className="text-[#ff5500] font-bold mt-0.5">•</span>
                <div className="flex-1">{parseInlineFormatting(textAfter)}</div>
              </div>
            );
          }

          // Numbered list item
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1 my-1">
                <span className="text-[#00e5a3] font-mono font-bold text-[11px] mt-0.5 bg-emerald-950/60 border border-emerald-500/30 px-1 rounded">
                  {numMatch[1]}
                </span>
                <div className="flex-1">{parseInlineFormatting(numMatch[2])}</div>
              </div>
            );
          }

          // Header
          if (trimmed.startsWith('#')) {
            const headerText = trimmed.replace(/^#+\s*/, '');
            return (
              <div
                key={idx}
                className="font-bold text-white tracking-wide text-xs sm:text-sm uppercase text-[#ff5500] pt-1"
              >
                {parseInlineFormatting(headerText)}
              </div>
            );
          }

          return <div key={idx}>{parseInlineFormatting(trimmed)}</div>;
        })}
      </div>
    );
  };

  // Parse bold **text** and `code` tags
  const parseInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-white tracking-tight">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1 py-0.5 bg-black/40 border border-slate-700 text-[#00e5a3] rounded font-mono text-[11px]"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const coachModes: { id: CoachMode; label: string; icon: any; color: string; desc: string }[] = [
    {
      id: 'tactics',
      label: 'Tactics & Matchday',
      icon: Calendar,
      color: 'text-[#00e5a3] border-[#00e5a3]/40 bg-[#00e5a3]/10',
      desc: 'Formation, Titan United scouting, Pressing structures',
    },
    {
      id: 'biomechanics',
      label: '3D Biomechanics',
      icon: Activity,
      color: 'text-[#ff5500] border-[#ff5500]/40 bg-[#ff5500]/10',
      desc: 'Kinematic angles, Valgus torque, 96% force balance',
    },
    {
      id: 'conditioning',
      label: 'Speed & Drills',
      icon: Dumbbell,
      color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
      desc: 'Sprint splits, ACWR workload, Finishing drills',
    },
    {
      id: 'nutrition',
      label: 'Nutrition & Fuel',
      icon: Flame,
      color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      desc: 'Pre-match carbs, Electrolytes, Whey protein recovery',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b0f] pb-36 pt-2 px-3 sm:px-4 max-w-2xl mx-auto flex flex-col justify-between">
      {/* 1. Top Intelligent Coach Header */}
      <div className="bg-[#0f1620] border border-slate-800/80 rounded-2xl p-3 sm:p-4 mb-3 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff5500]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#151f2c] border border-[#ff5500]/60 flex items-center justify-center text-[#ff5500] shadow-[0_0_15px_rgba(255,85,0,0.25)] relative shrink-0">
              <Bot className="w-5 h-5" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00e5a3] rounded-full border-2 border-[#070b0f] shadow-[0_0_8px_#00e5a3]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-black text-white tracking-wide">
                  AI Sports Director
                </h2>
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/40 text-purple-300 text-[9px] font-mono font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                    <Sparkles className="w-2.5 h-2.5 text-purple-300 animate-pulse" />
                    <span>GEMINI 2.5 FLASH</span>
                  </div>
                  <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[9px] font-mono font-bold transition-all ${isSocketLive
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}>
                    <Radio className={`w-2.5 h-2.5 ${isSocketLive ? 'animate-pulse text-emerald-400' : 'text-amber-400'}`} />
                    <span>{isSocketLive ? 'LIVE' : 'POLLING'}</span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                <span>Google GenAI Model</span>
                <span className="text-slate-600">•</span>
                <span>Real-Time Biometrics & Tactical Matrix</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setAutoVoice(!autoVoice)}
              title={autoVoice ? 'Disable Auto-Voice' : 'Enable Auto-Voice'}
              className={`p-1.5 rounded-lg border transition-all ${autoVoice
                ? 'bg-[#ff5500]/20 border-[#ff5500] text-[#ff5500]'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
            >
              {autoVoice ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleClearHistory}
              title="Clear History"
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Real-time Telemetry HUD Strip */}
        <div className="grid grid-cols-4 gap-1.5 bg-[#0b1016] border border-slate-800/60 rounded-xl p-2 text-center">
          <div className="border-r border-slate-800/60 pr-1">
            <div className="text-[9px] font-mono uppercase text-slate-400 flex items-center justify-center gap-0.5">
              <Heart className="w-2.5 h-2.5 text-rose-500" />
              <span>Heart Rate</span>
            </div>
            <div className="text-xs font-black text-white mt-0.5">
              {telemetry?.heartRate || 152} <span className="text-[9px] font-normal text-slate-400">BPM</span>
            </div>
          </div>

          <div className="border-r border-slate-800/60 pr-1">
            <div className="text-[9px] font-mono uppercase text-slate-400 flex items-center justify-center gap-0.5">
              <Activity className="w-2.5 h-2.5 text-[#00e5a3]" />
              <span>Symmetry</span>
            </div>
            <div className="text-xs font-black text-[#00e5a3] mt-0.5">
              {athlete?.stats?.symmetry || 96}% <span className="text-[8px] font-normal text-slate-400">49L/51R</span>
            </div>
          </div>

          <div className="border-r border-slate-800/60 pr-1">
            <div className="text-[9px] font-mono uppercase text-slate-400 flex items-center justify-center gap-0.5">
              <Zap className="w-2.5 h-2.5 text-cyan-400" />
              <span>Workload</span>
            </div>
            <div className="text-xs font-black text-cyan-400 mt-0.5">
              {telemetry?.acwrLive || 1.14} <span className="text-[8px] font-normal text-slate-400">ACWR</span>
            </div>
          </div>

          <div>
            <div className="text-[9px] font-mono uppercase text-slate-400 flex items-center justify-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5 text-[#ff5500]" />
              <span>Rating</span>
            </div>
            <div className="text-xs font-black text-[#ff5500] mt-0.5">
              {athlete?.overallRating || 95.4}
            </div>
          </div>
        </div>

        {/* Specialty Coach Mode Tabs */}
        <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {coachModes.map((mode) => {
            const Icon = mode.icon;
            const isSelected = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`shrink-0 px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-all ${isSelected
                  ? `${mode.color} shadow-sm`
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
              >
                <Icon className="w-3 h-3" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Messages Stream */}
      <div className="flex-1 space-y-3 overflow-y-auto mb-2 px-1 min-h-[320px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
          >
            {/* AI Avatar */}
            {msg.sender === 'apex' && (
              <div className="w-7 h-7 rounded-lg bg-[#151f2c] border border-[#ff5500]/60 flex items-center justify-center text-[#ff5500] shrink-0 mt-1 shadow-sm">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            {/* Message Card */}
            <div
              className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-3.5 shadow-lg border relative group ${msg.sender === 'user'
                ? 'bg-[#ff5500] border-[#ff661a] text-white rounded-tr-none'
                : 'bg-[#0f1620] border-slate-800 text-slate-200 rounded-tl-none'
                }`}
            >
              {/* Message Header / Tools */}
              {msg.sender === 'apex' && (
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-1.5 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase text-[#ff5500] tracking-wider">
                      Sports AI
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {msg.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => speakText(msg.text, msg.id)}
                      title="Listen to Coach"
                      className={`p-1 rounded text-slate-400 hover:text-[#ff5500] transition-colors ${speakingMsgId === msg.id ? 'text-[#ff5500] animate-pulse' : ''
                        }`}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleCopy(msg.text, msg.id)}
                      title="Copy response"
                      className="p-1 rounded text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Message Text Body */}
              {renderFormattedContent(msg.text)}

              {/* Embedded Action Buttons */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                  {msg.actions.map((act, aIdx) => (
                    <button
                      key={aIdx}
                      onClick={() => onTriggerAction && onTriggerAction(act.actionType as any)}
                      className="px-2.5 py-1 rounded-lg bg-[#182330] hover:bg-[#ff5500] border border-slate-700 hover:border-[#ff5500] text-slate-200 hover:text-white text-[11px] font-bold transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>{act.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}

              {msg.sender === 'user' && (
                <span className="text-[9px] mt-1.5 block text-white/80 text-right font-mono">
                  {msg.timestamp}
                </span>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-slate-300 text-xs py-2.5 px-3 bg-[#0f1620]/90 rounded-2xl border border-slate-800/80 shadow-md w-fit animate-in fade-in">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#ff5500] animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-[#ff5500] animate-bounce [animation-delay:0.15s]" />
              <div className="w-2 h-2 rounded-full bg-[#00e5a3] animate-bounce [animation-delay:0.3s]" />
            </div>
            <span className="text-[11px] font-mono text-slate-300">
              {typingStatus}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Contextual Quick Action Chips */}
      <div className="py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none mb-2">
        <button
          onClick={() => handleSendMessage('What is my current force symmetry and injury risk?')}
          className="shrink-0 px-2.5 py-1 rounded-full bg-[#0f1620] border border-slate-800 hover:border-[#ff5500] text-slate-300 hover:text-white text-[11px] font-medium transition-all flex items-center gap-1"
        >
          <Activity className="w-3 h-3 text-[#ff5500]" />
          <span>Biometrics & Symmetry</span>
        </button>
        <button
          onClick={() => handleSendMessage('Break down upcoming match tactics for Titan United FC')}
          className="shrink-0 px-2.5 py-1 rounded-full bg-[#0f1620] border border-slate-800 hover:border-[#00e5a3] text-slate-300 hover:text-white text-[11px] font-medium transition-all flex items-center gap-1"
        >
          <Calendar className="w-3 h-3 text-[#00e5a3]" />
          <span>Titan United Tactics</span>
        </button>
        <button
          onClick={() => handleSendMessage('Suggest high-intensity box finishing & sprint drills')}
          className="shrink-0 px-2.5 py-1 rounded-full bg-[#0f1620] border border-slate-800 hover:border-cyan-400 text-slate-300 hover:text-white text-[11px] font-medium transition-all flex items-center gap-1"
        >
          <Dumbbell className="w-3 h-3 text-cyan-400" />
          <span>Sprint & Finishing Drills</span>
        </button>
        <button
          onClick={() => handleSendMessage('Mera overall performance aur agla match kaisa hai? (Hindi)')}
          className="shrink-0 px-2.5 py-1 rounded-full bg-[#0f1620] border border-slate-800 hover:border-amber-400 text-slate-300 hover:text-white text-[11px] font-medium transition-all flex items-center gap-1"
        >
          <Languages className="w-3 h-3 text-amber-400" />
          <span>हिंदी में बताओ</span>
        </button>
      </div>

      {/* 4. Chat Input & Voice Recognition Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-[#0f1620] border border-slate-800 rounded-2xl p-1.5 shadow-xl relative"
      >
        {isListening && (
          <div className="absolute -top-7 left-3 flex items-center gap-1.5 bg-rose-950/80 border border-rose-500/50 text-rose-300 text-[10px] font-mono px-2 py-0.5 rounded-full shadow-lg animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <span>Listening to voice in Hindi / English...</span>
          </div>
        )}

        <button
          type="button"
          onClick={toggleVoiceInput}
          title={isListening ? 'Stop Voice Input' : 'Speak to AI Coach'}
          className={`p-2.5 rounded-xl transition-all shrink-0 ${isListening
            ? 'bg-rose-600 text-white animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.6)]'
            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-[#ff5500]'
            }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Sports AI (English / Hinglish)..."
          className="flex-1 bg-transparent px-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 bg-[#ff5500] hover:bg-[#ff661a] disabled:opacity-40 disabled:hover:bg-[#ff5500] text-white rounded-xl transition-all shadow-md active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
