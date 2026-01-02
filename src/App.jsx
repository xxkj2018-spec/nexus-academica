import React, { useState, useEffect, useRef } from 'react';
import { 
  Map as MapIcon, 
  BookOpen, 
  Gamepad2, 
  Video, 
  FileText, 
  Zap, 
  Cpu, 
  Trophy,
  MessageSquare,
  Sparkles,
  Lock,
  X,
  Coins,
  Flame,
  Bot,
  Clapperboard,
  Presentation,
  Rocket,
  Search,
  CheckCircle,
  Code,
  Globe,
  Loader,
  AlertCircle,
  Terminal
} from 'lucide-react';

// --- 0. API UTILITIES (Gemini Integration) ---

// ⚠️ API Key 由运行环境自动提供，无需手动填写
const apiKey = ""; 

/**
 * 调用 Gemini API 生成内容
 * 包含指数退避重试机制
 */
async function callGeminiAPI(prompt, retries = 3) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }]
  };

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Agent returned empty data.";
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed: ${error.message}`);
      if (i === retries - 1) throw error;
      // Exponential backoff: 1s, 2s, 4s...
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}

// --- 1. CONFIGURATION ---

const KNOWLEDGE_NODES = [
  { 
    id: 'k1', title: 'Gemini 原力枢纽', level: 1, type: 'Core', status: 'completed', x: 50, y: 50, connections: ['k2', 'k3', 'k4'], icon: Sparkles, color: 'text-blue-400',
    desc: '掌握 Google 最强模型全家桶。学会与 Gemini Pro 对话，解锁多模态理解能力。', tags: ['必修', 'Prompt工程']
  },
  { 
    id: 'k2', title: '智能体锻造厂', level: 2, type: 'Forge', status: 'unlocked', x: 20, y: 25, connections: [], icon: Bot, color: 'text-purple-400',
    desc: '从零构建你的 AI Agent。学习 Codex 逻辑，让智能体替你自动打工。', tags: ['热门', '高薪技能']
  },
  { 
    id: 'k3', title: '幻影剧场 (AI影视)', level: 2, type: 'Studio', status: 'unlocked', x: 80, y: 25, connections: [], icon: Clapperboard, color: 'text-pink-400',
    desc: 'Sora/Runway 实战。一个人就是一支队伍，制作动漫、短剧与电影级特效。', tags: ['创作者推荐', '变现快']
  },
  { 
    id: 'k4', title: '现实扭曲力场 (办公)', level: 2, type: 'Office', status: 'locked', x: 50, y: 85, connections: [], icon: Presentation, color: 'text-emerald-400',
    desc: '一键生成 PPT，自动写研报。掌握 AI 办公流，让工作效率提升 10 倍。', tags: ['效率神器']
  },
];

const MODES = [
  { id: 'adventure', name: '实战演练', icon: Gamepad2, color: 'text-blue-400', border: 'border-blue-500/50', bg: 'bg-blue-900/20', desc: '进入沙盒环境，亲手调试一个 Agent 或生成一段视频。', xp: '150 XP' },
  { id: 'chronicle', name: '案例故事', icon: BookOpen, color: 'text-purple-400', border: 'border-purple-500/50', bg: 'bg-purple-900/20', desc: '阅读“超级个体”的崛起故事，在剧情中学习工具用法。', xp: '120 XP' },
  { id: 'cinema', name: '大师精讲', icon: Video, color: 'text-pink-400', border: 'border-pink-500/50', bg: 'bg-pink-900/20', desc: '观看行业大佬的操作录屏与思维拆解。', xp: '80 XP' },
  { id: 'archive', name: '工具图谱', icon: FileText, color: 'text-emerald-400', border: 'border-emerald-500/50', bg: 'bg-emerald-900/20', desc: '获取最新的 AI 工具导航站与 Prompt 库。', xp: '50 XP' },
];

const CHAT_MESSAGES = [
  { user: 'Cyber_Artist', msg: '刚用幻影剧场做了一个 3 分钟的动漫，效果炸裂！', type: 'chat' },
  { user: 'System', msg: '🔥 热门：[智能体锻造厂] 新增 "客服机器人" 模板。', type: 'system' },
  { user: 'Newbie_99', msg: 'Gemini 1.5 Pro 的长文本分析怎么用？求教。', type: 'help' },
];

const AGENT_LOGS = [
  { agent: 'Watcher', action: '扫描全网最新技术动态...', status: 'done', time: '10:00:01' },
  { agent: 'Researcher', action: '发现新论文: "Gemini 3.0 Architecture"', status: 'done', time: '10:00:05' },
  { agent: 'Verifier', action: '验证知识点准确性...', status: 'active', time: '10:00:12' },
  { agent: 'Coder', action: '等待指令生成关卡代码...', status: 'pending', time: '--:--:--' },
];

const MODELS = [
  { id: 'gemini-3', name: 'Gemini 3.0 Pro', icon: Sparkles, color: 'text-blue-400' },
  { id: 'gpt-4', name: 'GPT-4 Turbo', icon: Zap, color: 'text-green-400' },
  { id: 'claude-3', name: 'Claude 3 Opus', icon: Bot, color: 'text-orange-400' },
];

// --- 2. COMPONENTS ---

const HolographicCard = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`relative bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-xl transition-all hover:border-blue-500/30 hover:shadow-blue-500/10 group ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    {children}
  </div>
);

const UserStats = () => (
  <div className="flex items-center gap-4 bg-black/60 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-lg pointer-events-auto">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[1px]">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AI_Master" alt="avatar" className="rounded-full bg-black" />
      </div>
      <div>
        <div className="text-xs text-gray-400 font-mono">Creator</div>
        <div className="text-sm font-bold text-white leading-none">LV.3</div>
      </div>
    </div>
    <div className="h-8 w-px bg-white/10" />
    <div className="flex flex-col gap-1 min-w-[100px]">
      <div className="flex justify-between text-[10px] text-purple-300 font-mono">
        <span>Mastery</span>
        <span>1,200 / 5,000</span>
      </div>
      <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[24%]" />
      </div>
    </div>
    <div className="h-8 w-px bg-white/10" />
    <div className="flex items-center gap-1.5 text-yellow-400 font-mono text-sm">
      <Coins size={14} /> <span>1,200 NEX</span>
    </div>
  </div>
);

// --- VIEW: Galaxy Map ---
const GalaxyView = ({ onNodeSelect }) => {
  return (
    <div className="relative w-full h-full overflow-hidden cursor-move select-none animate-in fade-in duration-700">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a2e] via-[#000] to-black" />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #4f46e5 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="lineGradientAI" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {KNOWLEDGE_NODES.flatMap(node => 
          node.connections.map(targetId => {
            const target = KNOWLEDGE_NODES.find(n => n.id === targetId);
            if (!target) return null;
            return <line key={`${node.id}-${target.id}`} x1={`${node.x}%`} y1={`${node.y}%`} x2={`${target.x}%`} y2={`${target.y}%`} stroke="url(#lineGradientAI)" strokeWidth="2" className="animate-pulse" />;
          })
        )}
      </svg>

      {KNOWLEDGE_NODES.map(node => {
        const NodeIcon = node.icon;
        const isCenter = node.type === 'Core';
        return (
          <div key={node.id} className="absolute -translate-x-1/2 -translate-y-1/2 group z-10" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 w-max opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
               {node.tags.map((tag, i) => <span key={i} className="px-2 py-0.5 bg-blue-600/80 text-white text-[10px] rounded-full shadow-lg backdrop-blur-sm border border-blue-400/30">{tag}</span>)}
            </div>
            {node.status === 'unlocked' && <div className={`absolute inset-0 rounded-full ${isCenter ? 'bg-blue-500/20' : 'bg-purple-500/20'} animate-ping duration-[3s]`} />}
            <button onClick={() => node.status !== 'locked' && onNodeSelect(node)} className={`relative flex items-center justify-center rounded-full border-2 transition-all duration-500 ${isCenter ? 'w-24 h-24 border-blue-400 shadow-[0_0_50px_rgba(59,130,246,0.4)] bg-black' : 'w-20 h-20 border-gray-600 bg-gray-900'} ${node.status === 'unlocked' && !isCenter ? 'border-purple-400 shadow-[0_0_30px_rgba(192,132,252,0.4)] hover:scale-110' : ''} ${node.status === 'locked' ? 'opacity-50 grayscale' : ''}`}>
              <NodeIcon size={isCenter ? 36 : 28} className={node.color} />
              {node.status === 'locked' && <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-[2px]"><Lock size={16} className="text-gray-400" /></div>}
            </button>
            <div className={`absolute top-full mt-3 left-1/2 -translate-x-1/2 w-max text-center transition-all ${node.status === 'locked' ? 'opacity-50' : 'opacity-100'}`}>
               <h3 className={`font-bold text-sm ${node.color} bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md`}>{node.title}</h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- VIEW: Genesis Studio (Creator Zone + Gemini API) ---
const CreatorStudio = () => {
  const [selectedModel, setSelectedModel] = useState('gemini-3');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Call the Real Gemini API
  const handleGenerate = async (type = 'general') => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedContent('');
    setErrorMsg('');

    // Prepend instruction based on type
    let finalPrompt = prompt;
    if (type === 'video') finalPrompt = `[Role: Video Director Agent] You are a professional AI video director. Create a detailed video script for the following topic. Include scene descriptions, camera angles, and narration. Topic: ${prompt}`;
    if (type === 'code') finalPrompt = `[Role: Senior Software Engineer] You are an expert programmer. Write clean, well-commented, and robust code for the following request. Provide only the code and brief explanation. Request: ${prompt}`;
    if (type === 'story') finalPrompt = `[Role: Sci-Fi Author] You are a creative sci-fi author. Write an engaging, educational story chapter that explains the following concept through plot and dialogue. Concept: ${prompt}`;

    try {
      const result = await callGeminiAPI(finalPrompt);
      setGeneratedContent(result);
    } catch (err) {
      setErrorMsg("Connection lost to the Neural Core (API Error). Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-full bg-[#0B0B15] animate-in fade-in duration-500">
      {/* Left: Agent & Model Panel */}
      <div className="w-80 bg-gray-950/80 border-r border-gray-800 p-6 flex flex-col gap-6">
        <div>
          <label className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3 block">Model Selection</label>
          <div className="space-y-2">
            {MODELS.map(model => (
              <button 
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${selectedModel === model.id ? 'bg-blue-600/10 border-blue-500/50' : 'bg-gray-900 border-gray-800 hover:border-gray-700'}`}
              >
                <model.icon size={18} className={model.color} />
                <span className={`text-sm font-bold ${selectedModel === model.id ? 'text-white' : 'text-gray-400'}`}>{model.name}</span>
                {selectedModel === model.id && <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]"></div>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <label className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3 block flex items-center gap-2">
            <Cpu size={14} className="animate-pulse" /> Agent Swarm Status
          </label>
          <div className="bg-black/50 rounded-xl border border-gray-800 p-4 font-mono text-xs space-y-4 h-64 overflow-y-auto">
             {AGENT_LOGS.map((log, i) => (
               <div key={i} className="flex gap-3">
                 <span className="text-gray-600">{log.time}</span>
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <span className={`font-bold ${log.status === 'done' ? 'text-green-500' : log.status === 'active' ? 'text-yellow-500' : 'text-gray-500'}`}>
                       [{log.agent}]
                     </span>
                     {log.status === 'active' && <Loader size={10} className="animate-spin text-yellow-500" />}
                   </div>
                   <span className="text-gray-400">{log.action}</span>
                 </div>
               </div>
             ))}
             {isGenerating && (
                <div className="flex gap-3 animate-pulse">
                  <span className="text-blue-500">NOW</span>
                  <div>
                    <span className="font-bold text-blue-400">[Gemini Agent]</span>
                    <span className="text-gray-300 block">Processing neural request...</span>
                  </div>
                </div>
             )}
          </div>
          <div className="mt-4 p-3 bg-blue-900/10 border border-blue-500/20 rounded-lg text-xs text-blue-300">
             <div className="flex items-center gap-2 mb-1 font-bold"><Globe size={12}/> Network Access Active</div>
             实时扫描 GitHub, arXiv, HuggingFace 最新动态中...
          </div>
        </div>
      </div>

      {/* Center: Creation Canvas */}
      <div className="flex-1 p-8 flex flex-col overflow-hidden">
         <div className="mb-6 flex-shrink-0">
           <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
             <Zap className="text-yellow-400 fill-yellow-400" /> Genesis Studio
           </h2>
           <p className="text-gray-400">描述你想创建的知识节点，Agent 团队将自动完成搜索、验证与代码生成。</p>
         </div>

         <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6 focus-within:border-blue-500 transition-colors flex-shrink-0">
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-24 bg-transparent text-white placeholder-gray-600 focus:outline-none resize-none font-mono text-sm"
              placeholder="例如：创建一个关于'Sora 视频生成原理'的互动教学关卡。要求包含扩散模型的可视化演示，并自动从 Twitter 抓取最新的 Sora 演示视频作为案例。"
            />
            <div className="flex justify-between items-center mt-4 border-t border-gray-800 pt-4">
               <div className="flex gap-4">
                 <button onClick={() => handleGenerate('video')} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors hover:bg-white/5 p-1 rounded"><Video size={14}/> 生成视频脚本</button>
                 <button onClick={() => handleGenerate('code')} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors hover:bg-white/5 p-1 rounded"><Gamepad2 size={14}/> 生成游戏代码</button>
                 <button onClick={() => handleGenerate('story')} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors hover:bg-white/5 p-1 rounded"><BookOpen size={14}/> 生成小说章节</button>
               </div>
               <button 
                 onClick={() => handleGenerate('general')}
                 disabled={isGenerating || !prompt.trim()}
                 className={`bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all hover:scale-105 ${isGenerating || !prompt.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 {isGenerating ? <Loader className="animate-spin"/> : <Sparkles size={18} />}
                 <span className="uppercase tracking-wider text-xs">Invoke Agents</span>
               </button>
            </div>
         </div>

         {/* Preview Area (Real API Output) */}
         <div className="flex-1 bg-black rounded-xl border border-gray-800 relative overflow-hidden flex flex-col">
            <div className="bg-gray-900 px-4 py-2 border-b border-gray-800 flex justify-between items-center">
               <span className="text-xs font-mono text-gray-500">OUTPUT_TERMINAL_V1</span>
               <div className="flex gap-1">
                 <div className="w-2 h-2 rounded-full bg-red-500"></div>
                 <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                   <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                   <div className="text-blue-400 font-mono animate-pulse">Forging Content...</div>
                   <div className="text-xs text-gray-600 mt-2">Calling Gemini API...</div>
                </div>
              ) : errorMsg ? (
                <div className="flex flex-col items-center justify-center h-full text-red-400">
                   <AlertCircle size={48} className="mb-4 opacity-50" />
                   <p>{errorMsg}</p>
                </div>
              ) : generatedContent ? (
                <div>{generatedContent}</div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-700">
                  <Terminal size={48} className="mb-4 opacity-20" />
                  <span>等待指令... 预览区域将展示生成结果</span>
                </div>
              )}
            </div>
         </div>
      </div>
    </div>
  );
};

// 3.3 模式选择弹窗 (Mode Selection Modal)
const ModeSelectionModal = ({ node, onClose }) => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-300">
    <HolographicCard className="w-full max-w-5xl p-0 bg-gray-900 border-blue-500/20 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] md:h-auto">
      <div className="w-full md:w-1/3 bg-gray-950 p-8 border-b md:border-b-0 md:border-r border-white/10 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 rounded-lg bg-gray-900 border border-white/10 flex items-center justify-center">
               <node.icon size={24} className={node.color} />
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{node.title}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
             {node.tags.map((tag, i) => <span key={i} className="text-[10px] uppercase font-bold tracking-wider text-blue-400 bg-blue-900/20 px-2 py-1 rounded border border-blue-900/30">{tag}</span>)}
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">{node.desc}</p>
          <div className="mt-auto">
            <div className="text-xs text-gray-500 uppercase font-bold mb-2">Completion Rewards</div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-yellow-400 bg-yellow-900/10 px-3 py-2 rounded border border-yellow-900/20"><Trophy size={16} /> <span className="text-sm font-bold">技能证书</span></div>
              <div className="flex items-center gap-2 text-purple-400 bg-purple-900/10 px-3 py-2 rounded border border-purple-900/20"><Coins size={16} /> <span className="text-sm font-bold">500 NEX</span></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-8 bg-gray-900/50">
        <h3 className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-6">选择学习模式 (Select Protocol)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <button key={mode.id} className={`relative rounded-xl border ${mode.border} ${mode.bg} p-5 flex flex-col items-start text-left transition-all hover:scale-[1.02] hover:bg-opacity-40 group overflow-hidden`}>
                <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity transform translate-x-1/4 translate-y-1/4"><Icon size={120} /></div>
                <div className={`w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center mb-3 group-hover:ring-2 ring-white/20 transition-all`}><Icon size={20} className={mode.color} /></div>
                <h3 className={`text-lg font-bold text-white mb-1 group-hover:translate-x-1 transition-transform`}>{mode.name}</h3>
                <p className="text-xs text-gray-400 leading-relaxed max-w-[90%] relative z-10">{mode.desc}</p>
                <div className="mt-4 text-[10px] font-mono text-gray-500 flex items-center gap-1"><Zap size={10} className="text-yellow-500" /> <span>Reward: {mode.xp}</span></div>
              </button>
            );
          })}
        </div>
      </div>
    </HolographicCard>
  </div>
);

// --- 4. 主程序入口 (MAIN APP) ---

export default function App() {
  const [activeView, setActiveView] = useState('galaxy'); // 'galaxy' or 'creator'
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="flex h-screen bg-black text-gray-100 font-sans">
      
      {/* 侧边导航栏 (Sidebar) */}
      <aside className="w-20 lg:w-64 bg-gray-950 border-r border-gray-800 flex flex-col z-20">
        <div className="h-20 flex items-center justify-center lg:justify-start lg:px-6 border-b border-gray-800 bg-gray-950">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <Rocket size={22} className="text-white" />
          </div>
          <div className="hidden lg:block ml-3">
             <h1 className="font-bold text-lg tracking-wider text-white leading-none">NEXUS</h1>
             <span className="text-[10px] text-blue-400 font-mono tracking-widest">AI FRONTIER</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* 发现区 */}
          <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest px-3 mb-2 hidden lg:block">Discover</div>
          <button 
            onClick={() => setActiveView('galaxy')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${activeView === 'galaxy' ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <MapIcon size={20} /> <span className="hidden lg:block font-medium">全知星图</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
            <Cpu size={20} /> <span className="hidden lg:block font-medium">Agent 市场</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
            <Trophy size={20} /> <span className="hidden lg:block font-medium">技能认证</span>
          </button>
          
          {/* 创作区 */}
          <div className="mt-8 text-[10px] text-gray-600 font-bold uppercase tracking-widest px-3 mb-2 hidden lg:block">Creator Zone</div>
          
          <button 
             onClick={() => setActiveView('creator')}
             className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors group mb-1 ${activeView === 'creator' ? 'bg-purple-600/10 text-purple-400 border border-purple-600/20' : 'text-gray-400 hover:bg-white/5'}`}
          >
            <div className="relative">
               <Sparkles size={20} className={activeView === 'creator' ? 'text-purple-400' : 'group-hover:text-purple-400 transition-colors'}/>
            </div>
            <span className="hidden lg:block font-medium">Genesis Studio</span>
          </button>

          <button className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors group">
            <div className="relative">
               <Zap size={20} className="group-hover:text-yellow-400 transition-colors"/>
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            </div>
            <span className="hidden lg:block font-medium">悬赏任务</span>
          </button>
        </nav>

        {/* 底部实时信息流 */}
        <div className="p-4 border-t border-gray-800 hidden lg:block bg-gray-950/50">
          <div className="flex items-center gap-2 mb-3 text-[10px] text-green-500 uppercase font-bold tracking-widest">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Global Signal
          </div>
          <div className="space-y-3">
            {CHAT_MESSAGES.map((msg, i) => (
              <div key={i} className="text-xs leading-relaxed border-l-2 border-gray-800 pl-2">
                <span className={`font-bold ${msg.type === 'system' ? 'text-pink-500' : 'text-blue-400'}`}>{msg.user}</span>
                <span className="text-gray-500 mx-1">::</span>
                <span className="text-gray-300">{msg.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* 主视图区域 */}
      <main className="flex-1 relative flex flex-col bg-black">
        {/* 顶部HUD */}
        <div className="absolute top-6 right-6 z-20 pointer-events-none">
           <UserStats />
        </div>
        
        {/* 内容显示区域 */}
        <div className="flex-1 relative overflow-hidden">
          {activeView === 'galaxy' ? (
            <GalaxyView onNodeSelect={setSelectedNode} />
          ) : (
            <CreatorStudio />
          )}
        </div>

        {/* 弹窗 (仅在星图模式且选中节点时显示) */}
        {activeView === 'galaxy' && selectedNode && (
          <ModeSelectionModal node={selectedNode} onClose={() => setSelectedNode(null)} />
        )}
      </main>
    </div>
  );
}