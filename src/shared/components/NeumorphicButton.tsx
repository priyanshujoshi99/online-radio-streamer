import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './NeumorphicButton.module.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const NeumorphicButton = ({ children, variant = 'secondary', className = '', ...props }: Props) => {
  return (
    <button 
      className={`${styles.button} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
