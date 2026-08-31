import React, { useEffect, useState } from 'react';
import { Brain, MessageSquareText, Send, Sparkles, Radio, Video, CheckCircle2, Upload, FileVideo, ShieldCheck } from 'lucide-react';
import { apiService } from '../utils/apiService';
import { socketService } from '../utils/socketService';
import { UploadTapeModal } from './UploadTapeModal';
import { TapeAnalysis } from '../types';

export const VideoReviewView: React.FC<{ role: string; athleteId: string }> = ({ role, athleteId }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [coachText, setCoachText] = useState('');
  const [live, setLive] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadingReview, setUploadingReview] = useState(false);
  const load = async () => { const r = await apiService.getVideoReviews(athleteId); setReviews(r.reviews || []); };
  useEffect(() => {
    load();
    const a = socketService.subscribe('video:analysis:ready', (r:any) => { if (r.userId === athleteId) setReviews(prev => [r, ...prev.filter(x => x.id !== r.id)]); });
    const b = socketService.subscribe('video:coach:reviewed', (r:any) => { if (r.userId === athleteId) setReviews(prev => [r, ...prev.filter(x => x.id !== r.id)]); });
    const c = socketService.subscribe('connection:status', (d:any) => setLive(!!d.isConnected));
    setLive(socketService.isConnected);
    return () => { a(); b(); c(); };
  }, [athleteId]);
  const handleUploadSuccess = async (_tape: TapeAnalysis) => {
    setUploadingReview(true);
    await load();
    setUploadingReview(false);
    setShowUpload(false);
  };
  const submitCoach = async (id:string) => {
    if (!coachText.trim()) return;
    const result = await apiService.addCoachVideoReview(id, { coachId: athleteId, coachName: 'Live Coach', text: coachText });
    if (result.success) { setReviews(prev => [result.review, ...prev.filter(x => x.id !== id)]); setCoachText(''); }
  };
  return <div className="max-w-5xl mx-auto p-4 sm:p-6 pb-28 space-y-5">
    <div className="rounded-3xl border border-slate-800 bg-[#111821] p-5 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#ff5500] text-xs font-black uppercase tracking-wider"><Video className="w-4 h-4"/> AI + COACH VIDEO LAB</div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-2">Performance Review Center</h1>
          <p className="text-sm text-slate-400 mt-1">Upload your match or training video, get AI improvement tips, then receive coach feedback.</p>
        </div>
        <div className={`self-start px-3 py-2 rounded-full text-[10px] font-black ${live?'text-emerald-400 bg-emerald-500/10':'text-amber-400 bg-amber-500/10'}`}><Radio className="inline w-3 h-3 mr-1"/>{live?'LIVE':'OFFLINE'}</div>
      </div>
    </div>

    <button
      onClick={() => setShowUpload(true)}
      className="w-full rounded-3xl border-2 border-dashed border-slate-700 hover:border-[#ff5500] bg-[#0b1016] hover:bg-[#ff5500]/5 p-8 sm:p-10 text-center transition-all group"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#ff5500]/10 border border-[#ff5500]/30 flex items-center justify-center mx-auto mb-4 text-[#ff5500] group-hover:scale-105 transition-transform">
        <Upload className="w-8 h-8" />
      </div>
      <div className="text-lg font-black text-white">Upload Training / Match Video</div>
      <div className="text-xs text-slate-400 mt-1">MP4, MOV, WebM • Upload from your device</div>
      <div className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-[#ff5500] text-white font-black text-sm shadow-lg shadow-orange-900/20">
        <FileVideo className="w-4 h-4"/> Choose Video File
      </div>
      <div className="text-[11px] text-slate-500 mt-3">AI will identify visible technique issues, improvement areas and practice drills.</div>
    </button>

    <div className="flex items-center justify-between">
      <div><h2 className="text-xl font-black text-white">Reviews & Feedback</h2><p className="text-xs text-slate-500">AI analysis and coach feedback for your uploaded videos.</p></div>
      {uploadingReview && <div className="text-xs text-[#ff8a55] font-bold">Refreshing review…</div>}
    </div>

    {reviews.length === 0 && <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400 text-sm">No video reviews yet. Upload a video above to get AI analysis and coach feedback.</div>}

    {reviews.map((r:any) => <div key={r.id} className="rounded-3xl border border-slate-800 bg-[#111821] p-4 sm:p-5 space-y-4 shadow-lg">
      <div className="flex items-start justify-between gap-3"><div><h2 className="font-black text-white flex items-center gap-2"><FileVideo className="w-4 h-4 text-[#ff5500]"/>{r.title}</h2><span className="text-[10px] text-slate-500">{new Date(r.createdAt).toLocaleString()}</span></div><span className="px-3 py-1 rounded-lg bg-[#ff5500]/10 text-[#ff8a55] text-xs font-black">{r.aiReview?.score ?? '--'}/100</span></div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-cyan-500/10">
          <div className="flex items-center gap-2 text-cyan-300 font-black text-xs mb-3"><Brain className="w-4 h-4"/> AI PERFORMANCE ANALYSIS</div>
          <p className="text-sm text-slate-200 leading-6">{r.aiReview?.summary || 'AI analysis is being prepared.'}</p>
          <div className="mt-3 text-xs text-slate-300"><b>Primary focus:</b> {r.aiReview?.focus || 'Technique and consistency'}</div>
          {r.aiReview?.mistakes?.length > 0 && <div className="mt-4"><div className="text-[11px] font-black text-red-300 uppercase mb-2">Mistakes detected</div><ul className="space-y-1 text-xs text-slate-300">{r.aiReview.mistakes.map((x:string,i:number)=><li key={i}>• {x}</li>)}</ul></div>}
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-emerald-500/10">
          <div className="flex items-center gap-2 text-emerald-300 font-black text-xs mb-3"><Sparkles className="w-4 h-4"/> IMPROVEMENT PLAN</div>
          <ul className="space-y-2 text-xs text-slate-300">{(r.aiReview?.improvements||[]).map((x:string,i:number)=><li key={i}>✓ {x}</li>)}</ul>
          {r.aiReview?.drills?.length>0 && <div className="mt-4"><div className="text-[11px] font-black text-white mb-2">Recommended drills</div><div className="flex flex-wrap gap-2">{r.aiReview.drills.map((d:string,i:number)=><span key={i} className="text-[10px] px-2 py-1 rounded-lg bg-slate-800 text-slate-300">{d}</span>)}</div></div>}
        </div>
      </div>
      <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5">
        <div className="flex items-center gap-2 text-blue-300 text-xs font-black mb-3"><MessageSquareText className="w-4 h-4"/> COACH REVIEW {r.coachReview && <CheckCircle2 className="w-3 h-3 text-emerald-400"/>}</div>
        {r.coachReview ? <div><p className="text-sm text-slate-200 leading-6">{r.coachReview.text}</p><span className="block text-[10px] text-slate-500 mt-2">— {r.coachReview.coachName}</span></div> : (role==='coach'||role==='admin') ? <div className="flex gap-2"><input value={coachText} onChange={e=>setCoachText(e.target.value)} placeholder="Write coach feedback: mistake + improvement tip..." className="flex-1 rounded-xl bg-slate-900 border border-slate-700 px-3 py-3 text-xs text-white outline-none"/><button onClick={()=>submitCoach(r.id)} className="rounded-xl bg-blue-600 px-4 text-white"><Send className="w-4 h-4"/></button></div> : <div className="flex items-center gap-2 text-xs text-slate-400"><ShieldCheck className="w-4 h-4 text-emerald-400"/>Waiting for coach feedback. You will receive it instantly when posted.</div>}
      </div>
    </div>)}

    <UploadTapeModal isOpen={showUpload} onClose={() => setShowUpload(false)} onUploadSuccess={handleUploadSuccess} />
  </div>;
};
