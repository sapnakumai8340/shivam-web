import { useEffect, useState, useCallback } from 'react';
import {
  AthleteProfile,
  BiomechanicalScan,
  FixtureSchedule,
  SocialPost,
  PlayerStory,
  FollowerNotification,
  SquadPlayerTelemetry
} from '../types';
import {
  createRealtimeAthlete,
  createRealtimeScans,
  createRealtimeFixtures,
  createRealtimeSocialPosts,
  createRealtimeStories,
  createRealtimeNotifications
} from './realtimeData';

const STORAGE_KEYS = {
  ATHLETE: 'apex_realtime_athlete_v2',
  SCANS: 'apex_realtime_scans_v2',
  FIXTURES: 'apex_realtime_fixtures_v3',
  POSTS: 'apex_realtime_posts_v2',
  STORIES: 'apex_realtime_stories_v2',
  NOTIFICATIONS: 'apex_realtime_notifs_v2',
  COMMUNITY_ATHLETES: 'apex_realtime_community_v2',
  LIVE_SESSION: 'apex_realtime_live_session',
};

// Safe LocalStorage Reader
function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Failed to parse localStorage for ${key}`, e);
    return fallback;
  }
}

// Safe LocalStorage Writer
function saveStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(` to save to localStorage for ${key}`, e);
  }
}

export function getInitialRealtimeState() {
  const initialAthlete = createRealtimeAthlete();
  const athlete = loadStorage<AthleteProfile>(STORAGE_KEYS.ATHLETE, initialAthlete);
  const scans = loadStorage<BiomechanicalScan[]>(STORAGE_KEYS.SCANS, createRealtimeScans());
  const fixtures = loadStorage<FixtureSchedule[]>(STORAGE_KEYS.FIXTURES, createRealtimeFixtures());
  const posts = loadStorage<SocialPost[]>(STORAGE_KEYS.POSTS, createRealtimeSocialPosts(athlete));
  const stories = loadStorage<PlayerStory[]>(STORAGE_KEYS.STORIES, createRealtimeStories(athlete));
  const notifications = loadStorage<FollowerNotification[]>(STORAGE_KEYS.NOTIFICATIONS, createRealtimeNotifications());

  const communityAthletes: Record<string, AthleteProfile> = {
    [athlete.id]: athlete,
  };

  const loadedCommunity = loadStorage(STORAGE_KEYS.COMMUNITY_ATHLETES, communityAthletes);

  return {
    athlete,
    scans,
    fixtures,
    posts,
    stories,
    notifications,
    followerNotifications: notifications,
    communityAthletes: loadedCommunity,
  };
}

export function persistRealtimeState(state: {
  athlete: AthleteProfile;
  scans?: BiomechanicalScan[];
  fixtures?: FixtureSchedule[];
  posts?: SocialPost[];
  stories?: PlayerStory[];
  notifications?: FollowerNotification[];
  followerNotifications?: FollowerNotification[];
  communityAthletes?: Record<string, AthleteProfile>;
}) {
  if (state.athlete) saveStorage(STORAGE_KEYS.ATHLETE, state.athlete);
  if (state.scans) saveStorage(STORAGE_KEYS.SCANS, state.scans);
  if (state.fixtures) saveStorage(STORAGE_KEYS.FIXTURES, state.fixtures);
  if (state.posts) saveStorage(STORAGE_KEYS.POSTS, state.posts);
  if (state.stories) saveStorage(STORAGE_KEYS.STORIES, state.stories);
  if (state.followerNotifications) saveStorage(STORAGE_KEYS.NOTIFICATIONS, state.followerNotifications);
  else if (state.notifications) saveStorage(STORAGE_KEYS.NOTIFICATIONS, state.notifications);
  if (state.communityAthletes) saveStorage(STORAGE_KEYS.COMMUNITY_ATHLETES, state.communityAthletes);
}

// Live Biometric Telemetry Stream Data Type
export interface LiveTelemetrySnapshot {
  heartRate: number;
  heartRateTrend: 'rising' | 'stable' | 'dropping';
  currentSpeed: number; // km/h
  speedDelta: number; // acceleration m/s²
  cadenceRpm: number;
  pitchX: number; // 0-100% position on tactical pitch
  pitchY: number; // 0-100% position on tactical pitch
  hrvMs: number;
  groundForceLeft: number;
  groundForceRight: number;
  bilateralSymmetry: number;
  kneeTorqueNm: number;
  activeSessionDurationSec: number;
  isSessionActive: boolean;
  intensityZone: 'Recovery (Z1)' | 'Aerobic (Z2)' | 'Tempo (Z3)' | 'Threshold (Z4)' | 'Neuromuscular Peak (Z5)';
  acwrLive: number;
  fatigueIndex: number;
}

