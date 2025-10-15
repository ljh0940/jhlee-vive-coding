const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  picture: string | null;
  role: string;
  provider: string;
}

class AuthService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async signUp(data: SignUpRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || '회원가입에 실패했습니다');
    }

    return response.json();
  }

  async signIn(data: SignInRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || '로그인에 실패했습니다');
    }

    return response.json();
  }

  async getCurrentUser(): Promise<UserResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('사용자 정보를 가져오는데 실패했습니다');
    }

    return response.json();
  }

  saveTokens(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // OAuth2 로그인
  initiateOAuth2Login(provider: 'kakao', from?: string): void {
    if (from) {
      localStorage.setItem('oauth2_redirect_from', from);
    }
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`;
  }

  getOAuth2RedirectPath(): string {
    const path = localStorage.getItem('oauth2_redirect_from') || '/';
    localStorage.removeItem('oauth2_redirect_from');
    return path;
  }
}

export const authService = new AuthService();
