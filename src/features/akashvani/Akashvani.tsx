import iframeResizer from 'iframe-resizer/js/iframeResizer';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { GlassCard } from '../../shared/components/GlassCard';
import { MainLayout } from '../../shared/components/MainLayout';
import { NeumorphicButton } from '../../shared/components/NeumorphicButton';
import styles from './Akashvani.module.css';

type Props = {
  url?: string;
}

export const Akashvani = ({ url = import.meta.env.VITE_AKASHVANI_URL }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [resizerActive, setResizerActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!iframeRef.current) return;

    const options = {
      checkOrigin: false,
      warningTimeout: 0,
      log: false,
      resizedCallback: () => {
        setResizerActive(true);
      },
      heightCalculationMethod: 'lowestElement' as const,
    };

    const ifr = iframeRef.current;
    
    // @ts-ignore
    iframeResizer(options, ifr);

    return () => {
      try {
        // @ts-expect-error iframeResizer adds this property
        if (ifr && (ifr).iFrameResizer) {
            // @ts-expect-error iframeResizer adds this property
            (ifr).iFrameResizer.disconnect();
        }
      } catch (e) {
        // ignore
      }
    };
  }, []);

  return (
    <MainLayout>
      <div className={styles.container}>
        <GlassCard className={styles.card}>
            <div style={{ marginBottom: '1.5rem' }}>
                <NeumorphicButton 
                    onClick={() => navigate('/')}
                >
                    <span>←</span> Back to Home
                </NeumorphicButton>
            </div>

            <h2 className={styles.title}>Akashvani Live</h2>
            
            {!resizerActive && (
                <div className={styles.loading}>
                    Loading live stream... If it doesn't appear, <a href={url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>click here</a>.
                </div>
            )}
            
            <iframe
                ref={iframeRef}
                src={url}
                className={styles.iframe}
                style={{
                    minHeight: resizerActive ? 'unset' : '800px', // Fallback height
                }}
                scrolling="no"
                // Security: allow scripts for the player, same-origin for resizing (if applicable, though we use proxy)
                sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
                allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                title="Akashvani Live Stream"
            />
        </GlassCard>
      </div>
    </MainLayout>
  );
};
