import { 
  AthleteProfile, 
  BiomechanicalScan, 
  FixtureSchedule, 
  SocialPost, 
  PlayerStory, 
  FollowerNotification,
  ChatMessage,
  SquadPlayerTelemetry,
  TelemetryDataPoint
} from '../types';
import { formatExactUploadTime, formatRelativeTime } from './timeUtils';

// Helper to get formatted date string for dynamic relative days
export function getRelativeDateString(daysAgo: number): string {
  const d = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}

export function getUpcomingDateString(daysAhead: number, timeStr: string = '19:30'): string {
  const d = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(d);
  const monthDay = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d);
  return `${weekday}, ${monthDay} • ${timeStr}`;
}

export function getPastMonthNames(count: number = 6): { month: string; rating: number; note: string }[] {
  const months: { month: string; rating: number; note: string }[] = [];
  const baseRatings = [80.0, 82.0, 84.5, 86.0, 88.0, 90.0];

  for (let i = count - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const mName = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    months.push({
      month: mName,
      rating: baseRatings[count - 1 - i] || 85.0,
      note: 'Standard biometric evaluation baseline',
    });
  }
  return months;
}

// Generate Clean Default Athlete Profile Template (Used before first login / registration)
export function createRealtimeAthlete(): AthleteProfile {
  return {
    id: 'GUEST-001',
    name: 'NEW ATHLETE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    actionImage: '',
    code: '#ATH-001',
    position: 'FWD',
    role: 'STRIKER',
    number: 10,
    sportSpecialty: 'Football',
    status: 'ACTIVE',
    overallRating: 85.0,
    ratingChange: 0.0,
    height: "178 cm",
    weight: '72 kg',
    preferredFoot: 'Right',
    age: 20,
    club: 'Kheltantra Athletes FC',
    handle: '@new_athlete',
    followersCount: 0,
    followingCount: 0,
    postsCount: 0,
    isFollowing: false,
    bio: 'Create an account or sign in to start recording your biometric telemetry, uploading match reels, and tracking performance.',
    stats: {
      games: 0,
      goals: 0,
      assists: 0,
      topSpeed: 0,
      passAccuracy: 0,
      shotConversion: 0,
      stamina: 85,
      symmetry: 100,
      injuryRisk: 'LOW',
      acwr: 1.0,
      forceBalance: {
        left: 50,
        right: 50,
      },
    },
    recentMatches: [],
    ratingHistory: getPastMonthNames(6),
    highlights: [],
    tapes: [],
  };
}

// Scans: Empty by default (Populated when user performs a real scan)
export function createRealtimeScans(): BiomechanicalScan[] {
  return [];
}

// Match Fixtures: Empty by default (Created & Managed by Admin)
export function createRealtimeFixtures(): FixtureSchedule[] {
  return [];
}

// Social Posts: Empty by default (Created by real users via database)
export function createRealtimeSocialPosts(currentAthlete: AthleteProfile): SocialPost[] {
  return [];
}

// Stories: Empty by default
export function createRealtimeStories(currentAthlete: AthleteProfile): PlayerStory[] {
  return [];
}

// Follower Notifications: Empty by default
export function createRealtimeNotifications(): FollowerNotification[] {
  return [];
}

// Squad Telemetry Roster: Empty by default (Populated from real registered accounts)
export const REALTIME_SQUAD_ROSTER: SquadPlayerTelemetry[] = [];

export const REALTIME_ASYMMETRY_DATA = [
  { muscleGroup: 'Quadriceps', leftPower: 95, rightPower: 95, target: 95, unit: '%' },
  { muscleGroup: 'Hamstrings', leftPower: 90, rightPower: 90, target: 90, unit: '%' },
  { muscleGroup: 'Adductors', leftPower: 90, rightPower: 90, target: 90, unit: '%' },
  { muscleGroup: 'Calves / Achilles', leftPower: 95, rightPower: 95, target: 95, unit: '%' },
  { muscleGroup: 'Gluteus Medius', leftPower: 92, rightPower: 92, target: 92, unit: '%' },
  { muscleGroup: 'Core Rotators', leftPower: 95, rightPower: 95, target: 95, unit: '%' },
];

export const REALTIME_WORKLOAD_7DAYS = [
  { day: 'Mon', acuteLoad: 600, chronicLoad: 600, readiness: 95, highSpeedM: 700 },
  { day: 'Tue', acuteLoad: 750, chronicLoad: 650, readiness: 92, highSpeedM: 850 },
  { day: 'Wed', acuteLoad: 400, chronicLoad: 600, readiness: 96, highSpeedM: 300 },
  { day: 'Thu', acuteLoad: 800, chronicLoad: 650, readiness: 90, highSpeedM: 900 },
  { day: 'Fri', acuteLoad: 300, chronicLoad: 620, readiness: 98, highSpeedM: 200 },
  { day: 'Sat', acuteLoad: 950, chronicLoad: 700, readiness: 94, highSpeedM: 1000 },
  { day: 'Sun', acuteLoad: 200, chronicLoad: 650, readiness: 99, highSpeedM: 80 },
];
