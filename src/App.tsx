import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VideoDashboard } from './components/VideoDashboard';
import { NewVideoProcessorModal } from './components/NewVideoProcessorModal';
import { VideoWorkspaceModal } from './components/VideoWorkspaceModal';
import { ChannelAnalyticsView } from './components/ChannelAnalyticsView';
import { VideoIdeasView } from './components/VideoIdeasView';
import { TrendsResearchView } from './components/TrendsResearchView';
import { ContentCalendarView } from './components/ContentCalendarView';
import { ScriptGeneratorView } from './components/ScriptGeneratorView';

import { ProcessedVideo, ChannelAnalytics, TrendTopic, VideoIdea } from './types';
import {
  getSavedVideos,
  saveVideos,
  saveSingleVideo,
  deleteVideo,
  getChannelAnalytics,
  getSavedTrends,
  saveTrends,
  getSavedIdeas,
  saveIdeas,
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'ideas' | 'trends' | 'calendar' | 'script'>('dashboard');
  
  // Persistent States
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);
  const [analytics, setAnalytics] = useState<ChannelAnalytics>(getChannelAnalytics());
  const [trends, setTrends] = useState<TrendTopic[]>([]);
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);

  // Modals States
  const [isNewVideoModalOpen, setIsNewVideoModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<ProcessedVideo | null>(null);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [scriptTopicInput, setScriptTopicInput] = useState<string>('');

  useEffect(() => {
    setVideos(getSavedVideos());
    setTrends(getSavedTrends());
    setIdeas(getSavedIdeas());
  }, []);

  const handleVideoProcessedSuccess = (newVideo: ProcessedVideo) => {
    const updated = saveSingleVideo(newVideo);
    setVideos(updated);
    setSelectedVideo(newVideo);
    setIsWorkspaceOpen(true);
  };

  const handleSaveVideo = (updatedVideo: ProcessedVideo) => {
    const updated = saveSingleVideo(updatedVideo);
    setVideos(updated);
    setSelectedVideo(null);
  };

  const handleDeleteVideo = (id: string) => {
    const updated = deleteVideo(id);
    setVideos(updated);
    if (selectedVideo?.id === id) {
      setSelectedVideo(null);
      setIsWorkspaceOpen(false);
    }
  };

  const handleAddIdea = (newIdea: VideoIdea) => {
    const updated = [newIdea, ...ideas];
    setIdeas(updated);
    saveIdeas(updated);
  };

  const handleAddTrend = (newTrend: TrendTopic) => {
    const updated = [newTrend, ...trends];
    setTrends(updated);
    saveTrends(updated);
  };

  const handleCreateScriptFromIdeaOrTrend = (topicTitle: string) => {
    setScriptTopicInput(topicTitle);
    setActiveTab('script');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-red-600 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewVideoModal={() => setIsNewVideoModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <VideoDashboard
            videos={videos}
            onSelectVideo={(vid) => {
              setSelectedVideo(vid);
              setIsWorkspaceOpen(true);
            }}
            onOpenNewModal={() => setIsNewVideoModalOpen(true)}
            onDeleteVideo={handleDeleteVideo}
          />
        )}

        {activeTab === 'analytics' && (
          <ChannelAnalyticsView analytics={analytics} />
        )}

        {activeTab === 'ideas' && (
          <VideoIdeasView
            ideas={ideas}
            onAddIdea={handleAddIdea}
            onCreateScriptFromIdea={handleCreateScriptFromIdeaOrTrend}
          />
        )}

        {activeTab === 'trends' && (
          <TrendsResearchView
            trends={trends}
            onAddTrend={handleAddTrend}
            onCreateVideoFromTrend={(title) => {
              setScriptTopicInput(title);
              setIsNewVideoModalOpen(true);
            }}
          />
        )}

        {activeTab === 'calendar' && (
          <ContentCalendarView
            videos={videos}
            onSelectVideo={(vid) => {
              setSelectedVideo(vid);
              setIsWorkspaceOpen(true);
            }}
            onOpenNewModal={() => setIsNewVideoModalOpen(true)}
          />
        )}

        {activeTab === 'script' && (
          <ScriptGeneratorView initialTopic={scriptTopicInput} />
        )}
      </main>

      {/* New Video Processor Modal */}
      <NewVideoProcessorModal
        isOpen={isNewVideoModalOpen}
        onClose={() => setIsNewVideoModalOpen(false)}
        onSuccess={handleVideoProcessedSuccess}
      />

      {/* Video Workspace Detail Modal */}
      <VideoWorkspaceModal
        video={selectedVideo}
        isOpen={isWorkspaceOpen}
        onClose={() => setIsWorkspaceOpen(false)}
        onSave={handleSaveVideo}
      />
    </div>
  );
}
