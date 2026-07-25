import React, { useState } from 'react';
import { TrendTopic } from '../types';
import { TrendingUp, Flame, Search, Wand2, Loader2, Compass, ArrowUpRight, Sparkles } from 'lucide-react';

interface TrendsResearchViewProps {
  trends: TrendTopic[];
  onAddTrend: (trend: TrendTopic) => void;
  onCreateVideoFromTrend: (trendTitle: string) => void;
}

export const TrendsResearchView: React.FC<TrendsResearchViewProps> = ({
  trends,
  onAddTrend,
  onCreateVideoFromTrend,
}) => {
  const [selectedNiche, setSelectedNiche] = useState('Tecnología, IA y Creadores');
  const [isSearching, setIsSearching] = useState(false);

  const handleResearchTrends = async () => {
    setIsSearching(true);
    try {
      const res = await fetch('/api/research-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche: selectedNiche }),
      });

      const data = await res.json();
      if (data.trends && Array.isArray(data.trends)) {
        data.trends.forEach((tr: any, idx: number) => {
          onAddTrend({
            ...tr,
            id: `tr-${Date.now()}-${idx}`,
          });
        });
      }
    } catch (err) {
      console.error('Error fetching trends:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-current" />
              <span>Investigación de Tendencias de YouTube en Tiempo Real</span>
            </div>
            <h2 className="text-xl font-extrabold text-white mt-1">
              Temas de Alto Impacto y Crecimiento Explosivo
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Identifica intenciones de búsqueda en auge con baja o media competencia antes de que se saturen.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              placeholder="Escribe tu nicho..."
              className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            />
            <button
              onClick={handleResearchTrends}
              disabled={isSearching}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium text-xs px-4 py-2 rounded-xl transition-all disabled:opacity-50 shrink-0 shadow-lg shadow-red-600/20"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Compass className="w-4 h-4" />
                  <span>Explorar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Trends Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {trends.map((tr) => (
          <div
            key={tr.id}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                  {tr.niche}
                </span>

                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{tr.growth}</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">
                {tr.title}
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-slate-500 block text-[10px]">Volumen de Búsqueda</span>
                  <span className="font-bold text-slate-200">{tr.searchVolume}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Nivel de Competencia</span>
                  <span className={`font-bold ${
                    tr.competition === 'Baja' ? 'text-emerald-400' : tr.competition === 'Media' ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {tr.competition}
                  </span>
                </div>
              </div>

              {/* Angle Box */}
              <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Ángulo Único Recomendado:</span>
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{tr.suggestedAngle}</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tr.tags.map((tag, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="pt-3 border-t border-slate-800/80 flex justify-end">
              <button
                onClick={() => onCreateVideoFromTrend(tr.title)}
                className="flex items-center space-x-1.5 text-xs bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-xl transition-colors shadow"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Crear Video con esta Tendencia</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
