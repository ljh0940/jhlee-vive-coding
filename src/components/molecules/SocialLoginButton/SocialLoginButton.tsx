import { Button, ButtonProps } from '@/components/atoms/Button';

export interface SocialLoginButtonProps extends Omit<ButtonProps, 'children'> {
  provider: 'Kakao';
  onSocialLogin: (provider: string) => void;
}

export const SocialLoginButton = ({
  provider,
  onSocialLogin,
  ...buttonProps
}: SocialLoginButtonProps) => {
  const providerConfig = {
    Kakao: {
      icon: '/icons/kakao.svg',
      label: '카카오'
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