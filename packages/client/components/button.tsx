import { Ripple, initTE } from 'tw-elements';
import { ReactNode, useEffect } from 'react';

const Button = ({
  className,
  rippleColor: color,
  onClick,
  children,
}: {
  className?: string;
  rippleColor?: string;
  onClick?: VoidFunction;
  children: ReactNode;
}) => {
  useEffect(() => {
    initTE({ Ripple });
  }, []);
  return (
    <button
      type="button"
      data-te-ripple-init
      data-te-ripple-color={color}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
