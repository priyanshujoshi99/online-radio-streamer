import type { ReactNode } from 'react';
import { Footer } from './Footer';
import styles from './MainLayout.module.css';

type Props = {
  children: ReactNode;
}

export const MainLayout = ({ children }: Props) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>Radio</div>
        <a 
          href="https://github.com/priyanshujoshi99/online-radio-streamer" 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="GitHub Repository"
          style={{ color: 'white', display: 'flex', alignItems: 'center' }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
        </a>
      </header>
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
