import { SportType } from '../types';

export interface SportConfig {
  id: SportType;
  name: string;
  emoji: string;
  iconName: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  defaultCompetitions: string[];
  defaultMatchTypes: string[];
  defaultSurfaces: string[];
  formations: string[];
  defaultVenue: string;
  positionOptions: string[];
  pitchType: 'grass_pitch' | 'hardwood_court' | 'cricket_oval' | 'tennis_court' | 'rugby_field' | 'running_track' | 'hockey_turf';
  tacticalPresets: {
    formation: string;
    players: {
      name: string;
      number: number;
      position: string;
      x: number; // percentage 0-100
      y: number; // percentage 0-100
    }[];
  }[];
}

export const SPORTS_CONFIG: Record<SportType, SportConfig> = {
  FOOTBALL: {
    id: 'FOOTBALL',
    name: 'Football / Soccer',
    emoji: '⚽',
    iconName: 'Activity',
    color: '#00e5a3',
    badgeBg: 'bg-emerald-500/15',
    badgeBorder: 'border-emerald-500/30',
    defaultCompetitions: [
      'Premier Championship',
      'Champions Super League',
      'National Cup Final',
      'Continental Derby',
      'Pre-Season Invitational'
    ],
    defaultMatchTypes: [
      'Championship Derby',
      'League Fixture',
      'Playoff Knockout',
      'Exhibition Friendly',
      'Cup Semi-Final'
    ],
    defaultSurfaces: [
      'Hybrid Natural Grass',
      'Natural Bermuda Grass',
      '3G Synthetic Turf',
      'Indoor AstroTurf'
    ],
    formations: [
      '4-3-3 Attacking Press',
      '4-2-3-1 Modern Control',
      '3-5-2 Wing-Back Overload',
      '4-4-2 Classic Block'
    ],
    defaultVenue: 'Apex National Stadium (Home)',
    positionOptions: [
      'Striker (ST #9)',
      'Left Winger (LW #11)',
      'Right Winger (RW #7)',
      'Attacking Mid (CAM #10)',
      'Central Mid (CM #8)',
      'Defensive Mid (CDM #6)',
      'Left Back (LB #3)',
      'Center Back (CB #4)',
      'Center Back (CB #5)',
      'Right Back (RB #2)',
      'Goalkeeper (GK #1)'
    ],
    pitchType: 'grass_pitch',
    tacticalPresets: [
      {
        formation: '4-3-3 Attacking Press',
        players: [
          { name: 'S. Vance', number: 11, position: 'LW', x: 20, y: 18 },
          { name: 'R. Kumar', number: 9, position: 'ST', x: 50, y: 14 },
          { name: 'E. Voss', number: 7, position: 'RW', x: 80, y: 18 },
          { name: 'M. Silva', number: 8, position: 'CM', x: 28, y: 44 },
          { name: 'T. Al-Mansoor', number: 6, position: 'CDM', x: 50, y: 52 },
          { name: 'D. Sterling', number: 10, position: 'CAM', x: 72, y: 44 },
          { name: 'L. Walker', number: 3, position: 'LB', x: 16, y: 74 },
          { name: 'L. Kante', number: 4, position: 'CB', x: 38, y: 76 },
          { name: 'V. Sanchez', number: 5, position: 'CB', x: 62, y: 76 },
          { name: 'J. Banks', number: 2, position: 'RB', x: 84, y: 74 },
          { name: 'K. Lind', number: 1, position: 'GK', x: 50, y: 92 },
        ]
      },
      {
        formation: '4-2-3-1 Modern Control',
        players: [
          { name: 'R. Kumar', number: 9, position: 'ST', x: 50, y: 14 },
          { name: 'S. Vance', number: 11, position: 'LAM', x: 22, y: 32 },
          { name: 'D. Sterling', number: 10, position: 'CAM', x: 50, y: 30 },
          { name: 'E. Voss', number: 7, position: 'RAM', x: 78, y: 32 },
          { name: 'T. Al-Mansoor', number: 6, position: 'DM', x: 36, y: 54 },
          { name: 'M. Silva', number: 8, position: 'DM', x: 64, y: 54 },
          { name: 'L. Walker', number: 3, position: 'LB', x: 16, y: 74 },
          { name: 'L. Kante', number: 4, position: 'CB', x: 38, y: 76 },
          { name: 'V. Sanchez', number: 5, position: 'CB', x: 62, y: 76 },
          { name: 'J. Banks', number: 2, position: 'RB', x: 84, y: 74 },
          { name: 'K. Lind', number: 1, position: 'GK', x: 50, y: 92 },
        ]
      }
    ]
  },

  BASKETBALL: {
    id: 'BASKETBALL',
    name: 'Basketball',
    emoji: '🏀',
    iconName: 'Zap',
    color: '#ff9800',
    badgeBg: 'bg-amber-500/15',
    badgeBorder: 'border-amber-500/30',
    defaultCompetitions: [
      'Pro Hoop Circuit',
      'National Championship Series',
      'Elite 8 Tournament',
      'Conference Playoff Finals',
      'Summer Showcase'
    ],
    defaultMatchTypes: [
      'Conference Playoff',
      'Regular Season Game',
      'Tournament Final',
      'Exhibition Showcase'
    ],
    defaultSurfaces: [
      'Polished Hardwood Court',
      'Indoor Maple Flooring',
      'Outdoor Pro Asphalt'
    ],
    formations: [
      '1-2-2 High Post & Motion',
      '2-3 Zone Defensive Wall',
      '1-3-1 Fast Break Spread',
      '5-Out Perimeter Spacing'
    ],
    defaultVenue: 'United Metro Arena (Home)',
    positionOptions: [
      'Point Guard (PG #1)',
      'Shooting Guard (SG #2)',
      'Small Forward (SF #3)',
      'Power Forward (PF #4)',
      'Center (C #5)',
      'Sixth Man / Spark Sub',
      '3-and-D Wing Specialist'
    ],
    pitchType: 'hardwood_court',
    tacticalPresets: [
      {
        formation: '1-2-2 High Post & Motion',
        players: [
          { name: 'R. Kumar', number: 1, position: 'PG', x: 50, y: 78 },
          { name: 'E. Voss', number: 2, position: 'SG', x: 22, y: 55 },
          { name: 'S. Vance', number: 3, position: 'SF', x: 78, y: 55 },
          { name: 'D. Sterling', number: 4, position: 'PF', x: 32, y: 28 },
          { name: 'L. Kante', number: 5, position: 'C', x: 68, y: 28 },
        ]
      },
      {
        formation: '5-Out Perimeter Spacing',
        players: [
          { name: 'R. Kumar', number: 1, position: 'PG', x: 50, y: 82 },
          { name: 'E. Voss', number: 2, position: 'SG', x: 18, y: 60 },
          { name: 'S. Vance', number: 3, position: 'SF', x: 82, y: 60 },
          { name: 'D. Sterling', number: 4, position: 'PF', x: 16, y: 28 },
          { name: 'L. Kante', number: 5, position: 'C', x: 84, y: 28 },
        ]
      }
    ]
  },

  CRICKET: {
    id: 'CRICKET',
    name: 'Cricket',
    emoji: '🏏',
    iconName: 'Shield',
    color: '#38bdf8',
    badgeBg: 'bg-sky-500/15',
    badgeBorder: 'border-sky-500/30',
    defaultCompetitions: [
      'Apex T20 Premier Trophy',
      'Champions 50-Over Cup',
      'First-Class Test Championship',
      'Super Smash Derby'
    ],
    defaultMatchTypes: [
      'T20 Championship',
      '50-Over Day/Night ODI',
      'Test Match 5-Day',
      'Powerplay Scrimmage'
    ],
    defaultSurfaces: [
      'Hard Baked Turf Wicket',
      'Green Seaming Pitch',
      'Dry Turning Dustbowl',
      'Drop-in Hybrid Pitch'
    ],
    formations: [
      'Aggressive T20 7-4 Lineup',
      'Balanced 50-Over ODI XI',
      'Attacking Test Slip Cordon'
    ],
    defaultVenue: 'Lord Oval Pavilion (Home)',
    positionOptions: [
      'Opening Batsman (Capt)',
      'Opening Bowler (Pace)',
      'Wicketkeeper Batsman',
      'Top Order #3 Anchor',
      'Middle Order Power-Hitter',
      'All-Rounder (Spin)',
      'Death Specialist Pace',
      'Off-Spin Mystery Bowler',
      'Leg-Spin Strike Bowler'
    ],
    pitchType: 'cricket_oval',
    tacticalPresets: [
      {
        formation: 'Aggressive T20 7-4 Lineup',
        players: [
          { name: 'S. Vance', number: 11, position: 'WK', x: 50, y: 20 },
          { name: 'R. Kumar', number: 9, position: 'Slip', x: 38, y: 24 },
          { name: 'E. Voss', number: 7, position: 'Bowler', x: 50, y: 78 },
          { name: 'D. Sterling', number: 10, position: 'Cover', x: 20, y: 46 },
          { name: 'M. Silva', number: 8, position: 'Mid-Wicket', x: 80, y: 46 },
          { name: 'T. Al-Mansoor', number: 6, position: 'Long-Off', x: 32, y: 88 },
          { name: 'L. Walker', number: 3, position: 'Long-On', x: 68, y: 88 },
        ]
      }
    ]
  },

  TENNIS: {
    id: 'TENNIS',
    name: 'Tennis & Racket',
    emoji: '🎾',
    iconName: 'Target',
    color: '#facc15',
    badgeBg: 'bg-yellow-500/15',
    badgeBorder: 'border-yellow-500/30',
    defaultCompetitions: [
      'International ATP 1000 Classic',
      'Grand Slam Open Masters',
      'Pro Invitational Trophy',
      'Davis Cup Championship'
    ],
    defaultMatchTypes: [
      'Grand Slam Masters Open',
      'Championship Final',
      'Doubles Semi-Final',
      'Round of 16 Singles'
    ],
    defaultSurfaces: [
      'Acrylic Hard Court',
      'Red Clay Court',
      'Lawn Grass Court',
      'Indoor Carpet'
    ],
    formations: [
      'Singles Championship Seed #1',
      'Doubles Tactical Server & Volley'
    ],
    defaultVenue: 'Centre Court Arena (Home)',
    positionOptions: [
      'Main Draw Singles #1',
      'Doubles Server (Baseline)',
      'Doubles Net Volleyer',
      'Hitting Partner / Reserve'
    ],
    pitchType: 'tennis_court',
    tacticalPresets: [
      {
        formation: 'Singles Championship Seed #1',
        players: [
          { name: 'R. Kumar', number: 1, position: 'Player', x: 50, y: 82 },
          { name: 'Opponent', number: 2, position: 'Rival', x: 50, y: 18 },
        ]
      },
      {
        formation: 'Doubles Tactical Server & Volley',
        players: [
          { name: 'R. Kumar', number: 1, position: 'Server', x: 32, y: 84 },
          { name: 'E. Voss', number: 7, position: 'Net', x: 68, y: 60 },
          { name: 'Rival 1', number: 10, position: 'Return', x: 68, y: 16 },
          { name: 'Rival 2', number: 11, position: 'Net', x: 32, y: 40 },
        ]
      }
    ]
  },

  RUGBY: {
    id: 'RUGBY',
    name: 'Rugby / Gridiron',
    emoji: '🏉',
    iconName: 'Flame',
    color: '#10b981',
    badgeBg: 'bg-emerald-600/15',
    badgeBorder: 'border-emerald-600/30',
    defaultCompetitions: [
      'Pacific Elite Rugby Championship',
      'Six Nations Continental Cup',
      'Super Rugby Derby',
      'National Sevens Circuit'
    ],
    defaultMatchTypes: [
      'Continental Derby',
      'Championship Final',
      'Playoff Eliminator',
      'Rugby 7s Fast Circuit'
    ],
    defaultSurfaces: [
      'Heavy Grass Turf',
      'Stadium Hybrid Pitch',
      'Wet Mud Field'
    ],
    formations: [
      '15-a-side Dominant Pack',
      'Rugby 7s High-Speed Spread',
      'Gridiron 11-Man Offensive Unit'
    ],
    defaultVenue: 'Sky Stadium Rugby Ground (Home)',
    positionOptions: [
      'Fly-Half (#10)',
      'Scrum-Half (#9)',
      'Inside Centre (#12)',
      'Outside Centre (#13)',
      'Winger (#11 / #14)',
      'Fullback (#15)',
      'Number 8 Lock (#8)',
      'Flanker (#6 / #7)',
      'Prop (#1 / #3)',
      'Hooker (#2)'
    ],
    pitchType: 'rugby_field',
    tacticalPresets: [
      {
        formation: '15-a-side Dominant Pack',
        players: [
          { name: 'R. Kumar', number: 10, position: 'Fly-Half', x: 50, y: 55 },
          { name: 'S. Vance', number: 11, position: 'Winger', x: 18, y: 35 },
          { name: 'E. Voss', number: 14, position: 'Winger', x: 82, y: 35 },
          { name: 'T. Al-Mansoor', number: 12, position: 'Centre', x: 38, y: 45 },
          { name: 'D. Sterling', number: 13, position: 'Centre', x: 62, y: 45 },
          { name: 'L. Kante', number: 8, position: 'Lock', x: 50, y: 72 },
          { name: 'L. Walker', number: 15, position: 'Fullback', x: 50, y: 20 },
        ]
      }
    ]
  },

  ATHLETICS: {
    id: 'ATHLETICS',
    name: 'Athletics & Track',
    emoji: '🏃',
    iconName: 'Flame',
    color: '#a855f7',
    badgeBg: 'bg-purple-500/15',
    badgeBorder: 'border-purple-500/30',
    defaultCompetitions: [
      'World Athletics Continental Tour',
      'Diamond League Finals',
      'National Sprint Trials',
      'Relay Championships'
    ],
    defaultMatchTypes: [
      'Diamond League Finals',
      'Sprint Relay Heat',
      '100m/200m Olympic Qualifying',
      'Time Trial Invitational'
    ],
    defaultSurfaces: [
      '400m 8-Lane Tartan Track',
      'Synthetic Mondo Surface',
      'Indoor Banked Oval 200m'
    ],
    formations: [
      '4x100m Sprint Relay Squad',
      '4x400m Strategic Baton Order',
      'Individual 100m Lane Assignment'
    ],
    defaultVenue: 'Olympic Tartan Stadium (Home)',
    positionOptions: [
      'Anchor Leg 4 (Sprint Peak)',
      'Bend Leg 3 (Curve Specialist)',
      'Straightaway Leg 2 (Max Velocity)',
      'Block Start Leg 1 (Reaction Speed)',
      'Pace Setter / Rabbit'
    ],
    pitchType: 'running_track',
    tacticalPresets: [
      {
        formation: '4x100m Sprint Relay Squad',
        players: [
          { name: 'L. Walker', number: 1, position: 'Leg 1 (Start)', x: 22, y: 78 },
          { name: 'S. Vance', number: 2, position: 'Leg 2 (Straight)', x: 22, y: 25 },
          { name: 'E. Voss', number: 3, position: 'Leg 3 (Curve)', x: 78, y: 25 },
          { name: 'R. Kumar', number: 4, position: 'Leg 4 (Anchor)', x: 78, y: 78 },
        ]
      }
    ]
  },

  HOCKEY: {
    id: 'HOCKEY',
    name: 'Field Hockey',
    emoji: '🏑',
    iconName: 'Activity',
    color: '#06b6d4',
    badgeBg: 'bg-cyan-500/15',
    badgeBorder: 'border-cyan-500/30',
    defaultCompetitions: [
      'Pro League World Series',
      'National Hockey Cup',
      'Continental Derby Finals',
      'Club Champions Trophy'
    ],
    defaultMatchTypes: [
      'Pro League Derby',
      'Shootout Playoff',
      'Championship Final',
      'Tournament Group Stage'
    ],
    defaultSurfaces: [
      'Water-Based Poligras AstroTurf',
      'Synthetic Hybrid Turf',
      'Indoor Smooth Court'
    ],
    formations: [
      '3-3-3-1 Attacking Press',
      '4-3-3 High Line',
      '5-3-2 Defensive Counter'
    ],
    defaultVenue: 'Apex Hockey Arena (Home)',
    positionOptions: [
      'Center Forward (CF #9)',
      'Left Winger (LW #11)',
      'Right Winger (RW #7)',
      'Center Half (CH #8)',
      'Attacking Half (AH #10)',
      'Defensive Half (DH #6)',
      'Sweeper / Fullback (SW #4)',
      'Goalkeeper (GK #1)'
    ],
    pitchType: 'hockey_turf',
    tacticalPresets: [
      {
        formation: '3-3-3-1 Attacking Press',
        players: [
          { name: 'R. Kumar', number: 9, position: 'CF', x: 50, y: 16 },
          { name: 'S. Vance', number: 11, position: 'LW', x: 24, y: 34 },
          { name: 'E. Voss', number: 7, position: 'RW', x: 76, y: 34 },
          { name: 'D. Sterling', number: 10, position: 'AH', x: 50, y: 44 },
          { name: 'M. Silva', number: 8, position: 'CH', x: 30, y: 60 },
          { name: 'T. Al-Mansoor', number: 6, position: 'DH', x: 70, y: 60 },
          { name: 'L. Kante', number: 4, position: 'SW', x: 50, y: 78 },
          { name: 'K. Lind', number: 1, position: 'GK', x: 50, y: 92 },
        ]
      }
    ]
  }
};
