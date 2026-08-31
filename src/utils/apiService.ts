import {
  AthleteProfile,
  SocialPost,
  SocialComment,
  FollowerNotification,
} from '../types';


// IMPORTANT: Vite only exposes VITE_* variables from .env files in the project root.
// Never fall back to window.location.origin inside a Capacitor APK: that points to the
// WebView origin, not the Express backend.
const ENV_API_URL = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) as string | undefined;
const DEFAULT_API_URL = 'https://shivamkumar-lw4a.onrender.com';

const isLocalBrowser = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && !(window as any).Capacitor;
export const API_BASE_URL = (ENV_API_URL || (isLocalBrowser ? '' : DEFAULT_API_URL)).replace(/\/+$/, '');

class ApiService {
  // ==========================================================
  // HELPERS
  // ==========================================================

  private getHeaders(userId?: string): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (userId) {
      headers['x-user-id'] = userId;
    }

    return headers;
  }

  private buildUrl(
    path: string,
    params?: Record<string, string | undefined>
  ): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${API_BASE_URL}${cleanPath}`;

    if (!params) {
      return url;
    }

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, value);
      }
    });

    const query = searchParams.toString();
    return query ? `${url}?${query}` : url;
  }

  
  private async parseResponse<T>(
    res: Response
  ): Promise<T> {
    const contentType =
      res.headers.get('content-type')?.toLowerCase() || '';

    const text = await res.text();

    if (!text) {
      if (!res.ok) {
        throw new Error(
          `Server returned ${res.status} ${res.statusText || ''}`.trim()
        );
      }

      return {} as T;
    }

    let data: T;

    try {
      data = JSON.parse(text) as T;
    } catch {
      const preview = text
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 200);

      throw new Error(
        `Server returned ${res.status} non-JSON response${
          preview ? `: ${preview}` : ''
        }`
      );
    }

    if (!res.ok) {
      const errorData = data as any;

      throw new Error(
        errorData?.error ||
          errorData?.message ||
          `Request failed with status ${res.status}`
      );
    }

    return data;
  }

  // ==========================================================
  // VIDEO AI + COACH REVIEW
  // ==========================================================
  async analyzeVideo(data: { userId?: string; title: string; frames?: string[]; imageBase64?: string; videoUrl?: string }) {
    try {
      const res = await fetch(this.buildUrl('/api/video/analyze'), {
        method: 'POST',
        headers: this.getHeaders(data.userId),
        body: JSON.stringify(data),
      });
      return await this.parseResponse<any>(res);
    } catch (e: any) {
      return { success: false, error: e?.message || 'Video analysis failed' };
    }
  }

  async getVideoReviews(userId: string) {
    try {
      const res = await fetch(this.buildUrl('/api/video/reviews', { userId }), { headers: this.getHeaders(userId) });
      return await this.parseResponse<any>(res);
    } catch (e: any) { return { reviews: [], error: e?.message }; }
  }

  async addCoachVideoReview(reviewId: string, data: { coachId?: string; coachName: string; text: string }) {
    try {
      const res = await fetch(this.buildUrl(`/api/video/reviews/${encodeURIComponent(reviewId)}/coach`), {
        method: 'POST', headers: this.getHeaders(data.coachId), body: JSON.stringify(data),
      });
      return await this.parseResponse<any>(res);
    } catch (e: any) { return { success: false, error: e?.message || 'Coach review failed' }; }
  }

  // ==========================================================
  // 1. AUTH: SIGNUP
  // ==========================================================

  async signup(data: {
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
  }): Promise<{
    success: boolean;
    user?: AthleteProfile;
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl('/api/auth/signup'),
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify(data),
        }
      );

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || 'Network error during signup',
      };
    }
  }

  // ==========================================================
  // 2. AUTH: LOGIN
  // ==========================================================

  async login(
    email: string,
    password?: string
  ): Promise<{
    success: boolean;
    user?: AthleteProfile;
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl('/api/auth/login'),
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || 'Network error during login',
      };
    }
  }

  // ==========================================================
  // 3. AUTH: LOGOUT
  // ==========================================================

  async logout(userId: string): Promise<{
    success: boolean;
    totalUsers?: number;
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl('/api/auth/logout'),
        {
          method: 'POST',
          headers: this.getHeaders(userId),
          body: JSON.stringify({ userId }),
        }
      );

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || 'Network error during logout',
      };
    }
  }

  // ==========================================================
  // 4. HEALTH CHECK
  // ==========================================================

  async health(): Promise<{
    status?: string;
    socketIO?: boolean;
    connectedClients?: number;
    totalUsers?: number;
    totalPosts?: number;
    timestamp?: string;
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl('/api/health'),
        {
          method: 'GET',
          headers: this.getHeaders(),
        }
      );

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        error: e?.message || 'Unable to connect to API server',
      };
    }
  }

  // ==========================================================
  // 5. CURRENT USER PROFILE
  // ==========================================================

  async getMe(
    userId: string
  ): Promise<{
    user?: AthleteProfile;
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl('/api/me', {
          userId,
        }),
        {
          headers: this.getHeaders(userId),
        }
      );

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        error: e?.message || 'Unable to get current user',
      };
    }
  }

  // ==========================================================
  // 6. GET ALL USERS
  // ==========================================================

  async getUsers(
    viewerId?: string
  ): Promise<{
    users: AthleteProfile[];
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl('/api/users', {
          viewerId,
        }),
        {
          headers: this.getHeaders(viewerId),
        }
      );

      const data = await this.parseResponse<{
        users?: AthleteProfile[];
        error?: string;
      }>(res);

      return {
        users: Array.isArray(data.users)
          ? data.users
          : [],
        error: data.error,
      };
    } catch (e: any) {
      return {
        users: [],
        error: e?.message,
      };
    }
  }

  // ==========================================================
  // 7. GET USER BY ID
  // ==========================================================

  async getUser(
    id: string,
    viewerId?: string
  ): Promise<{
    user?: AthleteProfile;
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl(
          `/api/users/${encodeURIComponent(id)}`,
          { viewerId }
        ),
        {
          headers: this.getHeaders(viewerId),
        }
      );

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        error: e?.message || 'Unable to get user',
      };
    }
  }

  // ==========================================================
  // 8. FOLLOW / UNFOLLOW
  // ==========================================================

  async toggleFollow(
    targetId: string,
    followerId: string
  ): Promise<{
    success: boolean;
    isFollowing: boolean;
    follower?: AthleteProfile;
    target?: AthleteProfile;
    notification?: FollowerNotification;
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl(
          `/api/users/${encodeURIComponent(targetId)}/follow`
        ),
        {
          method: 'POST',
          headers: this.getHeaders(followerId),
          body: JSON.stringify({
            followerId,
          }),
        }
      );

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        success: false,
        isFollowing: false,
        error: e?.message || 'Unable to follow/unfollow user',
      };
    }
  }

  // ==========================================================
  // 9. UPDATE PROFILE
  // ==========================================================

  async updateProfile(
    userId: string,
    updates: Partial<AthleteProfile>
  ): Promise<{
    success: boolean;
    user?: AthleteProfile;
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl('/api/users/profile'),
        {
          method: 'PATCH',
          headers: this.getHeaders(userId),
          body: JSON.stringify({
            userId,
            ...updates,
          }),
        }
      );

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || 'Unable to update profile',
      };
    }
  }

  // ==========================================================
  // 10. GET POSTS
  // ==========================================================

  async getPosts(
    viewerId?: string
  ): Promise<{
    posts: SocialPost[];
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl('/api/posts', {
          viewerId,
        }),
        {
          headers: this.getHeaders(viewerId),
        }
      );

      const data = await this.parseResponse<{
        posts?: SocialPost[];
        error?: string;
      }>(res);

      return {
        posts: Array.isArray(data.posts)
          ? data.posts
          : [],
        error: data.error,
      };
    } catch (e: any) {
      return {
        posts: [],
        error: e?.message,
      };
    }
  }

  // ==========================================================
  // 11. CREATE POST
  // ==========================================================

  async createPost(
    postData: any
  ): Promise<{
    post?: SocialPost;
    author?: AthleteProfile;
    success?: boolean;
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl('/api/posts'),
        {
          method: 'POST',
          headers: this.getHeaders(postData.authorId),
          body: JSON.stringify(postData),
        }
      );

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || 'Unable to create post',
      };
    }
  }

  // ==========================================================
  // 12. DELETE POST
  // ==========================================================

  async deletePost(
    postId: string,
    userId: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl(
          `/api/posts/${encodeURIComponent(postId)}`
        ),
        {
          method: 'DELETE',
          headers: this.getHeaders(userId),
          body: JSON.stringify({ userId }),
        }
      );

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || 'Unable to delete post',
      };
    }
  }

  // ==========================================================
  // 13. TOGGLE LIKE
  // ==========================================================

  async toggleLike(
    postId: string,
    userId: string
  ): Promise<{
    success: boolean;
    isLiked: boolean;
    post: SocialPost;
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl(
          `/api/posts/${encodeURIComponent(postId)}/like`
        ),
        {
          method: 'POST',
          headers: this.getHeaders(userId),
          body: JSON.stringify({ userId }),
        }
      );

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        success: false,
        isLiked: false,
        post: {} as SocialPost,
        error: e?.message || 'Unable to like post',
      };
    }
  }

  // ==========================================================
  // 14. ADD COMMENT
  // ==========================================================

  async addComment(
    postId: string,
    authorId: string,
    text: string
  ): Promise<{
    success: boolean;
    comment: SocialComment;
    post: SocialPost;
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl(
          `/api/posts/${encodeURIComponent(postId)}/comments`
        ),
        {
          method: 'POST',
          headers: this.getHeaders(authorId),
          body: JSON.stringify({
            authorId,
            text,
          }),
        }
      );

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        success: false,
        comment: {} as SocialComment,
        post: {} as SocialPost,
        error: e?.message || 'Unable to add comment',
      };
    }
  }

  // ==========================================================
  // 15. GET NOTIFICATIONS
  // ==========================================================

  async getNotifications(
    userId: string
  ): Promise<{
    notifications: FollowerNotification[];
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl('/api/notifications', {
          userId,
        }),
        {
          headers: this.getHeaders(userId),
        }
      );

      const data = await this.parseResponse<{
        notifications?: FollowerNotification[];
        error?: string;
      }>(res);

      return {
        notifications: Array.isArray(data.notifications)
          ? data.notifications
          : [],
        error: data.error,
      };
    } catch (e: any) {
      return {
        notifications: [],
        error: e?.message,
      };
    }
  }

  // ==========================================================
  // 16. MARK NOTIFICATION READ
  // ==========================================================

  async markNotificationRead(
    id: string
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl(
          `/api/notifications/${encodeURIComponent(id)}/read`
        ),
        {
          method: 'POST',
          headers: this.getHeaders(),
        }
      );

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || 'Unable to mark notification as read',
      };
    }
  }

  // ==========================================================
  // 17. COMPLETE STATE
  // ==========================================================

  async getState(
    viewerId?: string
  ): Promise<any> {
    try {
      const res = await fetch(
        this.buildUrl('/api/state', {
          viewerId,
        }),
        {
          headers: this.getHeaders(viewerId),
        }
      );

      return await this.parseResponse(res);
    } catch {
      return null;
    }
  }

  // ==========================================================
  // 18. AI CHATBOT
  // ==========================================================

  async sendChatMessage(payload: {
    message: string;
    userId?: string;
    mode?:
      | 'tactics'
      | 'biomechanics'
      | 'conditioning'
      | 'nutrition';
    history?: Array<{
      sender: 'user' | 'apex';
      text: string;
    }>;
  }): Promise<{
    success: boolean;
    message?: any;
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl('/api/chat'),
        {
          method: 'POST',
          headers: this.getHeaders(payload.userId),
          body: JSON.stringify(payload),
        }
      );

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        success: false,
        error:
          e?.message ||
          'Network error communicating with AI',
      };
    }
  }

  // ==========================================================
  // 19. GET SESSIONS
  // ==========================================================

  async getSessions(
    athleteId?: string
  ): Promise<{
    sessions: any[];
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl('/api/sessions', {
          athleteId,
        }),
        {
          headers: this.getHeaders(athleteId),
        }
      );

      const data = await this.parseResponse<{
        sessions?: any[];
        error?: string;
      }>(res);

      return {
        sessions: Array.isArray(data.sessions)
          ? data.sessions
          : [],
        error: data.error,
      };
    } catch (e: any) {
      return {
        sessions: [],
        error: e?.message,
      };
    }
  }

  // ==========================================================
  // 20. LOG SESSION
  // ==========================================================

  async logSession(
    sessionData: any
  ): Promise<{
    success: boolean;
    session?: any;
    athlete?: any;
    error?: string;
  }> {
    try {
      const res = await fetch(this.buildUrl('/api/sessions'), {
        method: 'POST',
        headers: this.getHeaders(sessionData.athleteId),
        body: JSON.stringify(sessionData),
      });

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || 'Network error logging session',
      };
    }
  }

  // ==========================================================
  // 21. COURSES & ACADEMY LEARNING PLATFORM
  // ==========================================================

  async getCourses(includeAll = false): Promise<{
    courses: any[];
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl('/api/courses', {
          all: includeAll ? 'true' : undefined,
        }),
        {
          headers: this.getHeaders(),
        }
      );

      const data = await this.parseResponse<{
        courses?: any[];
        error?: string;
      }>(res);

      return {
        courses: Array.isArray(data.courses) ? data.courses : [],
        error: data.error,
      };
    } catch (e: any) {
      return {
        courses: [],
        error: e?.message,
      };
    }
  }

  async getCourse(id: string): Promise<{
    course?: any;
    error?: string;
  }> {
    try {
      const res = await fetch(this.buildUrl(`/api/courses/${id}`), {
        headers: this.getHeaders(),
      });

      const data = await this.parseResponse<{
        course?: any;
        error?: string;
      }>(res);

      return {
        course: data.course,
        error: data.error,
      };
    } catch (e: any) {
      return {
        error: e?.message,
      };
    }
  }

  async saveCourse(courseData: any): Promise<{
    success: boolean;
    course?: any;
    error?: string;
  }> {
    try {
      const isEdit = !!courseData.id;
      const url = isEdit ? `/api/courses/${courseData.id}` : '/api/courses';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(this.buildUrl(url), {
        method,
        headers: this.getHeaders(),
        body: JSON.stringify(courseData),
      });

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || 'Network error saving course',
      };
    }
  }

  async deleteCourse(id: string): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const res = await fetch(this.buildUrl(`/api/courses/${id}`), {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || 'Network error deleting course',
      };
    }
  }

  async enrollCourse(courseId: string, userId?: string): Promise<{
    success: boolean;
    progress?: any;
    error?: string;
  }> {
    try {
      const res = await fetch(this.buildUrl(`/api/courses/${courseId}/enroll`), {
        method: 'POST',
        headers: this.getHeaders(userId),
        body: JSON.stringify({ userId }),
      });

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || 'Network error enrolling in course',
      };
    }
  }

  async updateCourseProgress(
    courseId: string,
    lessonId: string,
    positionSec = 0,
    completed = false,
    userId?: string
  ): Promise<{
    success: boolean;
    progress?: any;
    error?: string;
  }> {
    try {
      const res = await fetch(this.buildUrl(`/api/courses/${courseId}/progress`), {
        method: 'POST',
        headers: this.getHeaders(userId),
        body: JSON.stringify({
          userId,
          lessonId,
          positionSec,
          completed,
        }),
      });

      return await this.parseResponse(res);
    } catch (e: any) {
      return {
        success: false,
        error: e?.message || 'Network error updating course progress',
      };
    }
  }

  async getUserCoursesProgress(userId?: string): Promise<{
    progress: Record<string, any>;
    error?: string;
  }> {
    try {
      const res = await fetch(
        this.buildUrl('/api/courses-progress', {
          userId,
        }),
        {
          headers: this.getHeaders(userId),
        }
      );

      const data = await this.parseResponse<{
        progress?: Record<string, any>;
        error?: string;
      }>(res);

      return {
        progress: data.progress || {},
        error: data.error,
      };
    } catch (e: any) {
      return {
        progress: {},
        error: e?.message,
      };
    }
  }
}

export const apiService = new ApiService();