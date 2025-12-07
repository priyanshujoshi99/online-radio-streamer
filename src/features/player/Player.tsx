import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useNavigate } from 'react-router-dom';

import { GlassCard } from '../../shared/components/GlassCard';
import { MainLayout } from '../../shared/components/MainLayout';
import { NeumorphicButton } from '../../shared/components/NeumorphicButton';
import { NowPlaying } from './components/NowPlaying';
import { StationList } from './components/StationList';
import { useRadio } from './hooks/useRadio';
import styles from './Player.module.css';

export const Player = () => {
  const navigate = useNavigate();
  const { 
    stations, 
    currentStation, 
    currentSource, 
    isPlaying, 
    status,
    selectStation,
    handlePlay,
    handlePause,
    handleError,
    setStatus 
  } = useRadio();

  return (
    <MainLayout>
      <div className={styles.playerContainer}>
        <GlassCard className={styles.playerCard}>
          <div className={styles.content}>
            <NowPlaying station={currentStation} isPlaying={isPlaying} />
            
            <AudioPlayer
                className={styles.audioPlayer}
                autoPlay={false}
                src={currentSource}
                onPlay={handlePlay}
                onPause={handlePause}
                onWaiting={() => setStatus("Buffering...")}
                onPlayError={(err) => handleError(err.message)}
                onError={(e) => {
                    const audio = e.target as HTMLAudioElement;
                    const err = audio.error;
                    let msg = "Unknown error";
                    if (err) {
                        switch (err.code) {
                            case 1: msg = "Aborted"; break;
                            case 2: msg = "Network error"; break;
                            case 3: msg = "Decode error"; break;
                            case 4: msg = "Source not supported"; break;
                            default: msg = `Error code ${err.code}`; break;
                        }
                    }
                    handleError(msg);
                }}
                showSkipControls={false}
                showJumpControls={false}
                customAdditionalControls={[]}
                layout="stacked-reverse"
            />
            
            <div style={{ marginTop: '1rem', color: status.startsWith('Error') ? '#ff4d4d' : 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                {status !== 'idle' && status}
            </div>

            <div style={{ width: '100%', marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', opacity: 0.8 }}>Stations</h3>
                <StationList 
                    stations={stations} 
                    currentStation={currentStation} 
                    onSelectStation={selectStation} 
                />
            </div>
            
            <div style={{ marginTop: '2rem', width: '100%' }}>
                <NeumorphicButton 
                    variant="primary" 
                    onClick={() => navigate('/akashvani')}
                    style={{ width: '100%' }}
                >
                    <span>📻</span> Go to Akashvani Live
                </NeumorphicButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
};
