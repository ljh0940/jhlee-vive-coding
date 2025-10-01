import { Button, ButtonProps } from '@/components/atoms/Button';

export interface SocialLoginButtonProps extends Omit<ButtonProps, 'children'> {
  provider: 'Google' | 'GitHub' | 'Kakao' | 'Naver';
  onSocialLogin: (provider: string) => void;
}

export const SocialLoginButton = ({
  provider,
  onSocialLogin,
  ...buttonProps
}: SocialLoginButtonProps) => {
  const providerConfig = {
    Google: {
      icon: '/icons/google.svg',
      label: 'Google'
    },
    GitHub: {
      icon: '/icons/github.svg',
      label: 'GitHub'
    },
    Kakao: {
      icon: '/icons/kakao.svg',
      label: '카카오'
    },
    Naver: {
      icon: '/icons/naver.svg',
      label: '네이버'
    }
  };

  const config = providerConfig[provider];

  return (
    <Button
      variant="secondary"
      onClick={() => onSocialLogin(provider)}
      className="flex items-center justify-center space-x-2"
      {...buttonProps}
    >
      <img
        src={config.icon}
        alt={config.label}
        width={20}
        height={20}
      />
      <span>{config.label}</span>
    </Button>
  );
};