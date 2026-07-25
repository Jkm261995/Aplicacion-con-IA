import React, { useState } from 'react';
import { ProcessedVideo } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Share2,
  Youtube,
  Zap,
  Sliders,
  PlusCircle,
  Play,
  ArrowRight,
  Radio,
} from 'lucide-react';

interface ContentCalendarViewProps {
  videos: ProcessedVideo[];
  onSelectVideo: (video: ProcessedVideo) => void;
  onOpenNewModal: () => void;
}

export const ContentCalendarView: React.FC<ContentCalendarViewProps> = ({
  videos,
  onSelectVideo,
  onOpenNewModal,
}) => {
  const [autoPublishYouTube, setAutoPublishYouTube] = useState(true);
  const [autoShareTwitter, setAutoShareTwitter] = useState(true);
  const [autoShareLinkedIn, setAutoShareLinkedIn] = useState(false);

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <CalendarIcon className="w-4 h-4" />
            <span>Calendario de Publicación y Programación Automática</span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">
            Planificación Estratégica de Lanzamientos
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Organiza tus lanzamientos en las franjas horarias de mayor audiencia en YouTube Studio.
          </p>
        </div>

        <button
          onClick={onOpenNewModal}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-red-600/25 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Programar Video</span>
        </button>
      </div>

      {/* Heatmap Recommendation Banner */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-300 block">
              Franjas de Publicación de Alto Impacto Detectadas:
            </span>
            <p className="text-xs text-slate-300 mt-0.5">
              Tus suscriptores están más activos los <strong>Jueves y Sábados de 18:00 a 20:00 UTC</strong> (+38% retención inicial).
            </p>
          </div>
        </div>

        {/* Automation Toggles */}
        <div className="flex items-center space-x-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs w-full md:w-auto overflow-x-auto">
          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoPublishYouTube}
              onChange={(e) => setAutoPublishYouTube(e.target.checked)}
              className="accent-red-500 rounded"
            />
            <span className="text-slate-300 font-medium">Auto-YouTube Studio</span>
          </label>

          <span className="text-slate-700">|</span>

          <label className="flex items-center space-x-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoShareTwitter}
              onChange={(e) => setAutoShareTwitter(e.target.checked)}
              className="accent-red-500 rounded"
            />
            <span className="text-slate-300 font-medium">Auto-Hilo X</span>
          </label>
        </div>
      </div>

      {/* Days Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {daysOfWeek.map((day, idx) => {
          const isPeakDay = day === 'Jueves' || day === 'Sábado';

          return (
            <div
              key={day}
              className={`p-3.5 rounded-2xl border min-h-[220px] flex flex-col justify-between ${
                isPeakDay
                  ? 'bg-slate-900/90 border-red-500/30'
                  : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white">{day}</span>
                  {isPeakDay && (
                    <span className="text-[9px] bg-red-500/20 text-red-400 font-bold px-1.5 py-0.5 rounded uppercase">
                      Pico
                    </span>
                  )}
                </div>

                {/* Video items on this day mockup */}
                <div className="space-y-2">
                  {videos
                    .filter((v, vIdx) => vIdx % 7 === idx)
                    .map((vid) => {
                      const thumb = vid.thumbnailIdeas[vid.selectedThumbnailIndex] || vid.thumbnailIdeas[0];
                      const title = vid.titles[vid.selectedTitleIndex]?.title || vid.title;

                      return (
                        <div
                          key={vid.id}
                          onClick={() => onSelectVideo(vid)}
                          className="p-2.5 bg-slate-950/80 hover:bg-slate-950 rounded-xl border border-slate-800 hover:border-red-500/40 cursor-pointer transition-all space-y-1.5 group"
                        >
                          {thumb?.generatedImageUrl && (
                            <img
                              src={thumb.generatedImageUrl}
                              alt=""
                              className="w-full aspect-video object-cover rounded-lg"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <p className="text-[11px] font-semibold text-slate-200 line-clamp-2 leading-snug group-hover:text-red-400">
                            {title}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 text-sky-400" />
                              <span>18:00 UTC</span>
                            </span>
                            <span className="text-emerald-400 font-bold">100% Listo</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              <button
                onClick={onOpenNewModal}
                className="w-full py-1.5 rounded-lg border border-dashed border-slate-700/60 text-[10px] text-slate-500 hover:text-white hover:border-slate-500 transition-colors mt-2"
              >
                + Programar
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
