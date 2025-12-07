import type { ReactNode } from 'react';
import styles from './MainLayout.module.css';

type Props = {
  children: ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>RadioStreamer</div>
        <nav>
          {/* Add navigation items here if needed */}
        </nav>
      </header>
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};
