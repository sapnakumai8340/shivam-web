export type UserRole = 'player' | 'coach' | 'admin';

export type ActiveScreen = 'home' | 'feed' | 'performance' | 'profile' | 'schedule' | 'records' | 'chatbot' | 'management' | 'courses' | 'video-review' | 'splash';

export type FeePaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';

export interface FeePaymentRecord {
  id: string;
  playerId: string;
  playerName: string;
  jerseyNumber?: number;
  phone?: string;
  amount: number;
  monthYear: string; // e.g. "August 2026", "July 2026"
  paidDate: string; // e.g. "14 Aug 2026"
  paymentMethod: 'UPI' | 'Cash' | 'Bank Transfer' | 'Card' | 'Cheque';
  receiptNo: string;
  status: FeePaymentStatus;
  notes?: string;
  collectorName?: string;
}

export interface PlayerManagementProfile {
  id: string;
  name: string;
  avatar?: string;
  jerseyNumber: number;
  position: string;
  sportSpecialty?: string;
  phone?: string;
  email?: string;
  guardianName?: string;
  guardianPhone?: string;
  joiningDate: string;
  monthlyFee: number;
  feeStatus: FeePaymentStatus;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  attendancePct: number;
  status: 'ACTIVE' | 'RESTING' | 'INJURED' | 'SUSPENDED';
  kitIssued?: {
    jerseySize?: string;
    bootSize?: string;
    kitBagAssigned?: boolean;
    ballAssigned?: boolean;
    shinGuards?: boolean;
    gripSocks?: boolean;
    gpsTrackerAssigned?: boolean;
    notes?: string;
  };
  medicalNotes?: string;
}

export interface EquipmentInventoryItem {
  id: string;
  name: string;
  category: 'BALLS' | 'GEAR' | 'FITNESS' | 'MEDICAL' | 'UNIFORMS';
  totalQuantity: number;
  inUseQuantity: number;
  condition: 'EXCELLENT' | 'GOOD' | 'NEEDS REPLACEMENT';
  assignedTo?: string;
}

export interface AdminDecision {
  evaluatedBy: string;
  decisionDate: string;
  clearanceStatus: 'MATCH READY' | 'RESTRICTED MINUTES' | 'MEDICAL CLEARANCE REQUIRED' | 'BENCH ROTATION';
  maxWorkloadM: number;
  targetPaceKmH: number;
  trainingFocus: string;
  notes: string;
  isVerified: boolean;
}

export interface AthleteProfile {
  id: string;
  name: string;
  avatar: string;
  actionImage: string;
  code: string;
  position: string;
  role: string;
  number: number;
  phone?: string;
  sportSpecialty?: string;
  status: 'ACTIVE' | 'RESTING' | 'INJURED' | 'RECOVERING';
  overallRating: number;
  ratingChange: number;
  height?: string;
  weight?: string;
  preferredFoot?: 'Right' | 'Left' | 'Both';
  age?: number;
  club?: string;
  bio?: string;
  handle?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isFollowing?: boolean;
  coachEvaluation?: string;
  adminDecision?: AdminDecision;
  kitIssued?: {
    jerseySize?: string;
    bootSize?: string;
    kitBagAssigned?: boolean;
    ballAssigned?: boolean;
    shinGuards?: boolean;
    gripSocks?: boolean;
    gpsTrackerAssigned?: boolean;
    notes?: string;
  };
  stats: {
    games: number;
    goals: number;
    assists: number;
    runs?: number;
    wickets?: number;
    points?: number;
    topSpeed: number; // km/h
    passAccuracy: number; // %
    shotConversion: number; // %
    stamina: number; // %
    symmetry: number; // %
    injuryRisk: 'LOW' | 'MODERATE' | 'ELEVATED';
    acwr?: number; // Acute:Chronic Workload Ratio
    forceBalance: {
      left: number;
      right: number;
    };
  };
  recentMatches: MatchRecord[];
  ratingHistory: {
    month: string;
    rating: number;
    note?: string;
  }[];
  highlights: HighlightVideo[];
  tapes: TapeAnalysis[];
}

export interface MatchRecord {
  id: string;
  opponent: string;
  isHome: boolean;
  date: string;
  result: string; // 'W 3-1', 'D 1-1', etc.
  rating: number;
  score: string;
  status: 'completed' | 'upcoming';
  venue?: string;
  goalsScored?: number;
  assistsGiven?: number;
  minutesPlayed?: number;
  topSpeed?: number;
}

export interface HighlightVideo {
  id: string;
  title: string;
  category: 'FEATURED REEL' | 'TRAINING' | 'SKILLS' | 'MATCH HIGHLIGHT';
  duration: string;
  thumbnail: string;
  videoUrl?: string;
  dateAdded: string;
  views?: string;
  description?: string;
  fileSize?: string;
  isRealUpload?: boolean;
}

export interface TapeAnalysis {
  id: string;
  title: string;
  category: 'TACTICAL CAM' | 'TRAINING' | 'BIOMECHANICS' | 'MATCH';
  duration: string;
  thumbnail: string;
  videoUrl?: string;
  dateAdded: string;
  fileSize?: string;
  playerHighlight?: string;
  keyInsights?: string[];
  isRealUpload?: boolean;
  telemetryPoints?: {
    timestamp: number;
    speedKmh: number;
    heartRateBpm: number;
    kneeTorqueNm: number;
    symmetryPct: number;
    note?: string;
  }[];
}

export interface BiomechanicalScan {
  id: string;
  athleteName: string;
  athleteId: string;
  scanDate: string;
  scanType: 'LOWER BODY' | 'FULL BODY' | 'KINETIC CHAIN' | 'SPINE & CORE';
  efficiencyScore: number;
  symmetry: number;
  injuryRisk: 'LOW' | 'MODERATE' | 'HIGH';
  forceBalance: {
    left: number;
    right: number;
  };
  imageUrl: string;
  analysisTitle: string;
  metrics: {
    jointLoadN: number;
    flexionDeg: number;
    torqueNm: number;
    muscleActivationPct: number;
    vmoStrain: number;
    groundForce: number;
  };
  notes: string[];
}

export type SportType = 'FOOTBALL' | 'BASKETBALL' | 'CRICKET' | 'TENNIS' | 'RUGBY' | 'ATHLETICS' | 'HOCKEY';

export interface FixtureLineupPlayer {
  playerId: string;
  playerName: string;
  avatar?: string;
  number?: number;
  position: string;
  role?: 'Starter' | 'Substitute' | 'Reserve';
  readiness: number;
  status: 'Confirmed' | 'Pending' | 'Doubt';
}

export interface FixtureSchedule {
  id: string;
  sport?: SportType;
  matchType?: string; // 'League Match', 'Championship Derby', 'Playoff', 'Exhibition Friendly', 'Grand Slam Open', 'Relay Final'
  opponent: string;
  opponentLogo?: string;
  opponentColor?: string;
  competition: string;
  dateTime: string;
  dateTimestamp?: number;
  venue: string;
  surfaceType?: string; // 'Natural Grass', 'Hardwood', 'Turf Pitch', 'Hard Court', 'Red Clay', 'Synthetic Track'
  weatherCondition?: string; // 'Clear Night 18°C', 'Indoor Climate 21°C', 'Overcast 16°C'
  isHome: boolean;
  tacticalFormation?: string; // '4-3-3 Attacking', '1-2-2 Motion', 'T20 7-4 Aggressive', 'Singles Seed #1', etc.
  assignedLineup: FixtureLineupPlayer[];
  adminDirectives?: string[];
  refereeOfficial?: string;
  targetReadinessMin?: number;
  readinessScore: number;
  status: 'Scheduled' | 'In Progress' | 'Finished';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'apex';
  text: string;
  timestamp: string;
  metricsData?: {
    title: string;
    items: {
      label: string;
      value: string | number;
      delta?: string;
      status?: 'good' | 'warning' | 'danger';
    }[];
  };
  actions?: {
    label: string;
    actionType: string;
    payload?: any;
  }[];
}

export interface FollowerNotification {
  id: string;
  recipientId?: string;
  userId?: string;
  actorId?: string;
  name: string;
  avatar: string;
  handle: string;
  timestamp: number;
  timeAgo?: string;
  isMutual?: boolean;
  type?: 'FOLLOW' | 'LIKE' | 'COMMENT';
  message?: string;
  postId?: string;
  read?: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar: string;
  actionImage?: string;
  bio?: string;
  club?: string;
  position?: string;
  number?: number;
  createdAt: number;
}

export interface FollowRelation {
  followerId: string;
  followingId: string;
  createdAt: number;
}

export interface LikeRelation {
  postId: string;
  userId: string;
  createdAt: number;
}

export interface SocialComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorHandle: string;
  text: string;
  timestamp: string;
  createdAt?: number;
  exactUploadTime?: string;
  likesCount?: number;
}

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorHandle: string;
  authorClub: string;
  authorPosition: string;
  authorNumber?: number;
  isVerified?: boolean;
  mediaType: 'photo' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  caption: string;
  category: 'MATCHDAY' | 'TRAINING' | 'GOAL' | 'BIOMECHANICS' | 'RECOVERY' | 'LIFESTYLE';
  timestamp: string;
  createdAt?: number;
  exactUploadTime?: string;
  likesCount: number;
  isLiked: boolean;
  isSaved?: boolean;
  commentsCount: number;
  comments: SocialComment[];
  viewsCount?: string;
  telemetryTag?: string;
  location?: string;
}

export interface PlayerStory {
  id: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  playerHandle: string;
  hasUnseen: boolean;
  stories: {
    id: string;
    mediaUrl: string;
    mediaType: 'photo' | 'video';
    caption?: string;
    timestamp: string;
    createdAt?: number;
    telemetrySnippet?: string;
  }[];
}

export interface TelemetryDataPoint {
  timeOffsetSec: number;
  label: string;
  minute?: number;
  velocityKmh: number;
  jointTorqueNm: number;
  leftGroundForceN: number;
  rightGroundForceN: number;
  kneeFlexionDeg: number;
  vmoActivationPct: number;
  cadenceStepsSec: number;
  heartRateBpm?: number;
  fatiguePct?: number;
  sprintEffort?: number | string;
}

export interface SquadPlayerTelemetry {
  id: string;
  name: string;
  position: string;
  jersey: number;
  topSpeed: number;
  symmetryPct: number;
  sprintDistanceM: number;
  totalDistanceKm?: number;
  readinessScore?: number;
  jointStrain?: string;
  status?: string;
  acwr: number;
  injuryRiskScore: number;
  riskCategory: 'LOW' | 'MODERATE' | 'ELEVATED';
  liveStatus?: 'ON PITCH' | 'BENCH' | 'RECOVERY';
  currentBpm?: number;
}

export interface SessionRecord {
  id: string;
  athleteId: string;
  athleteName: string;
  sessionType: 'MATCH' | 'SPRINT_TEST' | 'HIIT_CARDIO' | 'BIOMECHANICS_DRILL' | 'REHAB_RECOVERY';
  title: string;
  date: string;
  timestamp: number;
  durationMinutes: number;
  topSpeedKmh: number;
  avgHeartRateBpm: number;
  maxHeartRateBpm: number;
  distanceKm: number;
  leftGroundForceN: number;
  rightGroundForceN: number;
  symmetryPct: number;
  jointTorqueNm: number;
  acwr: number;
  rpeLoadScore: number;
  sport?: string;
  goalsScored?: number;
  assistsGiven?: number;
  runsScored?: number;
  wicketsTaken?: number;
  pointsScored?: number;
  scoreResult?: string;
  notes?: string;
  telemetryPoints?: Array<{
    minute: number;
    velocityKmh: number;
    heartRateBpm: number;
    leftGroundForceN: number;
    rightGroundForceN: number;
    jointTorqueNm: number;
    label?: string;
  }>;
}

// ==========================================
// COURSES & ACADEMY LEARNING PLATFORM TYPES
// ==========================================

export interface CourseLesson {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  durationLabel: string; // e.g. "08:45"
  videoUrl: string;
  thumbnailUrl?: string;
  order: number;
}

export interface CourseChapter {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  title: string;
  slug?: string;
  description: string;
  longDescription?: string;
  thumbnail: string;
  category: 'Football' | 'Cricket' | 'Basketball' | 'Tennis' | 'Athletics' | 'Strength & Conditioning' | 'Biomechanics & Rehab' | 'General';
  instructorName: string;
  instructorTitle?: string;
  instructorAvatar?: string;
  level: 'ALL LEVELS' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  isPublished: boolean;
  totalDurationMinutes: number;
  totalLessonsCount: number;
  rating: number;
  enrolledCount: number;
  badge?: string;
  createdAt: number;
  updatedAt: number;
  chapters: CourseChapter[];
}

export interface UserCourseProgress {
  userId: string;
  courseId: string;
  enrolledAt: number;
  completedLessonIds: string[];
  lastWatchedLessonId?: string;
  lastWatchedPositionSec?: number;
  lastWatchedTimestamp?: number;
  overallProgressPct: number;
}

export interface LoginActivity {
  id: string;
  playerId: string;
  playerName: string;
  playerAvatar: string;
  playerPosition: string;
  playerNumber: number;
  type: 'LOGIN' | 'SIGNUP';
  timestamp: number;
  role: string;
}

