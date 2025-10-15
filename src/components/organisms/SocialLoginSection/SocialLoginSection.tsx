import { SocialLoginButton } from '@/components/molecules/SocialLoginButton';

export interface SocialLoginSectionProps {
  onSocialLogin: (provider: string) => void;
}

export const SocialLoginSection = ({ onSocialLogin }: SocialLoginSectionProps) => {
  return (
    <div>
      <div className="divider-section">
        <div className="divider-text">
          <span>또는 다음으로 계속</span>
        </div>
      </div>

      <div className="social-grid">
        <SocialLoginButton provider="Kakao" onSocialLogin={onSocialLogin} />
      </div>
    </div>
  );
};