import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/authService';

export default function OAuth2Redirect() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth2 error:', error);
      navigate('/login?error=' + encodeURIComponent(error));
      return;
    }

    if (accessToken && refreshToken) {
      authService.saveTokens({
        accessToken,
        refreshToken,
        tokenType: 'Bearer',
      });

      // OAuth2 로그인 시작 전에 저장한 경로로 리다이렉트
      const redirectPath = authService.getOAuth2RedirectPath();
      navigate(redirectPath, { replace: true });
    } else {
      navigate('/login?error=' + encodeURIComponent('토큰을 받지 못했습니다'));
    }
  }, [searchParams, navigate]);

  return (
    <div className="page-background">
      <div className="container-centered">
        <div className="content-max-width">
          <div className="card p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">로그인 처리 중...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
