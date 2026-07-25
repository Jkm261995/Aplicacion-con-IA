import React, { useState } from 'react';
import { VideoIdea } from '../types';
import { Lightbulb, Sparkles, Wand2, Zap, ArrowRight, Loader2, Check, Copy } from 'lucide-react';

interface VideoIdeasViewProps {
  ideas: VideoIdea[];
  onAddIdea: (idea: VideoIdea) => void;
  onCreateScriptFromIdea: (ideaTitle: string) => void;
}

export const VideoIdeasView: React.FC<VideoIdeasViewProps> = ({
  ideas,
  onAddIdea,
  onCreateScriptFromIdea,
}) => {
  const [nicheInput, setNicheInput] = useState('Tecnología, IA y Creadores');
  const [topicInput, setTopicInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerateIdeas = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-video-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: nicheInput,
          topic: topicInput,
        }),
      });

      const data = await res.json();
      if (data.ideas && Array.isArray(data.ideas)) {
        data.ideas.forEach((item: any, idx: number) => {
          onAddIdea({
            ...item,
            id: `idea-${Date.now()}-${idx}`,
          });
        });
      }
    } catch (err) {
      console.error('Error generating video ideas:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyOutline = (idea: VideoIdea) => {
    const text = `Título: ${idea.title}\nGancho Inicial: ${idea.hookIdea}\n\nEstructura de Contenido:\n${idea.contentOutline.map((step, i) => `${i + 1}. ${step}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(idea.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div>
          <div className="flex items-center space-x-2 text-red-500 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Generador de Ideas Virales con IA</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">
            Encuentra tu Próximo Video Éxito de Reproducciones
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gemini analiza los ángulos de mayor curiosidad y probabilidad de clics según tu nicho.
          </p>
        </div>

        {/* Inputs Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <input
            type="text"
            placeholder="Nicho (ej: Finanzas, Gaming, IA, Fitness)..."
            value={nicheInput}
            onChange={(e) => setNicheInput(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
          />
          <input
            type="text"
            placeholder="Tema específico opcional (ej: Productividad)..."
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
          />
          <button
            onClick={handleGenerateIdeas}
            disabled={isGenerating}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-red-600/25 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generando Ideas...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generar 5 Ideas Virales</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                  {idea.niche}
                </span>

                <span className="bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>Est. CTR: {idea.estimatedCTR}</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">
                {idea.title}
              </h3>

              {/* Hook Box */}
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Gancho de Retención (0-10s):
                </span>
                <p className="text-xs text-slate-300 italic">"{idea.hookIdea}"</p>
              </div>

              {/* Content Outline */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Puntos Clave a Desarrollar:
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {idea.contentOutline.map((pt, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-red-500 font-bold shrink-0">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Card Actions */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <button
                onClick={() => handleCopyOutline(idea)}
                className="text-slate-400 hover:text-white flex items-center space-x-1"
              >
                {copiedId === idea.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Esquema Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Esquema</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onCreateScriptFromIdea(idea.title)}
                className="flex items-center space-x-1.5 text-red-400 hover:text-red-300 font-semibold bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-500/20 transition-colors"
              >
                <span>Generar Guion</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
