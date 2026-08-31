import fs from 'fs';
import path from 'path';

export interface UserRecord {
  id: string;
  name: string;
  username: string; // e.g. "@rahulkumar"
  email: string;
  password?: string;
  role: 'player' | 'admin';
  avatar: string;
  actionImage?: string;
  code: string;
  position: string;
  roleTitle?: string;
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
  createdAt: number;
  coachEvaluation?: string;
  adminDecision?: {
    evaluatedBy: string;
    decisionDate: string;
    clearanceStatus: 'MATCH READY' | 'RESTRICTED MINUTES' | 'MEDICAL CLEARANCE REQUIRED' | 'BENCH ROTATION';
    maxWorkloadM: number;
    targetPaceKmH: number;
    trainingFocus: string;
    notes: string;
    isVerified: boolean;
  };
  stats: {
    games: number;
    goals: number;
    assists: number;
    runs?: number;
    wickets?: number;
    points?: number;
    topSpeed: number;
    passAccuracy: number;
    shotConversion: number;
    stamina: number;
    symmetry: number;
    injuryRisk: 'LOW' | 'MODERATE' | 'ELEVATED';
    acwr?: number;
    forceBalance: {
      left: number;
      right: number;
    };
  };
  recentMatches?: any[];
  ratingHistory?: any[];
  highlights?: any[];
  tapes?: any[];
}

export interface FollowRecord {
  followerId: string;
  followingId: string;
  createdAt: number;
}

export interface LikeRecord {
  postId: string;
  userId: string;
  createdAt: number;
}

export interface CommentRecord {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorHandle: string;
  text: string;
  createdAt: number;
  exactUploadTime?: string;
  likesCount?: number;
}

export interface PostRecord {
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
  createdAt: number;
  exactUploadTime?: string;
  likesCount?: number;
  location?: string;
  telemetryTag?: string;
  viewsCount?: string;
}

export interface NotificationRecord {
  id: string;
  recipientId: string;
  actorId: string;
  actorName: string;
  actorAvatar: string;
  actorHandle: string;
  type: 'FOLLOW' | 'LIKE' | 'COMMENT';
  message: string;
  postId?: string;
  timestamp: number;
  read: boolean;
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

export interface CourseLesson {
  id: string;
  title: string;
  description?: string;
  durationMinutes: number;
  durationLabel: string;
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

export interface DbState {
  users: Record<string, UserRecord>;
  follows: FollowRecord[];
  posts: PostRecord[];
  likes: LikeRecord[];
  comments: CommentRecord[];
  notifications: NotificationRecord[];
  scans: any[];
  fixtures: any[];
  stories: any[];
  chatMessages: any[];
  sessions: SessionRecord[];
  courses: Course[];
  courseProgress: Record<string, UserCourseProgress>;
}

const DB_FILE = path.join(process.cwd(), 'data', 'database.json');

function formatExactUploadTime(timestamp: number): string {
  const d = new Date(timestamp);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

class DatabaseService {
  private state: DbState;

  private getSeedState(): DbState {
    const seedUsers: Record<string, UserRecord> = {
      'APX-9942': {
        id: 'APX-9942',
        name: 'RAHUL KUMAR',
        username: '@rahulkumar',
        email: 'rahul.kumar@apex.pro',
        password: 'password123',
        role: 'player',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        actionImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80',
        code: '#APX-9942',
        position: 'FWD',
        roleTitle: 'CENTER FORWARD',
        number: 9,
        phone: '+91 98765 43210',
        sportSpecialty: 'Football (Striker / Finishing)',
        status: 'ACTIVE',
        overallRating: 95.4,
        ratingChange: 1.2,
        height: '182 cm',
        weight: '75 kg',
        preferredFoot: 'Right',
        age: 22,
        club: 'Kheltantra FC',
        bio: 'Pro Center Forward. Verified 34.8 km/h top sprint speed, 96% force symmetry, and Durand Cup Golden Boot contender.',
        createdAt: Date.now() - 120 * 24 * 60 * 60 * 1000,
        coachEvaluation: 'Elite finishing composure with 99th percentile high-speed sprint velocity. ACL decelerative torque is well within safety thresholds.',
        adminDecision: {
          evaluatedBy: 'Coach Vikram Rathore',
          decisionDate: '14 Aug 2026',
          clearanceStatus: 'MATCH READY',
          maxWorkloadM: 12000,
          targetPaceKmH: 34.5,
          trainingFocus: 'Near-post box runs & transition sprint endurance',
          notes: 'Full clearance granted for Friday fixture against Titan United FC.',
          isVerified: true,
        },
        stats: {
          games: 28,
          goals: 24,
          assists: 9,
          topSpeed: 34.8,
          passAccuracy: 89,
          shotConversion: 32,
          stamina: 92,
          symmetry: 96,
          injuryRisk: 'LOW',
          acwr: 1.14,
          forceBalance: { left: 49, right: 51 },
        },
        recentMatches: [
          {
            id: 'm-1',
            opponent: 'Mumbai City FC',
            isHome: true,
            date: '12 Aug 2026',
            result: 'W 3-1',
            rating: 9.4,
            score: '3 - 1',
            status: 'completed',
            venue: 'Stadium',
            goalsScored: 2,
            assistsGiven: 1,
            minutesPlayed: 88,
          },
          {
            id: 'm-2',
            opponent: 'Mohun Bagan SG',
            isHome: false,
            date: '05 Aug 2026',
            result: 'W 2-0',
            rating: 9.1,
            score: '2 - 0',
            status: 'completed',
            venue: 'Salt Lake Arena',
            goalsScored: 1,
            assistsGiven: 0,
            minutesPlayed: 90,
          },
          {
            id: 'm-3',
            opponent: 'Bengaluru FC',
            isHome: true,
            date: '28 Jul 2026',
            result: 'D 2-2',
            rating: 8.8,
            score: '2 - 2',
            status: 'completed',
            venue: 'Stadium',
            goalsScored: 1,
            assistsGiven: 1,
            minutesPlayed: 90,
          },
          {
            id: 'm-4',
            opponent: 'Kerala Blasters',
            isHome: false,
            date: '20 Jul 2026',
            result: 'W 1-0',
            rating: 8.9,
            score: '1 - 0',
            status: 'completed',
            venue: 'Jawaharlal Nehru Stadium',
            goalsScored: 1,
            assistsGiven: 0,
            minutesPlayed: 84,
          },
        ],
        ratingHistory: [
          { month: 'MAR', rating: 88.5, note: 'Pre-season baseline testing' },
          { month: 'APR', rating: 90.2, note: 'Cardio capacity +4% VO2max' },
          { month: 'MAY', rating: 91.8, note: 'Max sprint speed 33.8 km/h' },
          { month: 'JUN', rating: 93.0, note: 'ACL asymmetry normalized to 96%' },
          { month: 'JUL', rating: 94.2, note: 'Matchday MVP in Durand Cup' },
          { month: 'AUG', rating: 95.4, note: 'Current elite form • 99th percentile' },
        ],
        highlights: [],
        tapes: [],
      },
      'ADM-101': {
        id: 'ADM-101',
        name: 'COACH VIKRAM RATHORE',
        username: '@coachvikram',
        email: 'vikram.coach@apex.pro',
        password: 'password123',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        actionImage: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1000&q=80',
        code: '#ADM-101',
        position: 'STAFF',
        roleTitle: 'HEAD PERFORMANCE COACH',
        number: 1,
        phone: '+91 98111 22334',
        sportSpecialty: 'Tactical Periodization & GPS Biomechanics',
        status: 'ACTIVE',
        overallRating: 98.0,
        ratingChange: 0.0,
        height: '185 cm',
        weight: '80 kg',
        preferredFoot: 'Right',
        age: 38,
        club: 'Kheltantra FC',
        bio: 'Head Performance Coach at Kheltantra. UEFA Pro License, specialized in workload periodization, 100 Hz GPS analysis, and tactical formations.',
        createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
        stats: {
          games: 140,
          goals: 0,
          assists: 0,
          topSpeed: 0,
          passAccuracy: 0,
          shotConversion: 0,
          stamina: 95,
          symmetry: 100,
          injuryRisk: 'LOW',
          acwr: 1.0,
          forceBalance: { left: 50, right: 50 },
        },
        recentMatches: [],
        ratingHistory: [],
        highlights: [],
        tapes: [],
      },
      'APX-9943': {
        id: 'APX-9943',
        name: 'ARJUN STERLING',
        username: '@arjun_s',
        email: 'arjun.sterling@apex.pro',
        password: 'password123',
        role: 'player',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        actionImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80',
        code: '#APX-9943',
        position: 'WNG',
        roleTitle: 'LEFT WINGER',
        number: 7,
        sportSpecialty: 'Football',
        status: 'ACTIVE',
        overallRating: 93.8,
        ratingChange: 0.8,
        height: '179 cm',
        weight: '71 kg',
        age: 21,
        club: 'Kheltantra FC',
        createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
        stats: {
          games: 26,
          goals: 14,
          assists: 16,
          topSpeed: 35.1,
          passAccuracy: 86,
          shotConversion: 28,
          stamina: 90,
          symmetry: 94,
          injuryRisk: 'LOW',
          acwr: 1.18,
          forceBalance: { left: 47, right: 53 },
        },
        recentMatches: [],
        ratingHistory: [],
      },
      'APX-9944': {
        id: 'APX-9944',
        name: 'LEO SILVA',
        username: '@leosilva',
        email: 'leo.silva@apex.pro',
        password: 'password123',
        role: 'player',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
        code: '#APX-9944',
        position: 'MID',
        roleTitle: 'CENTRAL PLAYMAKER',
        number: 10,
        sportSpecialty: 'Football',
        status: 'ACTIVE',
        overallRating: 92.5,
        ratingChange: 0.5,
        height: '175 cm',
        weight: '68 kg',
        age: 23,
        club: 'Kheltantra FC',
        createdAt: Date.now() - 110 * 24 * 60 * 60 * 1000,
        stats: {
          games: 27,
          goals: 8,
          assists: 21,
          topSpeed: 31.8,
          passAccuracy: 93,
          shotConversion: 22,
          stamina: 89,
          symmetry: 97,
          injuryRisk: 'LOW',
          acwr: 1.08,
          forceBalance: { left: 49, right: 51 },
        },
        recentMatches: [],
        ratingHistory: [],
      },
      'APX-9945': {
        id: 'APX-9945',
        name: 'DAVID CHEN',
        username: '@davidchen',
        email: 'david.chen@apex.pro',
        password: 'password123',
        role: 'player',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=256&q=80',
        code: '#APX-9945',
        position: 'DEF',
        roleTitle: 'CENTER BACK',
        number: 4,
        sportSpecialty: 'Football',
        status: 'ACTIVE',
        overallRating: 91.0,
        ratingChange: -0.2,
        height: '188 cm',
        weight: '82 kg',
        age: 24,
        club: 'Kheltantra FC',
        createdAt: Date.now() - 100 * 24 * 60 * 60 * 1000,
        stats: {
          games: 25,
          goals: 3,
          assists: 2,
          topSpeed: 32.2,
          passAccuracy: 88,
          shotConversion: 15,
          stamina: 91,
          symmetry: 91,
          injuryRisk: 'MODERATE',
          acwr: 1.28,
          forceBalance: { left: 45, right: 55 },
        },
        recentMatches: [],
        ratingHistory: [],
      },
      'APX-9946': {
        id: 'APX-9946',
        name: 'ARJUN SHARMA',
        username: '@arjun_s',
        email: 'arjun.sharma@apex.pro',
        password: 'password123',
        role: 'player',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=256&q=80',
        code: '#APX-9946',
        position: 'MID',
        roleTitle: 'BOX-TO-BOX MIDFIELDER',
        number: 8,
        sportSpecialty: 'Football',
        status: 'ACTIVE',
        overallRating: 90.4,
        ratingChange: 0.6,
        height: '180 cm',
        weight: '74 kg',
        age: 22,
        club: 'Kheltantra FC',
        createdAt: Date.now() - 80 * 24 * 60 * 60 * 1000,
        stats: {
          games: 24,
          goals: 6,
          assists: 9,
          topSpeed: 30.9,
          passAccuracy: 89,
          shotConversion: 20,
          stamina: 93,
          symmetry: 95,
          injuryRisk: 'LOW',
          acwr: 1.05,
          forceBalance: { left: 50, right: 50 },
        },
        recentMatches: [],
        ratingHistory: [],
      },
    };

    const seedScans = [
      {
        id: 'scan-01',
        athleteName: 'RAHUL KUMAR',
        athleteId: 'APX-9942',
        scanDate: '14 Aug 2026',
        scanType: 'LOWER BODY',
        efficiencyScore: 96,
        symmetry: 96,
        injuryRisk: 'LOW',
        forceBalance: { left: 49, right: 51 },
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
        analysisTitle: 'Patellofemoral & Hamstring Deceleration Profile',
        metrics: {
          jointLoadN: 1240,
          flexionDeg: 38,
          torqueNm: 184,
          muscleActivationPct: 94,
          vmoStrain: 12,
          groundForce: 1250,
        },
        notes: [
          'Hamstring bilateral force output demonstrates a safe 96% symmetry rating.',
          'Decelerative knee torque stabilizes at 178 Nm during maximal cutbacks.',
          'Single-leg banded clamshells maintain optimal glute medius firing.',
        ],
      },
    ];

    const seedFixtures = [
      {
        id: 'fix-01',
        sport: 'FOOTBALL',
        matchType: 'League Derby',
        opponent: 'Titan United FC',
        opponentLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=128&q=80',
        competition: 'National Super League 2026',
        dateTime: 'Friday, Aug 21 • 19:30 IST',
        dateTimestamp: Date.now() + 4 * 24 * 60 * 60 * 1000,
        venue: 'Apex Arena Stadium',
        surfaceType: 'Natural Grass (Damp)',
        weatherCondition: 'Clear Night 22°C',
        isHome: true,
        tacticalFormation: '4-3-3 Attacking High-Press',
        assignedLineup: [
          { playerId: 'APX-9942', playerName: 'RAHUL KUMAR', number: 9, position: 'FWD', role: 'Starter', readiness: 95, status: 'Confirmed' },
          { playerId: 'APX-9943', playerName: 'ARJUN STERLING', number: 7, position: 'WNG', role: 'Starter', readiness: 94, status: 'Confirmed' },
          { playerId: 'APX-9944', playerName: 'LEO SILVA', number: 10, position: 'MID', role: 'Starter', readiness: 93, status: 'Confirmed' },
          { playerId: 'APX-9945', playerName: 'DAVID CHEN', number: 4, position: 'DEF', role: 'Starter', readiness: 91, status: 'Confirmed' },
          { playerId: 'APX-9946', playerName: 'ARJUN SHARMA', number: 8, position: 'MID', role: 'Starter', readiness: 90, status: 'Confirmed' },
        ],
        adminDirectives: [
          'Exploit space behind Titan fullbacks via Rahul Kumar sprint breakout.',
          'Press high in first 25 minutes to disrupt opponent build-up from back.',
        ],
        readinessScore: 94.2,
        status: 'Scheduled',
      },
    ];

    const seedSessions: SessionRecord[] = [
      {
        id: 'sess-01',
        athleteId: 'APX-9942',
        athleteName: 'RAHUL KUMAR',
        sessionType: 'MATCH',
        title: 'Full 90m Match vs Mumbai City FC',
        date: '12 Aug 2026',
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
        durationMinutes: 88,
        topSpeedKmh: 34.8,
        avgHeartRateBpm: 152,
        maxHeartRateBpm: 189,
        distanceKm: 11.4,
        leftGroundForceN: 1240,
        rightGroundForceN: 1265,
        symmetryPct: 96,
        jointTorqueNm: 184,
        acwr: 1.14,
        rpeLoadScore: 8.5,
        notes: '2 Goals, 1 Assist. Peak sprint velocity hit in 30th minute counter-attack.',
        telemetryPoints: [
          { minute: 0, label: "0'", velocityKmh: 0, heartRateBpm: 74, leftGroundForceN: 720, rightGroundForceN: 730, jointTorqueNm: 85 },
          { minute: 15, label: "15'", velocityKmh: 28.4, heartRateBpm: 148, leftGroundForceN: 1190, rightGroundForceN: 1210, jointTorqueNm: 156 },
          { minute: 30, label: "30'", velocityKmh: 34.8, heartRateBpm: 179, leftGroundForceN: 1470, rightGroundForceN: 1480, jointTorqueNm: 208 },
          { minute: 45, label: "HT", velocityKmh: 12.0, heartRateBpm: 116, leftGroundForceN: 840, rightGroundForceN: 850, jointTorqueNm: 95 },
          { minute: 60, label: "60'", velocityKmh: 33.4, heartRateBpm: 174, leftGroundForceN: 1390, rightGroundForceN: 1420, jointTorqueNm: 194 },
          { minute: 75, label: "75'", velocityKmh: 30.2, heartRateBpm: 176, leftGroundForceN: 1290, rightGroundForceN: 1340, jointTorqueNm: 178 },
          { minute: 88, label: "88'", velocityKmh: 32.8, heartRateBpm: 189, leftGroundForceN: 1370, rightGroundForceN: 1450, jointTorqueNm: 190 },
        ],
      },
    ];

    const seedCourses: Course[] = [
      {
        id: 'crs-football-01',
        title: 'Elite Striker Movement & High-Velocity Finishing',
        slug: 'elite-striker-movement',
        description: 'Master blindside runs, first-touch kills, and clinical 1-touch finishing under physical pressure in the penalty box.',
        longDescription: 'Developed by Apex High Performance Coaches, this tactical masterclass breaks down optical telemetry and GPS movement patterns used by professional center forwards to consistently create 3.5+ meters of separation in the final third.',
        thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
        category: 'Football',
        instructorName: 'Sarah Vance',
        instructorTitle: 'Head Performance Coach • Apex Academy',
        instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        level: 'ALL LEVELS',
        isPublished: true,
        totalDurationMinutes: 65,
        totalLessonsCount: 5,
        rating: 4.9,
        enrolledCount: 142,
        badge: 'MASTERCLASS',
        createdAt: 1770000000000,
        updatedAt: 1770000000000,
        chapters: [
          {
            id: 'ch-1',
            title: 'Chapter 1: Box Deceleration & Off-The-Ball Separation',
            description: 'Biomechanical timing of the secondary cut to deceive center-backs.',
            order: 1,
            lessons: [
              {
                id: 'les-1',
                title: 'The 3.5m Blindside Cut & Deceleration Vector',
                description: 'How to read the center-back hips and execute an explosive cutaway.',
                durationMinutes: 12,
                durationLabel: '12:45',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
                order: 1,
              },
              {
                id: 'les-2',
                title: 'First-Touch Directional Killing In Tight Quarters',
                description: 'Cushioning high-speed passes directly into shooting stride without stutter-stepping.',
                durationMinutes: 14,
                durationLabel: '14:20',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
                thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
                order: 2,
              },
              {
                id: 'les-3',
                title: 'Near-Post Dynamic Sprints on Low Crosses',
                description: 'Accelerating across the front of the goalkeeper with zero stride stutter.',
                durationMinutes: 11,
                durationLabel: '11:15',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
                order: 3,
              },
            ],
          },
          {
            id: 'ch-2',
            title: 'Chapter 2: Finishing Under Heavy Contact',
            description: 'Maintaining pelvic kinetic alignment when challenged physically.',
            order: 2,
            lessons: [
              {
                id: 'les-4',
                title: 'Low-Driven Corner Placement Mechanics',
                description: 'Planted foot ankle rigidity and follow-through trajectory.',
                durationMinutes: 15,
                durationLabel: '15:30',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                thumbnailUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=600&q=80',
                order: 1,
              },
              {
                id: 'les-5',
                title: 'Half-Volley Kinetic Chain Power Transfer',
                description: 'Generating 100+ km/h shot speed off bouncing balls.',
                durationMinutes: 13,
                durationLabel: '13:10',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
                thumbnailUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=600&q=80',
                order: 2,
              },
            ],
          },
        ],
      },
      {
        id: 'crs-cricket-02',
        title: 'Fast Bowling Biomechanics & 140+ km/h Velocity Science',
        slug: 'fast-bowling-biomechanics',
        description: 'Optimize run-up rhythm, front-foot braking force, and wrist release physics to gain 5-8 km/h without extra strain.',
        longDescription: 'Comprehensive breakdown of high-velocity fast bowling physics. Covers run-up velocity progression, front-foot brace angle, pelvic rotation, and wrist snap mechanics monitored through optical force tracking.',
        thumbnail: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
        category: 'Cricket',
        instructorName: 'Vikram Rathore',
        instructorTitle: 'Senior Pace Coach & Biomechanics Lead',
        instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        level: 'INTERMEDIATE',
        isPublished: true,
        totalDurationMinutes: 52,
        totalLessonsCount: 4,
        rating: 4.95,
        enrolledCount: 98,
        badge: 'POPULAR',
        createdAt: 1770000000000,
        updatedAt: 1770000000000,
        chapters: [
          {
            id: 'ch-crk-1',
            title: 'Module 1: Run-Up Rhythm & Delivery Stride',
            description: 'Building momentum without energy leakage.',
            order: 1,
            lessons: [
              {
                id: 'les-crk-1',
                title: 'Rhythmic Acceleration & Step Frequency',
                description: 'The mathematical build-up of speed into the penultimate stride.',
                durationMinutes: 14,
                durationLabel: '14:00',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                thumbnailUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=600&q=80',
                order: 1,
              },
              {
                id: 'les-crk-2',
                title: 'Front-Foot Landing Brake Force & Kinetic Transfer',
                description: 'Locking the front knee at 165° to catapult the torso forward.',
                durationMinutes: 12,
                durationLabel: '12:30',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
                thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
                order: 2,
              },
            ],
          },
          {
            id: 'ch-crk-2',
            title: 'Module 2: Wrist Position & Outswinger Release',
            description: 'Seam orientation aerodynamics at 140+ km/h.',
            order: 2,
            lessons: [
              {
                id: 'les-crk-3',
                title: 'Cocked Wrist Snap & 1st Slip Seam Angle',
                description: 'Maximizing laminar airflow for late aerodynamic swing.',
                durationMinutes: 13,
                durationLabel: '13:45',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
                order: 1,
              },
              {
                id: 'les-crk-4',
                title: 'Death Overs Yorker & Slower Ball Deception',
                description: 'Disguising release points and bowling pinpoint yorkers under pressure.',
                durationMinutes: 13,
                durationLabel: '13:15',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
                order: 2,
              },
            ],
          },
        ],
      },
      {
        id: 'crs-rehab-03',
        title: 'ACL Injury Prevention & Bilateral Force Symmetry',
        slug: 'acl-injury-prevention',
        description: 'Elite conditioning protocols for knee joint stabilization, decelerative load management, and kinetic chain symmetry.',
        longDescription: 'A clinical and athletic blueprint for bulletproofing knees, eliminating quad/hamstring imbalances, and mastering eccentric deceleration mechanics.',
        thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
        category: 'Biomechanics & Rehab',
        instructorName: 'Dr. Elena Voss',
        instructorTitle: 'Sports Physiologist & Kinetic Specialist',
        instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
        level: 'ALL LEVELS',
        isPublished: true,
        totalDurationMinutes: 44,
        totalLessonsCount: 3,
        rating: 4.98,
        enrolledCount: 184,
        badge: 'ESSENTIAL',
        createdAt: 1770000000000,
        updatedAt: 1770000000000,
        chapters: [
          {
            id: 'ch-rhb-1',
            title: 'Part 1: Deceleration Valgus Control & Landing Mechanics',
            description: 'Correcting inward knee collapse during high-speed cuts.',
            order: 1,
            lessons: [
              {
                id: 'les-rhb-1',
                title: 'Force Plate 50/50 Symmetry Baseline Assessment',
                description: 'Identifying hidden bilateral asymmetries before tissue strain occurs.',
                durationMinutes: 15,
                durationLabel: '15:10',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
                order: 1,
              },
              {
                id: 'les-rhb-2',
                title: 'Single-Leg Drop Jump & Dynamic Glute Medius Firing',
                description: 'Engaging lateral hip stabilizers to absorb 3x bodyweight impact.',
                durationMinutes: 14,
                durationLabel: '14:40',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
                thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
                order: 2,
              },
              {
                id: 'les-rhb-3',
                title: 'Nordic Hamstring Curls & Eccentric Deceleration',
                description: 'Progressive overload protocol to protect the posterior kinetic chain.',
                durationMinutes: 15,
                durationLabel: '15:00',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
                order: 3,
              },
            ],
          },
        ],
      },
      {
        id: 'crs-basketball-04',
        title: 'Point Guard Vision & Pick-And-Roll Motion Offense',
        slug: 'point-guard-vision',
        description: 'Elite spatial scanning, defensive read progression, and pocket pass execution for elite floor generals.',
        longDescription: 'Tactical film analysis and court execution drills for basketball playmakers looking to read drop coverage, blitzes, and weakside taggers with total composure.',
        thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
        category: 'Basketball',
        instructorName: 'David Sterling',
        instructorTitle: 'Pro Playmaker Coach',
        instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        level: 'ALL LEVELS',
        isPublished: true,
        totalDurationMinutes: 38,
        totalLessonsCount: 3,
        rating: 4.88,
        enrolledCount: 76,
        badge: 'TACTICAL',
        createdAt: 1770000000000,
        updatedAt: 1770000000000,
        chapters: [
          {
            id: 'ch-bsk-1',
            title: 'Section 1: Spatial Scanning & Coverage Reads',
            description: 'Deconstructing defense structures in real-time.',
            order: 1,
            lessons: [
              {
                id: 'les-bsk-1',
                title: '360 Head-Scan Before Screen Engagement',
                description: 'Pre-reading help defender positioning before making the downhill cut.',
                durationMinutes: 12,
                durationLabel: '12:20',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                thumbnailUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=600&q=80',
                order: 1,
              },
              {
                id: 'les-bsk-2',
                title: 'The Wrap-Around Pocket Pass & Hook Pass',
                description: 'Delivering passes under the armpit of rim protectors.',
                durationMinutes: 14,
                durationLabel: '14:10',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
                thumbnailUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
                order: 2,
              },
              {
                id: 'les-bsk-3',
                title: 'Pull-Up Midrange Jumper Off The Bounce',
                description: 'Hard plant brake force to rise straight up with balanced release.',
                durationMinutes: 12,
                durationLabel: '12:00',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
                thumbnailUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
                order: 3,
              },
            ],
          },
        ],
      },
    ];

    return {
      users: seedUsers,
      follows: [],
      posts: [],
      likes: [],
      comments: [],
      notifications: [],
      scans: seedScans,
      fixtures: seedFixtures,
      stories: [],
      chatMessages: [
        {
          id: 'msg-1',
          sender: 'apex',
          text: 'Welcome to Kheltantra Sports Intelligence Platform. Real-time telemetry, video reels, and player performance database active.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      sessions: seedSessions,
      courses: seedCourses,
      courseProgress: {},
    };
  }

  private getEmptyState(): DbState {
    return {
      users: {},
      follows: [],
      posts: [],
      likes: [],
      comments: [],
      notifications: [],
      scans: [],
      fixtures: [],
      stories: [],
      chatMessages: [],
      sessions: [],
      courses: [],
      courseProgress: {},
    };
  }

  constructor() {
    this.state = this.load();
  }

  private load(): DbState {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return {
            ...this.getEmptyState(),
            ...parsed,
            users: parsed.users || {},
            follows: parsed.follows || [],
            posts: parsed.posts || [],
            likes: parsed.likes || [],
            comments: parsed.comments || [],
            notifications: parsed.notifications || [],
            scans: parsed.scans || [],
            fixtures: parsed.fixtures || [],
            stories: parsed.stories || [],
            chatMessages: parsed.chatMessages || [],
            sessions: parsed.sessions || [],
            courses: parsed.courses || [],
            courseProgress: parsed.courseProgress || {},
          };
        }
      }
    } catch (e) {
      console.error('[DB] Error loading database file:', e);
    }

    const emptyState = this.getEmptyState();
    this.save(emptyState);
    return emptyState;
  }

  private save(stateToSave?: DbState): void {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(stateToSave || this.state, null, 2), 'utf-8');
    } catch (e) {
      console.error('[DB] Error saving database file:', e);
    }
  }

  public getState(): DbState {
    return this.state;
  }

  // Calculate real counts for a user record (Authoritative)
  public formatUserProfile(userId: string, viewerId?: string): any {
    const user = this.state.users[userId];
    if (!user) return null;

    const postsCount = this.state.posts.filter((p) => p.authorId === userId).length;
    const followersCount = this.state.follows.filter((f) => f.followingId === userId).length;
    const followingCount = this.state.follows.filter((f) => f.followerId === userId).length;
    const isFollowing = viewerId
      ? this.state.follows.some((f) => f.followerId === viewerId && f.followingId === userId)
      : false;

    return {
      ...user,
      handle: user.username || `@${user.name.toLowerCase().replace(/\s+/g, '')}_${user.number || 9}`,
      postsCount,
      followersCount,
      followingCount,
      isFollowing,
    };
  }

  public getAllUsers(viewerId?: string): any[] {
    return Object.keys(this.state.users).map((id) => this.formatUserProfile(id, viewerId));
  }

  public getCommunityAthletesMap(viewerId?: string): Record<string, any> {
    const map: Record<string, any> = {};
    for (const id of Object.keys(this.state.users)) {
      map[id] = this.formatUserProfile(id, viewerId);
    }
    return map;
  }

  public getUserById(id: string, viewerId?: string): any {
    return this.formatUserProfile(id, viewerId);
  }

  public getUserByEmail(email: string): UserRecord | null {
    const found = Object.values(this.state.users).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    return found || null;
  }

  public getUserByUsername(username: string): UserRecord | null {
    const clean = username.startsWith('@') ? username.toLowerCase() : `@${username.toLowerCase()}`;
    const found = Object.values(this.state.users).find(
      (u) => (u.username || '').toLowerCase() === clean
    );
    return found || null;
  }

  // ----------------------------------------------------
  // User Registration & Auth
  // ----------------------------------------------------
  public signupUser(params: {
    name: string;
    email: string;
    password?: string;
    username?: string;
    role?: 'player' | 'admin';
    position?: string;
    jerseyNumber?: number;
    club?: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    sportSpecialty?: string;
  }): { success: boolean; user?: any; error?: string } {
    const emailClean = params.email.trim().toLowerCase();
    if (this.getUserByEmail(emailClean)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const isAdmin = params.role === 'admin';
    const rawUsername = params.username || `@${params.name.trim().toLowerCase().replace(/\s+/g, '')}`;
    const cleanUsername = rawUsername.startsWith('@') ? rawUsername : `@${rawUsername}`;

    // Generate unique user ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const userId = isAdmin ? `ADM-${randomSuffix}` : `USR-${randomSuffix}`;

    const defaultPlayerAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80';
    const defaultPlayerAction = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80';
    const defaultAdminAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
    const defaultAdminAction = 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1000&q=80';

    const cleanPosition = isAdmin
      ? 'STAFF'
      : (params.position?.includes('(')
        ? params.position.split('(')[1].replace(')', '')
        : params.position || 'FWD');

    const roleTitle = isAdmin
      ? (params.position || 'HEAD PERFORMANCE COACH')
      : (params.position?.toUpperCase() || 'PLAYER');

    const newUser: UserRecord = {
      id: userId,
      name: params.name.trim().toUpperCase(),
      username: cleanUsername,
      email: emailClean,
      password: params.password || 'password123',
      role: isAdmin ? 'admin' : 'player',
      avatar: params.avatar || (isAdmin ? defaultAdminAvatar : defaultPlayerAvatar),
      actionImage: isAdmin ? defaultAdminAction : defaultPlayerAction,
      code: `#${userId}`,
      position: cleanPosition,
      roleTitle: roleTitle,
      number: params.jerseyNumber || (isAdmin ? 1 : 10),
      phone: params.phone || '',
      sportSpecialty: params.sportSpecialty || (isAdmin ? 'High Performance & Tactical Periodization' : 'Football'),
      status: 'ACTIVE',
      overallRating: isAdmin ? 98.0 : 88.0,
      ratingChange: 0.0,
      height: "178 cm",
      weight: '72 kg',
      preferredFoot: 'Right',
      age: isAdmin ? 34 : 21,
      club: params.club || (isAdmin ? 'Kheltantra Tactical Academy' : 'Kheltantra Athletes FC'),
      bio: params.bio || (isAdmin
        ? `${params.name} is registered as Coach / Staff managing team tactics, performance telemetry, and fixture schedules.`
        : `${params.name} is a competitive athlete tracking biomechanics and match performance on Kheltantra.`),
      createdAt: Date.now(),
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
        forceBalance: { left: 50, right: 50 },
      },
      recentMatches: [],
      ratingHistory: [],
      highlights: [],
      tapes: [],
    };

    this.state.users[userId] = newUser;
    this.save();

    return {
      success: true,
      user: this.formatUserProfile(userId),
    };
  }

  public authenticateUser(email: string, password?: string): { success: boolean; user?: any; error?: string } {
    const user = this.getUserByEmail(email.trim());
    if (!user) {
      return { success: false, error: 'No account registered with this email.' };
    }
    if (password && user.password && user.password !== password) {
      return { success: false, error: 'Incorrect password entered.' };
    }
    return {
      success: true,
      user: this.formatUserProfile(user.id),
    };
  }

  public loginUser(email: string, password?: string): { success: boolean; user?: any; error?: string } {
    return this.authenticateUser(email, password);
  }

  // ----------------------------------------------------
  // Follow / Unfollow System (Authoritative)
  // ----------------------------------------------------
  public toggleFollow(
    followerId: string,
    targetUserId: string
  ): {
    success: boolean;
    isFollowing: boolean;
    follower: any;
    targetUser: any;
    notification?: NotificationRecord;
    error?: string;
  } {
    if (followerId === targetUserId) {
      return { success: false, isFollowing: false, follower: null, targetUser: null, error: 'Cannot follow yourself' };
    }

    const follower = this.state.users[followerId];
    const target = this.state.users[targetUserId];

    if (!follower || !target) {
      return { success: false, isFollowing: false, follower: null, targetUser: null, error: 'User not found' };
    }

    const existingIndex = this.state.follows.findIndex(
      (f) => f.followerId === followerId && f.followingId === targetUserId
    );

    let isFollowing = false;
    let notification: NotificationRecord | undefined;

    if (existingIndex >= 0) {
      // Unfollow
      this.state.follows.splice(existingIndex, 1);
      isFollowing = false;
    } else {
      // Follow
      this.state.follows.push({
        followerId,
        followingId: targetUserId,
        createdAt: Date.now(),
      });
      isFollowing = true;

      // Create notification for target user
      notification = {
        id: `notif-${Date.now()}`,
        recipientId: targetUserId,
        actorId: followerId,
        actorName: follower.name,
        actorAvatar: follower.avatar,
        actorHandle: follower.username || `@${follower.name.toLowerCase().replace(/\s+/g, '')}`,
        type: 'FOLLOW',
        message: `${follower.name} started following your athletic profile`,
        timestamp: Date.now(),
        read: false,
      };
      this.state.notifications.unshift(notification);
    }

    this.save();

    return {
      success: true,
      isFollowing,
      follower: this.formatUserProfile(followerId, followerId),
      targetUser: this.formatUserProfile(targetUserId, followerId),
      notification,
    };
  }

  public getFollowers(userId: string, viewerId?: string): any[] {
    const followerIds = this.state.follows
      .filter((f) => f.followingId === userId)
      .map((f) => f.followerId);
    return followerIds.map((id) => this.formatUserProfile(id, viewerId || userId));
  }

  public getFollowing(userId: string, viewerId?: string): any[] {
    const followingIds = this.state.follows
      .filter((f) => f.followerId === userId)
      .map((f) => f.followingId);
    return followingIds.map((id) => this.formatUserProfile(id, viewerId || userId));
  }

  // ----------------------------------------------------
  // Posts & Feed System (Authoritative)
  // ----------------------------------------------------
  public getPosts(viewerId?: string, filter?: string): any[] {
    let posts = [...this.state.posts];

    if (filter === 'reels') {
      posts = posts.filter((p) => p.mediaType === 'video');
    } else if (filter === 'players') {
      posts = posts.filter((p) => {
        const author = this.state.users[p.authorId];
        return !author || author.role === 'player';
      });
    } else if (filter === 'admins' || filter === 'coaches') {
      posts = posts.filter((p) => {
        const author = this.state.users[p.authorId];
        return author && author.role === 'admin';
      });
    }

    return posts
      .sort((a, b) => b.createdAt - a.createdAt)
      .map((p) => this.formatPost(p, viewerId));
  }

  public getPostById(postId: string, viewerId?: string): any {
    const post = this.state.posts.find((p) => p.id === postId);
    if (!post) return null;
    return this.formatPost(post, viewerId);
  }

  private formatPost(post: PostRecord, viewerId?: string): any {
    const author = this.state.users[post.authorId];
    const postLikes = this.state.likes.filter((l) => l.postId === post.id);
    const postComments = this.state.comments
      .filter((c) => c.postId === post.id)
      .sort((a, b) => b.createdAt - a.createdAt);

    const isLiked = viewerId ? postLikes.some((l) => l.userId === viewerId) : false;

    return {
      ...post,
      authorName: author ? author.name : post.authorName,
      authorAvatar: author ? author.avatar : post.authorAvatar,
      authorHandle: author ? (author.username || post.authorHandle) : post.authorHandle,
      authorPosition: author ? (author.role === 'admin' ? 'HEAD PERFORMANCE COACH' : author.roleTitle || author.position) : post.authorPosition,
      authorNumber: author ? author.number : post.authorNumber,
      likesCount: (post.likesCount || 0) + postLikes.length,
      commentsCount: postComments.length,
      comments: postComments,
      isLiked,
      isSaved: false,
    };
  }

  public createPost(postData: {
    authorId: string;
    mediaType: 'photo' | 'video';
    mediaUrl: string;
    thumbnailUrl?: string;
    caption: string;
    category?: 'MATCHDAY' | 'TRAINING' | 'GOAL' | 'BIOMECHANICS' | 'RECOVERY' | 'LIFESTYLE';
    location?: string;
    telemetryTag?: string;
    exactUploadTime?: string;
  }): { post: any; author: any } {
    const author = this.state.users[postData.authorId] || {
      id: postData.authorId,
      name: 'Athlete',
      username: '@athlete',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      club: 'Kheltantra FC',
      position: 'FWD',
      number: 10,
      role: 'player',
    };

    const now = Date.now();
    const newPost: PostRecord = {
      id: `post-${now}-${Math.floor(Math.random() * 1000)}`,
      authorId: author.id,
      authorName: author.name,
      authorAvatar: author.avatar,
      authorHandle: author.username || `@${author.name.toLowerCase().replace(/\s+/g, '')}`,
      authorClub: author.club || 'Kheltantra FC',
      authorPosition: author.role === 'admin' ? 'HEAD PERFORMANCE COACH' : ((author as any).roleTitle || author.position || 'PLAYER'),
      authorNumber: author.number,
      isVerified: true,
      mediaType: postData.mediaType,
      mediaUrl: postData.mediaUrl,
      thumbnailUrl: postData.thumbnailUrl || (postData.mediaType === 'video' ? postData.mediaUrl : undefined),
      caption: postData.caption,
      category: postData.category || 'TRAINING',
      timestamp: 'Just now',
      createdAt: now,
      exactUploadTime: postData.exactUploadTime || formatExactUploadTime(now),
      location: postData.location || 'Kheltantra Performance Ground',
      telemetryTag: postData.telemetryTag || 'Match Readiness 98% • Biomechanics',
      viewsCount: '1',
    };

    this.state.posts.unshift(newPost);
    this.save();

    return {
      post: this.getPostById(newPost.id, author.id),
      author: this.formatUserProfile(author.id),
    };
  }

  public deletePost(postId: string, userId?: string): { success: boolean; author?: any; error?: string } {
    const index = this.state.posts.findIndex((p) => p.id === postId);
    if (index === -1) {
      return { success: false, error: 'Post not found.' };
    }

    const post = this.state.posts[index];
    if (userId && post.authorId !== userId) {
      return { success: false, error: 'Unauthorized to delete this post.' };
    }

    const authorId = post.authorId;
    this.state.posts.splice(index, 1);

    // Clean up related likes and comments
    this.state.likes = this.state.likes.filter((l) => l.postId !== postId);
    this.state.comments = this.state.comments.filter((c) => c.postId !== postId);

    this.save();

    return {
      success: true,
      author: this.formatUserProfile(authorId),
    };
  }

  // ----------------------------------------------------
  // Likes System (Authoritative)
  // ----------------------------------------------------
  public toggleLike(
    postId: string,
    userId: string
  ): {
    success: boolean;
    isLiked: boolean;
    post: any;
    notification?: NotificationRecord;
    error?: string;
  } {
    const post = this.state.posts.find((p) => p.id === postId);
    const user = this.state.users[userId];
    if (!post || !user) {
      return { success: false, isLiked: false, post: null, error: 'Post or user not found.' };
    }

    const existingIndex = this.state.likes.findIndex((l) => l.postId === postId && l.userId === userId);

    let isLiked = false;
    let notification: NotificationRecord | undefined;

    if (existingIndex >= 0) {
      // Unlike
      this.state.likes.splice(existingIndex, 1);
      isLiked = false;
    } else {
      // Like
      this.state.likes.push({
        postId,
        userId,
        createdAt: Date.now(),
      });
      isLiked = true;

      // If liked by someone other than post author, notify post author
      if (post.authorId !== userId) {
        notification = {
          id: `notif-${Date.now()}`,
          recipientId: post.authorId,
          actorId: userId,
          actorName: user.name,
          actorAvatar: user.avatar,
          actorHandle: user.username || `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
          type: 'LIKE',
          message: `${user.name} liked your post`,
          postId,
          timestamp: Date.now(),
          read: false,
        };
        this.state.notifications.unshift(notification);
      }
    }

    this.save();

    return {
      success: true,
      isLiked,
      post: this.getPostById(postId, userId),
      notification,
    };
  }

  // ----------------------------------------------------
  // Comments System (Authoritative)
  // ----------------------------------------------------
  public addComment(
    postId: string,
    authorId: string,
    text: string
  ): {
    success: boolean;
    comment: any;
    post: any;
    notification?: NotificationRecord;
    error?: string;
  } {
    const post = this.state.posts.find((p) => p.id === postId);
    const user = this.state.users[authorId];
    if (!post || !user) {
      return { success: false, comment: null, post: null, error: 'Post or user not found.' };
    }

    const now = Date.now();
    const commentRecord: CommentRecord = {
      id: `comm-${now}`,
      postId,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorHandle: user.username || `@${user.name.toLowerCase().replace(/\s+/g, '')}_${user.number}`,
      text: text.trim(),
      createdAt: now,
      exactUploadTime: formatExactUploadTime(now),
      likesCount: 0,
    };

    this.state.comments.push(commentRecord);

    let notification: NotificationRecord | undefined;
    if (post.authorId !== authorId) {
      notification = {
        id: `notif-${now}`,
        recipientId: post.authorId,
        actorId: user.id,
        actorName: user.name,
        actorAvatar: user.avatar,
        actorHandle: user.username || `@${user.name.toLowerCase().replace(/\s+/g, '')}`,
        type: 'COMMENT',
        message: `${user.name} commented on your post: "${text.slice(0, 35)}..."`,
        postId,
        timestamp: now,
        read: false,
      };
      this.state.notifications.unshift(notification);
    }

    this.save();

    return {
      success: true,
      comment: commentRecord,
      post: this.getPostById(postId, authorId),
      notification,
    };
  }

  public getComments(postId: string): CommentRecord[] {
    return this.state.comments
      .filter((c) => c.postId === postId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  // ----------------------------------------------------
  // Notifications System (Authoritative)
  // ----------------------------------------------------
  public getNotifications(userId?: string): NotificationRecord[] {
    if (!userId) return this.state.notifications;
    return this.state.notifications.filter((n) => n.recipientId === userId);
  }

  public markNotificationRead(id: string): boolean {
    const notif = this.state.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.save();
      return true;
    }
    return false;
  }

  // ----------------------------------------------------
  // Update Profile
  // ----------------------------------------------------
  public updateProfile(userId: string, updates: Partial<UserRecord>): any {
    const user = this.state.users[userId];
    if (!user) return null;

    this.state.users[userId] = {
      ...user,
      ...updates,
      stats: {
        ...user.stats,
        ...(updates.stats || {}),
      },
    };

    this.save();
    return this.formatUserProfile(userId);
  }

  // ----------------------------------------------------
  // Scans & Fixtures
  // ----------------------------------------------------
  public addScan(scan: any): any {
    this.state.scans.unshift(scan);
    this.save();
    return scan;
  }

  public getFixtures(): any[] {
    return this.state.fixtures || [];
  }

  public getFixtureById(id: string): any {
    return this.state.fixtures?.find((f) => f.id === id) || null;
  }

  public addFixture(fixture: any): any {
    this.state.fixtures.unshift(fixture);
    this.save();
    return fixture;
  }

  public updateFixture(fixture: any): any {
    this.state.fixtures = this.state.fixtures.map((f) => (f.id === fixture.id ? { ...f, ...fixture } : f));
    this.save();
    return fixture;
  }

  public deleteFixture(fixtureId: string): boolean {
    this.state.fixtures = this.state.fixtures.filter((f) => f.id !== fixtureId);
    this.save();
    return true;
  }

  public addStory(story: any): any {
    this.state.stories.unshift(story);
    this.save();
    return story;
  }

  // ----------------------------------------------------
  // Performance Sessions Management (Authoritative)
  // ----------------------------------------------------
  public getSessions(athleteId?: string): SessionRecord[] {
    if (!athleteId) return this.state.sessions || [];
    return (this.state.sessions || []).filter((s) => s.athleteId === athleteId);
  }

  public getSessionById(sessionId: string): SessionRecord | null {
    return (this.state.sessions || []).find((s) => s.id === sessionId) || null;
  }

  public addSession(sessionData: Partial<SessionRecord> & { athleteId: string }): { session: SessionRecord; athlete: any } {
    const athlete = this.getUserById(sessionData.athleteId) || this.getUserById('APX-9942');
    const athleteName = athlete?.name || sessionData.athleteName || 'Athlete';
    const now = Date.now();

    const newSession: SessionRecord = {
      id: sessionData.id || `sess-${now}-${Math.floor(Math.random() * 1000)}`,
      athleteId: sessionData.athleteId,
      athleteName,
      sessionType: sessionData.sessionType || 'MATCH',
      title: sessionData.title || `${sessionData.sessionType || 'Training'} Session`,
      date: sessionData.date || new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date()),
      timestamp: sessionData.timestamp || now,
      durationMinutes: Number(sessionData.durationMinutes) || 45,
      topSpeedKmh: sessionData.topSpeedKmh ? Number(sessionData.topSpeedKmh) : undefined,
      avgHeartRateBpm: sessionData.avgHeartRateBpm ? Number(sessionData.avgHeartRateBpm) : undefined,
      maxHeartRateBpm: sessionData.maxHeartRateBpm ? Number(sessionData.maxHeartRateBpm) : undefined,
      distanceKm: sessionData.distanceKm ? Number(sessionData.distanceKm) : undefined,
      leftGroundForceN: Number(sessionData.leftGroundForceN) || 1150,
      rightGroundForceN: Number(sessionData.rightGroundForceN) || 1180,
      symmetryPct: Number(sessionData.symmetryPct) || 96,
      jointTorqueNm: Number(sessionData.jointTorqueNm) || 175,
      acwr: Number(sessionData.acwr) || 1.12,
      rpeLoadScore: Number(sessionData.rpeLoadScore) || 7.5,
      sport: sessionData.sport,
      goalsScored: sessionData.goalsScored !== undefined ? Number(sessionData.goalsScored) : undefined,
      assistsGiven: sessionData.assistsGiven !== undefined ? Number(sessionData.assistsGiven) : undefined,
      runsScored: sessionData.runsScored !== undefined ? Number(sessionData.runsScored) : undefined,
      wicketsTaken: sessionData.wicketsTaken !== undefined ? Number(sessionData.wicketsTaken) : undefined,
      pointsScored: sessionData.pointsScored !== undefined ? Number(sessionData.pointsScored) : undefined,
      scoreResult: sessionData.scoreResult,
      notes: sessionData.notes || '',
      telemetryPoints: sessionData.telemetryPoints || [],
    };

    if (!this.state.sessions) this.state.sessions = [];
    this.state.sessions.unshift(newSession);

    // Update athlete profile stats authoritatively
    if (athlete) {
      const user = this.state.users[athlete.id];
      if (user) {
        if (!user.stats) {
          user.stats = {
            games: 0,
            goals: 0,
            assists: 0,
            topSpeed: 0,
            passAccuracy: 85,
            shotConversion: 25,
            stamina: 90,
            symmetry: 95,
            injuryRisk: 'LOW',
            acwr: 1.0,
            forceBalance: { left: 50, right: 50 },
          };
        }

        // Update top speed if new record
        if (newSession.topSpeedKmh > (user.stats.topSpeed || 0)) {
          user.stats.topSpeed = newSession.topSpeedKmh;
        }

        // Update symmetry & acwr
        user.stats.symmetry = newSession.symmetryPct;
        user.stats.acwr = newSession.acwr;
        if (newSession.sessionType === 'MATCH') {
          user.stats.games = (user.stats.games || 0) + 1;
        }

        // Increment sports stats
        if (newSession.goalsScored !== undefined) user.stats.goals = (user.stats.goals || 0) + newSession.goalsScored;
        if (newSession.assistsGiven !== undefined) user.stats.assists = (user.stats.assists || 0) + newSession.assistsGiven;
        if (newSession.runsScored !== undefined) user.stats.runs = (user.stats.runs || 0) + newSession.runsScored;
        if (newSession.wicketsTaken !== undefined) user.stats.wickets = (user.stats.wickets || 0) + newSession.wicketsTaken;
        if (newSession.pointsScored !== undefined) user.stats.points = (user.stats.points || 0) + newSession.pointsScored;

        // Calculate force balance %
        const totalForce = newSession.leftGroundForceN + newSession.rightGroundForceN;
        if (totalForce > 0) {
          const leftPct = Math.round((newSession.leftGroundForceN / totalForce) * 100);
          user.stats.forceBalance = {
            left: leftPct,
            right: 100 - leftPct,
          };
        }

        // If match, add to recentMatches
        if (newSession.sessionType === 'MATCH') {
          if (!user.recentMatches) user.recentMatches = [];
          user.recentMatches.unshift({
            id: `match-${now}`,
            opponent: newSession.title.replace('Match vs ', '').replace('Match - ', '') || 'Opposition FC',
            isHome: true,
            date: newSession.date,
            result: 'Completed',
            rating: Math.min(9.9, Math.max(7.0, Number((newSession.symmetryPct / 10).toFixed(1)))),
            score: 'Played',
            status: 'completed',
            minutesPlayed: newSession.durationMinutes,
            goalsScored: newSession.goalsScored || 0,
            assistsGiven: newSession.assistsGiven || 0,
            runsScored: newSession.runsScored,
            wicketsTaken: newSession.wicketsTaken,
            pointsScored: newSession.pointsScored,
          });
        }
      }
    }

    this.save();
    const updatedAthlete = this.formatUserProfile(sessionData.athleteId);
    return { session: newSession, athlete: updatedAthlete };
  }

  // ==========================================================
  // COURSES & ACADEMY METHODS
  // ==========================================================

  public getCourses(includeUnpublished = false): Course[] {
    const list = this.state.courses || [];
    if (includeUnpublished) return list;
    return list.filter((c) => c.isPublished);
  }

  public getCourseById(id: string): Course | null {
    return (this.state.courses || []).find((c) => c.id === id) || null;
  }

  public saveCourse(courseData: Partial<Course>): { success: boolean; course: Course; isNew: boolean } {
    if (!this.state.courses) this.state.courses = [];
    const existingIdx = this.state.courses.findIndex((c) => c.id === courseData.id);
    const now = Date.now();

    // Recalculate total duration & total lessons count
    const chapters = courseData.chapters || [];
    let totalDuration = 0;
    let totalLessons = 0;
    chapters.forEach((ch) => {
      (ch.lessons || []).forEach((les) => {
        totalLessons += 1;
        totalDuration += les.durationMinutes || 0;
      });
    });

    if (existingIdx >= 0) {
      const updated: Course = {
        ...this.state.courses[existingIdx],
        ...courseData,
        chapters,
        totalDurationMinutes: totalDuration || courseData.totalDurationMinutes || 30,
        totalLessonsCount: totalLessons || courseData.totalLessonsCount || 1,
        updatedAt: now,
      } as Course;
      this.state.courses[existingIdx] = updated;
      this.save();
      return { success: true, course: updated, isNew: false };
    } else {
      const newCourse: Course = {
        id: courseData.id || `crs-${Date.now()}`,
        title: courseData.title || 'Untitled Sports Masterclass',
        slug: (courseData.title || 'course').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: courseData.description || 'Comprehensive training breakdown.',
        longDescription: courseData.longDescription || courseData.description || '',
        thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
        category: (courseData.category as any) || 'Football',
        instructorName: courseData.instructorName || 'Apex Performance Coach',
        instructorTitle: courseData.instructorTitle || 'Elite Staff Coach',
        instructorAvatar: courseData.instructorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        level: courseData.level || 'ALL LEVELS',
        isPublished: courseData.isPublished !== undefined ? courseData.isPublished : true,
        totalDurationMinutes: totalDuration || 45,
        totalLessonsCount: totalLessons || 3,
        rating: courseData.rating || 4.9,
        enrolledCount: courseData.enrolledCount || 0,
        badge: courseData.badge || 'NEW',
        createdAt: now,
        updatedAt: now,
        chapters: chapters.length > 0 ? chapters : [
          {
            id: `ch-${now}-1`,
            title: 'Chapter 1: Fundamentals & Field Mechanics',
            description: 'Core tactical foundations and drill progressions.',
            order: 1,
            lessons: [
              {
                id: `les-${now}-1`,
                title: 'Introduction & Biomechanical Objectives',
                description: 'Key principles and kinetic indicators to focus on.',
                durationMinutes: 10,
                durationLabel: '10:00',
                videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
                thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
                order: 1,
              },
            ],
          },
        ],
      };

      this.state.courses.unshift(newCourse);
      this.save();
      return { success: true, course: newCourse, isNew: true };
    }
  }

  public deleteCourse(id: string): { success: boolean } {
    if (!this.state.courses) return { success: false };
    const beforeLen = this.state.courses.length;
    this.state.courses = this.state.courses.filter((c) => c.id !== id);
    if (this.state.courses.length !== beforeLen) {
      this.save();
      return { success: true };
    }
    return { success: false };
  }

  public enrollUserInCourse(userId: string, courseId: string): { success: boolean; progress: UserCourseProgress } {
    if (!this.state.courseProgress) this.state.courseProgress = {};
    const key = `${userId}_${courseId}`;
    const course = this.getCourseById(courseId);

    if (this.state.courseProgress[key]) {
      return { success: true, progress: this.state.courseProgress[key] };
    }

    // Determine first lesson
    const firstLessonId = course?.chapters?.[0]?.lessons?.[0]?.id;

    const progress: UserCourseProgress = {
      userId,
      courseId,
      enrolledAt: Date.now(),
      completedLessonIds: [],
      lastWatchedLessonId: firstLessonId,
      lastWatchedPositionSec: 0,
      lastWatchedTimestamp: Date.now(),
      overallProgressPct: 0,
    };

    this.state.courseProgress[key] = progress;

    // Increment enrolled count on course
    if (course) {
      course.enrolledCount = (course.enrolledCount || 0) + 1;
    }

    this.save();
    return { success: true, progress };
  }

  public updateCourseProgress(
    userId: string,
    courseId: string,
    lessonId: string,
    positionSec = 0,
    completed = false
  ): { success: boolean; progress: UserCourseProgress } {
    if (!this.state.courseProgress) this.state.courseProgress = {};
    const key = `${userId}_${courseId}`;
    let prog = this.state.courseProgress[key];

    if (!prog) {
      prog = {
        userId,
        courseId,
        enrolledAt: Date.now(),
        completedLessonIds: [],
        lastWatchedLessonId: lessonId,
        lastWatchedPositionSec: positionSec,
        lastWatchedTimestamp: Date.now(),
        overallProgressPct: 0,
      };
    }

    prog.lastWatchedLessonId = lessonId;
    prog.lastWatchedPositionSec = Math.floor(positionSec);
    prog.lastWatchedTimestamp = Date.now();

    if (completed && !prog.completedLessonIds.includes(lessonId)) {
      prog.completedLessonIds.push(lessonId);
    }

    // Calculate progress %
    const course = this.getCourseById(courseId);
    if (course) {
      let totalLessons = 0;
      course.chapters?.forEach((ch) => {
        totalLessons += ch.lessons?.length || 0;
      });
      if (totalLessons > 0) {
        prog.overallProgressPct = Math.min(100, Math.round((prog.completedLessonIds.length / totalLessons) * 100));
      }
    }

    this.state.courseProgress[key] = prog;
    this.save();
    return { success: true, progress: prog };
  }

  public getUserCoursesProgress(userId: string): Record<string, UserCourseProgress> {
    if (!this.state.courseProgress) return {};
    const result: Record<string, UserCourseProgress> = {};
    Object.entries(this.state.courseProgress).forEach(([key, prog]) => {
      if (prog.userId === userId) {
        result[prog.courseId] = prog;
      }
    });
    return result;
  }
}

export const db = new DatabaseService();
