import type { Station } from '../../../data/stations';
import styles from './NowPlaying.module.css';

type Props = {
  station: Station | null;
  isPlaying: boolean;
};

export const NowPlaying = ({ station, isPlaying }: Props) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{station ? station.name : 'Select a Station'}</h2>
      <div className={styles.status}>
        {isPlaying ? (
            <>
                <span>LIVE</span>
                <div className={styles.visualizer}>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                    <div className={styles.bar}></div>
                </div>
            </>
        ) : (
            <span>Ready to play</span>
        )}
      </div>
    </div>
  );
};
