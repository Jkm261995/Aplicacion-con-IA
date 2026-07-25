import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Check,
  Copy,
  Edit3,
  Image as ImageIcon,
  Tag,
  Share2,
  FileText,
  Save,
  Calendar,
  Zap,
  Download,
  Loader2,
  CheckCircle2,
  ListOrdered,
  Eye,
  Sliders,
  Wand2,
  Flame,
  DollarSign,
  HelpCircle,
  Search,
  Plus,
  RefreshCw,
  LayoutGrid,
  Sparkle,
} from 'lucide-react';
import { ProcessedVideo, ThumbnailIdea, TitleOption } from '../types';

interface VideoWorkspaceModalProps {
  video: ProcessedVideo | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedVideo: ProcessedVideo) => void;
}

const VIRAL_ARCHETYPES = [
  {
    id: 'income_proof',
    name: '💰 Prueba de Ingresos ($/Día)',
    tag: 'Estilo Nano Banana Finanzas',
    description: 'Sujeto principal ocupando 40% del frame con cara de asombro, cifra gigante ($3,100/MES), flecha roja neón y gráfica ascendente.',
    defaultOverlay: '$3,100/MES',
    promptTemplate: 'Nano Banana high-CTR YouTube thumbnail, advertising composition, single clear focal point. Expressive creator occupying 40% of the 16:9 frame pointing excitedly at a laptop with a glowing green text reading "$3,100/MES", big red neon arrow pointing to a rising chart, simple dark studio background with rim lighting and clean space for text.',
  },
  {
    id: 'mrbeast_vs',
    name: '🏆 MrBeast $1 vs $10,000,000',
    tag: 'Comparación Extrema CTR',
    description: 'Pantalla dividida publicitaria, sujeto al centro con cara de asombro (40% del frame), 2 lados con colores vibrantes.',
    defaultOverlay: '$1 vs $10,000,000',
    promptTemplate: 'Nano Banana viral YouTube thumbnail, advertising composition split in two contrasting halves, subject in center with shocked exaggerated facial expression occupying 40% of the image, left side budget setup, right side ultra-luxury setup, dramatic studio rim light, clean text overlay space.',
  },
  {
    id: 'curiosity_shh',
    name: '🤫 Secreto / Gesto "Shh!"',
    tag: 'Curiosidad Nano Banana',
    description: 'Primer plano del sujeto (45% del frame) haciendo el gesto de silencio "Shh!", iluminación de estudio dramática y misterio.',
    defaultOverlay: 'NO ES COMO CREES',
    promptTemplate: 'Nano Banana high-CTR thumbnail, advertising visual composition. Close-up portrait of a person making a "shh" secret gesture with finger on lips occupying 45% of 16:9 frame, exaggerated intrigue expression, dark blurred background with glowing caution badge and clean space for text.',
  },
  {
    id: '3d_challenge',
    name: '🚀 Reto 3D / Aventura',
    tag: 'Reto Virales 3D',
    description: 'Sujeto hiper-expresivo con objetos 3D renderizados flotando, luz neón de borde (rim light) y fondo desenfocado.',
    defaultOverlay: 'PROBÉ ESTO 7 DÍAS',
    promptTemplate: 'Nano Banana 16:9 viral thumbnail, 3D floating glowing icons, hyper-expressive subject looking at camera in awe occupying 40% of frame, advertising lighting with cyan and magenta rim light, shallow depth background, clean space for text.',
  },
];

export const VideoWorkspaceModal: React.FC<VideoWorkspaceModalProps> = ({
  video,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen || !video) return null;

  const [activeTab, setActiveTab] = useState<'titles' | 'description' | 'thumbnails' | 'tags' | 'social' | 'script'>('titles');
  const [editedVideo, setEditedVideo] = useState<ProcessedVideo>({ ...video });
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [generatingImageIndex, setGeneratingImageIndex] = useState<number | null>(null);
  const [isGeneratingMoreTitles, setIsGeneratingMoreTitles] = useState(false);
  const [selectedTitleCategory, setSelectedTitleCategory] = useState<'all' | 'curiosity' | 'income_value' | 'challenge' | 'search_seo'>('all');
  const [newTagInput, setNewTagInput] = useState('');

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleTitleTextChange = (index: number, newTitle: string) => {
    const updatedTitles = [...editedVideo.titles];
    updatedTitles[index] = { ...updatedTitles[index], title: newTitle };
    setEditedVideo({
      ...editedVideo,
      titles: updatedTitles,
      title: index === editedVideo.selectedTitleIndex ? newTitle : editedVideo.title,
    });
  };

  const handleSelectTitle = (index: number) => {
    setEditedVideo({
      ...editedVideo,
      selectedTitleIndex: index,
      title: editedVideo.titles[index]?.title || editedVideo.title,
    });
  };

  const handleGenerateMoreTitles = async () => {
    setIsGeneratingMoreTitles(true);
    try {
      const res = await fetch('/api/generate-more-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentTitle: editedVideo.title,
          transcript: editedVideo.rawTranscript,
          category: selectedTitleCategory !== 'all' ? selectedTitleCategory : undefined,
        }),
      });

      const data = await res.json();
      if (data.titles && Array.isArray(data.titles)) {
        setEditedVideo({
          ...editedVideo,
          titles: [...editedVideo.titles, ...data.titles],
        });
      }
    } catch (err) {
      console.error('Error generating more titles:', err);
    } finally {
      setIsGeneratingMoreTitles(false);
    }
  };

  const handleGenerateThumbnailImage = async (index: number) => {
    const idea = editedVideo.thumbnailIdeas[index];
    if (!idea) return;

    setGeneratingImageIndex(index);
    try {
      const promptToUse = idea.customPrompt || `${idea.concept}. ${idea.visualElements}`;
      const res = await fetch('/api/generate-thumbnail-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptToUse,
          customPrompt: idea.customPrompt,
          style: idea.style,
          overlayText: idea.customOverlayText,
          archetype: idea.archetype,
        }),
      });

      const data = await res.json();
      if (data.imageUrl) {
        const updatedIdeas = [...editedVideo.thumbnailIdeas];
        updatedIdeas[index] = { ...updatedIdeas[index], generatedImageUrl: data.imageUrl };
        setEditedVideo({ ...editedVideo, thumbnailIdeas: updatedIdeas });
      }
    } catch (err) {
      console.error('Error generating thumbnail:', err);
    } finally {
      setGeneratingImageIndex(null);
    }
  };

  const handleApplyArchetypeToIdea = (index: number, archetype: typeof VIRAL_ARCHETYPES[0]) => {
    const updatedIdeas = [...editedVideo.thumbnailIdeas];
    updatedIdeas[index] = {
      ...updatedIdeas[index],
      archetype: archetype.name,
      customOverlayText: archetype.defaultOverlay,
      customPrompt: archetype.promptTemplate,
    };
    setEditedVideo({ ...editedVideo, thumbnailIdeas: updatedIdeas });
  };

  const handleAddCustomThumbnailCard = (archetype?: typeof VIRAL_ARCHETYPES[0]) => {
    const newIdea: ThumbnailIdea = {
      id: `thumb-custom-${Date.now()}`,
      concept: archetype ? archetype.name : 'Miniatura Personalizada Virales',
      archetype: archetype ? archetype.name : 'Concepto Personalizado',
      style: 'Fotorrealista de alto impacto',
      colors: 'Rojo, Amarillo y Negro de alto contraste',
      visualElements: archetype ? archetype.description : 'Sujeto expresivo con texto en negrita',
      emotion: 'Intriga y curiosidad',
      customOverlayText: archetype ? archetype.defaultOverlay : 'NUEVO VIDEO',
      customPrompt: archetype ? archetype.promptTemplate : 'High contrast YouTube thumbnail, 16:9, expressive subject, bold neon overlay, dark studio lighting',
    };
    setEditedVideo({
      ...editedVideo,
      thumbnailIdeas: [...editedVideo.thumbnailIdeas, newIdea],
    });
  };

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const clean = newTagInput.trim().toLowerCase();
    if (!editedVideo.tags.includes(clean)) {
      setEditedVideo({ ...editedVideo, tags: [...editedVideo.tags, clean] });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedVideo({
      ...editedVideo,
      tags: editedVideo.tags.filter((t) => t !== tagToRemove),
    });
  };

  const handleSaveAndClose = () => {
    onSave(editedVideo);
    onClose();
  };

  const currentSelectedTitle = editedVideo.titles[editedVideo.selectedTitleIndex] || editedVideo.titles[0];

  const filteredTitles = editedVideo.titles.filter((t) => {
    if (selectedTitleCategory === 'all') return true;
    return t.category === selectedTitleCategory;
  });

  const getCategoryBadge = (category?: string) => {
    switch (category) {
      case 'curiosity':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">⚡ Curiosidad</span>;
      case 'income_value':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">💰 Ingresos / Valor</span>;
      case 'challenge':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">🔥 Reto Virales</span>;
      case 'search_seo':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">🔍 Búsqueda SEO</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">🔥 Viral Hook</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Workspace Top Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Panel de Video
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400">
                  {new Date(editedVideo.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white truncate max-w-xl">
                {editedVideo.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {/* Status Select */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Estado:</span>
              <select
                value={editedVideo.status}
                onChange={(e) => setEditedVideo({ ...editedVideo, status: e.target.value as any })}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
              >
                <option value="draft" className="bg-slate-900">Borrador</option>
                <option value="scheduled" className="bg-slate-900">Programado</option>
                <option value="published" className="bg-slate-900">Publicado</option>
              </select>
            </div>

            <button
              onClick={handleSaveAndClose}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium text-xs px-4 py-2 rounded-xl shadow-lg shadow-red-600/30 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Guardar</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1 px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setActiveTab('titles')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'titles'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Títulos SEO & CTR ({editedVideo.titles.length})</span>
            {currentSelectedTitle && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-amber-400/20 text-amber-300 font-bold rounded">
                Score {currentSelectedTitle.score}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('thumbnails')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'thumbnails'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Miniaturas Virales IA ({editedVideo.thumbnailIdeas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('description')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'description'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Descripción SEO</span>
          </button>

          <button
            onClick={() => setActiveTab('tags')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'tags'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Etiquetas ({editedVideo.tags.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              activeTab === 'social'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Redes Sociales</span>
          </button>

          {editedVideo.script && (
            <button
              onClick={() => setActiveTab('script')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                activeTab === 'script'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>Guión de Video</span>
            </button>
          )}
        </div>

        {/* Tab Contents Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: TITLES & SCORE */}
          {activeTab === 'titles' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>Sugerencias de Títulos Virales & SEO (CTR Score)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Selecciona o edita el título principal. Filtra por tipo de gancho o genera más opciones con IA.
                  </p>
                </div>

                <button
                  onClick={handleGenerateMoreTitles}
                  disabled={isGeneratingMoreTitles}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-semibold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all disabled:opacity-50 shrink-0"
                >
                  {isGeneratingMoreTitles ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>Generando Virales...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Generar Más Títulos SEO (+5)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setSelectedTitleCategory('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedTitleCategory === 'all'
                      ? 'bg-slate-100 text-slate-900 font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  Todos ({editedVideo.titles.length})
                </button>
                <button
                  onClick={() => setSelectedTitleCategory('curiosity')}
                  className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1 transition-all ${
                    selectedTitleCategory === 'curiosity'
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-slate-950 text-purple-300/80 border border-purple-500/20 hover:bg-purple-500/10'
                  }`}
                >
                  <span>⚡ Curiosidad</span>
                </button>
                <button
                  onClick={() => setSelectedTitleCategory('income_value')}
                  className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1 transition-all ${
                    selectedTitleCategory === 'income_value'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-950 text-emerald-300/80 border border-emerald-500/20 hover:bg-emerald-500/10'
                  }`}
                >
                  <span>💰 Ingresos & Valor</span>
                </button>
                <button
                  onClick={() => setSelectedTitleCategory('challenge')}
                  className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1 transition-all ${
                    selectedTitleCategory === 'challenge'
                      ? 'bg-rose-600 text-white font-bold'
                      : 'bg-slate-950 text-rose-300/80 border border-rose-500/20 hover:bg-rose-500/10'
                  }`}
                >
                  <span>🔥 Reto Virales</span>
                </button>
                <button
                  onClick={() => setSelectedTitleCategory('search_seo')}
                  className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1 transition-all ${
                    selectedTitleCategory === 'search_seo'
                      ? 'bg-sky-600 text-white font-bold'
                      : 'bg-slate-950 text-sky-300/80 border border-sky-500/20 hover:bg-sky-500/10'
                  }`}
                >
                  <span>🔍 Búsqueda SEO</span>
                </button>
              </div>

              {/* Titles List */}
              <div className="space-y-3">
                {filteredTitles.map((t, idx) => {
                  const originalIndex = editedVideo.titles.findIndex((titleObj) => titleObj.title === t.title);
                  const isSelected = editedVideo.selectedTitleIndex === originalIndex;

                  return (
                    <div
                      key={originalIndex >= 0 ? originalIndex : idx}
                      onClick={() => handleSelectTitle(originalIndex >= 0 ? originalIndex : 0)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red-500/10 border-red-500/50 ring-1 ring-red-500/30 shadow-lg shadow-red-950/20'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-3 flex-1">
                          <input
                            type="radio"
                            name="selectedTitle"
                            checked={isSelected}
                            onChange={() => handleSelectTitle(originalIndex >= 0 ? originalIndex : 0)}
                            className="mt-1.5 accent-red-500"
                          />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2 flex-wrap gap-1">
                              {getCategoryBadge(t.category)}
                              {isSelected && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white">
                                  ✓ Título Activo
                                </span>
                              )}
                            </div>

                            <input
                              type="text"
                              value={t.title}
                              onChange={(e) => handleTitleTextChange(originalIndex, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-sm font-semibold text-white focus:outline-none focus:border-red-500"
                            />
                            <p className="text-xs text-slate-400 leading-relaxed italic">
                              "{t.reasoning}"
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 ${
                            t.score >= 9.0
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : t.score >= 8.0
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}>
                            <Zap className="w-3 h-3 fill-current" />
                            <span>Score {t.score}/10</span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(t.title, `title-${idx}`);
                            }}
                            className="mt-2.5 text-[11px] text-slate-400 hover:text-white flex items-center space-x-1 px-2 py-1 bg-slate-900 rounded border border-slate-800"
                          >
                            {copiedSection === `title-${idx}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: THUMBNAILS & AI IMAGE GENERATION */}
          {activeTab === 'thumbnails' && (
            <div className="space-y-6">
              
              {/* Header & Description */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-red-500" />
                    <span>Estudio de Miniaturas Virales e Inteligencia Artificial</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Personaliza los resúmenes, textos superpuestos y prompts en inglés para generar imágenes en formato 16:9 con IA.
                  </p>
                </div>

                <button
                  onClick={() => handleAddCustomThumbnailCard()}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all shrink-0"
                >
                  <Plus className="w-4 h-4 text-red-400" />
                  <span>Agregar Otra Idea</span>
                </button>
              </div>

              {/* VIRAL REFERENCE ARCHETYPES BANNER */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <h4 className="text-xs font-bold text-slate-200">
                      Inspiraciones Virales (Prueba de Ingresos, MrBeast, Secreto & 3D)
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-500">Haz clic en un arquetipo para aplicarlo</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {VIRAL_ARCHETYPES.map((arch) => (
                    <div
                      key={arch.id}
                      className="p-3 bg-slate-900/90 border border-slate-800 hover:border-amber-400/50 rounded-xl transition-all group flex flex-col justify-between space-y-2 cursor-pointer"
                      onClick={() => handleAddCustomThumbnailCard(arch)}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                            {arch.tag}
                          </span>
                          <span className="text-[10px] bg-amber-400/10 text-amber-400 px-1.5 py-0.5 rounded font-mono font-bold">
                            CTR MAX
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                          {arch.name}
                        </h5>
                        <p className="text-[11px] text-slate-400 leading-normal line-clamp-2">
                          {arch.description}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddCustomThumbnailCard(arch);
                        }}
                        className="w-full text-center text-[11px] font-semibold text-amber-400 bg-amber-400/10 group-hover:bg-amber-400 group-hover:text-slate-950 py-1.5 rounded-lg transition-all flex items-center justify-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Crear Esta Miniatura</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* THUMBNAILS CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {editedVideo.thumbnailIdeas.map((idea, idx) => {
                  const isSelected = editedVideo.selectedThumbnailIndex === idx;
                  const isGenerating = generatingImageIndex === idx;

                  return (
                    <div
                      key={idea.id || idx}
                      className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between space-y-4 transition-all ${
                        isSelected
                          ? 'bg-red-500/10 border-red-500/50 ring-1 ring-red-500/30 shadow-xl'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-4">
                        
                        {/* Top Badge & Concept Title */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            {idea.archetype && (
                              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-amber-400/15 text-amber-300 border border-amber-400/30 mb-1">
                                Arquetipo: {idea.archetype}
                              </span>
                            )}
                            <h4 className="text-xs sm:text-sm font-bold text-white">
                              Concepto #{idx + 1}: {idea.concept}
                            </h4>
                          </div>

                          {isSelected && (
                            <span className="shrink-0 bg-red-600 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow">
                              ✓ Seleccionada
                            </span>
                          )}
                        </div>

                        {/* Thumbnail Image Preview Box */}
                        <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center group shadow-inner">
                          {idea.generatedImageUrl ? (
                            <img
                              src={idea.generatedImageUrl}
                              alt={idea.concept}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="text-center p-6 space-y-2">
                              <ImageIcon className="w-10 h-10 text-slate-600 mx-auto" />
                              <span className="text-xs text-slate-400 block font-medium">
                                Haz clic en "Generar Imagen con IA" para renderizar
                              </span>
                            </div>
                          )}

                          {/* Dynamic Text Overlay Badge on Image */}
                          {idea.customOverlayText && (
                            <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md border border-amber-400/60 text-amber-300 font-extrabold text-xs sm:text-sm px-3 py-1.5 text-center uppercase tracking-wider rounded-lg shadow-2xl">
                              {idea.customOverlayText}
                            </div>
                          )}
                        </div>

                        {/* Summary details */}
                        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                          <p><strong className="text-slate-400">Estilo:</strong> {idea.style}</p>
                          <p><strong className="text-slate-400">Colores:</strong> {idea.colors}</p>
                          <p><strong className="text-slate-400">Emoción:</strong> {idea.emotion}</p>
                        </div>

                        {/* Editable Overlay Text */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                            <span>Texto Superpuesto en la Imagen:</span>
                            <span className="text-[10px] text-slate-500">(Aparece sobre la miniatura)</span>
                          </label>
                          <input
                            type="text"
                            value={idea.customOverlayText || ''}
                            onChange={(e) => {
                              const updatedIdeas = [...editedVideo.thumbnailIdeas];
                              updatedIdeas[idx] = { ...updatedIdeas[idx], customOverlayText: e.target.value };
                              setEditedVideo({ ...editedVideo, thumbnailIdeas: updatedIdeas });
                            }}
                            placeholder="Ej: $3,100/MES o NO ES COMO CREES"
                            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-amber-300 focus:outline-none focus:border-red-500 font-extrabold tracking-wide uppercase"
                          />
                        </div>

                        {/* Custom Prompt Field (User requested explicitly) */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-300 mb-1 flex items-center justify-between">
                            <span>Prompt Personalizado para la IA Imagen:</span>
                            <span className="text-[10px] text-amber-400/80">Puedes modificar las instrucciones</span>
                          </label>
                          <textarea
                            rows={3}
                            value={idea.customPrompt || `${idea.concept}. ${idea.visualElements}`}
                            onChange={(e) => {
                              const updatedIdeas = [...editedVideo.thumbnailIdeas];
                              updatedIdeas[idx] = { ...updatedIdeas[idx], customPrompt: e.target.value };
                              setEditedVideo({ ...editedVideo, thumbnailIdeas: updatedIdeas });
                            }}
                            placeholder="Escribe tu prompt detallado en inglés..."
                            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-red-500 font-mono leading-relaxed resize-none"
                          />
                        </div>

                        {/* Quick Presets Dropdown/Buttons */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-medium block">Aplicar Plantilla Viral a este card:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {VIRAL_ARCHETYPES.map((arch) => (
                              <button
                                key={arch.id}
                                onClick={() => handleApplyArchetypeToIdea(idx, arch)}
                                className="text-[10px] bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-300 px-2 py-1 rounded-md transition-colors"
                              >
                                {arch.name.split(' ')[0]} {arch.name.split(' ')[1]}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Card Buttons */}
                      <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleGenerateThumbnailImage(idx)}
                          disabled={isGenerating}
                          className="flex-1 flex items-center justify-center space-x-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50"
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin text-white" />
                              <span>Generando con Gemini IA...</span>
                            </>
                          ) : (
                            <>
                              <Wand2 className="w-4 h-4 text-amber-300" />
                              <span>Generar Imagen con IA</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => setEditedVideo({ ...editedVideo, selectedThumbnailIndex: idx })}
                          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                            isSelected
                              ? 'bg-emerald-600 text-white font-bold'
                              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                          }`}
                        >
                          {isSelected ? '✓ Elegida' : 'Seleccionar'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: YOUTUBE DESCRIPTION */}
          {activeTab === 'description' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Descripción Optimizada para YouTube</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Diseñada sin marcas de tiempo (timestamps) para máxima claridad y retención en el algoritmo.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(editedVideo.description, 'desc')}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs px-3.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
                >
                  {copiedSection === 'desc' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Descripción</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={16}
                  value={editedVideo.description}
                  onChange={(e) => setEditedVideo({ ...editedVideo, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-red-500 font-mono leading-relaxed resize-none"
                />
                <div className="flex justify-between text-xs text-slate-500 px-1">
                  <span>{editedVideo.description.length} / 5,000 caracteres</span>
                  <span>Sin timestamps incluidos</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TAGS & KEYWORDS */}
          {activeTab === 'tags' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Etiquetas (Tags) SEO para YouTube</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Lista optimizada para pegar directamente en la casilla de etiquetas de YouTube Studio.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(editedVideo.tags.join(', '), 'tags')}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs px-3.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
                >
                  {copiedSection === 'tags' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">¡Etiquetas Copiadas!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Formato YouTube Studio</span>
                    </>
                  )}
                </button>
              </div>

              {/* Add Tag Input */}
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Agregar nueva etiqueta..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={handleAddTag}
                  className="bg-red-600 hover:bg-red-500 text-white text-xs px-4 py-2 rounded-xl transition-colors font-medium"
                >
                  Agregar Tag
                </button>
              </div>

              {/* Tags Cloud */}
              <div className="flex flex-wrap gap-2 p-4 bg-slate-950/60 border border-slate-800 rounded-xl min-h-[140px]">
                {editedVideo.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="flex items-center space-x-1.5 bg-slate-800 text-slate-200 border border-slate-700/80 px-3 py-1 rounded-lg text-xs font-medium group hover:border-red-500/50 transition-all"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SOCIAL MEDIA ADAPTATIONS */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white">Adaptaciones para Redes Sociales</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Publicaciones listas para promocionar tu video de YouTube en X (Twitter), Instagram Reels y LinkedIn.
                </p>
              </div>

              {/* Twitter Thread */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-sky-400" />
                    <span>Hilo para Twitter / X</span>
                  </h4>
                  <button
                    onClick={() => copyToClipboard(editedVideo.socialPosts.twitterThread.join('\n\n'), 'twitter')}
                    className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar Hilo</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {editedVideo.socialPosts.twitterThread.map((tweet, idx) => (
                    <div key={idx} className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 font-mono border border-slate-800">
                      {tweet}
                    </div>
                  ))}
                </div>
              </div>

              {/* Instagram Reel Hook */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>Guion Corto para Reel / TikTok</span>
                  </h4>
                  <button
                    onClick={() => copyToClipboard(editedVideo.socialPosts.instagramReelHook, 'reel')}
                    className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 font-mono border border-slate-800">
                  {editedVideo.socialPosts.instagramReelHook}
                </div>
              </div>

              {/* LinkedIn Post */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Publicación Profesional para LinkedIn</span>
                  </h4>
                  <button
                    onClick={() => copyToClipboard(editedVideo.socialPosts.linkedInSummary, 'linkedin')}
                    className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </button>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 font-mono border border-slate-800 leading-relaxed">
                  {editedVideo.socialPosts.linkedInSummary}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FULL SCRIPT */}
          {activeTab === 'script' && editedVideo.script && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Guión Estructurado del Video</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Ganchos iniciales, indicación de notas de edición (B-Roll) y llamadas a la acción.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Hook (Primeros 10s)
                  </span>
                  <p className="text-xs text-slate-200 font-medium">{editedVideo.script.hook}</p>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">
                    Introducción
                  </span>
                  <p className="text-xs text-slate-200">{editedVideo.script.intro}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300">Puntos Clave del Video:</h4>
                  {editedVideo.script.bodyPoints.map((pt, idx) => (
                    <div key={idx} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                      <h5 className="text-xs font-bold text-white">
                        {idx + 1}. {pt.title}
                      </h5>
                      <p className="text-xs text-slate-300 leading-relaxed">{pt.text}</p>
                      <div className="p-2 bg-slate-900 rounded-lg text-[11px] text-amber-300 border border-amber-400/20 flex items-center space-x-2">
                        <Eye className="w-3.5 h-3.5 shrink-0" />
                        <span>Visual/B-Roll: {pt.visualCue}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Cierre y Llamado a la Acción (CTA)
                  </span>
                  <p className="text-xs text-slate-200">{editedVideo.script.cta}</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
