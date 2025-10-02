import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const { signup, loginWithOAuth2, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = ((location.state as any)?.from?.pathname as string) || "/";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    const success = await signup(formData.email, formData.password, formData.name);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google' || provider === 'GitHub') {
      loginWithOAuth2(provider.toLowerCase() as 'google' | 'github', from);
    } else {
      console.log(`${provider} signup not implemented yet`);
    }
  };

  return (
    <div className="page-background">
      <div className="container-centered">
        <div className="content-max-width">
          <div className="card p-8">
            <div className="logo-container">
              <img
                src="/icons/app-logo.svg"
                alt="Lucky Numbers"
                width={80}
                height={80}
              />
            </div>
            <h2 className="page-title">
              계정 만들기
            </h2>
            <p className="page-subtitle">
              또는{" "}
              <Link to="/login" className="navigation-link">
                기존 계정으로 로그인
              </Link>
            </p>

            <div className="divider-section">
              <div className="divider-text">
                <span>또는 다음으로 계속</span>
              </div>
            </div>

            <div className="social-grid">
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                className="btn btn-secondary flex items-center justify-center space-x-2"
              >
                <img
                  src="/icons/google.svg"
                  alt="Google"
                  width={20}
                  height={20}
                />
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("GitHub")}
                className="btn btn-secondary flex items-center justify-center space-x-2"
              >
                <img
                  src="/icons/github.svg"
                  alt="GitHub"
                  width={20}
                  height={20}
                />
                <span>GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("Kakao")}
                className="btn btn-secondary flex items-center justify-center space-x-2"
              >
                <img
                  src="/icons/kakao.svg"
                  alt="카카오"
                  width={20}
                  height={20}
                />
                <span>카카오</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialLogin("Naver")}
                className="btn btn-secondary flex items-center justify-center space-x-2"
              >
                <img
                  src="/icons/naver.svg"
                  alt="네이버"
                  width={20}
                  height={20}
                />
                <span>네이버</span>
              </button>
            </div>

            <form className="form-section" onSubmit={handleSubmit}>
              {error && (
                <div className="error-message bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="form-section">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    이름
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="input-field"
                    placeholder="이름을 입력하세요"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email-address" className="form-label">
                    이메일 주소
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input-field"
                    placeholder="이메일 주소를 입력하세요"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    비밀번호
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="input-field"
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password" className="form-label">
                    비밀번호 확인
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="input-field"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="checkbox-group">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  required
                  className="checkbox"
                />
                <label htmlFor="agree-terms" className="text-sm text-gray-700">
                  다음에 동의합니다{" "}
                  <Link to="#" className="navigation-link">
                    서비스 약관
                  </Link>{" "}
                  및{" "}
                  <Link to="#" className="navigation-link">
                    개인정보 처리방침
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={isLoading}
              >
                {isLoading ? '계정 생성 중...' : '계정 만들기'}
              </button>

              <div className="text-center">
                <Link to="/" className="navigation-link">
                  ← 홈으로 돌아가기
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}