import { ProcessedVideo, ChannelAnalytics, TrendTopic, VideoIdea } from '../types';
import { INITIAL_PROCESSED_VIDEOS, INITIAL_CHANNEL_ANALYTICS, INITIAL_TRENDS, INITIAL_IDEAS } from '../data/mockData';

const STORAGE_KEYS = {
  VIDEOS: 'youassistant_processed_videos_v1',
  ANALYTICS: 'youassistant_channel_analytics_v1',
  TRENDS: 'youassistant_trends_v1',
  IDEAS: 'youassistant_ideas_v1',
};

export function getSavedVideos(): ProcessedVideo[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.VIDEOS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(INITIAL_PROCESSED_VIDEOS));
      return INITIAL_PROCESSED_VIDEOS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading videos from storage:', e);
    return INITIAL_PROCESSED_VIDEOS;
  }
}

export function saveVideos(videos: ProcessedVideo[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  } catch (e) {
    console.error('Error saving videos to storage:', e);
  }
}

export function saveSingleVideo(video: ProcessedVideo): ProcessedVideo[] {
  const current = getSavedVideos();
  const index = current.findIndex((v) => v.id === video.id);
  let updated: ProcessedVideo[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = video;
  } else {
    updated = [video, ...current];
  }
  saveVideos(updated);
  return updated;
}

export function deleteVideo(id: string): ProcessedVideo[] {
  const current = getSavedVideos();
  const updated = current.filter((v) => v.id !== id);
  saveVideos(updated);
  return updated;
}

export function getChannelAnalytics(): ChannelAnalytics {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    if (!data) return INITIAL_CHANNEL_ANALYTICS;
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_CHANNEL_ANALYTICS;
  }
}

export function getSavedTrends(): TrendTopic[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TRENDS);
    if (!data) return INITIAL_TRENDS;
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_TRENDS;
  }
}

export function saveTrends(trends: TrendTopic[]): void {
  localStorage.setItem(STORAGE_KEYS.TRENDS, JSON.stringify(trends));
}

export function getSavedIdeas(): VideoIdea[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.IDEAS);
    if (!data) return INITIAL_IDEAS;
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_IDEAS;
  }
}

export function saveIdeas(ideas: VideoIdea[]): void {
  localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
}
