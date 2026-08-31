import { AthleteProfile, BiomechanicalScan, FixtureSchedule, ChatMessage, SocialPost, PlayerStory } from '../types';

export const CURRENT_ATHLETE: AthleteProfile = {
  id: 'APX-9942',
  name: 'RAHUL KUMAR',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  actionImage: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=600&q=80',
  code: '#APX-9942',
  position: 'FWD',
  role: 'STRIKER',
  number: 9,
  sportSpecialty: 'Football (Striker / Center Forward)',
  status: 'ACTIVE',
  overallRating: 94.2,
  ratingChange: 2.1,
  height: "182 cm / 6'0\"",
  weight: '76 kg / 167 lbs',
  preferredFoot: 'Right',
  age: 22,
  club: 'Premier Squad',
  handle: '@rahulkumar',
  followersCount: 14280,
  followingCount: 384,
  postsCount: 28,
  isFollowing: false,
  bio: 'Explosive center-forward specializing in high-speed penalty box transitions, bilateral kinetic balance, and clinical 1-touch finishing under physical pressure.',
  coachEvaluation: 'High-velocity sprint resilience confirmed nominal. Recommended for starting 11 in upcoming fixture with standard 75-min rotation plan.',
  adminDecision: {
    evaluatedBy: 'Coach Sarah Vance & Medical Staff',
    decisionDate: 'Oct 14, 2023',
    clearanceStatus: 'MATCH READY',
    maxWorkloadM: 920,
    targetPaceKmH: 34.5,
    trainingFocus: 'Maximal sprint deceleration symmetry and right hamstring eccentric loading.',
    notes: 'Cleared for 90-minute competitive intensity. Zero kinetic degradation detected on latest optical scan.',
    isVerified: true,
  },
  stats: {
    games: 128,
    goals: 87,
    assists: 42,
    topSpeed: 34, // km/h
    passAccuracy: 88,
    shotConversion: 29,
    stamina: 91,
    symmetry: 94,
    injuryRisk: 'LOW',
    forceBalance: {
      left: 48,
      right: 52,
    },
  },
  recentMatches: [
    {
      id: 'm1',
      opponent: 'vs. Metro City FC',
      isHome: true,
      date: 'Oct 12, 2023',
      result: 'W 3-1',
      rating: 9.2,
      score: '3 - 1',
      status: 'completed',
      goalsScored: 2,
      assistsGiven: 1,
      minutesPlayed: 90,
    },
    {
      id: 'm2',
      opponent: '@ United Hawks',
      isHome: false,
      date: 'Oct 05, 2023',
      result: 'D 1-1',
      rating: 7.8,
      score: '1 - 1',
      status: 'completed',
      goalsScored: 1,
      assistsGiven: 0,
      minutesPlayed: 84,
    },
    {
      id: 'm3',
      opponent: 'vs. Ironclad Athletic',
      isHome: true,
      date: 'Sep 28, 2023',
      result: 'W 2-0',
      rating: 8.9,
      score: '2 - 0',
      status: 'completed',
      goalsScored: 1,
      assistsGiven: 1,
      minutesPlayed: 90,
    },
    {
      id: 'm4',
      opponent: '@ Vanguard City',
      isHome: false,
      date: 'Sep 18, 2023',
      result: 'W 4-2',
      rating: 9.4,
      score: '4 - 2',
      status: 'completed',
      goalsScored: 3,
      assistsGiven: 0,
      minutesPlayed: 90,
    }
  ],
  ratingHistory: [
    { month: 'MAY', rating: 92.0, note: 'Pre-season baseline calibration' },
    { month: 'JUN', rating: 93.1, note: 'Agility & sprint program completion' },
    { month: 'JUL', rating: 95.4, note: 'Mid-summer tournament MVP' },
    { month: 'AUG', rating: 94.8, note: 'Minor hamstring fatigue deload' },
    { month: 'SEP', rating: 96.5, note: '3 consecutive clean sheet wins' },
    { month: 'OCT', rating: 97.2, note: 'Career peak following Metro City hat-trick' },
  ],
  highlights: [
    {
      id: 'h1',
      title: 'Season Opener: Hat-trick Performance',
      category: 'FEATURED REEL',
      duration: '3:42',
      thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      dateAdded: 'Oct 14, 2023',
      views: '14.2k',
      description: 'Breakdown of Rahul Kumar 3 explosive goals and positional runs against Metro City FC defense line.'
    },
    {
      id: 'h2',
      title: 'Quick Release Drill',
      category: 'TRAINING',
      duration: '0:45',
      thumbnail: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=500&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      dateAdded: 'Oct 11, 2023',
      views: '5.8k',
      description: 'High-speed 1-touch finishing in tight penalty box quarters under physical pressure.'
    },
    {
      id: 'h3',
      title: 'Corner Kick Accuracy',
      category: 'SKILLS',
      duration: '1:20',
      thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=500&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      dateAdded: 'Oct 08, 2023',
      views: '7.1k',
      description: 'In-swing curl curve trajectories and near-post header targeting.'
    },
  ],
  tapes: [
    {
      id: 't1',
      title: 'Attacking Runs Breakdown vs Metro City',
      category: 'TACTICAL CAM',
      duration: '2:45',
      thumbnail: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      dateAdded: 'Added Oct 13',
      fileSize: '480 MB',
      playerHighlight: 'Rahul Kumar #9',
      keyInsights: [
        'Explosive off-the-ball cut at 0:42 created 3.4m separation.',
        'Maximum deceleration rate reached 6.2 m/s² with optimal knee alignment.',
        'Secondary blind-side run drew two center-backs out of low block.'
      ]
    },
    {
      id: 't2',
      title: 'Speed & Agility Drills - Week 42',
      category: 'TRAINING',
      duration: '1:12',
      thumbnail: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      dateAdded: 'Added Oct 10',
      fileSize: '210 MB',
      playerHighlight: 'Rahul Kumar #9',
      keyInsights: [
        'Lateral cone transition time improved by 110ms over previous block.',
        'Ground reaction symmetry maintained at 48L / 52R balance.'
      ]
    },
  ],
};

export const RECENT_SCANS: BiomechanicalScan[] = [
  {
    id: 's1',
    athleteName: 'RAHUL K.',
    athleteId: 'APX-9942',
    scanDate: 'Oct 24, 2023',
    scanType: 'LOWER BODY',
    efficiencyScore: 88.4,
    symmetry: 94,
    injuryRisk: 'LOW',
    forceBalance: { left: 48, right: 52 },
    imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=600&q=80',
    analysisTitle: 'KNEE KINEMATICS & TIBIAL LOAD',
    metrics: {
      jointLoadN: 945,
      flexionDeg: 39,
      torqueNm: 182,
      muscleActivationPct: 89,
      vmoStrain: 12,
      groundForce: 1240,
    },
    notes: [
      'Stance phase knee angle stability within target envelope (< 40 deg deflection).',
      'Vastus Medialis Oblique (VMO) firing sequence synchronized with patellar tracking.',
      'Recommended maintaining unilateral quad loading drills before full contact.'
    ]
  },
  {
    id: 's2',
    athleteName: 'SARAH T.',
    athleteId: 'APX-8831',
    scanDate: 'Oct 22, 2023',
    scanType: 'FULL BODY',
    efficiencyScore: 92.1,
    symmetry: 96,
    injuryRisk: 'LOW',
    forceBalance: { left: 50, right: 50 },
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    analysisTitle: 'THERMAL FLUX & MUSCLE ACTIVATION',
    metrics: {
      jointLoadN: 780,
      flexionDeg: 44,
      torqueNm: 145,
      muscleActivationPct: 94,
      vmoStrain: 8,
      groundForce: 1110,
    },
    notes: [
      'Chest/Arm heat flux: 345 W/m² indicating optimal aerobic steady state.',
      'Zero bilateral pelvic tilt during high cadence sprint cycle.',
      'Slight deltoid tension noted post-plyometrics.'
    ]
  },
  {
    id: 's3',
    athleteName: 'ELENA V.',
    athleteId: 'APX-7710',
    scanDate: 'Oct 19, 2023',
    scanType: 'KINETIC CHAIN',
    efficiencyScore: 95.8,
    symmetry: 98,
    injuryRisk: 'LOW',
    forceBalance: { left: 49, right: 51 },
    imageUrl: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=600&q=80',
    analysisTitle: 'SPRINT PROPULSION & PLANT PHASE',
    metrics: {
      jointLoadN: 1020,
      flexionDeg: 35,
      torqueNm: 210,
      muscleActivationPct: 97,
      vmoStrain: 6,
      groundForce: 1450,
    },
    notes: [
      'Ground contact time clocked at world-class 88 milliseconds.',
      'Ankle stiffness quotient 1.4x standard team average.',
      'Peak energy return observed during initial acceleration stride.'
    ]
  }
];

export const UPCOMING_FIXTURES: FixtureSchedule[] = [
  {
    id: 'fix-1',
    sport: 'FOOTBALL',
    matchType: 'Championship Derby',
    opponent: ' Dragons',
    opponentLogo: '🐉',
    opponentColor: '#ff5500',
    competition: 'Premier Super Cup • Final',
    dateTime: 'Saturday, Oct 28 • 19:30',
    venue: ' National Stadium (Home)',
    surfaceType: 'Hybrid Natural Grass',
    weatherCondition: 'Floodlights • 18°C Clear',
    isHome: true,
    tacticalFormation: '4-3-3 Attacking Press',
    readinessScore: 96,
    status: 'Scheduled',
    targetReadinessMin: 90,
    adminDirectives: [
      'High-line pressing from kickoff - target opponent CB build-up.',
      'Isolate winger Sarah Vance in 1v1 wide transitions.',
      'Maintain compact midfield triangle to control second balls.'
    ],
    refereeOfficial: 'M. Oliver (FIFA Int.)',
    assignedLineup: [
      { playerId: 'APX-9942', playerName: 'Rahul Kumar', position: 'ST (#9)', number: 9, role: 'Starter', readiness: 98, status: 'Confirmed' },
      { playerId: 'APX-8831', playerName: 'Sarah Vance', position: 'LW (#11)', number: 11, role: 'Starter', readiness: 94, status: 'Confirmed' },
      { playerId: 'APX-7710', playerName: 'Elena Voss', position: 'RW (#7)', number: 7, role: 'Starter', readiness: 97, status: 'Confirmed' },
      { playerId: 'APX-6604', playerName: 'David Sterling', position: 'CAM (#10)', number: 10, role: 'Starter', readiness: 92, status: 'Confirmed' },
      { playerId: 'APX-5512', playerName: 'Mateo Silva', position: 'CM (#8)', number: 8, role: 'Starter', readiness: 90, status: 'Confirmed' },
      { playerId: 'APX-4421', playerName: 'Tariq Al-Mansoor', position: 'CDM (#6)', number: 6, role: 'Starter', readiness: 95, status: 'Confirmed' },
      { playerId: 'APX-3310', playerName: 'Lucas Walker', position: 'LB (#3)', number: 3, role: 'Starter', readiness: 88, status: 'Confirmed' },
      { playerId: 'APX-2209', playerName: 'Leo Kante', position: 'CB (#4)', number: 4, role: 'Starter', readiness: 96, status: 'Confirmed' },
      { playerId: 'APX-2208', playerName: 'Victor Sanchez', position: 'CB (#5)', number: 5, role: 'Starter', readiness: 93, status: 'Confirmed' },
      { playerId: 'APX-1104', playerName: 'Jordan Banks', position: 'RB (#2)', number: 2, role: 'Starter', readiness: 89, status: 'Confirmed' },
      { playerId: 'APX-0011', playerName: 'Kasper Lind', position: 'GK (#1)', number: 1, role: 'Starter', readiness: 99, status: 'Confirmed' },
    ]
  },
  {
    id: 'fix-2',
    sport: 'BASKETBALL',
    matchType: 'Conference Playoff',
    opponent: 'Chicago Bulls Academy',
    opponentLogo: '🏀',
    opponentColor: '#ce1141',
    competition: 'Pro Hoop Circuit • Game 3',
    dateTime: 'Monday, Oct 30 • 20:15',
    venue: 'United Metro Arena (Away)',
    surfaceType: 'Polished Hardwood Court',
    weatherCondition: 'Indoor Arena • Climate 21°C',
    isHome: false,
    tacticalFormation: '1-2-2 High Post & Motion',
    readinessScore: 94,
    status: 'Scheduled',
    targetReadinessMin: 92,
    adminDirectives: [
      'Focus defensive switch on primary pick-and-roll ballhandler.',
      'Exploit baseline cuts against zone defensive structure.',
      'Crash offensive glass on weak-side 3-point attempts.'
    ],
    refereeOfficial: 'Crew Chief T. Brothers',
    assignedLineup: [
      { playerId: 'APX-9942', playerName: 'Rahul Kumar', position: 'Point Guard (#1 PG)', number: 1, role: 'Starter', readiness: 96, status: 'Confirmed' },
      { playerId: 'APX-7710', playerName: 'Elena Voss', position: 'Shooting Guard (#2 SG)', number: 2, role: 'Starter', readiness: 97, status: 'Confirmed' },
      { playerId: 'APX-8831', playerName: 'Sarah Vance', position: 'Small Forward (#3 SF)', number: 3, role: 'Starter', readiness: 93, status: 'Confirmed' },
      { playerId: 'APX-6604', playerName: 'David Sterling', position: 'Power Forward (#4 PF)', number: 4, role: 'Starter', readiness: 91, status: 'Confirmed' },
      { playerId: 'APX-2209', playerName: 'Leo Kante', position: 'Center (#5 C)', number: 5, role: 'Starter', readiness: 95, status: 'Confirmed' },
    ]
  },
  {
    id: 'fix-3',
    sport: 'CRICKET',
    matchType: 'T20 Championship',
    opponent: 'Royal Titans XI',
    opponentLogo: '🏏',
    opponentColor: '#1d4ed8',
    competition: 'T20 Premier Trophy',
    dateTime: 'Wednesday, Nov 01 • 14:00',
    venue: 'Lord Oval Pavilion (Home)',
    surfaceType: 'Hard Baked Turf Wicket',
    weatherCondition: 'Sunny Clear • 24°C Humidity 40%',
    isHome: true,
    tacticalFormation: 'Aggressive T20 7-4 Lineup',
    readinessScore: 92,
    status: 'Scheduled',
    targetReadinessMin: 88,
    adminDirectives: [
      'Target early swing with new ball in first 4 overs.',
      'Rotate strike aggressively against spin through mid-wicket.',
      'Tight death bowling with wide yorkers and slower bouncers.'
    ],
    refereeOfficial: 'R. Kettleborough (ICC)',
    assignedLineup: [
      { playerId: 'APX-9942', playerName: 'Rahul Kumar', position: 'Opening Batsman (Capt)', number: 9, role: 'Starter', readiness: 98, status: 'Confirmed' },
      { playerId: 'APX-7710', playerName: 'Elena Voss', position: 'Opening Bowler (Pace)', number: 7, role: 'Starter', readiness: 96, status: 'Confirmed' },
      { playerId: 'APX-8831', playerName: 'Sarah Vance', position: 'Wicketkeeper Batsman', number: 11, role: 'Starter', readiness: 94, status: 'Confirmed' },
      { playerId: 'APX-6604', playerName: 'David Sterling', position: 'Top Order #3', number: 10, role: 'Starter', readiness: 90, status: 'Confirmed' },
      { playerId: 'APX-5512', playerName: 'Mateo Silva', position: 'All-Rounder (Spin)', number: 8, role: 'Starter', readiness: 92, status: 'Confirmed' },
      { playerId: 'APX-4421', playerName: 'Tariq Al-Mansoor', position: 'Death Specialist Pace', number: 6, role: 'Starter', readiness: 95, status: 'Confirmed' },
    ]
  },
  {
    id: 'fix-4',
    sport: 'TENNIS',
    matchType: 'Grand Slam Masters Open',
    opponent: 'Alexander Novak (World #4)',
    opponentLogo: '🎾',
    opponentColor: '#eab308',
    competition: 'International ATP 1000 Classic',
    dateTime: 'Friday, Nov 03 • 17:00',
    venue: 'Centre Court Arena (Home)',
    surfaceType: 'Acrylic Hard Court',
    weatherCondition: 'Retractable Roof Open • 20°C',
    isHome: true,
    tacticalFormation: 'Singles Championship Seed #1',
    readinessScore: 97,
    status: 'Scheduled',
    targetReadinessMin: 95,
    adminDirectives: [
      'Attack second serve with deep topspin forehand returns.',
      'Deploy drop-shot variations to break opponent baseline rhythm.',
      'Protect first-serve percentage above 68% threshold.'
    ],
    refereeOfficial: 'Eva Asderaki (Gold Badge)',
    assignedLineup: [
      { playerId: 'APX-9942', playerName: 'Rahul Kumar', position: 'Main Draw Singles #1', number: 1, role: 'Starter', readiness: 98, status: 'Confirmed' },
      { playerId: 'APX-7710', playerName: 'Elena Voss', position: 'Hitting Partner / Coach', number: 2, role: 'Substitute', readiness: 95, status: 'Confirmed' },
    ]
  },
  {
    id: 'fix-5',
    sport: 'RUGBY',
    matchType: 'Continental Derby',
    opponent: 'Auckland Crusaders Pack',
    opponentLogo: '🏉',
    opponentColor: '#059669',
    competition: 'Pacific Elite Rugby Championship',
    dateTime: 'Saturday, Nov 04 • 18:00',
    venue: 'Sky Stadium Rugby Ground (Away)',
    surfaceType: 'Heavy Grass Turf',
    weatherCondition: 'Breezy • 15°C Overcast',
    isHome: false,
    tacticalFormation: '15-a-side Dominant Pack',
    readinessScore: 91,
    status: 'Scheduled',
    targetReadinessMin: 90,
    adminDirectives: [
      'Dominate first-phase set piece scrums and line-outs.',
      'Fast ruck recycle time under 2.8 seconds.',
      'Tactical territorial kicking behind opponent defensive line.'
    ],
    refereeOfficial: 'N. Owens (WR Referee)',
    assignedLineup: [
      { playerId: 'APX-9942', playerName: 'Rahul Kumar', position: 'Fly-Half (#10)', number: 10, role: 'Starter', readiness: 97, status: 'Confirmed' },
      { playerId: 'APX-8831', playerName: 'Sarah Vance', position: 'Winger (#11)', number: 11, role: 'Starter', readiness: 93, status: 'Confirmed' },
      { playerId: 'APX-2209', playerName: 'Leo Kante', position: 'Number 8 Lock (#8)', number: 8, role: 'Starter', readiness: 95, status: 'Confirmed' },
      { playerId: 'APX-4421', playerName: 'Tariq Al-Mansoor', position: 'Inside Centre (#12)', number: 12, role: 'Starter', readiness: 92, status: 'Confirmed' },
    ]
  },
  {
    id: 'fix-6',
    sport: 'ATHLETICS',
    matchType: 'Diamond League Finals',
    opponent: 'Global Sprint Invitational',
    opponentLogo: '🏃',
    opponentColor: '#8b5cf6',
    competition: 'World Athletics Continental Tour',
    dateTime: 'Sunday, Nov 05 • 15:30',
    venue: 'Olympic Tartan Stadium (Home)',
    surfaceType: '400m 8-Lane Tartan Track',
    weatherCondition: 'Tailwind +1.2 m/s • 23°C',
    isHome: true,
    tacticalFormation: '4x100m Sprint Relay Squad',
    readinessScore: 98,
    status: 'Scheduled',
    targetReadinessMin: 94,
    adminDirectives: [
      'Blind handoff zone execution perfected within 20m window.',
      'Explosive start drive block angle between 45°-50°.',
      'Maintain maximum stride frequency in 60m-100m transition.'
    ],
    refereeOfficial: 'World Athletics Starter Jury',
    assignedLineup: [
      { playerId: 'APX-9942', playerName: 'Rahul Kumar', position: 'Anchor Leg 4 (Sprint)', number: 4, role: 'Starter', readiness: 99, status: 'Confirmed' },
      { playerId: 'APX-7710', playerName: 'Elena Voss', position: 'Bend Leg 3 (Curve)', number: 3, role: 'Starter', readiness: 98, status: 'Confirmed' },
      { playerId: 'APX-8831', playerName: 'Sarah Vance', position: 'Straightaway Leg 2', number: 2, role: 'Starter', readiness: 95, status: 'Confirmed' },
      { playerId: 'APX-3310', playerName: 'Lucas Walker', position: 'Block Start Leg 1', number: 1, role: 'Starter', readiness: 92, status: 'Confirmed' },
    ]
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'apex',
    text: "Morning, Coach. I've analyzed yesterday's sprint data. The team averaged a 5% drop in top speed during the final quarter.",
    timestamp: 'TODAY, 08:30 AM',
  },
  {
    id: 'msg-2',
    sender: 'user',
    text: 'Show me the top 3 players with the most significant drop-off.',
    timestamp: 'TODAY, 08:31 AM',
  },
  {
    id: 'msg-3',
    sender: 'apex',
    text: "Here are the players showing the highest fatigue indicators in Q4 based on GPS telemetry and force plate sensors:\n\n1. **#11 Sarah Vance (LW)** - 8.4% velocity drop (Peak 32.1 -> 29.4 km/h) • High quad deceleration strain.\n2. **#3 Lucas Walker (LB)** - 7.1% velocity drop (Peak 30.8 -> 28.6 km/h) • Recommended active recovery.\n3. **#8 Mateo Silva (CM)** - 6.8% velocity drop • Ground reaction asymmetry increased to 45L / 55R.\n\n*Rahul Kumar (#9)* maintained 97% sprint output with zero biomechanical deficit.",
    timestamp: 'TODAY, 08:32 AM',
    metricsData: {
      title: 'Q4 Velocity & Fatigue Breakdown',
      items: [
        { label: 'Sarah Vance #11', value: '-8.4%', delta: 'High Quad Strain', status: 'warning' },
        { label: 'Lucas Walker #3', value: '-7.1%', delta: 'Deload Prescribed', status: 'warning' },
        { label: 'Mateo Silva #8', value: '-6.8%', delta: '45L/55R Asymmetry', status: 'warning' },
        { label: 'Rahul Kumar #9', value: '-0.8%', delta: 'Peak Condition', status: 'good' },
      ]
    },
    actions: [
      { label: 'Schedule Cryo Deload', actionType: 'schedule_recovery' },
      { label: 'Adjust Roster Minutes', actionType: 'open_roster' },
    ]
  }
];

export interface TelemetryDataPoint {
  minute: number;
  label: string;
  velocityKmh: number;
  heartRateBpm: number;
  leftGroundForceN: number;
  rightGroundForceN: number;
  jointTorqueNm: number;
  fatiguePct: number;
  sprintEffort: number;
}

export const MATCH_TELEMETRY_SERIES: TelemetryDataPoint[] = [
  { minute: 0, label: "0'", velocityKmh: 0, heartRateBpm: 72, leftGroundForceN: 720, rightGroundForceN: 730, jointTorqueNm: 85, fatiguePct: 4, sprintEffort: 0 },
  { minute: 10, label: "10'", velocityKmh: 28.4, heartRateBpm: 148, leftGroundForceN: 1180, rightGroundForceN: 1205, jointTorqueNm: 154, fatiguePct: 12, sprintEffort: 75 },
  { minute: 20, label: "20'", velocityKmh: 31.2, heartRateBpm: 164, leftGroundForceN: 1320, rightGroundForceN: 1340, jointTorqueNm: 178, fatiguePct: 19, sprintEffort: 88 },
  { minute: 30, label: "30'", velocityKmh: 34.6, heartRateBpm: 178, leftGroundForceN: 1460, rightGroundForceN: 1475, jointTorqueNm: 205, fatiguePct: 28, sprintEffort: 98 },
  { minute: 40, label: "40'", velocityKmh: 27.5, heartRateBpm: 162, leftGroundForceN: 1190, rightGroundForceN: 1210, jointTorqueNm: 160, fatiguePct: 37, sprintEffort: 68 },
  { minute: 45, label: "HT", velocityKmh: 12.0, heartRateBpm: 115, leftGroundForceN: 840, rightGroundForceN: 850, jointTorqueNm: 95, fatiguePct: 29, sprintEffort: 20 },
  { minute: 55, label: "55'", velocityKmh: 33.1, heartRateBpm: 172, leftGroundForceN: 1380, rightGroundForceN: 1410, jointTorqueNm: 192, fatiguePct: 44, sprintEffort: 92 },
  { minute: 65, label: "65'", velocityKmh: 34.8, heartRateBpm: 184, leftGroundForceN: 1490, rightGroundForceN: 1520, jointTorqueNm: 212, fatiguePct: 56, sprintEffort: 100 },
  { minute: 75, label: "75'", velocityKmh: 29.8, heartRateBpm: 175, leftGroundForceN: 1280, rightGroundForceN: 1330, jointTorqueNm: 176, fatiguePct: 68, sprintEffort: 82 },
  { minute: 85, label: "85'", velocityKmh: 32.4, heartRateBpm: 188, leftGroundForceN: 1360, rightGroundForceN: 1440, jointTorqueNm: 188, fatiguePct: 78, sprintEffort: 90 },
  { minute: 90, label: "90'+", velocityKmh: 30.5, heartRateBpm: 182, leftGroundForceN: 1250, rightGroundForceN: 1390, jointTorqueNm: 169, fatiguePct: 84, sprintEffort: 85 },
];

export interface SquadPlayerTelemetry {
  id: string;
  name: string;
  position: string;
  jersey: number;
  topSpeed: number; // km/h
  sprintDistanceM: number;
  totalDistanceKm: number;
  acwr: number; // Acute:Chronic Workload Ratio
  symmetryPct: number;
  readinessScore: number;
  injuryRiskScore: number; // 0-100 (lower is better)
  riskCategory: 'LOW' | 'MODERATE' | 'ELEVATED';
  jointStrain: 'NORMAL' | 'HAMSTRING ALERT' | 'ADDUCTOR' | 'PATELLAR';
  status: 'ACTIVE' | 'REST' | 'REHAB';
}

export const SQUAD_TELEMETRY_ROSTER: SquadPlayerTelemetry[] = [
  { id: 'APX-9942', name: 'Rahul Kumar', position: 'FWD (ST)', jersey: 9, topSpeed: 34.8, sprintDistanceM: 840, totalDistanceKm: 11.4, acwr: 1.15, symmetryPct: 95, readinessScore: 97, injuryRiskScore: 12, riskCategory: 'LOW', jointStrain: 'NORMAL', status: 'ACTIVE' },
  { id: 'APX-8831', name: 'Sarah Vance', position: 'FWD (LW)', jersey: 11, topSpeed: 33.2, sprintDistanceM: 920, totalDistanceKm: 11.9, acwr: 1.38, symmetryPct: 91, readinessScore: 84, injuryRiskScore: 38, riskCategory: 'MODERATE', jointStrain: 'HAMSTRING ALERT', status: 'ACTIVE' },
  { id: 'APX-7710', name: 'Elena Voss', position: 'FWD (RW)', jersey: 7, topSpeed: 34.1, sprintDistanceM: 880, totalDistanceKm: 10.8, acwr: 1.18, symmetryPct: 97, readinessScore: 95, injuryRiskScore: 15, riskCategory: 'LOW', jointStrain: 'NORMAL', status: 'ACTIVE' },
  { id: 'APX-6604', name: 'David Sterling', position: 'MID (CAM)', jersey: 10, topSpeed: 31.8, sprintDistanceM: 680, totalDistanceKm: 12.6, acwr: 1.22, symmetryPct: 93, readinessScore: 91, injuryRiskScore: 22, riskCategory: 'LOW', jointStrain: 'NORMAL', status: 'ACTIVE' },
  { id: 'APX-5512', name: 'Mateo Silva', position: 'MID (CM)', jersey: 8, topSpeed: 30.5, sprintDistanceM: 590, totalDistanceKm: 13.2, acwr: 1.45, symmetryPct: 88, readinessScore: 82, injuryRiskScore: 42, riskCategory: 'MODERATE', jointStrain: 'ADDUCTOR', status: 'ACTIVE' },
  { id: 'APX-4421', name: 'Tariq Al-Mansoor', position: 'MID (CDM)', jersey: 6, topSpeed: 29.8, sprintDistanceM: 510, totalDistanceKm: 12.8, acwr: 1.12, symmetryPct: 94, readinessScore: 94, injuryRiskScore: 18, riskCategory: 'LOW', jointStrain: 'NORMAL', status: 'ACTIVE' },
  { id: 'APX-3310', name: 'Lucas Walker', position: 'DEF (LB)', jersey: 3, topSpeed: 32.4, sprintDistanceM: 780, totalDistanceKm: 11.1, acwr: 1.52, symmetryPct: 87, readinessScore: 76, injuryRiskScore: 64, riskCategory: 'ELEVATED', jointStrain: 'PATELLAR', status: 'REST' },
  { id: 'APX-2209', name: 'Leo Kante', position: 'DEF (CB)', jersey: 4, topSpeed: 31.2, sprintDistanceM: 450, totalDistanceKm: 9.8, acwr: 1.08, symmetryPct: 96, readinessScore: 96, injuryRiskScore: 10, riskCategory: 'LOW', jointStrain: 'NORMAL', status: 'ACTIVE' },
  { id: 'APX-2208', name: 'Victor Sanchez', position: 'DEF (CB)', jersey: 5, topSpeed: 30.9, sprintDistanceM: 430, totalDistanceKm: 9.6, acwr: 1.10, symmetryPct: 94, readinessScore: 93, injuryRiskScore: 14, riskCategory: 'LOW', jointStrain: 'NORMAL', status: 'ACTIVE' },
  { id: 'APX-1104', name: 'Jordan Banks', position: 'DEF (RB)', jersey: 2, topSpeed: 32.9, sprintDistanceM: 760, totalDistanceKm: 11.3, acwr: 1.25, symmetryPct: 92, readinessScore: 89, injuryRiskScore: 26, riskCategory: 'LOW', jointStrain: 'NORMAL', status: 'ACTIVE' },
  { id: 'APX-0011', name: 'Kasper Lind', position: 'GK (#1)', jersey: 1, topSpeed: 22.4, sprintDistanceM: 120, totalDistanceKm: 4.8, acwr: 0.95, symmetryPct: 98, readinessScore: 99, injuryRiskScore: 6, riskCategory: 'LOW', jointStrain: 'NORMAL', status: 'ACTIVE' },
];

export const KINETIC_ASYMMETRY_DATA = [
  { muscleGroup: 'Quadriceps', leftPower: 92, rightPower: 96, target: 95, unit: '%' },
  { muscleGroup: 'Hamstrings', leftPower: 86, rightPower: 94, target: 90, unit: '%' },
  { muscleGroup: 'Adductors', leftPower: 88, rightPower: 91, target: 90, unit: '%' },
  { muscleGroup: 'Calves / Achilles', leftPower: 95, rightPower: 95, target: 95, unit: '%' },
  { muscleGroup: 'Gluteus Medius', leftPower: 91, rightPower: 94, target: 92, unit: '%' },
  { muscleGroup: 'Core Rotators', leftPower: 94, rightPower: 93, target: 95, unit: '%' },
];

export const WORKLOAD_HISTORY_7DAYS = [
  { day: 'Mon', acuteLoad: 680, chronicLoad: 620, readiness: 96, highSpeedM: 740 },
  { day: 'Tue', acuteLoad: 890, chronicLoad: 640, readiness: 92, highSpeedM: 920 },
  { day: 'Wed', acuteLoad: 420, chronicLoad: 630, readiness: 95, highSpeedM: 350 },
  { day: 'Thu', acuteLoad: 950, chronicLoad: 660, readiness: 89, highSpeedM: 1040 },
  { day: 'Fri', acuteLoad: 310, chronicLoad: 650, readiness: 98, highSpeedM: 220 },
  { day: 'Sat (Match)', acuteLoad: 1180, chronicLoad: 710, readiness: 94, highSpeedM: 1280 },
  { day: 'Sun (Deload)', acuteLoad: 240, chronicLoad: 690, readiness: 97, highSpeedM: 80 },
];

export const INITIAL_FOLLOWER_NOTIFICATIONS = [
  {
    id: 'fn-1',
    userId: 'APX-7710',
    name: 'Elena Voss',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    handle: '@elenavoss_7',
    timestamp: Date.now() - 1000 * 45, // 45s ago
    isMutual: true
  },
  {
    id: 'fn-2',
    userId: 'APX-8831',
    name: 'Sarah Vance',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    handle: '@sarahvance_11',
    timestamp: Date.now() - 1000 * 60 * 8, // 8m ago
    isMutual: true
  },
  {
    id: 'fn-3',
    userId: 'APX-6604',
    name: 'David Sterling',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    handle: '@dsterling_10',
    timestamp: Date.now() - 1000 * 60 * 32, // 32m ago
    isMutual: true
  }
];

export const INITIAL_STORIES: PlayerStory[] = [
  {
    id: 'story-user',
    playerId: 'APX-9942',
    playerName: 'Your Story',
    playerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    playerHandle: '@rahulkumar',
    hasUnseen: false,
    stories: [
      {
        id: 'st-1',
        mediaUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
        mediaType: 'photo',
        caption: 'Pre-match activation workout complete! 🔥 #Ready',
        timestamp: '18m ago',
        createdAt: Date.now() - 1000 * 60 * 18,
        telemetrySnippet: 'Heart Rate: 164 BPM • Readiness: 98%'
      }
    ]
  },
  {
    id: 'story-sarah',
    playerId: 'APX-8831',
    playerName: 'Sarah Vance',
    playerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    playerHandle: '@sarahvance_11',
    hasUnseen: true,
    stories: [
      {
        id: 'st-2',
        mediaUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
        mediaType: 'photo',
        caption: 'Speed ladder drills on matchday -1 ⚡️',
        timestamp: '45m ago',
        createdAt: Date.now() - 1000 * 60 * 45,
        telemetrySnippet: 'Cadence: 4.8 steps/sec'
      }
    ]
  },
  {
    id: 'story-elena',
    playerId: 'APX-7710',
    playerName: 'Elena Voss',
    playerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    playerHandle: '@elenavoss_7',
    hasUnseen: true,
    stories: [
      {
        id: 'st-3',
        mediaUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
        mediaType: 'photo',
        caption: 'Target practice! Top bin angles 🎯⚽️',
        timestamp: '2h ago',
        createdAt: Date.now() - 1000 * 60 * 120,
        telemetrySnippet: 'Shot Speed: 104 km/h'
      }
    ]
  },
  {
    id: 'story-david',
    playerId: 'APX-6604',
    playerName: 'David Sterling',
    playerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    playerHandle: '@dsterling_10',
    hasUnseen: true,
    stories: [
      {
        id: 'st-4',
        mediaUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=800&q=80',
        mediaType: 'photo',
        caption: 'Tactical film review with Coach Henderson 📋',
        timestamp: '4h ago',
        createdAt: Date.now() - 1000 * 60 * 240,
        telemetrySnippet: 'Vision Map: 34 key passes'
      }
    ]
  },
  {
    id: 'story-mateo',
    playerId: 'APX-5512',
    playerName: 'Mateo Silva',
    playerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&q=80',
    playerHandle: '@mateo_silva8',
    hasUnseen: false,
    stories: [
      {
        id: 'st-5',
        mediaUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
        mediaType: 'photo',
        caption: 'Cryotherapy and recovery plunge 🧊',
        timestamp: '6h ago',
        createdAt: Date.now() - 1000 * 60 * 360,
        telemetrySnippet: 'Temp: 4°C • Recovery Score: 92%'
      }
    ]
  }
];

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    authorId: 'APX-9942',
    authorName: 'Rahul Kumar',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    authorHandle: '@rahulkumar',
    authorClub: 'Premier Squad',
    authorPosition: 'Striker (#9)',
    authorNumber: 9,
    isVerified: true,
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1000&q=80',
    caption: 'Championship derby ready under the floodlights. Dialed in 95% bilateral symmetry on the morning scan. Let’s get these 3 points! ⚽️⚡️ #Matchday #ApexFC #StrikerLife',
    category: 'MATCHDAY',
    timestamp: '12m ago',
    createdAt: Date.now() - 1000 * 60 * 12,
    exactUploadTime: '14 Aug 2026, 07:07 AM',
    likesCount: 1482,
    isLiked: true,
    isSaved: true,
    commentsCount: 38,
    location: 'Arena Stadium',
    telemetryTag: '95% Symmetry • 34.8 km/h Sprint Peak',
    viewsCount: '12.4k',
    comments: [
      {
        id: 'c1',
        authorId: 'APX-8831',
        authorName: 'Sarah Vance',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        authorHandle: '@sarahvance_11',
        text: 'Putting that through-ball on a plate for you today! 🎯',
        timestamp: '6m ago',
        createdAt: Date.now() - 1000 * 60 * 6,
        likesCount: 24
      },
      {
        id: 'c2',
        authorId: 'APX-6604',
        authorName: 'David Sterling',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
        authorHandle: '@dsterling_10',
        text: 'Absolute machine brother, let’s win this. 🔥',
        timestamp: '2m ago',
        createdAt: Date.now() - 1000 * 60 * 2,
        likesCount: 16
      }
    ]
  },
  {
    id: 'post-2',
    authorId: 'APX-8831',
    authorName: 'Sarah Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    authorHandle: '@sarahvance_11',
    authorClub: 'Apex Premier Squad',
    authorPosition: 'Left Wing (#11)',
    authorNumber: 11,
    isVerified: true,
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80',
    caption: 'High-speed wing transition & cross drills. Clocked 33.2 km/h during the last progression rep! 💨👟 #SpeedDrills #Winger #ApexTelemetry',
    category: 'TRAINING',
    timestamp: '48m ago',
    createdAt: Date.now() - 1000 * 60 * 48,
    exactUploadTime: '14 Aug 2026, 06:31 AM',
    likesCount: 2190,
    isLiked: false,
    isSaved: false,
    commentsCount: 54,
    location: 'Apex Training Facility Ground 1',
    telemetryTag: 'Top Speed: 33.2 km/h • 920m High Speed Running',
    viewsCount: '18.9k',
    comments: [
      {
        id: 'c3',
        authorId: 'APX-7710',
        authorName: 'Elena Voss',
        authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
        authorHandle: '@elenavoss_7',
        text: 'That deceleration cut was lethal!! 🔥🔥',
        timestamp: '30m ago',
        createdAt: Date.now() - 1000 * 60 * 30,
        likesCount: 31
      }
    ]
  },
  {
    id: 'post-3',
    authorId: 'APX-7710',
    authorName: 'Elena Voss',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    authorHandle: '@elenavoss_7',
    authorClub: 'Apex Premier Squad',
    authorPosition: 'Right Wing (#7)',
    authorNumber: 7,
    isVerified: true,
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1000&q=80',
    caption: 'Precision is everything. Free kick practice after full team tactical training. 98% kinetic chain efficiency. 🎯⚽️ #FreeKickSpecialist #ApexPerformance',
    category: 'GOAL',
    timestamp: '2h ago',
    createdAt: Date.now() - 1000 * 60 * 120,
    exactUploadTime: '14 Aug 2026, 05:19 AM',
    likesCount: 3410,
    isLiked: true,
    isSaved: false,
    commentsCount: 82,
    location: 'Metro Olympic Training Ground',
    telemetryTag: 'Kinetic Chain Score: 98% • 102 km/h Ball Velocity',
    viewsCount: '24.1k',
    comments: [
      {
        id: 'c4',
        authorId: 'APX-9942',
        authorName: 'Rahul Kumar',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
        authorHandle: '@rahulkumar',
        text: 'Top corner every single time! Untouchable 🚀',
        timestamp: '1h ago',
        createdAt: Date.now() - 1000 * 60 * 60,
        likesCount: 42
      }
    ]
  },
  {
    id: 'post-4',
    authorId: 'APX-6604',
    authorName: 'David Sterling',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    authorHandle: '@dsterling_10',
    authorClub: 'Apex Premier Squad',
    authorPosition: 'Playmaker (CAM #10)',
    authorNumber: 10,
    isVerified: true,
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1000&q=80',
    caption: 'Full focus on spatial awareness and 360 scanning. The game is won in the mind before the pitch. 🧠⚽️ #TacticalMind #Number10',
    category: 'BIOMECHANICS',
    timestamp: '5h ago',
    createdAt: Date.now() - 1000 * 60 * 300,
    exactUploadTime: '14 Aug 2026, 02:19 AM',
    likesCount: 1870,
    isLiked: false,
    commentsCount: 29,
    location: 'Apex Bio-Kinetic Lab',
    telemetryTag: 'Reaction Time: 180ms • Workload ACWR: 1.22',
    viewsCount: '9.8k',
    comments: []
  },
  {
    id: 'post-5',
    authorId: 'APX-0011',
    authorName: 'Kasper Lind',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    authorHandle: '@kasper_gk1',
    authorClub: 'Apex Premier Squad',
    authorPosition: 'Goalkeeper (#1)',
    authorNumber: 1,
    isVerified: true,
    mediaType: 'video',
    mediaUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1000&q=80',
    caption: 'Clean sheet mentality. Reflex dive drills with 85ms reaction timing on rapid deflections! 🧤🛡️ #Goalkeeper #CleanSheet #Wall',
    category: 'TRAINING',
    timestamp: '1d ago',
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    exactUploadTime: '13 Aug 2026, 07:19 AM',
    likesCount: 2640,
    isLiked: true,
    commentsCount: 46,
    location: 'Apex Goalkeeping Academy',
    telemetryTag: 'Dive Velocity: 4.6 m/s • 99% Readiness Score',
    viewsCount: '15.2k',
    comments: []
  }
];

export const COMMUNITY_ATHLETES: Record<string, AthleteProfile> = {
  'APX-9942': CURRENT_ATHLETE,
  'APX-8831': {
    id: 'APX-8831',
    name: 'SARAH VANCE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    actionImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80',
    code: '#APX-8831',
    position: 'FWD',
    role: 'LEFT WINGER',
    number: 11,
    sportSpecialty: 'Football (Left Winger / Speed Sprint)',
    status: 'ACTIVE',
    overallRating: 92.4,
    ratingChange: 1.8,
    height: "174 cm / 5'8\"",
    weight: '65 kg / 143 lbs',
    preferredFoot: 'Left',
    age: 22,
    club: 'Apex Premier Squad',
    handle: '@sarahvance_11',
    followersCount: 28400,
    followingCount: 412,
    postsCount: 45,
    isFollowing: true,
    bio: 'Electric left-wing specialist with explosive acceleration, rapid change-of-direction cuts, and lethal pinpoint crosses.',
    stats: {
      games: 98,
      goals: 44,
      assists: 61,
      topSpeed: 33.2,
      passAccuracy: 91,
      shotConversion: 24,
      stamina: 94,
      symmetry: 96,
      injuryRisk: 'LOW',
      forceBalance: { left: 50, right: 50 }
    },
    recentMatches: [],
    ratingHistory: [],
    highlights: [],
    tapes: []
  },
  'APX-7710': {
    id: 'APX-7710',
    name: 'ELENA VOSS',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    actionImage: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=600&q=80',
    code: '#APX-7710',
    position: 'FWD',
    role: 'RIGHT WINGER',
    number: 7,
    sportSpecialty: 'Football (Inverted Winger & Free Kicks)',
    status: 'ACTIVE',
    overallRating: 95.8,
    ratingChange: 2.4,
    height: "178 cm / 5'10\"",
    weight: '69 kg / 152 lbs',
    preferredFoot: 'Right',
    age: 24,
    club: 'Apex Premier Squad',
    handle: '@elenavoss_7',
    followersCount: 39100,
    followingCount: 298,
    postsCount: 62,
    isFollowing: true,
    bio: 'Dynamic inverted forward known for long-range curling finishes, set-piece precision, and 98% kinetic chain symmetry.',
    stats: {
      games: 114,
      goals: 62,
      assists: 53,
      topSpeed: 34.1,
      passAccuracy: 89,
      shotConversion: 31,
      stamina: 96,
      symmetry: 98,
      injuryRisk: 'LOW',
      forceBalance: { left: 49, right: 51 }
    },
    recentMatches: [],
    ratingHistory: [],
    highlights: [],
    tapes: []
  },
  'APX-6604': {
    id: 'APX-6604',
    name: 'DAVID STERLING',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    actionImage: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
    code: '#APX-6604',
    position: 'MID',
    role: 'PLAYMAKER',
    number: 10,
    sportSpecialty: 'Football (Central Playmaker & Vision)',
    status: 'ACTIVE',
    overallRating: 91.2,
    ratingChange: 1.1,
    height: "182 cm / 5'11\"",
    weight: '76 kg / 167 lbs',
    preferredFoot: 'Both',
    age: 25,
    club: 'Apex Premier Squad',
    handle: '@dsterling_10',
    followersCount: 19800,
    followingCount: 350,
    postsCount: 34,
    isFollowing: false,
    bio: 'Master playmaker with vision, line-breaking passes, and high spatial IQ orchestration across the attacking third.',
    stats: {
      games: 140,
      goals: 38,
      assists: 88,
      topSpeed: 31.8,
      passAccuracy: 95,
      shotConversion: 21,
      stamina: 92,
      symmetry: 93,
      injuryRisk: 'LOW',
      forceBalance: { left: 51, right: 49 }
    },
    recentMatches: [],
    ratingHistory: [],
    highlights: [],
    tapes: []
  },
  'APX-0011': {
    id: 'APX-0011',
    name: 'KASPER LIND',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    actionImage: 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=600&q=80',
    code: '#APX-0011',
    position: 'GK',
    role: 'GOALKEEPER',
    number: 1,
    sportSpecialty: 'Football (Goalkeeper & Reflex Saves)',
    status: 'ACTIVE',
    overallRating: 94.0,
    ratingChange: 0.9,
    height: "193 cm / 6'4\"",
    weight: '88 kg / 194 lbs',
    preferredFoot: 'Right',
    age: 27,
    club: 'Apex Premier Squad',
    handle: '@kasper_gk1',
    followersCount: 16500,
    followingCount: 190,
    postsCount: 19,
    isFollowing: true,
    bio: 'Commanding shot stopper with 85ms dive reflexes, box aerial dominance, and modern sweeper-keeper distribution.',
    stats: {
      games: 175,
      goals: 0,
      assists: 4,
      topSpeed: 22.4,
      passAccuracy: 86,
      shotConversion: 0,
      stamina: 89,
      symmetry: 98,
      injuryRisk: 'LOW',
      forceBalance: { left: 50, right: 50 }
    },
    recentMatches: [],
    ratingHistory: [],
    highlights: [],
    tapes: []
  }
};

