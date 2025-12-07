import styles from './Footer.module.css';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>Built with ❤️ by <a href="https://github.com/priyanshujoshi99" target="_blank" rel="noopener noreferrer">Priyanshu</a></p>
      </div>
    </footer>
  );
};
