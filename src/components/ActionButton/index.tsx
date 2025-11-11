import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';

import './index.css';
import { cn } from '@/lib/utils';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

export const UpButton = ({
  isLoading,
  className,
  ...props
}: ActionButtonProps) => {
  const { onMouseLeave } = props;
  if (isLoading) {
    return (
      <button
        onMouseLeave={onMouseLeave}
        type="button"
        className="flex h-[110px] flex-1 items-center justify-center gap-[3px] bg-[url('@/assets/actions/up-loading.png')] bg-cover bg-center bg-no-repeat text-sm"
      >
        <Loader2 className="animate-spin" size={18} /> Sign in Wallet
      </button>
    );
  }

  return (
    <button type="button" className={cn('up-button', className)} {...props} />
  );
};

export const DownButton = ({
  isLoading,
  className,
  ...props
}: ActionButtonProps) => {
  const { onMouseLeave } = props;
  if (isLoading) {
    return (
      <button
        onMouseLeave={onMouseLeave}
        type="button"
        className="flex h-[110px] flex-1 items-center justify-center gap-[3px] bg-[url('@/assets/actions/down-loading.png')] bg-cover bg-center bg-no-repeat text-sm"
      >
        <Loader2 className="animate-spin" size={18} /> Sign in Wallet
      </button>
    );
  }

  return (
    <button type="button" className={cn('down-button', className)} {...props} />
  );
};
