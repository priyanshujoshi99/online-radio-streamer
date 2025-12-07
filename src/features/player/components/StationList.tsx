import type { Station } from '../../../data/stations';
import { NeumorphicButton } from '../../../shared/components/NeumorphicButton';
import styles from './StationList.module.css';

type Props = {
  stations: Station[];
  currentStation: Station | null;
  onSelectStation: (station: Station) => void;
};

export const StationList = ({ stations, currentStation, onSelectStation }: Props) => {
  return (
    <div className={styles.list}>
        {stations.map((station) => (
            <NeumorphicButton
                key={station.name}
                className={`${styles.stationItem} ${currentStation?.name === station.name ? styles.active : ''}`}
                onClick={() => onSelectStation(station)}
            >
                <span>🎵</span>
                {station.name}
                {currentStation?.name === station.name && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.8em', opacity: 0.7 }}>Playing</span>
                )}
            </NeumorphicButton>
        ))}
    </div>
  );
};
