import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, ActiveScreen, BiomechanicalScan, HighlightVideo, TapeAnalysis, FixtureSchedule, AthleteProfile, AdminDecision, SocialPost, PlayerStory, SocialComment, PlayerManagementProfile, FeePaymentRecord, EquipmentInventoryItem, SessionRecord, LoginActivity } from './types';
import { getInitialRealtimeState, persistRealtimeState, LiveTelemetrySnapshot } from './utils/realtimeStore';
import { socketService } from './utils/socketService';
import { apiService } from './utils/apiService';
import { formatExactUploadTime } from './utils/timeUtils';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { PerformanceView } from './components/PerformanceView';
import { FeedView } from './components/FeedView';
import { ProfileView } from './components/ProfileView';
import { SchedulingView } from './components/SchedulingView';
import { RecordsView } from './components/RecordsView';
import { ChatbotView } from './components/ChatbotView';
import { ManagementView } from './components/ManagementView';
import { CoursesView } from './components/CoursesView';
import { ScreenSwitcher } from './components/ScreenSwitcher';

// Modals
import { LoginModal, UserAuthData } from './components/LoginModal';
import { ScanModal } from './components/ScanModal';
import { ScanDetailModal } from './components/ScanDetailModal';
import { FullReportModal } from './components/FullReportModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { ScheduleModal } from './components/ScheduleModal';
import { UploadTapeModal } from './components/UploadTapeModal';
import { EditProfileModal } from './components/EditProfileModal';
import { AdminPerformanceModal } from './components/AdminPerformanceModal';
import { CreatePostModal } from './components/CreatePostModal';
import { PlayerProfileModal } from './components/PlayerProfileModal';
import { StoryViewerModal } from './components/StoryViewerModal';
import { PlayerScannerModal } from './components/PlayerScannerModal';
import { LeaderboardAdminModal } from './components/LeaderboardAdminModal';
import { VideoReviewView } from './components/VideoReviewView';

export default function App() {
  // Initialize State from local store fallback
  const [initialData] = useState(() => getInitialRealtimeState());

  // Navigation & Role State (Default to Home screen)
  const [role, setRole] = useState<UserRole>('player');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('kheltantra_theme') as 'dark' | 'light') || 'dark');
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('kheltantra_theme', theme); }, [theme]);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');

  // Active Athlete Data State
  const [athlete, setAthlete] = useState<AthleteProfile>(initialData.athlete);
  const [scans, setScans] = useState<BiomechanicalScan[]>(initialData.scans);

  // Social & Community State
  const [posts, setPosts] = useState<SocialPost[]>(initialData.posts);
  const [stories, setStories] = useState<PlayerStory[]>(initialData.stories);
  const [followerNotifications, setFollowerNotifications] = useState(initialData.followerNotifications);
  const [fixtures, setFixtures] = useState<FixtureSchedule[]>(initialData.fixtures);
  const [communityAthletes, setCommunityAthletes] = useState<Record<string, AthleteProfile>>(initialData.communityAthletes);
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([]);

  // Academy & Club Management System State
  const [mgmtPlayers, setMgmtPlayers] = useState<PlayerManagementProfile[]>(() => {
    try {
      const raw = localStorage.getItem('apex_mgmt_players_v4');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [mgmtFeeRecords, setMgmtFeeRecords] = useState<FeePaymentRecord[]>(() => {
    try {
      const raw = localStorage.getItem('apex_mgmt_fees_v4');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [mgmtInventory, setMgmtInventory] = useState<EquipmentInventoryItem[]>(() => {
    try {
      const raw = localStorage.getItem('apex_mgmt_inventory_v4');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('apex_mgmt_players_v4', JSON.stringify(mgmtPlayers));
    } catch (e) { }
  }, [mgmtPlayers]);

  useEffect(() => {
    try {
      localStorage.setItem('apex_mgmt_fees_v4', JSON.stringify(mgmtFeeRecords));
    } catch (e) { }
  }, [mgmtFeeRecords]);

  useEffect(() => {
    try {
      localStorage.setItem('apex_mgmt_inventory_v4', JSON.stringify(mgmtInventory));
    } catch (e) { }
  }, [mgmtInventory]);

  // Live Biometric Telemetry Stream (from Socket.IO)
  const [telemetry, setTelemetry] = useState<LiveTelemetrySnapshot>({
    heartRate: 0,
    heartRateTrend: 'stable',
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
    intensityZone: 'Recovery (Z1)',
    acwrLive: 0,
    fatigueIndex: 0,
  });

  // Socket.IO Full-Duplex Real-Time Stream Synchronization
  useEffect(() => {
    socketService.connect();

    // Fetch authoritative snapshot immediately via REST
    apiService.getState().then((serverState: any) => {
      if (serverState) {
        if (serverState.athlete) setAthlete(serverState.athlete);
        if (serverState.scans) setScans(serverState.scans);
        if (serverState.fixtures) setFixtures(serverState.fixtures);
        if (serverState.posts) setPosts(serverState.posts);
        if (serverState.stories) setStories(serverState.stories);
        if (serverState.notifications) setFollowerNotifications(serverState.notifications);
        if (serverState.communityAthletes) setCommunityAthletes(serverState.communityAthletes);
        if (serverState.liveTelemetry) setTelemetry(serverState.liveTelemetry);
        if (serverState.sessions) setSessions(serverState.sessions);
      }
    });

    // 1. Initialize complete state from server authoritative store
    const unsubInit = socketService.subscribe('init:state', (serverState: any) => {
      if (serverState) {
        if (serverState.athlete) setAthlete(serverState.athlete);
        if (serverState.scans) setScans(serverState.scans);
        if (serverState.fixtures) setFixtures(serverState.fixtures);
        if (serverState.posts) setPosts(serverState.posts);
        if (serverState.stories) setStories(serverState.stories);
        if (serverState.notifications) setFollowerNotifications(serverState.notifications);
        if (serverState.communityAthletes) setCommunityAthletes(serverState.communityAthletes);
        if (serverState.liveTelemetry) setTelemetry(serverState.liveTelemetry);
        if (serverState.sessions) setSessions(serverState.sessions);
      }
    });

    // 2. Telemetry Live 100Hz Stream
    const unsubTelemetry = socketService.subscribe('telemetry:update', (liveSnap: LiveTelemetrySnapshot) => {
      setTelemetry(liveSnap);
    });

    // 3. Social Posts Real-Time Stream
    const unsubPostCreated = socketService.subscribe('post:created', (newPost: SocialPost) => {
      setPosts((prev) => [newPost, ...prev.filter((p) => p.id !== newPost.id)]);
    });

    const unsubPostUpdated = socketService.subscribe('post:updated', (updatedPost: SocialPost) => {
      setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
    });

    const unsubPostDeleted = socketService.subscribe('post:deleted', (deletedPostId: string) => {
      setPosts((prev) => prev.filter((p) => p.id !== deletedPostId));
    });

    // 4. Stories Stream
    const unsubStoryCreated = socketService.subscribe('story:created', (newStory: PlayerStory) => {
      setStories((prev) => [newStory, ...prev.filter((s) => s.id !== newStory.id)]);
    });

    // 5. Scans Stream
    const unsubScanCreated = socketService.subscribe('scan:created', (newScan: BiomechanicalScan) => {
      setScans((prev) => [newScan, ...prev.filter((s) => s.id !== newScan.id)]);
    });

    // 6. Fixtures Stream
    const unsubFixCreated = socketService.subscribe('fixture:created', (fix: FixtureSchedule) => {
      setFixtures((prev) => [fix, ...prev.filter((f) => f.id !== fix.id)]);
    });

    const unsubFixUpdated = socketService.subscribe('fixture:updated', (fix: FixtureSchedule) => {
      setFixtures((prev) => prev.map((f) => (f.id === fix.id ? fix : f)));
    });

    const unsubFixDeleted = socketService.subscribe('fixture:deleted', (fixId: string) => {
      setFixtures((prev) => prev.filter((f) => f.id !== fixId));
    });

    // 7. Athlete & Community Profile Updates
    const unsubAthleteUpdated = socketService.subscribe('athlete:updated', (ath: AthleteProfile) => {
      setAthlete(ath);
      setCommunityAthletes((prev) => ({ ...prev, [ath.id]: ath }));
    });

    const unsubCommunityUpdated = socketService.subscribe('community:updated', (comm: Record<string, AthleteProfile>) => {
      setCommunityAthletes(comm);
    });

    // 8. Follower Notification Stream
    const unsubNotifCreated = socketService.subscribe('notification:created', (notif: any) => {
      setFollowerNotifications((prev) => [notif, ...prev]);
    });

    // 9. Session Stream
    const unsubSessionCreated = socketService.subscribe('session:created', (newSession: SessionRecord) => {
      setSessions((prev) => [newSession, ...prev.filter((s) => s.id !== newSession.id)]);
    });

    return () => {
      unsubInit();
      unsubTelemetry();
      unsubPostCreated();
      unsubPostUpdated();
      unsubPostDeleted();
      unsubStoryCreated();
      unsubScanCreated();
      unsubFixCreated();
      unsubFixUpdated();
      unsubFixDeleted();
      unsubAthleteUpdated();
      unsubCommunityUpdated();
      unsubNotifCreated();
      unsubSessionCreated();
    };
  }, []);

  const handleLogSession = useCallback(async (sessionData: any) => {
    const tempId = sessionData.id || `sess-${Date.now()}`;
    const optimisticSession: SessionRecord = {
      id: tempId,
      athleteId: sessionData.athleteId || athlete.id,
      athleteName: sessionData.athleteName || athlete.name,
      sessionType: sessionData.sessionType || 'TRAINING',
      title: sessionData.title,
      date: sessionData.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      timestamp: Date.now(),
      durationMinutes: Number(sessionData.durationMinutes) || 45,
      topSpeedKmh: sessionData.topSpeedKmh,
      distanceKm: sessionData.distanceKm,
      notes: sessionData.notes,
    } as any;

    // 1. Immediate local update
    setSessions((prev) => [optimisticSession, ...prev.filter((s) => s.id !== tempId)]);

    // 2. Socket.io broadcast
    socketService.emit('session:create', { ...sessionData, id: tempId });

    // 3. REST API persistent save
    try {
      const res = await apiService.logSession({ ...sessionData, id: tempId });
      if (res.success && res.session) {
        setSessions((prev) => [res.session, ...prev.filter((s) => s.id !== tempId && s.id !== res.session.id)]);
        if (res.athlete) {
          setAthlete(res.athlete);
          setCommunityAthletes((prev) => ({ ...prev, [res.athlete.id]: res.athlete }));
        }
      }
    } catch (err) {
      console.error('Failed to persist session to server:', err);
    }
  }, [athlete]);

  // Authentication Gate: show login/signup page until user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Modals Visibility State
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isPlayerScannerOpen, setIsPlayerScannerOpen] = useState(false);
  const [isLeaderboardAdminOpen, setIsLeaderboardAdminOpen] = useState(false);
  const [selectedScanDetail, setSelectedScanDetail] = useState<BiomechanicalScan | null>(null);
  const [isFullReportOpen, setIsFullReportOpen] = useState(false);
  const [activeVideoItem, setActiveVideoItem] = useState<HighlightVideo | TapeAnalysis | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isUploadTapeOpen, setIsUploadTapeOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAdminPerformanceOpen, setIsAdminPerformanceOpen] = useState(false);

  // Social Modals
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);

  // Toggle live session state via Socket.IO
  const toggleSession = useCallback(() => {
    socketService.toggleSession();
  }, []);

  // Persist State Changes locally as well for offline resilience
  const syncState = (partial: {
    athlete?: AthleteProfile;
    scans?: BiomechanicalScan[];
    fixtures?: FixtureSchedule[];
    posts?: SocialPost[];
    stories?: PlayerStory[];
    followerNotifications?: any[];
    communityAthletes?: Record<string, AthleteProfile>;
  }) => {
    persistRealtimeState({
      athlete: partial.athlete || athlete,
      scans: partial.scans || scans,
      fixtures: partial.fixtures || fixtures,
      posts: partial.posts || posts,
      stories: partial.stories || stories,
      followerNotifications: partial.followerNotifications || followerNotifications,
      communityAthletes: partial.communityAthletes || communityAthletes,
    });
  };

  // Role Switcher Handler (Enforce Auth for Admin Access)
  const handleToggleRole = (requestedRole?: UserRole) => {
    const nextRole = requestedRole || (role === 'player' ? 'coach' : 'player');

    // Protect Admin and Coach role access
    if ((nextRole === 'admin' || nextRole === 'coach') && role === 'player') {
      const isCoachProfile =
        athlete.position === 'STAFF' ||
        athlete.role?.toLowerCase().includes('coach') ||
        athlete.role?.toLowerCase().includes('tactician') ||
        athlete.role?.toLowerCase().includes('director');

      if (!isCoachProfile) {
        setIsLoginOpen(true);
        return;
      }
    }

    setRole(nextRole);

    // Switch to corresponding role profile in communityAthletes if available
    const candidates = Object.values(communityAthletes) as AthleteProfile[];
    if (nextRole === 'admin') {
      const adminUser =
        candidates.find(
          (u: AthleteProfile) => u.position === 'STAFF' || u.role?.toLowerCase().includes('coach') || u.id === 'APX-8831'
        ) || communityAthletes['APX-8831'];
      if (adminUser) {
        setAthlete(adminUser);
        syncState({ athlete: adminUser });
        socketService.updateAthlete(adminUser);
      }
    } else {
      const playerUser =
        candidates.find(
          (u: AthleteProfile) => u.position !== 'STAFF' && !u.role?.toLowerCase().includes('coach') && u.id !== 'APX-8831'
        ) || communityAthletes['APX-9942'];
      if (playerUser) {
        setAthlete(playerUser);
        syncState({ athlete: playerUser });
        socketService.updateAthlete(playerUser);
      }
    }
  };

  const handleSearchPlayer = (query: string) => {
    if (!query.trim()) return;
    const lowerQuery = query.trim().toLowerCase();
    const players = Object.values(communityAthletes) as AthleteProfile[];
    const found =
      players.find(p => p.id.toLowerCase() === lowerQuery) ||
      players.find(p => p.id.toLowerCase().includes(lowerQuery) || p.name.toLowerCase().includes(lowerQuery));

    if (found) {
      setSelectedPlayerId(found.id);
    } else {
      console.warn(`Player with ID or Name "${query}" not found.`);
    }
  };

  // Login & Registration Success Handler
  const handleLoginSuccess = (newRole: UserRole, userEmail: string, authData?: UserAuthData, userProfile?: AthleteProfile, isNewUser?: boolean) => {
    setRole(newRole);
    setIsAuthenticated(true);
    if (userProfile?.id || authData?.user?.id) localStorage.setItem("apex_current_user_id", String(userProfile?.id || authData?.user?.id));
    setIsLoginOpen(false);

    // Track login/signup activity for admin
    const profileForActivity = userProfile || authData?.user;
    const isSignup = isNewUser || (authData as any)?.isNewUser || false;
    const activityEntry: LoginActivity = {
      id: `act-${Date.now()}`,
      playerId: profileForActivity?.id || `USR-${Date.now()}`,
      playerName: profileForActivity?.name || authData?.name || userEmail.split('@')[0] || 'Unknown Player',
      playerAvatar: profileForActivity?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      playerPosition: profileForActivity?.position || (authData as any)?.position || 'Player',
      playerNumber: profileForActivity?.number || (authData as any)?.jerseyNumber || 0,
      type: isSignup ? 'SIGNUP' : 'LOGIN',
      timestamp: Date.now(),
      role: newRole,
    };
    setLoginActivities((prev) => [activityEntry, ...prev.slice(0, 49)]);

    const targetProfile = userProfile || authData?.user;
    if (targetProfile) {
      setAthlete(targetProfile);
      const updatedCommunity = {
        ...communityAthletes,
        [targetProfile.id]: targetProfile,
      };
      setCommunityAthletes(updatedCommunity);
      syncState({ athlete: targetProfile, communityAthletes: updatedCommunity });
      socketService.updateAthlete(targetProfile);

      // Sync into Management Players Roster if not present
      if (newRole === 'player') {
        setMgmtPlayers((prev) => {
          const exists = prev.some((p) => p.id === targetProfile.id || p.name.toLowerCase() === targetProfile.name.toLowerCase());
          if (exists) return prev;
          const newPlayerRecord: PlayerManagementProfile = {
            id: targetProfile.id,
            name: targetProfile.name,
            avatar: targetProfile.avatar,
            jerseyNumber: targetProfile.number || 9,
            position: targetProfile.role || targetProfile.position || 'FWD (ST)',
            sportSpecialty: targetProfile.sportSpecialty || 'Football',
            phone: targetProfile.phone || '+91 98765 43210',
            email: `${targetProfile.id.toLowerCase()}@apexacademy.org`,
            joiningDate: '15 Jan 2026',
            monthlyFee: 2500,
            feeStatus: 'PAID',
            lastPaymentDate: '10 Aug 2026',
            lastPaymentAmount: 2500,
            attendancePct: 96,
            status: 'ACTIVE',
            kitIssued: {
              jerseySize: 'L',
              bootSize: 'UK 9',
              kitBagAssigned: true,
              ballAssigned: true,
            },
            medicalNotes: 'Cleared for full high performance training.',
          };
          return [newPlayerRecord, ...prev];
        });
      }
    } else if (authData?.name) {
      const updatedAthlete = {
        ...athlete,
        name: authData.name || athlete.name,
        handle: `@${authData.name.toLowerCase().replace(/\s+/g, '')}_${authData.jerseyNumber || athlete.number}`,
        position: authData.position?.includes('(') ? authData.position.split('(')[1].replace(')', '') : (authData.position || athlete.position),
        role: authData.position || athlete.role,
        number: authData.jerseyNumber || athlete.number,
      };
      setAthlete(updatedAthlete);
      const updatedCommunity = {
        ...communityAthletes,
        [updatedAthlete.id]: updatedAthlete,
      };
      setCommunityAthletes(updatedCommunity);
      syncState({ athlete: updatedAthlete, communityAthletes: updatedCommunity });
      socketService.updateAthlete(updatedAthlete);

      if (newRole === 'player') {
        setMgmtPlayers((prev) => {
          const exists = prev.some((p) => p.id === updatedAthlete.id || p.name.toLowerCase() === updatedAthlete.name.toLowerCase());
          if (exists) return prev;
          const newPlayerRecord: PlayerManagementProfile = {
            id: updatedAthlete.id,
            name: updatedAthlete.name,
            avatar: updatedAthlete.avatar,
            jerseyNumber: updatedAthlete.number || 9,
            position: updatedAthlete.role || updatedAthlete.position || 'FWD (ST)',
            sportSpecialty: updatedAthlete.sportSpecialty || 'Football',
            phone: updatedAthlete.phone || '+91 98765 43210',
            email: `${updatedAthlete.id.toLowerCase()}@apexacademy.org`,
            joiningDate: '15 Jan 2026',
            monthlyFee: 2500,
            feeStatus: 'PAID',
            lastPaymentDate: '10 Aug 2026',
            lastPaymentAmount: 2500,
            attendancePct: 96,
            status: 'ACTIVE',
            kitIssued: {
              jerseySize: 'L',
              bootSize: 'UK 9',
              kitBagAssigned: true,
              ballAssigned: true,
            },
            medicalNotes: 'Cleared for full high performance training.',
          };
          return [newPlayerRecord, ...prev];
        });
      }
    }

    setActiveScreen('home');
    setIsAuthenticated(true);
    if (userProfile?.id || authData?.user?.id) localStorage.setItem("apex_current_user_id", String(userProfile?.id || authData?.user?.id));
  };

  // Social Feed Handlers
  const handleCreatePost = (newPost: SocialPost) => {
    const nextPosts = [newPost, ...posts];
    const nextAthlete = {
      ...athlete,
      postsCount: (athlete.postsCount || 0) + 1,
    };
    setPosts(nextPosts);
    setAthlete(nextAthlete);
    syncState({ posts: nextPosts, athlete: nextAthlete });
    socketService.createPost(newPost);
  };

  const handleDeletePost = (postId: string) => {
    const nextPosts = posts.filter((p) => p.id !== postId);
    const nextAthlete = {
      ...athlete,
      postsCount: Math.max(0, (athlete.postsCount || 0) - 1),
    };
    setPosts(nextPosts);
    setAthlete(nextAthlete);
    syncState({ posts: nextPosts, athlete: nextAthlete });
    socketService.deletePost(postId, athlete.id);
  };

  const handleToggleLikePost = (postId: string) => {
    setPosts(prev => {
      const nextPosts = prev.map(p => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          };
        }
        return p;
      });
      syncState({ posts: nextPosts });
      return nextPosts;
    });
    socketService.likePost(postId);
  };

  const handleToggleSavePost = (postId: string) => {
    setPosts(prev => {
      const nextPosts = prev.map(p => (p.id === postId ? { ...p, isSaved: !p.isSaved } : p));
      syncState({ posts: nextPosts });
      return nextPosts;
    });
    socketService.savePost(postId);
  };

  const handleAddComment = (postId: string, text: string) => {
    const now = Date.now();
    const newComment: SocialComment = {
      id: `comm-${now}`,
      authorId: athlete.id,
      authorName: athlete.name,
      authorAvatar: athlete.avatar,
      authorHandle: athlete.handle || `@${athlete.name.toLowerCase().replace(/\s+/g, '')}_${athlete.number}`,
      text,
      timestamp: 'Just now',
      createdAt: now,
      exactUploadTime: formatExactUploadTime(now),
      likesCount: 0,
    };

    setPosts(prev => {
      const nextPosts = prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      });
      syncState({ posts: nextPosts });
      return nextPosts;
    });

    socketService.commentPost(postId, newComment);
  };

  const handleToggleFollow = (athleteId: string) => {
    socketService.toggleFollow(athleteId);

    setCommunityAthletes(prev => {
      const target = prev[athleteId];
      if (!target) return prev;
      const willFollow = !target.isFollowing;
      const updatedTarget = {
        ...target,
        isFollowing: willFollow,
        followersCount: willFollow ? (target.followersCount || 0) + 1 : Math.max(0, (target.followersCount || 0) - 1),
      };

      const updatedAthlete = {
        ...athlete,
        followingCount: willFollow ? (athlete.followingCount || 0) + 1 : Math.max(0, (athlete.followingCount || 0) - 1),
      };
      setAthlete(updatedAthlete);

      let nextNotifs = followerNotifications;
      if (willFollow) {
        nextNotifs = [
          {
            id: `notif-${Date.now()}`,
            type: 'FOLLOW',
            name: target.name,
            handle: target.handle,
            avatar: target.avatar,
            timestamp: Date.now(),
            read: false,
          },
          ...followerNotifications,
        ];
        setFollowerNotifications(nextNotifs);
      }

      const nextCommunity = {
        ...prev,
        [athleteId]: updatedTarget,
      };

      syncState({
        communityAthletes: nextCommunity,
        athlete: updatedAthlete,
        followerNotifications: nextNotifs,
      });

      return nextCommunity;
    });
  };

  // Handle Scan Completed
  const handleScanCompleted = (scanOrMetrics: any) => {
    const scanObj: BiomechanicalScan = scanOrMetrics.id ? scanOrMetrics : {
      id: `scan-${Date.now()}`,
      athleteName: athlete.name,
      athleteId: athlete.code || 'APX-9942',
      scanDate: 'Just now',
      scanType: 'LOWER BODY',
      efficiencyScore: 95.2,
      symmetry: scanOrMetrics.symmetry || 96,
      injuryRisk: 'LOW',
      forceBalance: { left: 49, right: 51 },
      imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=600&q=80',
      analysisTitle: 'LIVE OPTICAL KINEMATICS & LOAD',
      metrics: {
        jointLoadN: scanOrMetrics.jointLoad || 960,
        flexionDeg: scanOrMetrics.kneeFlexion || 38,
        torqueNm: scanOrMetrics.torque || 185,
        muscleActivationPct: 94,
        vmoStrain: scanOrMetrics.vmoStrain || 9,
        groundForce: scanOrMetrics.groundForce || 1260,
      },
      notes: [
        'Live optical diagnostic completed with verified symmetry envelope.',
        'Knee flexion torque aligned with target power phase.',
      ],
    };

    const nextScans = [scanObj, ...scans];
    const nextAthlete = {
      ...athlete,
      overallRating: Math.min(99, +(athlete.overallRating + 0.2).toFixed(1)),
      stats: {
        ...athlete.stats,
        symmetry: scanObj.symmetry,
        forceBalance: scanObj.forceBalance,
      },
    };

    setScans(nextScans);
    setAthlete(nextAthlete);
    setSelectedScanDetail(scanObj);
    syncState({ scans: nextScans, athlete: nextAthlete });
    socketService.createScan(scanObj);
  };

  // Handle Tape Uploaded
  const handleTapeUploaded = (tape: TapeAnalysis) => {
    const nextAthlete = {
      ...athlete,
      tapes: [tape, ...athlete.tapes],
    };
    setAthlete(nextAthlete);
    syncState({ athlete: nextAthlete });
    socketService.updateAthlete(nextAthlete);
  };

  // Handle Match Fixture Added by Admin
  const handleAddFixture = (fixture: FixtureSchedule) => {
    const nextFixtures = [fixture, ...fixtures];
    setFixtures(nextFixtures);
    syncState({ fixtures: nextFixtures });
    socketService.createFixture(fixture);
  };

  // Handle Match Fixture Deleted by Admin
  const handleDeleteFixture = (fixtureId: string) => {
    const nextFixtures = fixtures.filter((f) => f.id !== fixtureId);
    setFixtures(nextFixtures);
    syncState({ fixtures: nextFixtures });
    socketService.deleteFixture(fixtureId);
  };

  // Handle Match Fixture Updated by Admin
  const handleUpdateFixture = (fixture: FixtureSchedule) => {
    const nextFixtures = fixtures.map((f) => (f.id === fixture.id ? fixture : f));
    setFixtures(nextFixtures);
    syncState({ fixtures: nextFixtures });
    socketService.updateFixture(fixture);
  };

  // Handle Save Profile from EditProfileModal
  const handleSaveProfile = (updatedProfile: any) => {
    const next = {
      ...athlete,
      ...updatedProfile,
      stats: {
        ...athlete.stats,
        ...(updatedProfile.stats || {}),
      },
    };
    const nextCommunity = { ...communityAthletes, [next.id]: next };
    setAthlete(next);
    setCommunityAthletes(nextCommunity);
    syncState({ athlete: next, communityAthletes: nextCommunity });
    socketService.updateAthlete(next);
    apiService.updateProfile(next.id, updatedProfile);
  };

  // Handle Admin Decide Performance & Calibrate Status
  const handleSaveAdminPerformance = (decision: {
    overallRating: number;
    ratingChange: number;
    symmetry: number;
    forceLeft: number;
    forceRight: number;
    topSpeed: number;
    acwr: number;
    status: 'ACTIVE' | 'RESTING' | 'INJURED';
    adminDecision: AdminDecision;
  }) => {
    const nextAthlete: AthleteProfile = {
      ...athlete,
      overallRating: decision.overallRating,
      ratingChange: decision.ratingChange,
      status: decision.status,
      stats: {
        ...athlete.stats,
        symmetry: decision.symmetry,
        forceBalance: {
          left: decision.forceLeft,
          right: decision.forceRight,
        },
        topSpeed: decision.topSpeed,
        acwr: decision.acwr,
      },
      adminDecision: decision.adminDecision,
    };
    setAthlete(nextAthlete);
    syncState({ athlete: nextAthlete });
    socketService.calibrateAthlete(decision);
  };

  // Admin controls the public leaderboard by calibrating each player's rating.
  const handleSaveLeaderboard = (updatedPlayers: AthleteProfile[]) => {
    const nextCommunity = { ...communityAthletes };
    updatedPlayers.forEach(player => {
      const previous = nextCommunity[player.id];
      if (previous) nextCommunity[player.id] = { ...previous, overallRating: player.overallRating };
    });

    const current = nextCommunity[athlete.id] || athlete;
    setCommunityAthletes(nextCommunity);
    setAthlete(current);
    syncState({ communityAthletes: nextCommunity, athlete: current });
    updatedPlayers.forEach(player => socketService.updateAthlete(player));
  };

  const selectedAthleteForProfile = selectedPlayerId ? communityAthletes[selectedPlayerId] || athlete : null;

  // If not authenticated, show full-page Login/Signup screen
  if (!isAuthenticated) {
    return (
      <LoginModal
        isOpen={true}
        onClose={() => { }} // No close allowed on auth gate
        onLoginSuccess={handleLoginSuccess}
        initialRole={role}
        initialMode="signup"
        isAuthGate={true}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#070b0f] text-slate-100 font-sans selection:bg-[#ff5500] selection:text-white flex flex-col justify-between">
      {/* Top Quick Navigation Bar */}
      <ScreenSwitcher
        currentScreen={activeScreen}
        currentRole={role}
        onSelectScreen={setActiveScreen}
        onToggleRole={handleToggleRole}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenScan={() => setIsScanOpen(true)}
        onOpenReport={() => setIsFullReportOpen(true)}
        onOpenUploadTape={() => setIsUploadTapeOpen(true)}
        onOpenPlayerScanner={() => setIsPlayerScannerOpen(true)}
      />

      {/* Global Header */}
      <Header
        role={role}
        athlete={athlete}
        onToggleRole={handleToggleRole}
        onOpenLogin={() => setIsLoginOpen(true)}
        onSearchPlayer={handleSearchPlayer}
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full">
        {activeScreen === 'home' && (
          <HomeView
            athlete={athlete}
            role={role}
            telemetry={telemetry}
            onToggleSession={toggleSession}
            scans={scans}
            onOpenUploadTape={() => setIsUploadTapeOpen(true)}
            onOpenScan={() => setIsScanOpen(true)}
            onNavigateToPerformance={() => setActiveScreen('performance')}
            onNavigateToSchedule={() => setActiveScreen('schedule')}
            onNavigateToProfile={() => setActiveScreen('profile')}
            onNavigateToFeed={() => setActiveScreen('feed')}
            onNavigateToChatbot={() => setActiveScreen('chatbot')}
            onNavigateToManagement={() => setActiveScreen('management')}
            onNavigateToCourses={() => setActiveScreen('courses')}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
            onPlayVideo={(video) => setActiveVideoItem(video)}
            onSelectScan={(scan) => setSelectedScanDetail(scan)}
            onLoginSuccess={handleLoginSuccess}
            communityAthletes={communityAthletes}
            onOpenLeaderboardAdmin={() => setIsLeaderboardAdminOpen(true)}
          />
        )}

        {activeScreen === 'performance' && (
          <PerformanceView
            athlete={athlete}
            role={role}
            telemetry={telemetry}
            communityAthletes={communityAthletes}
            scans={scans}
            fixtures={fixtures}
            sessions={sessions}
            posts={posts}
            loginActivities={loginActivities}
            onLogSession={handleLogSession}
            onToggleSession={toggleSession}
            onOpenScan={() => setIsScanOpen(true)}
            onOpenUploadTape={() => setIsUploadTapeOpen(true)}
            onOpenPlayerProfile={(playerId) => setSelectedPlayerId(playerId)}
          />
        )}

        {activeScreen === 'feed' && (
          <FeedView
            currentUser={athlete}
            posts={posts}
            stories={stories}
            communityAthletes={communityAthletes}
            scans={scans}
            followerNotifications={followerNotifications}
            onStartScan={() => setIsScanOpen(true)}
            onSelectScan={(scan) => setSelectedScanDetail(scan)}
            onViewAllScans={() => setActiveScreen('profile')}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
            onOpenPlayerProfile={(playerId) => setSelectedPlayerId(playerId)}
            onToggleFollow={handleToggleFollow}
            onToggleLikePost={handleToggleLikePost}
            onToggleSavePost={handleToggleSavePost}
            onAddComment={handleAddComment}
            onDeletePost={handleDeletePost}
            onOpenStory={(idx) => setActiveStoryIndex(idx)}
            onPlayVideo={(video) => setActiveVideoItem(video)}
          />
        )}

        {activeScreen === 'profile' && (
          <ProfileView
            athlete={athlete}
            role={role}
            communityAthletes={communityAthletes}
            onOpenFullReport={() => setIsFullReportOpen(true)}
            onPlayHighlight={(video) => setActiveVideoItem(video)}
            onPlayTape={(tape) => setActiveVideoItem(tape)}
            onUploadTape={() => setIsUploadTapeOpen(true)}
            onViewAllMatches={() => setIsFullReportOpen(true)}
            onViewAllHighlights={() => {
              if (athlete.highlights && athlete.highlights.length > 0) {
                setActiveVideoItem(athlete.highlights[0]);
              }
            }}
            onEditProfile={() => setIsEditProfileOpen(true)}
            onAdminDecidePerformance={() => setIsAdminPerformanceOpen(true)}
            onNavigateToSchedule={() => setActiveScreen('schedule')}
            onSelectPlayerProfile={(playerId) => setSelectedPlayerId(playerId)}
          />
        )}

        {activeScreen === 'schedule' && (
          <SchedulingView
            fixtures={fixtures}
            role={role}
            onNewFixture={() => {
              if (role === 'admin' || role === 'coach' || athlete.position === 'STAFF') {
                setIsScheduleModalOpen(true);
              } else {
                setIsLoginOpen(true);
              }
            }}
            onDeleteFixture={handleDeleteFixture}
            onUpdateFixture={handleUpdateFixture}
            onSwitchRole={(newRole) => handleToggleRole(newRole)}
            onOpenLogin={() => setIsLoginOpen(true)}
            onSelectFixture={(fixture) => {
              // Tactical schedule focus
            }}
          />
        )}

        {activeScreen === 'records' && (
          <RecordsView
            communityAthletes={communityAthletes}
            onSelectPlayer={(player) => {
              setSelectedPlayerId(player.id);
            }}
          />
        )}

        {activeScreen === 'management' && (
          <ManagementView
            role={role}
            currentAthlete={athlete}
            players={mgmtPlayers}
            feeRecords={mgmtFeeRecords}
            inventory={mgmtInventory}
            onUpdatePlayers={setMgmtPlayers}
            onUpdateFeeRecords={setMgmtFeeRecords}
            onUpdateInventory={setMgmtInventory}
            onOpenLogin={() => setIsLoginOpen(true)}
          />
        )}

        {activeScreen === 'courses' && (
          <CoursesView
            role={role}
            athlete={athlete}
            onOpenLogin={() => setIsLoginOpen(true)}
          />
        )}

        {activeScreen === 'video-review' && (
          <VideoReviewView role={role} athleteId={athlete.id} />
        )}

        {activeScreen === 'chatbot' && (
          <ChatbotView
            athlete={athlete}
            telemetry={telemetry}
            fixtures={fixtures}
            scans={scans}
            onTriggerAction={(actionType) => {
              if (actionType === 'schedule') setActiveScreen('schedule');
              if (actionType === 'profile') setActiveScreen('profile');
              if (actionType === 'scan') setIsScanOpen(true);
              if (actionType === 'performance') setActiveScreen('performance');
              if (actionType === 'management') setActiveScreen('management');
            }}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav
        role={role}
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
      />

      {/* --- Interactive Modals --- */}

      {/* 1. Login & Registration Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialRole={role}
      />

      {/* 2. Optical Biomechanical Scan Modal */}
      <ScanModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onScanComplete={handleScanCompleted}
      />

      {/* 3. Scan Detail Modal */}
      <ScanDetailModal
        isOpen={!!selectedScanDetail}
        scan={selectedScanDetail}
        onClose={() => setSelectedScanDetail(null)}
      />

      {/* 4. Full Report / Confidential Dossier Modal */}
      <FullReportModal
        isOpen={isFullReportOpen}
        athlete={athlete}
        onClose={() => setIsFullReportOpen(false)}
      />

      {/* 5. Video Highlight & Tactical Player Modal */}
      <VideoPlayerModal
        isOpen={!!activeVideoItem}
        item={activeVideoItem}
        onClose={() => setActiveVideoItem(null)}
      />

      {/* 6. Fixture Scheduling Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onAddFixture={handleAddFixture}
      />

      {/* 7. Upload Game Tape Modal */}
      <UploadTapeModal
        isOpen={isUploadTapeOpen}
        onClose={() => setIsUploadTapeOpen(false)}
        onUploadSuccess={handleTapeUploaded}
      />

      {/* 8. Edit Profile Modal (User / Player Customization) */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        athlete={athlete}
        onClose={() => setIsEditProfileOpen(false)}
        onSave={handleSaveProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* 9. Admin Performance Decision Modal (Admin Directorial Power) */}
      <AdminPerformanceModal
        isOpen={isAdminPerformanceOpen}
        athlete={athlete}
        onClose={() => setIsAdminPerformanceOpen(false)}
        onSave={handleSaveAdminPerformance}
        onSaveAdminPerformance={handleSaveAdminPerformance}
      />

      {/* 10. Create Post / Video Reel Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        currentUser={athlete}
        onClose={() => setIsCreatePostOpen(false)}
        onCreatePost={handleCreatePost}
      />

      {/* 11. Admin Leaderboard Control */}
      <LeaderboardAdminModal
        isOpen={isLeaderboardAdminOpen && role === 'admin'}
        players={(Object.values(communityAthletes) as AthleteProfile[]).filter(p => p.position !== 'STAFF' && !p.role?.toLowerCase().includes('coach') && !p.role?.toLowerCase().includes('admin'))}
        onClose={() => setIsLeaderboardAdminOpen(false)}
        onSave={handleSaveLeaderboard}
      />

      {/* 12. Instagram-Style Player Profile Modal */}
      {selectedAthleteForProfile && (
        <PlayerProfileModal
          isOpen={!!selectedPlayerId}
          athlete={selectedAthleteForProfile}
          posts={posts}
          onClose={() => setSelectedPlayerId(null)}
          onToggleFollow={handleToggleFollow}
          onPlayVideo={(video) => setActiveVideoItem(video)}
        />
      )}

      {/* 12. Instagram-Style Story Viewer Modal */}
      {activeStoryIndex !== null && (
        <StoryViewerModal
          isOpen={activeStoryIndex !== null}
          stories={stories}
          initialIndex={activeStoryIndex}
          onClose={() => setActiveStoryIndex(null)}
        />
      )}

      {/* 13. Player Profile Scanner Modal */}
      <PlayerScannerModal
        isOpen={isPlayerScannerOpen}
        onClose={() => setIsPlayerScannerOpen(false)}
        communityAthletes={communityAthletes}
        onOpenPlayerProfile={(playerId) => {
          setSelectedPlayerId(playerId);
          setIsPlayerScannerOpen(false);
        }}
      />
    </div>
  );
}


