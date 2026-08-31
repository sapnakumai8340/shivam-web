import { io, Socket } from 'socket.io-client';
import { 
  AthleteProfile, 
  BiomechanicalScan, 
  FixtureSchedule, 
  SocialPost, 
  PlayerStory, 
  FollowerNotification,
  ChatMessage
} from '../types';
import { LiveTelemetrySnapshot } from './realtimeStore';
import { API_BASE_URL } from './apiService';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();
  public isConnected: boolean = false;
  public socketId: string = '';
  public latencyMs: number = 12;
  public onlineUsersCount: number = 1;

  public connect(): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    // Connect to backend origin explicitly (needed for Capacitor APKs)
    this.socket = io(API_BASE_URL, {
      auth: { userId: localStorage.getItem('apex_current_user_id') || 'APX-9942' },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.socketId = this.socket?.id || '';
      console.log('⚡ [Socket.IO Client] Connected with ID:', this.socketId);
      this.notifySubscribers('connection:status', { isConnected: true, socketId: this.socketId });
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('🔌 [Socket.IO Client] Disconnected');
      this.notifySubscribers('connection:status', { isConnected: false });
    });

    this.socket.on('presence:count', (count: number) => {
      this.onlineUsersCount = count;
      this.notifySubscribers('presence:count', count);
    });

    this.socket.on('init:state', (data: any) => {
      this.notifySubscribers('init:state', data);
    });

    this.socket.on('telemetry:update', (telemetry: LiveTelemetrySnapshot) => {
      this.notifySubscribers('telemetry:update', telemetry);
    });

    this.socket.on('post:created', (post: SocialPost) => {
      this.notifySubscribers('post:created', post);
    });

    this.socket.on('post:updated', (post: SocialPost) => {
      this.notifySubscribers('post:updated', post);
    });

    this.socket.on('post:deleted', (postId: string) => {
      this.notifySubscribers('post:deleted', postId);
    });

    this.socket.on('story:created', (story: PlayerStory) => {
      this.notifySubscribers('story:created', story);
    });

    this.socket.on('scan:created', (scan: BiomechanicalScan) => {
      this.notifySubscribers('scan:created', scan);
    });

    this.socket.on('fixture:created', (fixture: FixtureSchedule) => {
      this.notifySubscribers('fixture:created', fixture);
    });

    this.socket.on('fixture:updated', (fixture: FixtureSchedule) => {
      this.notifySubscribers('fixture:updated', fixture);
    });

    this.socket.on('fixture:deleted', (fixtureId: string) => {
      this.notifySubscribers('fixture:deleted', fixtureId);
    });

    this.socket.on('athlete:updated', (athlete: AthleteProfile) => {
      this.notifySubscribers('athlete:updated', athlete);
    });

    this.socket.on('community:updated', (communityAthletes: Record<string, AthleteProfile>) => {
      this.notifySubscribers('community:updated', communityAthletes);
    });

    this.socket.on('video:analysis:started', (data: any) => this.notifySubscribers('video:analysis:started', data));
    this.socket.on('video:analysis:ready', (data: any) => this.notifySubscribers('video:analysis:ready', data));
    this.socket.on('video:coach:reviewed', (data: any) => this.notifySubscribers('video:coach:reviewed', data));
    this.socket.on('video:review:updated', (data: any) => this.notifySubscribers('video:review:updated', data));

    this.socket.on('notification:created', (notif: FollowerNotification) => {
      this.notifySubscribers('notification:created', notif);
    });

    this.socket.on('chat:message', (msg: ChatMessage) => {
      this.notifySubscribers('chat:message', msg);
    });

    this.socket.on('chat:typing', (data: { isTyping: boolean; sender?: string; mode?: string }) => {
      this.notifySubscribers('chat:typing', data);
    });

    return this.socket;
  }

  public subscribe(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      const set = this.listeners.get(event);
      if (set) {
        set.delete(callback);
      }
    };
  }

  private notifySubscribers(event: string, data: any) {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in socket subscriber for ${event}:`, e);
        }
      });
    }
  }

  // Emitters
  public toggleSession() {
    this.socket?.emit('telemetry:toggle-session');
  }

  public createPost(post: SocialPost) {
    this.socket?.emit('post:create', post);
  }

  public deletePost(postId: string, userId?: string) {
    this.socket?.emit('post:delete', { postId, userId });
  }

  public likePost(postId: string, userId?: string) {
    this.socket?.emit('post:like', { postId, userId });
  }

  public savePost(postId: string) {
    this.socket?.emit('post:save', { postId });
  }

  public commentPost(postId: string, comment: any, authorId?: string) {
    this.socket?.emit('post:comment', { postId, comment, authorId });
  }

  public createStory(story: PlayerStory) {
    this.socket?.emit('story:create', story);
  }

  public emit(event: string, ...args: any[]) {
    this.socket?.emit(event, ...args);
  }

  public createSession(session: any) {
    this.socket?.emit('session:create', session);
  }

  public createScan(scan: BiomechanicalScan) {
    this.socket?.emit('scan:create', scan);
  }

  public createFixture(fixture: FixtureSchedule) {
    this.socket?.emit('fixture:create', fixture);
  }

  public updateFixture(fixture: FixtureSchedule) {
    this.socket?.emit('fixture:update', fixture);
  }

  public deleteFixture(fixtureId: string) {
    this.socket?.emit('fixture:delete', fixtureId);
  }

  public updateAthlete(athlete: AthleteProfile) {
    this.socket?.emit('athlete:update', athlete);
  }

  public calibrateAthlete(decisionData: any) {
    this.socket?.emit('athlete:calibrate', decisionData);
  }

  public toggleFollow(targetId: string, followerId?: string) {
    this.socket?.emit('user:follow', { targetId, followerId });
  }

  public identifyUser(userId: string) { this.socket?.emit('user:identify', userId); }

  public sendChatMessage(
    text: string,
    sender: string = 'user',
    options?: {
      id?: string;
      userId?: string;
      mode?: 'tactics' | 'biomechanics' | 'conditioning' | 'nutrition';
      history?: Array<{ sender: 'user' | 'apex'; text: string }>;
    }
  ) {
    this.socket?.emit('chat:send', {
      id: options?.id,
      text,
      sender,
      userId: options?.userId,
      mode: options?.mode,
      history: options?.history,
    });
  }
}

export const socketService = new SocketService();
