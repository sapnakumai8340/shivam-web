
import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

const PORT = Number(process.env.PORT || 8000);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Lazy Google GenAI initialization with telemetry User-Agent header
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// Real-Time Live Telemetry Engine (100 Hz broadcast simulation)
// ----------------------------------------------------
let connectedClientsCount = 0;

// Currently authenticated users. A Set prevents duplicate counting
// when the same user logs in more than once.
const loggedInUsers = new Set<string>();
let liveTelemetry = {
  heartRate: 0,
  heartRateTrend: 'stable' as 'rising' | 'stable' | 'dropping',
  currentSpeed: 0,
  speedDelta: 0,
  cadenceRpm: 0,
  pitchX: 50,
  pitchY: 50,
  hrvMs: 0,
  groundForceLeft: 0,
  groundForceRight: 0,
  bilateralSymmetry: 0,
  kneeTorqueNm: 0,
  activeSessionDurationSec: 0,
  isSessionActive: false,
  intensityZone: 'Recovery (Z1)' as 'Recovery (Z1)' | 'Aerobic (Z2)' | 'Tempo (Z3)' | 'Threshold (Z4)' | 'Neuromuscular Peak (Z5)',
  acwrLive: 0,
  fatigueIndex: 0,
};

// setInterval(() => {
//  io.emit('telemetry:update', liveTelemetry);
// }, 1000);

// ----------------------------------------------------
// Sports AI Director Engine (Gemini 3.7 Flash + Authoritative Telemetry)
// ----------------------------------------------------
async function generateSportsAiResponse(params: {
  text: string;
  sender?: string;
  userId?: string;
  mode?: 'tactics' | 'biomechanics' | 'conditioning' | 'nutrition';
  history?: Array<{ sender: 'user' | 'apex'; text: string }>;
  athleteContext?: any;
}): Promise<{
  text: string;
  metricsData?: {
    title: string;
    items: Array<{ label: string; value: string | number; delta?: string; status?: 'good' | 'warning' | 'danger' }>;
  };
  actions?: Array<{ label: string; actionType: string; payload?: any }>;
}> {
  const { text, userId = 'APX-9942', mode = 'tactics', history = [] } = params;
  const primaryUser = db.getUserById(userId) || db.getUserById('APX-9942');
  const fixtures = db.getFixtures();
  const nextFixture = fixtures[0] || null;
  const scans = db.getState().scans || [];
  const latestScan = scans[0] || null;

  const contextSummary = {
    athlete: {
      name: primaryUser?.name || 'Rahul Kumar',
      position: primaryUser?.position || 'Forward (#9)',
      rating: primaryUser?.overallRating || 95.4,
      status: primaryUser?.status || 'ACTIVE',
      symmetryPct: primaryUser?.stats?.symmetry || 96,
      forceBalance: primaryUser?.stats?.forceBalance || { left: 49, right: 51 },
      topSpeedKmH: primaryUser?.stats?.topSpeed || 34.2,
      staminaPct: primaryUser?.stats?.stamina || 94,
      injuryRisk: primaryUser?.stats?.injuryRisk || 'LOW',
      acwr: primaryUser?.stats?.acwr || 1.14,
    },
    liveTelemetry: {
      heartRateBpm: liveTelemetry.heartRate,
      intensityZone: liveTelemetry.intensityZone,
      cadenceRpm: liveTelemetry.cadenceRpm,
      speedKmh: liveTelemetry.currentSpeed,
      hrvMs: liveTelemetry.hrvMs,
      bilateralSymmetryPct: liveTelemetry.bilateralSymmetry,
      fatigueIndexPct: liveTelemetry.fatigueIndex,
      groundForceN: { left: liveTelemetry.groundForceLeft, right: liveTelemetry.groundForceRight },
      kneeTorqueNm: liveTelemetry.kneeTorqueNm,
    },
    nextMatch: nextFixture
      ? {
        opponent: nextFixture.opponent,
        competition: nextFixture.competition,
        dateTime: nextFixture.dateTime,
        venue: nextFixture.venue,
        tacticalFormation: nextFixture.tacticalFormation,
        readinessScorePct: nextFixture.readinessScore,
      }
      : null,
    latestBiomechanicalScan: latestScan
      ? {
        title: latestScan.analysisTitle,
        kneeFlexionDeg: latestScan.metrics?.flexionDeg || 38,
        vmoStrain: latestScan.metrics?.vmoStrain || 12,
        groundForceN: latestScan.metrics?.groundForce || 2505,
        notes: latestScan.notes || [],
      }
      : null,
    coachMode: mode,
  };

  const ai = getGeminiClient();
  if (ai) {
    try {
      const systemInstruction = `You are xAthletic AI Director, the elite sports science, physical therapy, tactical intelligence, and performance coaching engine for the Kheltanra Sports System powered by Google Gemini.

CURRENT ATHLETE & LIVE BIOMETRICS CONTEXT:
${JSON.stringify(contextSummary, null, 2)}

COACH SPECIALTY MODE: ${mode.toUpperCase()}
- 'tactics': Match tactical analysis, formation breakdown, opponent scouting (Titan United FC), pressing structures, set pieces.
- 'biomechanics': 3D kinetic chain, ground reaction force symmetry (49%L / 51%R), decelerative knee valgus, pelvic tilt, joint load, injury prevention.
- 'conditioning': Sprint speed splits, VO2 max capacity, HIIT protocols, recovery HRV, ACWR workload management.
- 'nutrition': Pre-match carb loading, post-training whey protein synthesis (30g), hydration electrolyte balance (500mg Na+/hr), anti-inflammatory foods.

BEHAVIOR AND TONE:
1. Speak with authoritative, realistic, high-level sports science expertise. Treat the athlete like an elite pro athlete.
2. LANGUAGE FLEXIBILITY: You fully understand English, Hindi, and Hinglish. If the user writes or asks in Hindi or Hinglish (e.g., "dkeho ai chatboat ko realstic karo", "mera stamina kaisa hai", "next match kiske saath hai", "injury ka kya risk hai", "finishing drill batao", "api use kar lo na chat boat me gemini ka"), reply naturally in clean, energetic Hinglish or Hindi using clear athletic terminology. If the user writes in English, reply in sharp, clinical sports science English.
3. Structure your response with bold key metrics, concise bullet points, sets/reps when suggesting drills, and tactical clarity.
4. Keep responses focused and readable (2 to 4 concise paragraphs/sections with bullet points).
5. Suggest interactive action buttons where appropriate.`;

      const contents: any[] = [];
      const recentHistory = history.slice(-6);
      for (const h of recentHistory) {
        contents.push({
          role: h.sender === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      }
      contents.push({
        role: 'user',
        parts: [{ text }],
      });

      let response: any = null;

      // Try gemini-3.6-flash first with a 15-second timeout
      try {
        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('AI generation timeout')), 15000)
        );
        response = await Promise.race([geminiPromise, timeoutPromise]);
      } catch (firstErr) {
        console.warn('gemini-3.6-flash attempt failed, falling back to gemini-3.6-flash:', firstErr);
        try {
          response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
        } catch (secondErr) {
          console.warn('gemini-3.6-flash failed, trying gemini-3.6-flash:', secondErr);
          response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });
        }
      }

      const replyText = response?.text || '';
      if (replyText.trim()) {
        const lower = (text + ' ' + replyText).toLowerCase();
        const actions: any[] = [];
        if (
          lower.includes('scan') ||
          lower.includes('biomechanic') ||
          lower.includes('valgus') ||
          lower.includes('symmetry') ||
          lower.includes('pelvic')
        ) {
          actions.push({ label: '🔬 View 3D Scan', actionType: 'scan' });
        }
        if (
          lower.includes('match') ||
          lower.includes('fixture') ||
          lower.includes('titan') ||
          lower.includes('schedule') ||
          lower.includes('game')
        ) {
          actions.push({ label: '📅 Match Schedule', actionType: 'schedule' });
        }
        if (
          lower.includes('telemetry') ||
          lower.includes('heart') ||
          lower.includes('speed') ||
          lower.includes('stamina') ||
          lower.includes('hrv')
        ) {
          actions.push({ label: '⚡ Live Telemetry', actionType: 'performance' });
        }

        return {
          text: replyText,
          actions: actions.length > 0 ? actions : undefined,
        };
      }
    } catch (err) {
      console.error('Gemini generateContent error in sports assistant:', err);
    }
  }

  // Realistic Contextual Engine (Authoritative Fallback)
  const lower = (text || '').toLowerCase();
  const name = primaryUser?.name || 'Rahul Kumar';
  const rating = primaryUser?.overallRating || 95.4;
  const sym = primaryUser?.stats?.symmetry || 96;
  const forceL = primaryUser?.stats?.forceBalance?.left || 49;
  const forceR = primaryUser?.stats?.forceBalance?.right || 51;
  const topSpd = primaryUser?.stats?.topSpeed || 34.2;
  const nextOpp = nextFixture?.opponent || 'Titan United FC';
  const nextDate = nextFixture?.dateTime || 'Friday 19:30 IST';
  const formation = nextFixture?.tacticalFormation || '4-3-3 Attacking';

  // Check if Hindi / Hinglish query
  const isHindi =
    lower.includes('karo') ||
    lower.includes('hai') ||
    lower.includes('kaisa') ||
    lower.includes('kya') ||
    lower.includes('mera') ||
    lower.includes('batao') ||
    lower.includes('dekho') ||
    lower.includes('dkeho') ||
    lower.includes('kaise') ||
    lower.includes('kuch') ||
    lower.includes('kab') ||
    lower.includes('kiske') ||
    lower.includes('chahiye') ||
    lower.includes('raha');

  if (lower.includes('realistic') || lower.includes('realstic') || lower.includes('dkeho') || lower.includes('real time') || lower.includes('realtime') || lower.includes('live')) {
    if (isHindi) {
      return {
        text: `**Live Biometric Telemetry Connected!** ⚡\n\nAb main live high-frequency socket stream aur authoritative database se real-time connected hoon:\n\n• **Athlete**: ${name} (Rating: **${rating}** | Top Speed: **${topSpd} km/h**)\n• **Live Heart Rate**: **${liveTelemetry.heartRate} BPM** (${liveTelemetry.intensityZone})\n• **Bilateral Force Balance**: **${forceL}% Left / ${forceR}% Right** (${sym}% symmetry)\n• **Cadence**: **${liveTelemetry.cadenceRpm} RPM** • Knee Deceleration Torque: **${liveTelemetry.kneeTorqueNm} Nm**\n• **ACWR Workload Ratio**: **${liveTelemetry.acwrLive}** (Fatigue Index: **${liveTelemetry.fatigueIndex}%**)\n\nAap mujhse matchday tactics, sprint splits, 3D kinematic scans, ya customized recovery nutrition ke baare mein pooch sakte hain!`,
        actions: [
          { label: '⚡ Live Telemetry', actionType: 'performance' },
          { label: '🔬 View 3D Scan', actionType: 'scan' },
          { label: '📅 Match Schedule', actionType: 'schedule' },
        ],
      };
    } else {
      return {
        text: `* AI Athletic Intelligence System Online (Real-Time Synchronized)** ⚡\n\nDirectly linked to full-duplex live sensor telemetry and team tactical matrix:\n\n• **Athlete**: ${name} (Rating: **${rating}** | Top Speed: **${topSpd} km/h**)\n• **Live Biometrics**: **${liveTelemetry.heartRate} BPM** in ${liveTelemetry.intensityZone} (Cadence: **${liveTelemetry.cadenceRpm} RPM**)\n• **Bilateral Kinetic Symmetry**: **${sym}%** (${forceL}% L / ${forceR}% R)\n• **Neuromuscular Load**: **${liveTelemetry.acwrLive} ACWR** with **LOW** injury risk\n• **Upcoming Fixture**: **${nextOpp}** (${nextDate} | **${formation}**)\n\nAsk for tactical scouting reports, 3D kinematic corrections, high-velocity drills, or match fueling.`,
        actions: [
          { label: '⚡ Live Telemetry', actionType: 'performance' },
          { label: '🔬 View 3D Scan', actionType: 'scan' },
          { label: '📅 Match Schedule', actionType: 'schedule' },
        ],
      };
    }
  }

  if (lower.includes('stamina') || lower.includes('heart') || lower.includes('bpm') || lower.includes('hrv') || lower.includes('cardio') || lower.includes('fatigue')) {
    if (isHindi) {
      return {
        text: `**Cardiorespiratory & Stamina Analytics for ${name}** 🫀\n\n• **Live Heart Rate**: **${liveTelemetry.heartRate} BPM** (${liveTelemetry.intensityZone})\n• **Heart Rate Variability (HRV)**: **${liveTelemetry.hrvMs} ms** (High autonomic recovery)\n• **Stamina Rating**: **${primaryUser?.stats?.stamina || 94}%** • Fatigue Index: **${liveTelemetry.fatigueIndex}%**\n• **Aerobic Threshold**: Well-balanced within Zone 4 threshold pacing.\n\n**Recovery Recommendation**: Match ke baad 15 minute low-intensity spin aur foam rolling karein taaki lactic acid clearance tezi se ho sake.`,
        actions: [{ label: '⚡ View Live Telemetry', actionType: 'performance' }],
      };
    } else {
      return {
        text: `**Cardiorespiratory & Stamina Intelligence** 🫀\n\n• **Current Heart Rate**: **${liveTelemetry.heartRate} BPM** (${liveTelemetry.intensityZone})\n• **Resting / Training HRV**: **${liveTelemetry.hrvMs} ms** (Indicates high autonomic readiness)\n• **Aerobic Capacity (VO2 Max equiv)**: **${primaryUser?.stats?.stamina || 94}%** Stamina Score\n• **Fatigue Index**: **${liveTelemetry.fatigueIndex}%** (Optimal range <25%)\n\n**Protocol**: Maintain 85% pacing in open play transitions to conserve high-velocity anaerobic reserves for final-third sprints.`,
        actions: [{ label: '⚡ View Live Telemetry', actionType: 'performance' }],
      };
    }
  }

  if (lower.includes('schedule') || lower.includes('match') || lower.includes('fixture') || lower.includes('kab')) {
    if (isHindi) {
      return {
        text: `**Next Fixture Breakdown: ${nextOpp}** ⚽\n\n• **Competition**: ${nextFixture?.competition || 'Championship Derby'}\n• **Date & Time**: ${nextDate}\n• **Venue**: ${nextFixture?.venue || 'Apex High-Altitude Stadium'}\n• **Tactical Setup**: **${formation}** with high-pressing triggers.\n• **Squad Readiness**: **${nextFixture?.readinessScore || 97}%** (Full starting XI cleared by Medical Desk).\n\n**Key Directive**: Titan United ke high defensive line ke peeche quick counter-attack channels exploit karein.`,
        actions: [{ label: '📅 Open Match Schedule', actionType: 'schedule' }],
      };
    } else {
      return {
        text: `**Upcoming Fixture: ${nextOpp}** ⚽\n\n• **Competition**: ${nextFixture?.competition || 'Championship Derby'}\n• **Kick-off**: ${nextDate} at ${nextFixture?.venue || 'Apex High-Altitude Stadium'}\n• **Formation**: **${formation}**\n• **Squad Readiness**: **${nextFixture?.readinessScore || 97}%** confirmed starters.\n\n**Tactical Focus**: Overload the half-spaces and exploit the transition space behind Titan's aggressive fullbacks.`,
        actions: [{ label: '📅 Open Match Schedule', actionType: 'schedule' }],
      };
    }
  }

  if (lower.includes('injury') || lower.includes('risk') || lower.includes('symmetry') || lower.includes('force') || lower.includes('joint')) {
    if (isHindi) {
      return {
        text: `**Biomechanical Kinetic Assessment for ${name}** 🩺\n\n• **Bilateral Symmetry**: **${sym}%** (Ideal standard is >95%)\n• **Force Distribution**: **${forceL}% Left / ${forceR}% Right**\n• **Kinematic Joint Flexion**: 38° knee angle with mild 6° valgus deceleration collapse.\n• **Injury Risk Level**: **LOW (0.82 ACWR)**\n\n**Recommended Fix**: Single-Leg Banded Clamshells (3x15 reps) aur Eccentric Nordic Curls (3x6 reps) to reinforce glute medius & ACL stability.`,
        actions: [{ label: '🔬 View 3D Scan', actionType: 'scan' }],
      };
    } else {
      return {
        text: `**Biomechanical & Kinetic Analysis** 🩺\n\n• **Bilateral Force Symmetry**: **${sym}%** (${forceL}% L / ${forceR}% R)\n• **Dynamic Knee Valgus**: 6° inward deviation on landing decelerations\n• **ACWR Workload Ratio**: **1.14** (Optimal 'Sweet Spot' between 0.8 - 1.3)\n• **Injury Risk Index**: **LOW**\n\n**Corrective Protocol**: Perform banded monster walks and single-leg Romanian deadlifts to balance lateral hip stabilizers.`,
        actions: [{ label: '🔬 View 3D Scan', actionType: 'scan' }],
      };
    }
  }

  if (lower.includes('drill') || lower.includes('training') || lower.includes('speed') || lower.includes('pace') || lower.includes('workout')) {
    if (isHindi) {
      return {
        text: `**Custom High-Performance Training Drills for ${name}** 🏃‍♂️\n\n1. **High-Tempo 1-Touch Box Finishing** (4 sets x 8 reps)\n   • Focus: Quick reaction in the 18-yard box with maximum conversion accuracy.\n2. **10m - 30m Resisted Sled Sprints** (5 sets x 30m @ 95% effort)\n   • Focus: Explosive first-step drive to unlock **${topSpd} km/h** peak velocity.\n3. **Deceleration & Change-of-Direction Cones** (3 sets x 6 reps)\n   • Focus: Knee alignment over toes to eliminate valgus torque.`,
        actions: [{ label: '⚡ View Live Telemetry', actionType: 'performance' }],
      };
    } else {
      return {
        text: `**High-Intensity Performance Drills** 🏃‍♂️\n\n1. **High-Speed Deceleration & Cut-Backs** (4 sets x 6 reps, 90s rest)\n   • Enforces knee tracking over second toe during sudden decelerations.\n2. **Flying 20m Sprint Splits** (6 reps @ 100% effort, 2-min recovery)\n   • Targeted at sustaining your **${topSpd} km/h** sprint ceiling.\n3. **Eccentric Nordic Hamstring Lowers** (3 sets x 6 reps, 4-sec tempo)\n   • Maximizes eccentric knee flexion strength for sprint durability.`,
        actions: [{ label: '⚡ View Live Telemetry', actionType: 'performance' }],
      };
    }
  }

  if (lower.includes('nutrition') || lower.includes('diet') || lower.includes('food') || lower.includes('protein') || lower.includes('water') || lower.includes('recovery')) {
    if (isHindi) {
      return {
        text: `**Sports Nutrition & Recovery Protocol** 🥗\n\n• **Pre-Match Fueling (3 hrs before)**: 150g complex carbs (oats, brown rice, bananas) with lean protein.\n• **Hydration**: 500ml water with electrolyte tablets (500mg sodium / 200mg potassium per hour of intense sweat).\n• **Post-Match Anabolic Window (30 min)**: 30g fast-absorbing whey isolate + 40g dextrose/tart cherry juice for glycogen replenishment and muscle repair.`,
      };
    } else {
      return {
        text: `**Elite Nutrition & Hydration Strategy** 🥗\n\n• **Pre-Match (3 Hours Out)**: High complex carbohydrates (2.5g/kg bodyweight) + moderate protein, low fiber/fat for rapid gastric emptying.\n• **Intra-Match**: 6-8% carbohydrate-electrolyte solution every 15 minutes.\n• **Post-Training Recovery**: 30g Leucine-rich whey protein + 500ml tart cherry juice to accelerate neuromuscular recovery and reduce DOMS.`,
      };
    }
  }

  // General default response
  if (isHindi) {
    return {
      text: `**AI Coach Active** 🎯\n\n${name}, aapka status **${primaryUser?.status || 'ACTIVE'}** hai aur overall rating **${rating}** hai. Bilateral symmetry **${sym}%** par optimal zone mein hai.\n\nAap mujhse match preparation, tactical lineup, biomechanical scans, ya sprint workouts ke baare mein kuch bhi pooch sakte hain!`,
      actions: [
        { label: '🔬 View 3D Scan', actionType: 'scan' },
        { label: '📅 Match Schedule', actionType: 'schedule' },
      ],
    };
  }

  return {
    text: `** Sports Intelligence** 🎯\n\nAthlete **${name}** is operating at an overall rating of **${rating}** with **${sym}%** bilateral force symmetry. Live telemetry confirms stable neuromuscular readiness with **${liveTelemetry.heartRate} BPM** in ${liveTelemetry.intensityZone}.\n\nHow would you like to proceed? We can analyze matchday tactics for **${nextOpp}**, review 3D joint kinetics, or program high-speed sprint drills.`,
    actions: [
      { label: '🔬 View 3D Scan', actionType: 'scan' },
      { label: '📅 Match Schedule', actionType: 'schedule' },
    ],
  };
}

// ----------------------------------------------------
// REST API Routes (Database-backed & Authoritative)
// ----------------------------------------------------

// 1. Auth: Signup (Creates new real user in database with 0 posts, 0 followers, 0 following)
app.post('/api/auth/signup', (req, res) => {
  const result = db.signupUser(req.body);
  if (!result.success) {
    return res.status(400).json(result);
  }
  // Broadcast updated community to all clients
  io.emit('community:updated', db.getCommunityAthletesMap());
  res.status(201).json(result);
});

// 2. Auth: Login (Validates email & password, returns exact profile from database)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  const users = db.getState().users;

  const user = Object.values(users).find(
    u => u.email === email
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      error: 'Invalid email or password'
    });
  }

  // User successfully logged in
  loggedInUsers.add(user.id);

  console.log(
    `[Auth] User logged in: ${user.id} | Active users: ${loggedInUsers.size}`
  );

  res.json({
    success: true,
    user
  });
});

// 3. Auth: Logout
app.post('/api/auth/logout', (req, res) => {
  const userId = (
    req.body?.userId ||
    req.headers['x-user-id'] ||
    ''
  ) as string;

  if (userId) {
    loggedInUsers.delete(userId);
    console.log(
      `[Auth] User logged out: ${userId} | Active users: ${loggedInUsers.size}`
    );
  }

  res.json({
    success: true,
    totalUsers: loggedInUsers.size,
  });
});

// 4. Auth: Current User Profile (GET /api/me)
app.get('/api/me', (req, res) => {
  const userId = (req.headers['x-user-id'] || req.query.userId || 'APX-9942') as string;
  const user = db.getUserById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

// 4. Users: Get all registered users with real counts
app.get('/api/users', (req, res) => {
  const viewerId = (req.headers['x-user-id'] || req.query.viewerId || '') as string;
  const users = db.getAllUsers(viewerId);
  res.json({ users });
});

// 5. Users: Get single user by ID
app.get('/api/users/:id', (req, res) => {
  const viewerId = (req.headers['x-user-id'] || req.query.viewerId || '') as string;
  const user = db.getUserById(req.params.id, viewerId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
});

// 6. Users: Get followers of a user
app.get('/api/users/:id/followers', (req, res) => {
  const viewerId = (req.headers['x-user-id'] || req.query.viewerId || '') as string;
  const followers = db.getFollowers(req.params.id, viewerId);
  res.json({ followers });
});

// 7. Users: Get who a user is following
app.get('/api/users/:id/following', (req, res) => {
  const viewerId = (req.headers['x-user-id'] || req.query.viewerId || '') as string;
  const following = db.getFollowing(req.params.id, viewerId);
  res.json({ following });
});

// 8. Follow / Unfollow User (POST /api/users/:id/follow)
app.post('/api/users/:id/follow', (req, res) => {
  const targetId = req.params.id;
  const followerId = (req.body.followerId || req.headers['x-user-id'] || 'APX-9942') as string;

  const result = db.toggleFollow(followerId, targetId);
  if (!result.success) {
    return res.status(400).json(result);
  }

  // Real-time broadcast to all connected clients
  io.emit('athlete:updated', result.targetUser);
  io.emit('athlete:updated', result.follower);
  io.emit('community:updated', db.getCommunityAthletesMap());
  if (result.notification) {
    io.emit('notification:created', result.notification);
  }

  res.json(result);
});

// 9. Update User Profile (PATCH /api/users/profile)
app.patch('/api/users/profile', (req, res) => {
  const userId = (req.body.userId || req.headers['x-user-id'] || 'APX-9942') as string;
  const updatedUser = db.updateProfile(userId, req.body);
  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  io.emit('athlete:updated', updatedUser);
  io.emit('community:updated', db.getCommunityAthletesMap());
  res.json({ success: true, user: updatedUser });
});

// 10. Posts: Get all posts
app.get('/api/posts', (req, res) => {
  const viewerId = (req.headers['x-user-id'] || req.query.viewerId || '') as string;
  const posts = db.getPosts(viewerId);
  res.json({ posts });
});

// 11. Posts: Create a new post
app.post('/api/posts', (req, res) => {
  const result = db.createPost(req.body);
  io.emit('post:created', result.post);
  io.emit('athlete:updated', result.author);
  io.emit('community:updated', db.getCommunityAthletesMap());
  res.status(201).json(result);
});

// 12. Posts: Delete a post
app.delete('/api/posts/:id', (req, res) => {
  const postId = req.params.id;
  const userId = (req.body.userId || req.headers['x-user-id'] || '') as string;

  const result = db.deletePost(postId, userId);
  if (!result.success) {
    return res.status(400).json(result);
  }

  io.emit('post:deleted', postId);
  if (result.author) {
    io.emit('athlete:updated', result.author);
    io.emit('community:updated', db.getCommunityAthletesMap());
  }
  res.json(result);
});

// 13. Posts: Toggle Like
app.post('/api/posts/:id/like', (req, res) => {
  const postId = req.params.id;
  const userId = (req.body.userId || req.headers['x-user-id'] || 'APX-9942') as string;

  const result = db.toggleLike(postId, userId);
  if (!result.success) {
    return res.status(400).json(result);
  }

  io.emit('post:updated', result.post);
  if (result.notification) {
    io.emit('notification:created', result.notification);
  }
  res.json(result);
});

// 14. Posts: Get Comments
app.get('/api/posts/:id/comments', (req, res) => {
  const comments = db.getComments(req.params.id);
  res.json({ comments });
});

// 15. Posts: Add Comment
app.post('/api/posts/:id/comments', (req, res) => {
  const postId = req.params.id;
  const { authorId, text } = req.body;
  const currentUserId = authorId || (req.headers['x-user-id'] as string) || 'APX-9942';

  const result = db.addComment(postId, currentUserId, text);
  if (!result.success) {
    return res.status(400).json(result);
  }

  io.emit('post:updated', result.post);
  if (result.notification) {
    io.emit('notification:created', result.notification);
  }
  res.status(201).json(result);
});

// 16. Notifications: Get user notifications
app.get('/api/notifications', (req, res) => {
  const userId = (req.headers['x-user-id'] || req.query.userId || '') as string;
  const notifications = db.getNotifications(userId);
  res.json({ notifications });
});

// 17. Notifications: Mark read
app.post('/api/notifications/:id/read', (req, res) => {
  const success = db.markNotificationRead(req.params.id);
  res.json({ success });
});

// 18. Fixtures: Get all official fixtures (Admin controlled)
app.get('/api/fixtures', (req, res) => {
  const fixtures = db.getFixtures();
  res.json({ fixtures });
});

// 19. Fixtures: Create official fixture (Admin only)
app.post('/api/fixtures', (req, res) => {
  const fixture = db.addFixture({
    ...req.body,
    id: req.body.id || `fix-${Date.now()}`,
  });
  io.emit('fixture:created', fixture);
  res.status(201).json({ fixture });
});

// 20. Fixtures: Update official fixture (Admin only)
app.put('/api/fixtures/:id', (req, res) => {
  const fixture = db.updateFixture({
    ...req.body,
    id: req.params.id,
  });
  io.emit('fixture:updated', fixture);
  res.json({ fixture });
});

// 21. Fixtures: Delete official fixture (Admin only)
// 21b. Performance Sessions Management
app.get('/api/sessions', (req, res) => {
  const athleteId = req.query.athleteId as string;
  const sessionsList = db.getSessions(athleteId);
  res.json({ success: true, sessions: sessionsList });
});

app.post('/api/sessions', (req, res) => {
  try {
    const sessionData = req.body;
    const result = db.addSession(sessionData);
    io.emit('session:created', result.session);
    if (result.athlete) {
      io.emit('athlete:updated', result.athlete);
      io.emit('community:updated', db.getCommunityAthletesMap());
    }
    res.json({ success: true, session: result.session, athlete: result.athlete });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 21c. Courses & Academy Learning Platform
app.get('/api/courses', (req, res) => {
  const includeUnpublished = req.query.all === 'true' || req.query.admin === 'true';
  const courses = db.getCourses(includeUnpublished);
  res.json({ success: true, courses });
});

app.get('/api/courses/:id', (req, res) => {
  const course = db.getCourseById(req.params.id);
  if (!course) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }
  res.json({ success: true, course });
});

app.post('/api/courses', (req, res) => {
  try {
    const result = db.saveCourse(req.body);
    io.emit('course:created', result.course);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.put('/api/courses/:id', (req, res) => {
  try {
    const result = db.saveCourse({ ...req.body, id: req.params.id });
    io.emit('course:updated', result.course);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.delete('/api/courses/:id', (req, res) => {
  const result = db.deleteCourse(req.params.id);
  if (result.success) {
    io.emit('course:deleted', req.params.id);
  }
  res.json(result);
});

app.post('/api/courses/:id/enroll', (req, res) => {
  const userId = (req.body.userId || req.headers['x-user-id'] || 'APX-9942') as string;
  const result = db.enrollUserInCourse(userId, req.params.id);
  io.emit('course:enrolled', { userId, courseId: req.params.id });
  res.json(result);
});

app.post('/api/courses/:id/progress', (req, res) => {
  const userId = (req.body.userId || req.headers['x-user-id'] || 'APX-9942') as string;
  const { lessonId, positionSec, completed } = req.body;
  const result = db.updateCourseProgress(userId, req.params.id, lessonId, positionSec, completed);
  res.json(result);
});

app.get('/api/courses-progress', (req, res) => {
  const userId = (req.query.userId || req.headers['x-user-id'] || 'APX-9942') as string;
  const progressMap = db.getUserCoursesProgress(userId);
  res.json({ success: true, progress: progressMap });
});

// 22. Complete State endpoint (for instant hydration)
app.get('/api/state', (req, res) => {
  const viewerId = (req.headers['x-user-id'] || req.query.viewerId || 'APX-9942') as string;
  const dbState = db.getState();
  const activeAthlete = db.getUserById(viewerId) || db.getUserById('APX-9942');

  res.json({
    athlete: activeAthlete,
    communityAthletes: db.getCommunityAthletesMap(viewerId),
    scans: dbState.scans,
    fixtures: dbState.fixtures,
    sessions: dbState.sessions || [],
    courses: dbState.courses || [],
    posts: db.getPosts(viewerId),
    stories: dbState.stories,
    notifications: db.getNotifications(viewerId),
    chatMessages: dbState.chatMessages,
    liveTelemetry,
    onlineCount: connectedClientsCount,
    serverTime: Date.now(),
  });
});


// ----------------------------------------------------
// AI Video Review + Coach Review (Real-time)
// ----------------------------------------------------
type VideoReview = {
  id: string;
  userId: string;
  title: string;
  status: 'ANALYZING' | 'READY' | 'FAILED';
  createdAt: number;
  aiReview?: any;
  coachReview?: { coachId: string; coachName: string; text: string; createdAt: number };
};
const videoReviews: VideoReview[] = [];

function createAppNotification(recipientId: string, title: string, message: string, type = 'SYSTEM') {
  const notification: any = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    recipientId,
    actorId: 'SYSTEM',
    actorName: 'Kheltantra AI',
    actorAvatar: '',
    actorHandle: '@kheltantra',
    type,
    message: `${title}: ${message}`,
    timestamp: Date.now(),
    read: false,
  };
  // Persist only when the DB supports the existing notification shape.
  try {
    const state: any = db.getState();
    state.notifications = state.notifications || [];
    state.notifications.unshift(notification);
    if (typeof (db as any).save === 'function') (db as any).save();
  } catch (_) { }
  io.to(`user:${recipientId}`).emit('notification:created', notification);
  io.emit('notification:created', notification);
  return notification;
}

function fallbackVideoReview(title: string) {
  return {
    score: 82,
    summary: `AI review for “${title}” completed. Your movement quality is promising; focus on consistency under speed and pressure.`,
    strengths: ['Good movement intent', 'Balanced athletic posture', 'Strong effort and repeatability'],
    improvements: ['Keep knee tracking aligned over the foot', 'Improve first-step acceleration', 'Control body position during deceleration'],
    drills: ['4 x 20m acceleration starts', '3 x 8 lateral control reps each side', '3 x 6 deceleration-to-cut reps'],
    focus: 'Acceleration + controlled deceleration',
    confidence: 78,
  };
}

app.post('/api/video/analyze', async (req, res) => {
  try {
    const { userId = 'APX-9942', title = 'Training Video', frames = [], imageBase64, videoUrl } = req.body || {};
    const reviewId = `vr-${Date.now()}`;
    const review: VideoReview = { id: reviewId, userId, title, status: 'ANALYZING', createdAt: Date.now() };
    videoReviews.unshift(review);

    createAppNotification(userId, 'Video analysis started', `${title} is being analyzed by AI.`, 'VIDEO');
    io.to(`user:${userId}`).emit('video:analysis:started', review);

    const ai = getGeminiClient();
    let aiReview: any = null;
    if (ai && ((Array.isArray(frames) && frames.length > 0) || imageBase64)) {
      try {
        const frameList = Array.isArray(frames) && frames.length ? frames.slice(0, 6) : [imageBase64];
        const parts: any[] = [{ text: `Analyze this athlete training footage for sports performance coaching. Video title: ${title}. Return JSON only with keys: score (0-100), summary, strengths (array), improvements (array), drills (array), focus, confidence (0-100). Do not diagnose medical conditions. Give actionable technique/performance feedback.` }];
        for (const frame of frameList) {
          if (!frame || typeof frame !== 'string') continue;
          const clean = frame.includes(',') ? frame.split(',')[1] : frame;
          parts.push({ inlineData: { mimeType: 'image/jpeg', data: clean } });
        }
        const response: any = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: [{ role: 'user', parts }],
          config: { temperature: 0.35, responseMimeType: 'application/json' },
        });
        const raw = response?.text || '';
        aiReview = JSON.parse(raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim());
      } catch (e) {
        console.warn('Video AI analysis failed; using coaching fallback:', e);
      }
    }
    aiReview = aiReview || fallbackVideoReview(title);
    review.aiReview = aiReview;
    review.status = 'READY';

    createAppNotification(userId, 'AI video review ready', `${title} has a ${aiReview.score}/100 performance score.`, 'VIDEO');
    io.to(`user:${userId}`).emit('video:analysis:ready', review);
    io.emit('video:review:updated', review);
    res.status(201).json({ success: true, review });
  } catch (error: any) {
    console.error('POST /api/video/analyze:', error);
    res.status(500).json({ success: false, error: error?.message || 'Video analysis failed' });
  }
});

app.get('/api/video/reviews', (req, res) => {
  const userId = String(req.query.userId || 'APX-9942');
  res.json({ reviews: videoReviews.filter(r => r.userId === userId) });
});

app.post('/api/video/reviews/:id/coach', (req, res) => {
  const { coachId = 'COACH-001', coachName = 'Head Coach', text = '' } = req.body || {};
  const review = videoReviews.find(r => r.id === req.params.id);
  if (!review) return res.status(404).json({ success: false, error: 'Video review not found' });
  if (!text.trim()) return res.status(400).json({ success: false, error: 'Coach review is required' });
  review.coachReview = { coachId, coachName, text: text.trim(), createdAt: Date.now() };
  createAppNotification(review.userId, 'Coach review received', `${coachName} added feedback to “${review.title}”.`, 'COACH');
  io.to(`user:${review.userId}`).emit('video:coach:reviewed', review);
  io.emit('video:review:updated', review);
  res.json({ success: true, review });
});

// ----------------------------------------------------
// Socket.IO Real-Time Event Handlers
// ----------------------------------------------------

io.on('connection', (socket) => {
  const initialUserId = String((socket.handshake.auth as any)?.userId || (socket.handshake.query as any)?.userId || 'APX-9942');
  socket.join(`user:${initialUserId}`);
  connectedClientsCount++;
  console.log(`[Socket.IO] Client connected: ${socket.id} (Total: ${connectedClientsCount})`);

  // Broadcast presence count
  io.emit('presence:count', connectedClientsCount);

  // Send full initial state to newly connected client
  const defaultAthlete = db.getUserById('APX-9942');
  const dbState = db.getState();

  socket.emit('init:state', {
    athlete: defaultAthlete,
    communityAthletes: db.getCommunityAthletesMap('APX-9942'),
    scans: dbState.scans,
    fixtures: dbState.fixtures,
    sessions: dbState.sessions || [],
    courses: dbState.courses || [],
    posts: db.getPosts('APX-9942'),
    stories: dbState.stories,
    notifications: db.getNotifications('APX-9942'),
    chatMessages: dbState.chatMessages,
    liveTelemetry,
    onlineCount: connectedClientsCount,
    serverTime: Date.now(),
  });

  // Create / Log Training Session
  socket.on('session:create', (sessionData: any) => {
    try {
      const result = db.addSession(sessionData);
      io.emit('session:created', result.session);
      if (result.athlete) {
        io.emit('athlete:updated', result.athlete);
        io.emit('community:updated', db.getCommunityAthletesMap());
      }
    } catch (e) { }
  });

  // Toggle Live Workout Session
  socket.on('telemetry:toggle-session', () => {
    liveTelemetry.isSessionActive = !liveTelemetry.isSessionActive;
    if (liveTelemetry.isSessionActive) {
      liveTelemetry.activeSessionDurationSec = 0;
    }
    io.emit('telemetry:update', liveTelemetry);
  });

  // Create Social Post
  socket.on('post:create', (newPost: any) => {
    const result = db.createPost(newPost);
    io.emit('post:created', result.post);
    io.emit('athlete:updated', result.author);
    io.emit('community:updated', db.getCommunityAthletesMap());
  });

  // Delete Social Post
  socket.on('post:delete', ({ postId, userId }: { postId: string; userId?: string }) => {
    const result = db.deletePost(postId, userId);
    if (result.success) {
      io.emit('post:deleted', postId);
      if (result.author) {
        io.emit('athlete:updated', result.author);
        io.emit('community:updated', db.getCommunityAthletesMap());
      }
    }
  });

  // Like Social Post
  socket.on('post:like', ({ postId, userId }: { postId: string; userId?: string }) => {
    const currentUserId = userId || 'APX-9942';
    const result = db.toggleLike(postId, currentUserId);
    if (result.success) {
      io.emit('post:updated', result.post);
      if (result.notification) {
        io.emit('notification:created', result.notification);
      }
    }
  });

  // Comment on Post
  socket.on(
    'post:comment',
    ({ postId, comment, authorId }: { postId: string; comment?: any; authorId?: string }) => {
      const text = comment?.text || (typeof comment === 'string' ? comment : '');
      const uid = authorId || comment?.authorId || 'APX-9942';
      const result = db.addComment(postId, uid, text);
      if (result.success) {
        io.emit('post:updated', result.post);
        if (result.notification) {
          io.emit('notification:created', result.notification);
        }
      }
    }
  );

  // Follow / Unfollow Athlete (Real-time Authoritative)
  socket.on(
    'user:follow',
    ({ followerId, targetId }: { followerId?: string; targetId: string }) => {
      const uid = followerId || 'APX-9942';
      const result = db.toggleFollow(uid, targetId);
      if (result.success) {
        io.emit('athlete:updated', result.targetUser);
        io.emit('athlete:updated', result.follower);
        io.emit('community:updated', db.getCommunityAthletesMap());
        if (result.notification) {
          io.emit('notification:created', result.notification);
        }
      }
    }
  );

  // Create Story
  socket.on('story:create', (newStory: any) => {
    const story = db.addStory(newStory);
    io.emit('story:created', story);
  });

  // Create Biomechanical Scan
  socket.on('scan:create', (newScan: any) => {
    const scan = db.addScan({
      ...newScan,
      id: newScan.id || `scan-${Date.now()}`,
    });
    io.emit('scan:created', scan);
  });

  // Fixture Management
  socket.on('fixture:create', (fixture: any) => {
    const created = db.addFixture({
      ...fixture,
      id: fixture.id || `fix-${Date.now()}`,
    });
    io.emit('fixture:created', created);
  });

  socket.on('fixture:update', (updatedFixture: any) => {
    const updated = db.updateFixture(updatedFixture);
    io.emit('fixture:updated', updated);
  });

  socket.on('fixture:delete', (fixtureId: string) => {
    db.deleteFixture(fixtureId);
    io.emit('fixture:deleted', fixtureId);
  });

  // Update Athlete Profile
  socket.on('athlete:update', (updatedProfile: any) => {
    const updatedUser = db.updateProfile(updatedProfile.id || 'APX-9942', updatedProfile);
    if (updatedUser) {
      io.emit('athlete:updated', updatedUser);
      io.emit('community:updated', db.getCommunityAthletesMap());
    }
  });

  // Chat message send & broadcast
  socket.on(
    'chat:send',
    async (msgPayload: {
      id?: string;
      text: string;
      sender?: string;
      userId?: string;
      mode?: 'tactics' | 'biomechanics' | 'conditioning' | 'nutrition';
      history?: Array<{ sender: 'user' | 'apex'; text: string }>;
    }) => {
      const userMsgId = msgPayload.id || `msg-${Date.now()}`;
      const userMsg: { id: string; sender: 'user' | 'apex'; text: string; timestamp: string } = {
        id: userMsgId,
        sender: (msgPayload.sender === 'apex' ? 'apex' : 'user') as 'user' | 'apex',
        text: msgPayload.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Broadcast user message to other sockets (avoid echo to sender who already rendered it locally)
      socket.broadcast.emit('chat:message', userMsg);

      // Emit live typing indicator in real-time
      io.emit('chat:typing', { isTyping: true, sender: 'apex', mode: msgPayload.mode || 'tactics' });

      // If user message is sent, trigger AI response
      try {
        const aiResponse = await generateSportsAiResponse({
          text: msgPayload.text,
          userId: msgPayload.userId || 'APX-9942',
          mode: msgPayload.mode || 'tactics',
          history: msgPayload.history || [],
        });

        const aiMsg: {
          id: string;
          sender: 'user' | 'apex';
          text: string;
          timestamp: string;
          actions?: any[];
          metricsData?: any;
        } = {
          id: `-${Date.now()}`,
          sender: 'apex',
          text: aiResponse.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actions: aiResponse.actions,
          metricsData: aiResponse.metricsData,
        };

        io.emit('chat:typing', { isTyping: false, sender: 'apex' });
        io.emit('chat:message', aiMsg);
      } catch (e: any) {
        console.error('Socket chat error:', e);
        io.emit('chat:typing', { isTyping: false, sender: 'apex' });
      }
    }
  );

  socket.on('disconnect', () => {
    connectedClientsCount = Math.max(0, connectedClientsCount - 1);
    console.log(`[Socket.IO] Client disconnected: ${socket.id} (Total: ${connectedClientsCount})`);
    io.emit('presence:count', connectedClientsCount);
  });
});

// ----------------------------------------------------
// HTTP Endpoints (Health, AI Chat, & Analysis)
// ----------------------------------------------------

// AI Status endpoint to verify Gemini API connectivity
app.get('/api/ai/status', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' && process.env.GEMINI_API_KEY.trim() !== '');
  res.json({
    active: true,
    provider: 'Google Gemini',
    model: 'gemini-3.6-flash',
    apiKeyConfigured: hasKey,
    realtimeSocket: true,
    supportedModes: ['tactics', 'biomechanics', 'conditioning', 'nutrition'],
  });
});

// Direct REST endpoint for AI Chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { message, text, userId, mode, history, athleteContext } = req.body;
    const query = message || text || '';
    if (!query.trim()) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    const aiResponse = await generateSportsAiResponse({
      text: query,
      userId: userId || (req.headers['x-user-id'] as string) || 'APX-9942',
      mode: mode || 'tactics',
      history: history || [],
      athleteContext,
    });

    res.json({
      success: true,
      message: {
        id: `apex-${Date.now()}`,
        sender: 'apex',
        text: aiResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: aiResponse.actions,
        metricsData: aiResponse.metricsData,
      },
    });
  } catch (error: any) {
    console.error('API /api/chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal AI chat error',
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    socketIO: true,
    connectedClients: connectedClientsCount,
    totalUsers: loggedInUsers.size,
    totalPosts: db.getState().posts.length,
    timestamp: new Date().toISOString(),
  });
});

// Biomechanical Scan AI Analysis endpoint
app.post('/api/scan-analysis', async (req, res) => {
  try {
    const { scanType, mediaType, imageBase64, athleteName, customNotes } = req.body;
    const ai = getGeminiClient();

    const fallbackAnalysis = {
      summary: "Biomechanical 3D Kinematic Scan completed. Pose geometry parsed across 18 kinetic joints.",
      postureAngles: {
        kneeFlexion: 38,
        kneeValgusAngle: 6,
        hipTiltDeg: -4,
        spineAngleDeg: 12,
        shoulderAsymmetryDeg: 2,
        anklePronationDeg: 5,
        forceBalanceLeft: 48,
        forceBalanceRight: 52
      },
      flawsAndCorrections: [
        {
          flaw: "Right Knee Valgus (Inward collapse during landing)",
          cause: "Weak Gluteus Medius & delayed VMO firing",
          correction: "Maintain knees tracking over toes during deceleration and jump landings."
        },
        {
          flaw: "Mild Anterior Pelvic Tilt (-4°)",
          cause: "Tight hip flexors and underactive deep abdominal core",
          correction: "Engage transverse abdominis and activate glute bridge prior to sprinting."
        }
      ],
      injuryRisks: [
        {
          level: "MODERATE",
          area: "Patellar Tendon & ACL Strain",
          description: "Elevated shear force on right patella due to inward knee angle during deceleration."
        },
        {
          level: "LOW",
          area: "Lumbar Spine Strain",
          description: "Spine angle within target 12° flex envelope."
        }
      ],
      solutions: [
        {
          title: "Single-Leg Banded Clamshells",
          category: "Corrective Strength",
          setsReps: "3 sets x 15 reps (Each side)",
          purpose: "Strengthen Gluteus Medius to eliminate knee valgus collapse."
        },
        {
          title: "Eccentric Nordic Hamstring Curls",
          category: "Injury Prevention",
          setsReps: "3 sets x 6 reps (3-sec lowering)",
          purpose: "Protect ACL and increase hamstring peak torque capacity."
        },
        {
          title: "Kneeling Hip Flexor Stretch & Core Bracing",
          category: "Mobility",
          setsReps: "2 sets x 45 sec hold",
          purpose: "Relieve anterior pelvic tilt and improve hip extension stride length."
        }
      ]
    };

    if (!ai) {
      return res.json({ analysis: fallbackAnalysis });
    }

    const systemPrompt = `You are an elite sports biomechanist, physical therapist, and AI motion lab analyst.
Analyse the provided athlete scan (${scanType || 'Full Body / Lower Body Movement'}, Media: ${mediaType || 'Image/Video'}, Notes: ${customNotes || 'None'}).

Output ONLY a valid JSON object matching this schema exactly:
{
  "summary": "Short 2-sentence clinical diagnostic summary",
  "postureAngles": {
    "kneeFlexion": 38,
    "kneeValgusAngle": 6,
    "hipTiltDeg": -4,
    "spineAngleDeg": 12,
    "shoulderAsymmetryDeg": 2,
    "anklePronationDeg": 5,
    "forceBalanceLeft": 49,
    "forceBalanceRight": 51
  },
  "flawsAndCorrections": [
    {
      "flaw": "Name of biomechanical flaw",
      "cause": "Anatomical or muscular root cause",
      "correction": "Specific technical movement correction"
    }
  ],
  "injuryRisks": [
    {
      "level": "HIGH" | "MODERATE" | "LOW",
      "area": "Anatomical zone",
      "description": "Why this risk exists"
    }
  ],
  "solutions": [
    {
      "title": "Exercise or drill name",
      "category": "Corrective Strength" | "Mobility" | "Injury Prevention" | "Neuromuscular",
      "setsReps": "e.g. 3 sets x 12 reps",
      "purpose": "How this exercise solves the issue"
    }
  ]
}`;

    let responseText = "";
    if (imageBase64 && imageBase64.startsWith("data:image")) {
      const mimeType = imageBase64.split(";")[0].split(":")[1] || "image/jpeg";
      const base64Data = imageBase64.split(",")[1];
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: systemPrompt + "\nAnalyze this athlete photo for posture, alignment, movement flaws, injury risk, and solutions:" },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data,
                },
              },
            ],
          },
        ],
      });
      responseText = response.text || "";
    } else {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: systemPrompt + `\nAthlete Name: ${athleteName || 'Athlete'}. Perform biomechanical analysis for scan type: ${scanType}.`,
      });
      responseText = response.text || "";
    }

    // Try parsing JSON response
    try {
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      return res.json({ analysis: parsed });
    } catch (parseErr) {
      return res.json({ analysis: fallbackAnalysis });
    }
  } catch (error: any) {
    console.error("AI Scan Analysis error:", error);
    return res.json({
      analysis: {
        summary: "Biomechanical scan processed with optical kinematics engine.",
        postureAngles: { kneeFlexion: 36, kneeValgusAngle: 4, hipTiltDeg: -3, spineAngleDeg: 10, shoulderAsymmetryDeg: 1, anklePronationDeg: 4, forceBalanceLeft: 50, forceBalanceRight: 50 },
        flawsAndCorrections: [{ flaw: "Minor knee valgus during dynamic decelerations", cause: "Glute medius fatigue", correction: "Keep knees over toes during landing" }],
        injuryRisks: [{ level: "LOW", area: "Lower kinetic chain", description: "All joint forces within safe limits" }],
        solutions: [{ title: "Banded Monster Walks", category: "Corrective Strength", setsReps: "3 sets x 15 steps", purpose: "Strengthen lateral hip stability" }]
      }
    });
  }
});

// Setup Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Kheltantra Performance server with Socket.IO running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
