import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '@/services/authService';

export default function OAuth2Redirect() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processOAuth2Callback = async () => {
      const accessToken = searchParams.get('accessToken');
      const refreshToken = searchParams.get('refreshToken');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        console.error('OAuth2 error:', errorParam);
        setError(errorParam);
        setTimeout(() => {
          navigate('/login?error=' + encodeURIComponent(errorParam));
        }, 2000);
        return;
      }

      if (accessToken && refreshToken) {
        try {
          // 토큰 저장
          authService.saveTokens({
            accessToken,
            refreshToken,
            tokenType: 'Bearer',
          });

          // 사용자 정보 로드 (AuthContext가 자동으로 처리)
          // OAuth2 로그인 시작 전에 저장한 경로로 리다이렉트
          const redirectPath = authService.getOAuth2RedirectPath();

          // 페이지 새로고침을 통해 AuthContext가 토큰으로부터 사용자 정보를 로드하도록 함
          window.location.href = redirectPath;
        } catch (err) {
          console.error('Failed to process OAuth2 callback:', err);
          setError('로그인 처리 중 오류가 발생했습니다.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }
      } else {
        setError('토큰을 받지 못했습니다.');
        setTimeout(() => {
          navigate('/login?error=' + encodeURIComponent('토큰을 받지 못했습니다'));
        }, 2000);
      }
    };

    processOAuth2Callback();
  }, [searchParams, navigate]);

  return (
    <div className="page-background">
      <div className="container-centered">
        <div className="content-max-width">
          <div className="card p-8">
            <div className="text-center">
              {error ? (
                <>
                  <div className="text-red-600 mb-4">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">{error}</p>
                  <p className="text-sm text-gray-500 mt-2">로그인 페이지로 이동합니다...</p>
                </>
              ) : (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">로그인 처리 중...</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
