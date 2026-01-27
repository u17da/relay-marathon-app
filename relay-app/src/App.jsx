import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flag, Clock, Users, ChevronRight, Activity, Award, Undo2, Settings, ArrowLeft, Check, RefreshCw, Anchor, Ship, Waves, Sparkles, PartyPopper, Sun, Zap, Rabbit } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import runnerList from './runner_list.json';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Fixed Constants
const TOTAL_LAPS = 30;
const TARGET_LAP_TIME_SEC = 8 * 60; // 1周8分
const LAP_DISTANCE_KM = 42.195 / 30; // approx 1.4065

// --- ANIMATION STYLES ---
const AnimationStyles = () => (
  <style>{`
    @keyframes bob {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(2deg); }
    }
    @keyframes sail {
      0% { transform: translateX(-100vw); }
      100% { transform: translateX(100vw); }
    }
    @keyframes wave {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes gal-spin {
      0% { transform: rotate(0deg) scale(0.5); }
      50% { transform: rotate(180deg) scale(1.5); }
      100% { transform: rotate(360deg) scale(0.5); }
    }
    @keyframes rainbow-bg {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes text-pop {
      0% { transform: scale(0); opacity: 0; }
      80% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-bob { animation: bob 2s ease-in-out infinite; }
    .animate-sail { animation: sail 3s linear forwards; }
    .animate-wave { animation: wave 10s linear infinite; }
    .animate-gal-spin { animation: gal-spin 1s linear infinite; }
    .animate-rainbow { 
      background: linear-gradient(45deg, #ff00cc, #333399, #00ffff, #ffcc00);
      background-size: 400% 400%;
      animation: rainbow-bg 0.5s ease infinite;
    }
    .animate-text-pop { animation: text-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
  `}</style>
);

// --- COMPONENTS ---

const Card = ({ children, className }) => (
  <div className={cn("bg-manabi-card rounded-xl shadow-sm border border-slate-200 p-5", className)}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', size = 'default', className, disabled }) => {
  const variants = {
    primary: 'bg-manabi-teal text-white hover:bg-manabi-tealHover shadow-sm',
    secondary: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
    accent: 'bg-manabi-orange text-white hover:bg-[#E55A2B] shadow-sm',
    ghost: 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizes = {
    default: 'py-3 px-4 text-base font-bold rounded-lg',
    lg: 'py-4 px-6 text-lg font-bold rounded-xl',
    huge: 'py-6 px-8 text-2xl font-bold rounded-2xl tracking-wide',
    sm: 'py-2 px-3 text-sm font-bold rounded-md',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </button>
  );
};

// --- MODALS ---

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform scale-100">
        <div className="p-6">
          <h3 className="text-xl font-bold text-manabi-navy mb-2">{title}</h3>
          <p className="text-slate-600 font-medium">{message}</p>
        </div>
        <div className="flex border-t border-slate-100">
          <button
            onClick={onCancel}
            className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 active:bg-slate-100 transition-colors"
          >
            キャンセル
          </button>
          <div className="w-px bg-slate-100"></div>
          <button
            onClick={onConfirm}
            className="flex-1 py-4 text-manabi-teal font-bold hover:bg-teal-50 active:bg-teal-100 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

function PasswordDialog({ isOpen, title, onConfirm, onCancel }) {
  const [pass, setPass] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onConfirm(pass);
    setPass('');
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-bold text-manabi-navy mb-4">{title}</h3>
          <input
            type="password"
            autoFocus
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="パスフレーズを入力"
            className="w-full p-3 rounded-lg border-2 border-slate-200 focus:border-manabi-teal focus:outline-none text-lg font-bold"
          />
        </div>
        <div className="flex border-t border-slate-100">
          <button
            onClick={() => { onCancel(); setPass(''); }}
            className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50"
          >
            キャンセル
          </button>
          <div className="w-px bg-slate-100"></div>
          <button
            onClick={handleSubmit}
            className="flex-1 py-4 text-manabi-orange font-bold hover:bg-orange-50"
          >
            実行
          </button>
        </div>
      </div>
    </div>
  );
}

// --- TRANSITIONS ---

function TransitionOverlay({ teamId, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (teamId === 'ota') {
    return (
      <div className="fixed inset-0 z-[200] bg-sky-100 flex flex-col items-center justify-center overflow-hidden">
        <AnimationStyles />
        <div className="absolute inset-0 bg-blue-400/10"></div>
        {/* Sky Elements */}
        <div className="absolute top-20 right-20 text-yellow-400 animate-pulse">
          <Sun size={80} />
        </div>

        {/* Main Ship */}
        <div className="relative z-10 animate-sail w-full max-w-4xl">
          <div className="flex flex-col items-center">
            <div className="text-manabi-navy font-black text-4xl mb-4 bg-white/80 backdrop-blur px-8 py-4 rounded-full shadow-lg whitespace-nowrap">
              太田ヨットスクール、出航！！
            </div>
            <div className="text-manabi-navy drop-shadow-2xl animate-bob">
              <Ship size={200} fill="currentColor" className="text-manabi-navy" />
            </div>
          </div>
        </div>

        {/* Waves */}
        <div className="absolute bottom-0 left-0 w-[200%] h-48 flex items-end animate-wave text-blue-500/30">
          <Waves size={200} className="w-full h-full scale-[2]" />
        </div>
        <div className="absolute bottom-0 left-0 w-[200%] h-32 flex items-end animate-wave text-blue-600/30" style={{ animationDuration: '7s' }}>
          <Waves size={200} className="w-full h-full scale-[2]" />
        </div>
      </div>
    );
  }

  if (teamId === 'surfing') {
    return (
      <div className="fixed inset-0 z-[200] animate-rainbow flex flex-col items-center justify-center overflow-hidden">
        <AnimationStyles />

        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="animate-gal-spin duration-3000">
            <Sun size={600} className="text-white" />
          </div>
        </div>

        <div className="relative z-10 text-center space-y-8">
          <div className="flex justify-center gap-4">
            <div className="animate-bounce delay-0"><Sparkles size={64} className="text-yellow-300" /></div>
            <div className="animate-bounce delay-100"><PartyPopper size={64} className="text-pink-300" /></div>
            <div className="animate-bounce delay-200"><Zap size={64} className="text-cyan-300" /></div>
          </div>

          <div className="animate-text-pop transform transition-all">
            <h1 className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] stroke-black" style={{ WebkitTextStroke: '2px black' }}>
              バイブス<br />ぶち上げ!!!
            </h1>
          </div>

          <div className="text-2xl font-bold text-white bg-black/30 backdrop-blur-md px-6 py-2 rounded-full inline-block animate-pulse">
            徳永ぶちｱｹﾞ♂Surfing☆スクール
          </div>
        </div>

        {/* Floating text */}
        <div className="absolute top-1/4 left-10 text-4xl font-bold text-white -rotate-12 animate-text-pop" style={{ animationDelay: '0.5s' }}>
          ⤴︎AGE⤴︎
        </div>
        <div className="absolute bottom-1/4 right-10 text-4xl font-bold text-white rotate-12 animate-text-pop" style={{ animationDelay: '0.8s' }}>
          最強！！
        </div>
      </div>
    );
  }

  // Default fallback transition
  return (
    <div className="fixed inset-0 z-[200] bg-white flex items-center justify-center">
      <div className="animate-spin text-manabi-teal">
        <RefreshCw size={64} />
      </div>
    </div>
  );
}

// --- SCREENS ---

function LandingScreen({ onSelectTeam }) {
  return (
    <div className="min-h-screen bg-manabi-bg flex flex-col items-center justify-center p-6 space-y-10 animate-in fade-in duration-700">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold text-manabi-navy tracking-tight drop-shadow-sm">
          RelayFun<span className="text-manabi-sky">.</span>
        </h1>
        <p className="text-slate-400 font-bold tracking-wide text-sm">CHOOSE YOUR TEAM</p>
      </div>

      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 px-4">
        {runnerList.map((team) => {
          if (team.id === 'ota') {
            // 太田ヨットスクール (Marine/Yacht Design)
            return (
              <button
                key={team.id}
                onClick={() => onSelectTeam(team.id)}
                className="group relative overflow-hidden bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 block border-4 border-transparent hover:border-manabi-navy/20 w-full text-left"
              >
                {/* Marine Background & Decoration */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,#f0f9ff_20px,#f0f9ff_40px)] opacity-60"></div>
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-sky-100/50 to-transparent"></div>
                <div className="absolute -right-8 -top-8 text-manabi-navy/5 rotate-12 group-hover:rotate-6 transition-transform duration-500">
                  <Ship size={180} />
                </div>

                <div className="relative z-10 p-8 h-full flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-manabi-navy rounded-2xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                      <Anchor size={28} />
                    </div>
                    <span className="px-3 py-1 bg-manabi-sky/10 text-manabi-navy text-xs font-bold rounded-full border border-manabi-sky/20">
                      ENTRY
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-manabi-navy leading-tight mb-2 group-hover:text-manabi-teal transition-colors">
                    {team.teamName}
                  </h2>

                  <div className="flex items-center gap-2 text-slate-500 text-sm font-bold mb-8">
                    <Waves size={16} className="text-manabi-sky" />
                    <span>限界を超え、ゴールの彼方へ</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(4, team.members.length))].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                          {team.members[i][0]}
                        </div>
                      ))}
                      {team.members.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                          +{team.members.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-manabi-navy font-bold text-sm group-hover:translate-x-1 transition-transform">
                      START <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </button>
            );
          } else if (team.id === 'surfing') {
            // 徳永ぶちｱｹﾞ♂Surfing☆スクール (Gal/Gyaru Design)
            return (
              <button
                key={team.id}
                onClick={() => onSelectTeam(team.id)}
                className="group relative overflow-hidden bg-gradient-to-br from-[#FF00CC] via-[#333399] to-[#493240] rounded-3xl shadow-xl hover:shadow-[0_20px_50px_rgba(255,0,204,0.3)] transition-all duration-300 hover:-translate-y-1 block ring-4 ring-transparent hover:ring-pink-400/50 w-full text-left"
              >
                {/* Gal Background & Decoration */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.2),transparent_70%)]"></div>

                {/* Glitter effect dots */}
                <div className="absolute -left-4 top-10 text-pink-300/20 -rotate-12 animate-pulse">
                  <Sparkles size={100} />
                </div>
                <div className="absolute right-0 bottom-0 text-yellow-300/20 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  <PartyPopper size={140} />
                </div>

                <div className="relative z-10 p-8 h-full flex flex-col text-white">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-[#FF00CC] shadow-[0_0_20px_rgba(255,255,255,0.5)] group-hover:scale-110 transition-transform group-hover:rotate-12">
                      <Sun size={28} className="drop-shadow-sm" />
                    </div>
                    <span className="px-3 py-1 bg-black/20 text-white text-xs font-bold rounded-full border border-white/30 backdrop-blur-md">
                      GAL STYLE
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-yellow-200 leading-tight mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
                    {team.teamName} <span className="text-3xl inline-block group-hover:animate-bounce">⤴︎</span>
                  </h2>

                  <div className="flex items-center gap-2 text-pink-100 text-sm font-bold mb-8">
                    <Zap size={16} className="text-yellow-300 fill-yellow-300" />
                    <span>マジ最強バイブスで優勝っしょ☆</span>
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="flex -space-x-2">
                      {/* Colorful avatars for gal team */}
                      {[...Array(Math.min(4, team.members.length))].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-300 to-pink-500 border-2 border-white/50 flex items-center justify-center text-[10px] font-bold text-white">
                          {team.members[i][0]}
                        </div>
                      ))}
                      {team.members.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center text-[10px] font-bold text-white backdrop-blur-sm">
                          +{team.members.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-yellow-300 font-black text-sm group-hover:scale-110 transition-transform tracking-wider shadow-black drop-shadow-sm">
                      GO!! <ChevronRight size={18} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </button>
            );
          }

          // Default Fallback
          return (
            <button
              key={team.id}
              onClick={() => onSelectTeam(team.id)}
              className="group block bg-white border border-slate-200 hover:border-manabi-sky rounded-xl p-6 shadow-sm hover:shadow-md transition-all active:scale-[0.98] w-full text-left"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-manabi-navy group-hover:text-manabi-teal transition-colors">{team.teamName}</span>
                <ChevronRight className="text-slate-300 group-hover:text-manabi-sky" />
              </div>
              <div className="text-xs text-slate-500 mt-2 font-medium">
                メンバー {team.members.length}名
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SetupScreen({ onStart, savedData }) {
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState(['']);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (savedData) {
      setTeamName(savedData.teamName || '');
      setMembers(savedData.members || ['']);
      setAssignments(savedData.assignments || Array(TOTAL_LAPS).fill(0));
    }
  }, [savedData]);

  const isValid = teamName.trim().length > 0 && members.some(m => m.trim().length > 0);

  return (
    <div className="max-w-md mx-auto p-4 pb-32 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-4 pt-4">
        <a href="/" className="p-2 -ml-2 text-slate-400 hover:text-manabi-navy"><ArrowLeft size={24} /></a>
        <h1 className="text-2xl font-bold text-manabi-navy">チーム設定確認</h1>
      </div>

      <Card className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">チーム名</label>
          <input
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-50 border border-slate-300 font-bold text-lg text-manabi-navy focus:outline-none focus:border-manabi-sky focus:ring-1 focus:ring-manabi-sky"
            readOnly
          />
        </div>
      </Card>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">走順リスト (全30周)</label>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="max-h-[50vh] overflow-y-auto divide-y divide-slate-100">
            {assignments.map((memberIdx, lapIdx) => (
              <div key={lapIdx} className="flex items-center p-3 hover:bg-slate-50">
                <span className="w-12 font-mono text-sm font-bold text-slate-400">#{lapIdx + 1}</span>
                <select
                  value={memberIdx}
                  onChange={(e) => {
                    const newA = [...assignments];
                    newA[lapIdx] = parseInt(e.target.value);
                    setAssignments(newA);
                  }}
                  className="flex-1 bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  {members.map((m, i) => (
                    <option key={i} value={i}>{m}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50">
        <Button
          onClick={() => onStart({ teamName, members, assignments })}
          disabled={!isValid}
          className="w-full max-w-md mx-auto"
          size="lg"
        >
          レース開始！
        </Button>
      </div>
    </div>
  );
}

function EditModal({ data, onClose, onSave }) {
  const { members, assignments, laps } = data;
  const currentLap = laps.length;
  const [localAssignments, setLocalAssignments] = useState([...assignments]);

  const handleSave = () => {
    onSave(localAssignments);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-manabi-navy/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-lg text-manabi-navy">走順の変更</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {localAssignments.map((memberIdx, idx) => {
            const isFinished = idx < currentLap;
            const isCurrent = idx === currentLap;
            return (
              <div key={idx} className={cn("flex items-center p-3 border-b border-slate-50 last:border-0", isFinished && "opacity-50 bg-slate-50")}>
                <div className="w-12 font-mono text-sm font-bold text-slate-400">
                  #{idx + 1}
                </div>
                {isFinished ? (
                  <span className="flex-1 font-medium text-slate-500">{members[memberIdx]} (走行済)</span>
                ) : (
                  <select
                    value={memberIdx}
                    onChange={(e) => {
                      const newA = [...localAssignments];
                      newA[idx] = parseInt(e.target.value);
                      setLocalAssignments(newA);
                    }}
                    className={cn(
                      "flex-1 p-2 rounded-md font-bold border focus:outline-none transition-colors",
                      isCurrent
                        ? "bg-manabi-sky/10 border-manabi-sky text-manabi-navy"
                        : "bg-white border-slate-200 text-slate-700 focus:border-manabi-sky"
                    )}
                  >
                    {members.map((m, i) => (
                      <option key={i} value={i}>{m}</option>
                    ))}
                  </select>
                )}
                {isCurrent && <span className="ml-2 text-xs font-bold bg-manabi-sky text-white px-2 py-1 rounded">今</span>}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <Button onClick={handleSave} className="w-full">変更を保存</Button>
        </div>
      </div>
    </div>
  );
}

function RaceScreen({ data, onUpdate, onRequestReset, onRequestUndo }) {
  const [now, setNow] = useState(Date.now());
  const [showEdit, setShowEdit] = useState(false);
  const { teamName, members, assignments, startTime, laps } = data;

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const elapsedTotal = startTime ? Math.floor((now - startTime) / 1000) : 0;
  const currentLapIdx = laps.length;
  const isFinished = currentLapIdx >= TOTAL_LAPS;

  const currentRunnerIdx = assignments[currentLapIdx] || 0;
  const currentRunnerName = members[currentRunnerIdx];
  const nextRunnerIdx = assignments[currentLapIdx + 1] || 0;
  const nextRunnerName = currentLapIdx + 1 < TOTAL_LAPS ? members[nextRunnerIdx] : 'ゴール!!';

  const lastLapFinishTime = laps.length > 0 ? (laps[laps.length - 1].timestamp - startTime) / 1000 : 0;
  const targetTimeAtLastLap = laps.length * TARGET_LAP_TIME_SEC;
  const timeDiff = targetTimeAtLastLap - lastLapFinishTime;

  const remainingKm = Math.max(0, 42.195 - (currentLapIdx * LAP_DISTANCE_KM)).toFixed(2);

  const formatTime = (sec) => {
    const h = Math.floor(Math.abs(sec) / 3600);
    const m = Math.floor((Math.abs(sec) % 3600) / 60);
    const s = Math.abs(sec) % 60;
    const sign = sec < 0 ? '-' : '';
    return `${sign}${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatPaceDiff = (diffSec) => {
    const absM = Math.floor(Math.abs(diffSec) / 60);
    const absS = Math.floor(Math.abs(diffSec) % 60);
    if (diffSec === 0 && laps.length === 0) return "スタート！";
    if (diffSec >= 0) {
      return `${absM}分${absS}秒 速い！`;
    } else {
      return `${absM}分${absS}秒 遅れ汗`;
    }
  };

  const handleLap = () => {
    const newLaps = [
      ...laps,
      {
        lap: currentLapIdx + 1,
        timestamp: Date.now(),
        duration: (Date.now() - (laps.length > 0 ? laps[laps.length - 1].timestamp : startTime)) / 1000,
        runnerName: currentRunnerName,
      }
    ];
    onUpdate({ ...data, laps: newLaps });
  };

  const handleEditAssignments = (newAssignments) => {
    onUpdate({ ...data, assignments: newAssignments });
  };

  // If finished, parent handles switching to ResultScreen
  if (isFinished) return null;

  return (
    <div className="min-h-screen bg-manabi-bg flex flex-col items-center pb-safe">
      <div className="w-full max-w-md flex flex-col h-full min-h-screen bg-manabi-bg shadow-2xl overflow-hidden relative">
        <div className="bg-manabi-navy text-white p-6 pb-12 rounded-b-[2rem] shadow-lg relative z-10">
          <button
            onClick={() => setShowEdit(true)}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors z-50"
            aria-label="設定"
          >
            <Settings size={20} />
          </button>

          <div className="flex flex-col items-center justify-center mb-6 mt-2">
            <h2 className="text-manabi-sky text-sm font-bold uppercase tracking-wider mb-2">{teamName}</h2>
            <div className="text-6xl font-mono font-bold tracking-tight tabular-nums text-white drop-shadow-md">
              {formatTime(elapsedTotal)}
            </div>
          </div>

          <div className="flex justify-between items-end px-2">
            <div className="text-left">
              <div className="text-[10px] text-white/50 font-bold mb-1 tracking-wider uppercase">ペース</div>
              <div className={cn("text-xl font-bold", timeDiff >= 0 ? "text-manabi-teal" : "text-manabi-orange")}>
                {formatPaceDiff(timeDiff)}
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-white/50 font-bold mb-1 tracking-wider uppercase">残り距離</div>
              <div className="text-xl font-bold text-white">
                {remainingKm} km
              </div>
            </div>
          </div>

          <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden mt-6">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-manabi-sky to-manabi-teal transition-all duration-500 ease-out"
              style={{ width: `${(currentLapIdx / TOTAL_LAPS) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/40 mt-2 font-bold tracking-wider">
            <span>Start</span>
            <span>{currentLapIdx} / {TOTAL_LAPS} 周</span>
            <span>Goal</span>
          </div>
        </div>

        <div className="flex-1 px-4 -mt-6 space-y-4 pb-8 overflow-y-auto z-0">
          <Card className="pt-8 pb-6 px-6 relative overflow-hidden border-t-0 shadow-md">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
              <Users size={120} />
            </div>
            <div className="relative text-center">
              <div className="inline-block bg-slte-100 text-manabi-navy border border-manabi-navy/10 px-3 py-1 rounded-full text-xs font-bold mb-3">
                現在走行中 <span className="text-manabi-sky ml-1">#{currentLapIdx + 1}</span>
              </div>
              <div className="text-4xl font-extrabold text-manabi-navy truncate py-2">{currentRunnerName}</div>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-slate-50 border-dashed border-2 border-slate-200 shadow-none py-4 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">次の走者</div>
                  <div className="text-xl font-bold text-slate-700">{nextRunnerName}</div>
                </div>
                <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm border border-slate-100">
                  <ChevronRight size={20} />
                </div>
              </div>
            </Card>
          </div>

          <div className="pt-2 space-y-4">
            <Button
              variant="primary"
              size="huge"
              onClick={handleLap}
              className="relative overflow-hidden group shadow-lg shadow-manabi-teal/20 hover:shadow-manabi-teal/40 w-full py-8 text-3xl"
            >
              <span className="relative z-10 flex items-center gap-3">
                タスキ！ <RotateCcw className="group-active:-rotate-180 transition-transform duration-300" />
              </span>
            </Button>

            <div className="flex justify-between items-center px-2">
              <button
                onClick={onRequestUndo}
                className="text-slate-400 text-xs font-bold hover:text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-1"
              >
                <Undo2 size={14} /> タスキを戻す
              </button>
              <button
                onClick={onRequestReset}
                className="text-manabi-orange text-xs font-bold hover:text-red-600 bg-white px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-1"
              >
                リセット
              </button>
            </div>
          </div>

          <div className="px-2 pt-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">履歴</h3>
            <div className="space-y-2">
              {[...laps].reverse().map((lap) => (
                <div key={lap.lap} className="flex items-center justify-between text-sm py-2 border-b border-slate-200 last:border-0 pl-1 pr-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-manabi-sky text-xs font-bold">#{lap.lap}</span>
                    <span className="font-bold text-slate-700">{lap.runnerName}</span>
                  </div>
                  <div className="font-mono font-bold text-manabi-navy">
                    {Math.floor(lap.duration / 60)}分{(Math.floor(lap.duration) % 60).toString().padStart(2, '0')}秒
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showEdit && (
          <EditModal
            data={data}
            onClose={() => setShowEdit(false)}
            onSave={handleEditAssignments}
          />
        )}
      </div>
    </div>
  );
}

function ResultScreen({ data, onRequestReset }) {
  const { laps, startTime, teamName } = data;
  const totalTime = laps.length > 0 ? (laps[laps.length - 1].timestamp - startTime) / 1000 : 0;

  const formatTime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate ranks
  const sortedLaps = [...laps].sort((a, b) => a.duration - b.duration);
  const rankMap = new Map();
  sortedLaps.forEach((lap, index) => {
    // Only rank top 3
    if (index < 3) {
      rankMap.set(lap.lap, index + 1);
    }
  });

  return (
    <div className="min-h-screen bg-manabi-navy text-white p-8 flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500">
      <div className="text-center space-y-4">
        <Award size={80} className="text-manabi-sky mx-auto mb-6 drop-shadow-[0_0_15px_rgba(91,192,222,0.5)]" />
        <h1 className="text-4xl font-extrabold text-white">完走おめでとう！</h1>
        <h2 className="text-xl font-bold text-manabi-sky">{teamName}</h2>
        <div className="text-6xl font-black font-mono tracking-tighter text-white mt-6 mb-8">
          {formatTime(totalTime)}
        </div>
        <p className="text-sm font-bold text-white/50 tracking-widest uppercase">Total 42.195 km Finish</p>
      </div>

      <div className="w-full max-w-sm">
        <h3 className="text-xs font-bold text-white/50 mb-2 uppercase tracking-widest">全ラップ記録</h3>
        <div className="bg-white/5 rounded-2xl p-4 max-h-60 overflow-y-auto space-y-2 backdrop-blur-sm border border-white/10">
          {laps.map((lap) => {
            const rank = rankMap.get(lap.lap);
            return (
              <div key={lap.lap} className="flex justify-between items-center text-sm py-1 border-b border-white/5 last:border-0 relative">
                <div className="flex items-center gap-2">
                  <span className="text-white/80 font-medium">#{lap.lap} {lap.runnerName}</span>
                  {rank && (
                    <div className={cn(
                      "flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold border",
                      rank === 1 ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/50" :
                        rank === 2 ? "bg-slate-300/20 text-slate-300 border-slate-300/50" :
                          "bg-orange-700/20 text-orange-300 border-orange-700/50"
                    )}>
                      <Rabbit size={10} strokeWidth={3} /> {rank}
                    </div>
                  )}
                </div>
                <span className="font-mono text-white/60">{Math.floor(lap.duration / 60)}:{(Math.floor(lap.duration) % 60).toString().padStart(2, '0')}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Button onClick={onRequestReset} variant="secondary" className="w-full max-w-xs font-bold text-manabi-navy">
        新しいレースを始める
      </Button>
    </div>
  );
}

// --- APP ROOT ---

function App() {
  const [teamId, setTeamId] = useState(() => {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('team');
  });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTeamId, setTransitionTeamId] = useState(null);

  const presetTeam = runnerList.find(t => t.id === teamId);
  const storageKey = teamId ? `relay-app-data-${teamId}` : 'relay-app-data-default';

  const [data, setData] = useState(() => {
    // teamIdが無い場合はnull
    if (!teamId) return null;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : null;
  });

  const [phase, setPhase] = useState(() => {
    if (!teamId) return 'landing'; // 'landing' phase added
    if (!data) return 'setup';
    if (data.laps.length >= TOTAL_LAPS) return 'finish';
    return 'race';
  });

  const [modalMode, setModalMode] = useState(null); // 'password' | 'confirm' | 'undo' | null

  // teamIdが変わったらdataも読み直す
  useEffect(() => {
    if (teamId) {
      const key = `relay-app-data-${teamId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setData(JSON.parse(saved));
        setPhase(JSON.parse(saved).laps.length >= TOTAL_LAPS ? 'finish' : 'race');
      } else {
        setData(null);
        setPhase('setup');
      }
    }
  }, [teamId]);

  useEffect(() => {
    if (data && teamId) { // teamIdがあるときのみ保存
      localStorage.setItem(storageKey, JSON.stringify(data));
      if (data.laps.length >= TOTAL_LAPS) {
        setPhase('finish');
      }
    } else if (teamId && !data) {
      // dataがnullになったら消去 (reset時など)
      localStorage.removeItem(storageKey);
    }
  }, [data, storageKey, teamId]);

  const handleSelectTeam = (id) => {
    setTransitionTeamId(id);
    setIsTransitioning(true);
    // URLを更新するが、リロードはしない
    window.history.pushState({}, '', `?team=${id}`);
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    setTeamId(transitionTeamId);
    // teamIdが変わることで useEffectが走り、phaseがsetupになる
  };

  const handleStart = (setupData) => {
    setData({
      ...setupData,
      teamId: teamId || 'custom',
      startTime: Date.now(),
      laps: [],
    });
    setPhase('race');
  };

  const handleUpdate = (newData) => {
    setData(newData);
  };

  const executeReset = () => {
    localStorage.removeItem(storageKey);
    setData(null);
    setPhase('setup');
    setModalMode(null);
  };

  const executeUndo = () => {
    if (!data || data.laps.length === 0) return;
    const newLaps = data.laps.slice(0, -1);
    const newData = { ...data, laps: newLaps };
    setData(newData);
    setModalMode(null);
  };

  const requestSecureReset = () => {
    setModalMode('password');
  };

  const requestNormalReset = () => {
    setModalMode('confirm');
  };

  const requestUndo = () => {
    if (data && data.laps.length > 0) {
      setModalMode('undo');
    }
  };

  const handlePasswordConfirm = (inputPass) => {
    if (inputPass === 'smed') {
      executeReset();
    } else {
      alert('パスコードが違います');
    }
  };

  // 遷移中アニメーション
  if (isTransitioning) {
    return <TransitionOverlay teamId={transitionTeamId} onComplete={handleTransitionComplete} />;
  }

  // チーム未選択時はLanding
  if (!teamId) return <LandingScreen onSelectTeam={handleSelectTeam} />;

  const currentDisplayData = data || (presetTeam ? {
    teamName: presetTeam.teamName,
    members: presetTeam.members,
    assignments: presetTeam.assignments
  } : null);

  return (
    <div className="antialiased min-h-screen font-sans text-slate-900 bg-manabi-bg">
      {phase === 'setup' && (
        <SetupScreen
          onStart={handleStart}
          savedData={currentDisplayData}
        />
      )}

      {phase === 'race' && data && (
        <RaceScreen
          data={data}
          onUpdate={handleUpdate}
          onRequestReset={requestSecureReset}
          onRequestUndo={requestUndo}
        />
      )}

      {phase === 'finish' && data && (
        <ResultScreen
          data={data}
          onRequestReset={requestNormalReset}
        />
      )}

      {/* GLOBAL MODALS */}
      <PasswordDialog
        isOpen={modalMode === 'password'}
        title="リセットしますか？"
        onConfirm={handlePasswordConfirm}
        onCancel={() => setModalMode(null)}
      />

      <ConfirmDialog
        isOpen={modalMode === 'confirm'}
        title="新しいレースを開始"
        message="現在のレース記録は消去されます。よろしいですか？"
        onConfirm={executeReset}
        onCancel={() => setModalMode(null)}
      />

      <ConfirmDialog
        isOpen={modalMode === 'undo'}
        title="タスキを戻す確認"
        message="直前の記録を取り消して、前の走者に戻しますか？"
        onConfirm={executeUndo}
        onCancel={() => setModalMode(null)}
      />
    </div>
  );
}

export default App;
