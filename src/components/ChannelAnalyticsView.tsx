import React from 'react';
import { ChannelAnalytics } from '../types';
import {
  Users,
  Eye,
  Zap,
  Clock,
  DollarSign,
  TrendingUp,
  BarChart2,
  Award,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

interface ChannelAnalyticsViewProps {
  analytics: ChannelAnalytics;
}

export const ChannelAnalyticsView: React.FC<ChannelAnalyticsViewProps> = ({ analytics }) => {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Métricas en Tiempo Real</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1">Análisis de Desempeño del Canal</h2>
          <p className="text-xs text-slate-400 mt-1">
            Datos consolidados del algoritmo de YouTube en los últimos 28 días
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px]">Estado del Canal</span>
            <span className="font-bold text-white">Salud Algorítmica: 98% (Optima)</span>
          </div>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Suscriptores</span>
            <Users className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            {analytics.subscribers.toLocaleString('es-ES')}
          </p>
          <p className="text-[11px] text-emerald-400 flex items-center font-medium">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            <span>+{analytics.subscriberGrowth}% este mes</span>
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Vistas (28 días)</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            {analytics.viewsLast28Days.toLocaleString('es-ES')}
          </p>
          <p className="text-[11px] text-emerald-400 flex items-center font-medium">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            <span>+{analytics.viewsGrowth}% vs mes previo</span>
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">CTR Promedio</span>
            <Zap className="w-4 h-4 text-amber-400 fill-current" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            {analytics.avgCTR}%
          </p>
          <p className="text-[11px] text-amber-300 font-medium">
            Top 5% de tu nicho
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Retención Media</span>
            <Clock className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            {analytics.avgRetention}
          </p>
          <p className="text-[11px] text-slate-400">
            ~6:12 minutos por video
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Ingresos Est.</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">
            ${analytics.estimatedRevenue.toLocaleString('es-ES')}
          </p>
          <p className="text-[11px] text-emerald-400 font-medium">
            RPM promedio: $5.57
          </p>
        </div>

      </div>

      {/* Activity Bar Chart & Top Videos Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Activity Breakdown */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-red-500" />
                <span>Actividad Semanal de Reproducciones y Suscriptores</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Mapeo de picos de tráfico en las últimas 7 jornadas</p>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 items-end h-44 pt-6 pb-2 border-b border-slate-800">
            {analytics.recentActivity.map((day, i) => {
              const maxViews = 25000;
              const heightPct = Math.round((day.views / maxViews) * 100);

              return (
                <div key={i} className="flex flex-col items-center h-full justify-end group">
                  <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-mono">
                    {(day.views / 1000).toFixed(1)}k
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-red-600 to-rose-400 rounded-t-lg group-hover:from-red-500 group-hover:to-rose-300 transition-all cursor-pointer"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[11px] font-semibold text-slate-400 mt-2">{day.date}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" />
              <span>Días pico: Viernes y Sábado (+42% interacción)</span>
            </span>
            <span className="text-emerald-400 font-medium">+1,955 nuevos suscriptores este período</span>
          </div>
        </div>

        {/* Top Videos Table */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Videos Más Virales</span>
            </h3>
          </div>

          <div className="space-y-3">
            {analytics.topPerformingVideos.map((vid, index) => (
              <div key={vid.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                    #{index + 1}
                  </span>
                  <p className="text-xs font-bold text-white line-clamp-1 flex-1">{vid.title}</p>
                </div>
                
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>{(vid.views / 1000).toFixed(0)}k vistas</span>
                  <span className="text-amber-300 font-semibold">CTR {vid.ctr}%</span>
                  <span className="text-slate-300">Retención {vid.retention}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recommendation Box */}
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1 text-xs">
            <span className="font-bold text-red-400 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagnóstico de IA YOUASSISTANT:</span>
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Tus videos con formato de experimento en 24h superan el CTR medio en +2.8%. Te recomendamos mantener miniaturas con fondos oscuros y texto neón amarillo.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
