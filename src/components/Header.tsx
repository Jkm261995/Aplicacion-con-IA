import React from 'react';
import { Play, Sparkles, Calendar, TrendingUp, Lightbulb, BarChart3, PlusCircle, Youtube, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'analytics' | 'ideas' | 'trends' | 'calendar' | 'script';
  setActiveTab: (tab: 'dashboard' | 'analytics' | 'ideas' | 'trends' | 'calendar' | 'script') => void;
  onOpenNewVideoModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenNewVideoModal }) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-red-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Play className="w-5 h-5 text-red-500 fill-red-500 ml-0.5" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-red-400 bg-clip-text text-transparent">
                  YOUASSISTANT
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-red-500/20 text-red-400 rounded-full border border-red-500/30 tracking-wider uppercase">
                  IA Studio
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">
                Automatización de Post-Producción para Creadores de YouTube
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Youtube className="w-4 h-4" />
              <span>Mis Videos</span>
            </button>

            <button
              onClick={() => setActiveTab('ideas')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ideas'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Ideas IA</span>
            </button>

            <button
              onClick={() => setActiveTab('trends')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'trends'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Tendencias</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'calendar'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Calendario</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analítica</span>
            </button>
          </nav>

          {/* Right Action Button */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Gemini 3.6 Activo</span>
            </div>

            <button
              onClick={onOpenNewVideoModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-xl shadow-lg shadow-red-600/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Procesar Video</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950/80 px-2 py-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center p-1.5 rounded-lg ${activeTab === 'dashboard' ? 'text-red-400 font-semibold' : 'text-slate-400'}`}
        >
          <Youtube className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Videos</span>
        </button>
        <button
          onClick={() => setActiveTab('ideas')}
          className={`flex flex-col items-center p-1.5 rounded-lg ${activeTab === 'ideas' ? 'text-red-400 font-semibold' : 'text-slate-400'}`}
        >
          <Lightbulb className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Ideas</span>
        </button>
        <button
          onClick={() => setActiveTab('trends')}
          className={`flex flex-col items-center p-1.5 rounded-lg ${activeTab === 'trends' ? 'text-red-400 font-semibold' : 'text-slate-400'}`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Tendencias</span>
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center p-1.5 rounded-lg ${activeTab === 'calendar' ? 'text-red-400 font-semibold' : 'text-slate-400'}`}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Calendario</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center p-1.5 rounded-lg ${activeTab === 'analytics' ? 'text-red-400 font-semibold' : 'text-slate-400'}`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Analítica</span>
        </button>
      </div>
    </header>
  );
};
