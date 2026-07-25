import React, { useState } from 'react';
import { X, Sparkles, Youtube, FileText, ArrowRight, Loader2, CheckCircle, AlertCircle, Wand2 } from 'lucide-react';
import { ProcessedVideo } from '../types';

interface NewVideoProcessorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (video: ProcessedVideo) => void;
}

const SAMPLE_TRANSCRIPT = `En este video probé crear un canal completo de YouTube utilizando únicamente herramientas de inteligencia artificial durante 24 horas. Desde la generación del nicho, el guion, la voz en off sintetizada, la edición automatizada de video y las miniaturas diseñadas con IA. El objetivo era verificar si un canal 100% automatizado puede generar reproducciones reales y retención de audiencia sin intervención humana continua. Analizamos las estadísticas de las primeras 48 horas, las impresiones en el feed de recomendaciones de YouTube, la tasa de clics (CTR) y el porcentaje medio reproducido. Finalmente, te muestro paso a paso el flujo exacto de trabajo que puedes replicar hoy mismo para ahorrar más de 15 horas de edición semanal.`;

export const NewVideoProcessorModal: React.FC<NewVideoProcessorModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [inputMode, setInputMode] = useState<'transcript' | 'youtube'>('transcript');
  const [transcript, setTranscript] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isFetchingYoutube, setIsFetchingYoutube] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const processingSteps = [
    'Analizando estructura narrativa y ganchos de retención...',
    'Generando 5 títulos optimizados con Score de CTR (1-10)...',
    'Redactando descripción optimizada para YouTube sin timestamps...',
    'Diseñando 3 ideas de miniaturas visuales con estilo y composición...',
    'Extrayendo 15-20 etiquetas (tags) SEO para el algoritmo...',
    'Escribiendo adaptación para Twitter/X, Instagram Reel y LinkedIn...',
  ];

  const handleFetchYoutubeTranscript = async () => {
    if (!youtubeUrl.trim()) {
      setError('Por favor ingresa un enlace válido de YouTube.');
      return;
    }
    setError(null);
    setIsFetchingYoutube(true);

    try {
      const res = await fetch('/api/fetch-youtube-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtubeUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'No se pudo obtener la transcripción.');
      }
      setTranscript(data.transcript || '');
      setInputMode('transcript');
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor para la URL de YouTube.');
    } finally {
      setIsFetchingYoutube(false);
    }
  };

  const handleProcessVideo = async () => {
    if (!transcript.trim() || transcript.trim().length < 10) {
      setError('Por favor pega la transcripción completa del video (mínimo 10 caracteres).');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setCurrentStep(0);

    // Progress animation loop
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < processingSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    try {
      const res = await fetch('/api/process-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          youtubeUrl: youtubeUrl || undefined,
        }),
      });

      const data = await res.json();
      clearInterval(stepInterval);

      if (!res.ok) {
        throw new Error(data.error || 'Error procesando la transcripción.');
      }

      // Build new ProcessedVideo object
      const newVideo: ProcessedVideo = {
        id: `vid-${Date.now()}`,
        title: data.titles[0]?.title || 'Video Procesado con IA',
        createdAt: new Date().toISOString(),
        status: 'draft',
        rawTranscript: transcript,
        youtubeUrl: youtubeUrl || undefined,
        selectedTitleIndex: 0,
        titles: data.titles || [],
        description: data.description || '',
        tags: data.tags || [],
        thumbnailIdeas: (data.thumbnailIdeas || []).map((t: any, idx: number) => ({
          ...t,
          id: `thumb-${Date.now()}-${idx}`,
        })),
        selectedThumbnailIndex: 0,
        socialPosts: data.socialPosts || {
          twitterThread: [],
          instagramReelHook: '',
          linkedInSummary: '',
        },
        script: data.script,
        metrics: data.metrics,
      };

      setIsProcessing(false);
      onSuccess(newVideo);
      onClose();
    } catch (err: any) {
      clearInterval(stepInterval);
      setIsProcessing(false);
      setError(err.message || 'Ocurrió un error al procesar el video con la IA.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Procesar Nuevo Video con IA</h2>
              <p className="text-xs text-slate-400">
                Pega la transcripción completa y la IA generará todo el material de post-producción
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="flex items-center space-x-3 bg-red-500/10 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Mode Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setInputMode('transcript')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-medium rounded-lg transition-all ${
                inputMode === 'transcript'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4 text-red-400" />
              <span>Pegar Transcripción</span>
            </button>
            <button
              onClick={() => setInputMode('youtube')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-medium rounded-lg transition-all ${
                inputMode === 'youtube'
                  ? 'bg-slate-800 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Youtube className="w-4 h-4 text-red-500" />
              <span>Enlace de YouTube</span>
            </button>
          </div>

          {/* Youtube URL Input */}
          {inputMode === 'youtube' && (
            <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <label className="block text-xs font-medium text-slate-300">
                URL del Video de YouTube
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
                />
                <button
                  onClick={handleFetchYoutubeTranscript}
                  disabled={isFetchingYoutube || !youtubeUrl.trim()}
                  className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 py-2 rounded-xl transition-all disabled:opacity-50 border border-slate-700"
                >
                  {isFetchingYoutube ? (
                    <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                  ) : (
                    <>
                      <span>Extraer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Extrae el texto de las palabras habladas automáticamente.
              </p>
            </div>
          )}

          {/* Transcript Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">
                Transcripción Completa del Video
              </label>
              <button
                type="button"
                onClick={() => setTranscript(SAMPLE_TRANSCRIPT)}
                className="flex items-center space-x-1.5 text-[11px] text-red-400 hover:text-red-300 transition-colors bg-red-500/10 hover:bg-red-500/20 px-2.5 py-1 rounded-lg border border-red-500/20"
              >
                <Wand2 className="w-3 h-3" />
                <span>Probar con Ejemplo</span>
              </button>
            </div>
            <textarea
              rows={7}
              placeholder="Pega aquí la transcripción de las palabras habladas en tu video de YouTube (mínimo 10 caracteres)..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              disabled={isProcessing}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-red-500 transition-all font-mono leading-relaxed resize-none"
            />
            <div className="flex justify-between text-[11px] text-slate-500 px-1">
              <span>{transcript.length} caracteres introducidos</span>
              <span>Recomendado: {'>'}200 palabras</span>
            </div>
          </div>

          {/* Processing Progress Animation */}
          {isProcessing && (
            <div className="bg-slate-950/80 border border-red-500/30 p-4 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-red-400 flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando Automatización con IA...</span>
                </span>
                <span className="text-slate-400 font-mono">
                  {Math.round(((currentStep + 1) / processingSteps.length) * 100)}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep + 1) / processingSteps.length) * 100}%` }}
                />
              </div>

              <p className="text-xs text-slate-300 flex items-center space-x-2 font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>{processingSteps[currentStep]}</span>
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-5 border-t border-slate-800 bg-slate-900/60">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>

          <button
            onClick={handleProcessVideo}
            disabled={isProcessing || !transcript.trim()}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-red-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generar Post-Producción</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
