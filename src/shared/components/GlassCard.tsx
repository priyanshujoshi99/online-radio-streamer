import type { ReactNode } from 'react';
import styles from './GlassCard.module.css';

type Props = {
  children: ReactNode;
  className?: string;
};

export const GlassCard = ({ children, className = '' }: Props) => {
  return (
    <div className={`${styles.card} ${className}`}>
      {children}
    </div>
  );
};
