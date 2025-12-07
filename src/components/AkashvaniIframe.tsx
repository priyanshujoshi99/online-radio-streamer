import iframeResizer from 'iframe-resizer/js/iframeResizer';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  url?: string;
}

export default function AkashvaniIframe({ url = import.meta.env.VITE_AKASHVANI_URL }: Props) {
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
    <div style={{ width: '100%', maxWidth: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button 
        onClick={() => navigate('/')}
        style={{
          alignSelf: 'flex-start',
          marginBottom: '1rem',
          padding: '8px 16px',
          backgroundColor: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        ← Back to Home
      </button>
      
      {!resizerActive && (
        <div style={{ padding: 10, textAlign: 'center', background: '#f5f5f5', marginBottom: 10, width: '100%' }}>
          Loading live stream... If it doesn't appear, <a href={url} target="_blank" rel="noreferrer">click here</a>.
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={url}
        style={{
            width: '1px',
            minWidth: '100%',
            border: 'none',
            minHeight: resizerActive ? 'unset' : '800px', // Fallback height
        }}
        scrolling="no"
        // Security: allow scripts for the player, same-origin for resizing (if applicable, though we use proxy)
        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        title="Akashvani Live Stream"
      />
    </div>
  );
}
