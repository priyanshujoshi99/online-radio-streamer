import { NeumorphicButton } from '../../../shared/components/NeumorphicButton';
import styles from './PlayerControls.module.css';

type Props = {
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number;
  onVolumeChange: (value: number) => void;
  isLoading?: boolean;
};

export const PlayerControls = ({ isPlaying, onTogglePlay, volume, onVolumeChange, isLoading }: Props) => {
  return (
    <div className={styles.controls}>
      <div className={styles.mainControls}>
        <NeumorphicButton 
            onClick={onTogglePlay} 
            variant="primary"
            disabled={isLoading}
            style={{ width: 64, height: 64, borderRadius: '50%', padding: 0 }}
        >
           {isLoading ? '...' : (isPlaying ? '⏸' : '▶')}
        </NeumorphicButton>
      </div>
      
      <div className={styles.volumeControl}>
        <span>🔈</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume} 
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className={styles.slider}
        />
        <span>🔊</span>
      </div>
    </div>
  );
};
