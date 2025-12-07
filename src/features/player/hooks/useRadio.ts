import { useMemo, useState } from 'react';
import type { Station } from '../../../data/stations';
import { stations as defaultStations } from '../../../data/stations';

export const useRadio = () => {
  const [stations] = useState<Station[]>(defaultStations);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [status, setStatus] = useState<string>('idle');
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStation = useMemo(() => stations[currentIndex], [stations, currentIndex]);

  const getProxyUrl = (url: string) => {
    if (!url) return '';
    const proxyEnabled = (import.meta.env.VITE_RADIO_PROXY_ENABLED === 'true');
    const proxyBase = (import.meta.env.VITE_RADIO_PROXY_BASE as string) || '';
    
    // Auto-enable proxy if mixed content
    const isMixedContent = window.location.protocol === 'https:' && url.startsWith('http:');

    if (proxyEnabled || isMixedContent) {
      const base = proxyBase ? proxyBase.replace(/\/$/, '') : '';
      return `${base}/proxy-stream?target=${encodeURIComponent(url)}`;
    }
    return url;
  };

  const currentSource = useMemo(() => getProxyUrl(currentStation?.source), [currentStation]);

  const selectStation = (station: Station) => {
    const index = stations.findIndex(s => s.name === station.name);
    if (index !== -1) {
      setCurrentIndex(index);
      setStatus('idle');
      setIsPlaying(false); // Player will auto-play if configured, but state needs reset
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setStatus('Playing');
  };

  const handlePause = () => {
    setIsPlaying(false);
    setStatus('Paused');
  };

  const handleError = (msg: string) => {
    console.error('Radio Error:', msg);
    setStatus(`Error: ${msg}`);
    setIsPlaying(false);
  };

  return {
    stations,
    currentStation,
    currentIndex,
    currentSource,
    status,
    isPlaying,
    selectStation,
    handlePlay,
    handlePause,
    handleError,
    setStatus, // Exposed for granular updates if needed
  };
};
