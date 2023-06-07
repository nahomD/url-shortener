import { Ripple, initTE } from 'tw-elements';
import { ReactNode, useEffect } from 'react';

const Button = ({
  className,
  rippleColor,
  onClick,
  children,
  disabled,
  'data-testid': testId,
}: {
  className?: string;
  rippleColor?: string;
  onClick?: VoidFunction;
  children: ReactNode;
  disabled?: boolean;
  'data-testid'?: string;
}) => {
  useEffect(() => {
    initTE({ Ripple });
  }, []);
  return (
    <button
      type="button"
      data-te-ripple-init
      data-te-ripple-color={rippleColor}
      className={className}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      {children}
    </button>
  );
};

export default Button;
