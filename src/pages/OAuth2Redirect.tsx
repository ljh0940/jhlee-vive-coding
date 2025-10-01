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

      // 사용자 정보를 가져오는 대신 홈으로 리다이렉트
      // AuthContext가 자동으로 사용자 정보를 로드할 것입니다
      navigate('/');
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
