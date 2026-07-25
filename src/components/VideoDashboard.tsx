import React, { useState } from 'react';
import {
  Youtube,
  PlusCircle,
  Search,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  Calendar,
  MoreVertical,
  Trash2,
  Edit3,
  ExternalLink,
  Tag,
  Share2,
  FileText,
  Play,
  TrendingUp,
} from 'lucide-react';
import { ProcessedVideo } from '../types';

interface VideoDashboardProps {
  videos: ProcessedVideo[];
  onSelectVideo: (video: ProcessedVideo) => void;
  onOpenNewModal: () => void;
  onDeleteVideo: (id: string) => void;
}

export const VideoDashboard: React.FC<VideoDashboardProps> = ({
  videos,
  onSelectVideo,
  onOpenNewModal,
  onDeleteVideo,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'scheduled' | 'published'>('all');

  const filteredVideos = videos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || video.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const avgCTR = videos.length > 0
    ? (videos.reduce((acc, v) => acc + (v.titles[v.selectedTitleIndex]?.score || 8), 0) / videos.length).toFixed(1)
    : '9.4';

  const scheduledCount = videos.filter((v) => v.status === 'scheduled').length;
  const publishedCount = videos.filter((v) => v.status === 'published').length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20">
            <Youtube className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Videos Procesados</p>
            <p className="text-xl font-extrabold text-white">{videos.length}</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Score CTR Medio</p>
            <p className="text-xl font-extrabold text-white">{avgCTR} <span className="text-xs font-normal text-slate-400">/ 10</span></p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Tiempo Ahorrado</p>
            <p className="text-xl font-extrabold text-white">{videos.length * 4.5} hrs</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center space-x-3.5">
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-xl border border-sky-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Publicaciones</p>
            <p className="text-xl font-extrabold text-white">{publishedCount} <span className="text-xs text-slate-400 font-normal">({scheduledCount} prog.)</span></p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título o palabra clave en transcripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto overflow-x-auto text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterStatus === 'all'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos ({videos.length})
          </button>
          <button
            onClick={() => setFilterStatus('draft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterStatus === 'draft'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Borradores
          </button>
          <button
            onClick={() => setFilterStatus('scheduled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterStatus === 'scheduled'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Programados
          </button>
          <button
            onClick={() => setFilterStatus('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filterStatus === 'published'
                ? 'bg-slate-800 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Publicados
          </button>
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20">
            <Youtube className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-white">No hay videos procesados</h3>
            <p className="text-xs text-slate-400">
              Pega la transcripción de tu primer video para que la IA genere títulos con Score CTR, descripción SEO, miniaturas e ideas de publicación.
            </p>
          </div>
          <button
            onClick={onOpenNewModal}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-red-600/25 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Procesar Mi Primer Video</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVideos.map((video) => {
            const selectedTitleObj = video.titles[video.selectedTitleIndex] || video.titles[0];
            const selectedThumbObj = video.thumbnailIdeas[video.selectedThumbnailIndex] || video.thumbnailIdeas[0];

            return (
              <div
                key={video.id}
                onClick={() => onSelectVideo(video)}
                className="bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-200 cursor-pointer shadow-lg hover:shadow-red-900/10 hover:-translate-y-0.5"
              >
                <div>
                  {/* Thumbnail Preview Header */}
                  <div className="relative aspect-video bg-slate-950 overflow-hidden border-b border-slate-800">
                    {selectedThumbObj?.generatedImageUrl ? (
                      <img
                        src={selectedThumbObj.generatedImageUrl}
                        alt={selectedTitleObj?.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                        <Play className="w-10 h-10 text-red-500/40 mb-2" />
                        <span className="text-xs font-bold text-slate-300 line-clamp-1">{selectedThumbObj?.concept || 'Miniatura IA'}</span>
                        <span className="text-[10px] text-slate-500 mt-1">{selectedThumbObj?.style}</span>
                      </div>
                    )}

                    {/* CTR Score Badge */}
                    <div className="absolute top-2.5 right-2.5 bg-slate-950/90 backdrop-blur-md border border-amber-400/40 text-amber-300 font-extrabold text-xs px-2.5 py-1 rounded-lg flex items-center space-x-1 shadow-lg">
                      <Zap className="w-3 h-3 fill-current" />
                      <span>CTR {selectedTitleObj?.score || 9.0}/10</span>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      {video.status === 'published' && (
                        <span className="bg-emerald-500/90 text-white font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow">
                          Publicado
                        </span>
                      )}
                      {video.status === 'scheduled' && (
                        <span className="bg-sky-500/90 text-white font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow">
                          Programado
                        </span>
                      )}
                      {video.status === 'draft' && (
                        <span className="bg-slate-800/90 text-slate-300 font-bold text-[10px] px-2 py-0.5 rounded-md uppercase tracking-wider border border-slate-700 shadow">
                          Borrador
                        </span>
                      )}
                    </div>

                    {/* Overlay Text badge on Image */}
                    {selectedThumbObj?.customOverlayText && (
                      <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm border border-amber-400/50 text-amber-300 font-extrabold text-[11px] px-2 py-0.5 text-center uppercase tracking-wider rounded">
                        {selectedThumbObj.customOverlayText}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                      {selectedTitleObj?.title || video.title}
                    </h3>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>

                    <div className="flex items-center flex-wrap gap-1.5 pt-1">
                      {video.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                          #{tag}
                        </span>
                      ))}
                      {video.tags.length > 3 && (
                        <span className="text-[10px] text-slate-500">+{video.tags.length - 3} más</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 pt-0 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    {new Date(video.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteVideo(video.id);
                      }}
                      className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVideo(video);
                      }}
                      className="flex items-center space-x-1 text-red-400 hover:text-red-300 font-semibold"
                    >
                      <span>Ver Panel</span>
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
