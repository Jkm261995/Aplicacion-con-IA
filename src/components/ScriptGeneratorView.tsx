import React, { useState } from 'react';
import { VideoScript } from '../types';
import { Wand2, Sparkles, Loader2, Copy, Check, Eye, Download, FileText, ArrowRight } from 'lucide-react';

interface ScriptGeneratorViewProps {
  initialTopic?: string;
}

export const ScriptGeneratorView: React.FC<ScriptGeneratorViewProps> = ({ initialTopic }) => {
  const [topic, setTopic] = useState(initialTopic || '');
  const [duration, setDuration] = useState(8);
  const [tone, setTone] = useState('Entusiasta, educativo y directo');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<VideoScript | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerateScript = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          targetDurationMinutes: duration,
          tone,
        }),
      });

      const data = await res.json();
      if (data.script) {
        setGeneratedScript(data.script);
      }
    } catch (err) {
      console.error('Error generating script:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyScript = () => {
    if (!generatedScript) return;
    const text = `
GANCHO (0-10s):
${generatedScript.hook}

INTRODUCCIÓN:
${generatedScript.intro}

PUNTOS CLAVE:
${generatedScript.bodyPoints.map((pt, i) => `${i + 1}. ${pt.title}\nTexto: ${pt.text}\nVisual/B-Roll: ${pt.visualCue}\n`).join('\n')}

CIERRE Y LLAMADO A LA ACCIÓN (CTA):
${generatedScript.cta}
    `.trim();

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(null), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Wand2 className="w-4 h-4" />
            <span>Estudio de Generación de Guiones para YouTube</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">
            Crea Guiones de Alta Retención en Segundos
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Estructuras probadas para mantener a la audiencia enganchada con indicaciones visuales de B-Roll.
          </p>
        </div>

        {/* Inputs Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          <input
            type="text"
            placeholder="Tema del video (ej: Cómo monetizar con YouTube Shorts en 2026)..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
          />

          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
          >
            <option value={5}>Duración ~5 minutos</option>
            <option value={8}>Duración ~8 minutos</option>
            <option value={12}>Duración ~12 minutos</option>
            <option value={15}>Duración ~15 minutos</option>
          </select>

          <button
            onClick={handleGenerateScript}
            disabled={isGenerating || !topic.trim()}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-red-600/25 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generando...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generar Guión</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Script Display */}
      {generatedScript ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-red-500" />
              <span>Guión Generado para: "{topic}"</span>
            </h3>

            <button
              onClick={handleCopyScript}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs px-3.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">¡Guión Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Guión Completo</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                GANCHO INICIAL (0-10 SEGUNDOS)
              </span>
              <p className="text-sm text-white font-medium">{generatedScript.hook}</p>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                INTRODUCCIÓN Y PROMESA DE VALOR
              </span>
              <p className="text-xs text-slate-200">{generatedScript.intro}</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300">DESARROLLO DEL CONTENIDO:</h4>
              {generatedScript.bodyPoints.map((pt, idx) => (
                <div key={idx} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                  <h5 className="text-xs font-bold text-white">
                    {idx + 1}. {pt.title}
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed">{pt.text}</p>
                  <div className="p-2.5 bg-slate-900 rounded-lg text-xs text-amber-300 border border-amber-400/20 flex items-center space-x-2">
                    <Eye className="w-4 h-4 shrink-0 text-amber-400" />
                    <span><strong>Visual / B-Roll:</strong> {pt.visualCue}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                CIERRE Y LLAMADO A LA ACCIÓN (CTA)
              </span>
              <p className="text-xs text-slate-200">{generatedScript.cta}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Wand2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-300">Introduce un tema para escribir tu guión</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Escribe el título o tema de tu video y haz clic en "Generar Guión" para obtener la estructura completa lista para grabar.
          </p>
        </div>
      )}

    </div>
  );
};
