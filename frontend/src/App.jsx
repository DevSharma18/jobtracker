import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, MeshDistortMaterial } from '@react-three/drei';
import { io } from 'socket.io-client';
import { clsx } from 'clsx';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
   // Capture token from Google OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const googleToken = params.get('token');
    if (googleToken) {
      localStorage.setItem('token', googleToken);
      setToken(googleToken);
      window.history.replaceState({}, '', '/'); // clean URL
    }
  }, []);

  if (!token) {
    return <AuthScreen onLogin={setToken} />;
  }

  return <Dashboard token={token} onLogout={() => {
    localStorage.removeItem('token');
    setToken(null);
  }} />;
}

function AuthScreen({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const url = isSignup ? '/api/auth/signup' : '/api/auth/login';
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        onLogin(data.token);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Connection failed');
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-50 flex items-center justify-center overflow-hidden font-sans">
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
        </Canvas>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-8 bg-white border border-slate-200 shadow-lg"
      >
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-brand-500 mx-auto mb-4 flex items-center justify-center shadow-sm">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1.5L2 7v2h20V7L12 1.5zM4 10v1h1V9H4v1zm15 1h-1V9h1v2zM5 11v7h1v-7H5zm4 0v7h1v-7H9zm4 0v7h1v-7h-1zm4 0v7h1v-7h-1zM3 20v1.5h18V20H3zm1 1v1h16v-1H4z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isSignup ? 'Create an account' : 'Welcome back'}
          </h2>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            AI-powered career engineering platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide">EMAIL</label>
            <input
              type="email"
              placeholder="developer@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide">PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-medium"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 transition-all active:scale-[0.98]"
          >
            {isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold">or</span>
          </div>
        </div>

        <a
          href="/api/auth/google"
          className="w-full bg-white border border-slate-200 text-slate-700 font-medium py-3 flex items-center justify-center gap-3 hover:bg-slate-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </a>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors"
          >
            {isSignup ? 'Already have an account? Sign in' : "Need an account? Sign up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// 3D Visualizer Component
function VisualizerSphere({ isThinking }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * (isThinking ? 2 : 0.2);
      meshRef.current.rotation.y = state.clock.elapsedTime * (isThinking ? 2 : 0.3);
    }
  });

  return (
    <mesh ref={meshRef} scale={isThinking ? 1.5 : 1}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color={isThinking ? "#f43f5e" : "#6366f1"}
        envMapIntensity={1}
        clearcoat={1}
        clearcoatRoughness={0.1}
        metalness={0.1}
        roughness={0.3}
        distort={isThinking ? 0.6 : 0.2}
        speed={isThinking ? 5 : 1}
        wireframe={!isThinking}
      />
    </mesh>
  );
}

function Dashboard({ token, onLogout }) {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [aiStatus, setAiStatus] = useState('IDLE'); // IDLE, THINKING, DONE, ERROR
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  useEffect(() => {
    loadJobs();

    // Connect WebSocket
    const socket = io();

    socket.on('ai:thinking', () => {
      setAiStatus('THINKING');
      setCurrentAnalysis(null);
    });

    socket.on('ai:done', (data) => {
      setAiStatus('DONE');
      setCurrentAnalysis(data);
    });

    socket.on('ai:error', () => {
      setAiStatus('ERROR');
    });

    return () => socket.disconnect();
  }, []);

  async function loadJobs() {
    try {
      const res = await fetch('/api/jobs', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setJobs(data);
      }
    } catch (err) {
      console.error("Failed to load jobs");
    }
  }

  async function addJob(e) {
    e.preventDefault();
    if (!company || !role) return;

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ company, role, description })
      });
      if (res.ok) {
        setCompany('');
        setRole('');
        setDescription('');
        loadJobs();
      }
    } catch (err) {
      console.error("Failed to add job");
    }
  }

  async function updateStatus(jobId, newStatus) {
    try {
      const res = await fetch(`/api/jobs/${jobId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        loadJobs();
      }
    } catch (err) {
      console.error("Failed to update status");
    }
  }

  async function analyze(jobId) {
    const fileInput = document.getElementById(`file-${jobId}`);
    if (!fileInput.files[0]) {
      alert('Select PDF first');
      return;
    }

    const formData = new FormData();
    formData.append('resume', fileInput.files[0]);

    setAiStatus('THINKING');
    setCurrentAnalysis(null);

    try {
      await fetch(`/api/jobs/${jobId}/analyze`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      // The rest is handled by the WebSocket listeners
    } catch (err) {
      setAiStatus('ERROR');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-500 flex items-center justify-center shadow-sm">
             <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1.5L2 7v2h20V7L12 1.5zM4 10v1h1V9H4v1zm15 1h-1V9h1v2zM5 11v7h1v-7H5zm4 0v7h1v-7H9zm4 0v7h1v-7h-1zm4 0v7h1v-7h-1zM3 20v1.5h18V20H3zm1 1v1h16v-1H4z"/>
            </svg>
          </div>
          <h1 className="font-semibold tracking-tight text-lg">Job Tracking Platform</h1>
        </div>
        <button
          onClick={onLogout}
          className="text-sm font-medium text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
        >
          Disconnect
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">

        {/* Left Column: Forms and Lists */}
        <div className="lg:col-span-5 space-y-8">

           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
             <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                New Pipeline
             </h2>
             <form onSubmit={addJob} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide">COMPANY</label>
                    <input type="text" value={company} onChange={e=>setCompany(e.target.value)} required className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide">ROLE</label>
                    <input type="text" value={role} onChange={e=>setRole(e.target.value)} required className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 tracking-wide">JOB DESCRIPTION</label>
                  <textarea value={description} onChange={e=>setDescription(e.target.value)} required className="w-full border border-slate-200 bg-slate-50 rounded-xl px-3 py-2.5 text-sm min-h-[120px] focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white outline-none resize-y transition-all"></textarea>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white font-medium text-sm px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-sm">
                  Save Application
                </button>
             </form>
           </div>

           <div>
             <h3 className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                Active Pipelines ({jobs.length})
             </h3>
             <div className="space-y-3">
               {jobs.length === 0 ? (
                 <p className="text-sm text-slate-500 italic bg-white p-4 rounded-xl border border-slate-200 border-dashed text-center">No applications tracked yet.</p>
               ) : jobs.map(j => (
                 <div key={j.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group">
                   <div className="flex justify-between items-start mb-3">
                     <div>
                       <h4 className="font-semibold text-slate-900">{j.company}</h4>
                       <p className="text-xs font-medium text-slate-500">{j.role}</p>
                     </div>
                     <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                       <select value={j.status} onChange={(e) => updateStatus(j.id, e.target.value)} className="bg-transparent text-inherit font-inherit outline-none cursor-pointer"><option value="not_applied">Not Applied</option><option value="pending">Pending</option><option value="applied">Applied</option><option value="in_review">In Review</option></select>
                     </span>
                   </div>
                   <div className="flex gap-2 items-center mt-4">
                      <div className="relative flex-1">
                        <input type="file" id={`file-${j.id}`} accept=".pdf" onChange={(e) => {
                          const label = document.getElementById(`file-label-${j.id}`);
                          if (e.target.files[0]) {
                            label.innerText = "Change Resume: " + e.target.files[0].name;
                            label.classList.add("bg-brand-50", "text-brand-600", "border-brand-200");
                            label.classList.remove("text-slate-500", "bg-slate-50", "border-slate-200");
                          } else {
                            label.innerText = "Choose PDF Resume";
                            label.classList.remove("bg-brand-50", "text-brand-600", "border-brand-200");
                            label.classList.add("text-slate-500", "bg-slate-50", "border-slate-200");
                          }
                        }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 text-center font-medium border-dashed group-hover:border-slate-300 transition-colors truncate" id={`file-label-${j.id}`}>
                           Choose PDF Resume
                        </div>
                      </div>
                      <button onClick={() => analyze(j.id)} className="bg-brand-50 text-brand-600 hover:bg-brand-100 hover:text-brand-700 font-semibold text-xs px-4 py-2 rounded-lg transition-colors border border-brand-100">
                        Analyze
                      </button>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Right Column: 3D Vis & Results */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-slate-950 rounded-3xl shadow-2xl overflow-hidden relative h-[400px] flex flex-col border border-slate-800">

             <div className="absolute inset-0 opacity-80 mix-blend-screen">
               <Canvas camera={{ position: [0, 0, 5] }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1.5} />
                  <pointLight position={[-10, -10, -10]} color="#f43f5e" intensity={0.5} />
                  <VisualizerSphere isThinking={aiStatus === 'THINKING'} />
                  <OrbitControls autoRotate autoRotateSpeed={aiStatus === 'THINKING' ? 4 : 1} enableZoom={false} />
               </Canvas>
             </div>

             <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/10 bg-slate-950/40 backdrop-blur-md">
                <h3 className="font-mono text-xs font-semibold tracking-wider flex items-center gap-2">
                  <span className={clsx("w-2 h-2 rounded-full", {
                    "bg-slate-500": aiStatus === 'IDLE',
                    "bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.8)]": aiStatus === 'THINKING',
                    "bg-emerald-500": aiStatus === 'DONE',
                    "bg-red-500": aiStatus === 'ERROR'
                  })}></span>
                  <span className={clsx({
                    "text-slate-400": aiStatus === 'IDLE',
                    "text-rose-400": aiStatus === 'THINKING',
                    "text-emerald-400": aiStatus === 'DONE',
                    "text-red-400": aiStatus === 'ERROR'
                  })}>
                    SYSTEM.{aiStatus}
                  </span>
                </h3>
             </div>
          </div>

          <AnimatePresence mode="wait">
            {currentAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 20, height: 0 }}
                className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200"
              >
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                  <div className="w-24 h-24 rounded-full border-8 border-brand-50 flex items-center justify-center bg-white relative">
                     <svg className="absolute inset-0 w-full h-full text-brand-500 -rotate-90" viewBox="0 0 36 36">
                        <path strokeDasharray={`${currentAnalysis.match_score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                     </svg>
                     <span className="text-2xl font-bold text-slate-900">{currentAnalysis.match_score}<span className="text-sm text-slate-400">%</span></span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Analysis Complete</h2>
                    <p className="text-slate-500 mt-1 font-medium">Here is your technical breakdown.</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                       Identified Gaps
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentAnalysis.missing_skills.split(',').map((skill, i) => (
                        <span key={i} className="px-3 py-1.5 bg-rose-50 text-rose-700 text-sm font-semibold rounded-lg border border-rose-100">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                       Execution Plan
                    </h3>
                    <div className="prose prose-slate prose-sm max-w-none text-slate-600 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <ul className="space-y-3">
                        {(() => {
                          let steps = currentAnalysis.action_plan.split(/\n/).filter(l => l.trim());
                          if (steps.length <= 1) {
                            steps = currentAnalysis.action_plan.split(/(?:^|\s)Step \d+[:.]\s*/i).filter(l => l.trim());
                          }
                          if (steps.length <= 1) {
                            steps = currentAnalysis.action_plan.split(/\d+[\.\)]\s+/).filter(l => l.trim());
                          }
                          return steps.map((line, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-700 leading-relaxed">
                              <span className="shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center mt-0.5">
                                {i + 1}
                              </span>
                              <span>{line.replace(/^\d+[\.\)]\s*/, '').replace(/^- /, '').replace(/^Step \d+[:.]\s*/i, '')}</span>
                            </li>
                          ));
                        })()}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}

export default App;
