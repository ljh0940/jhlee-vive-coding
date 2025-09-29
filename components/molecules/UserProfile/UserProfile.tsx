import { cn } from '@/lib/utils';

export interface UserProfileProps {
  firstName: string;
  lastName: string;
  email: string;
  className?: string;
}

export const UserProfile = ({ firstName, lastName, email, className }: UserProfileProps) => {
  return (
    <div className={cn('user-profile', className)}>
      <div className="user-avatar">
        {firstName.charAt(0).toUpperCase()}
      </div>
      <h3 className="text-xl font-semibold mb-2">{firstName} {lastName}님</h3>
      <p className="text-white/80">{email}</p>
    </div>
  );
};