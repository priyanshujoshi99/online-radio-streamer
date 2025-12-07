import { useState } from "react";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useNavigate } from "react-router-dom";

type Station = { name: string; url: string };

const primaryName = (import.meta.env.VITE_RADIO_PRIMARY_NAME as string) || "Radio";
const primaryUrl = (import.meta.env.VITE_RADIO_PRIMARY_URL as string) || "";

const additionalJson = (import.meta.env.VITE_RADIO_ADDITIONAL as string) || "[]";

function parseAdditional(): Station[] {
  try {
    const arr = JSON.parse(additionalJson);
    if (Array.isArray(arr)) return arr.map((s: any) => ({ name: s.name || s.url, url: s.url }));
  } catch (e) { /* ignore */ }
  return [];
}

export default function RadioPlayer() {
  const [stations] = useState<Station[]>(() => {
    const base: Station[] = primaryUrl ? [{ name: primaryName, url: primaryUrl }] : [];
    return base.concat(parseAdditional());
  });
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [status, setStatus] = useState<string>("idle");
  const navigate = useNavigate();

  const currentStation = stations[selectedIndex];

  const getSrc = (url: string) => {
    if (!url) return "";
    const proxyEnabled = (import.meta.env.VITE_RADIO_PROXY_ENABLED === "true");
    const proxyBase = (import.meta.env.VITE_RADIO_PROXY_BASE as string) || "";
    
    // Auto-enable proxy if we are on HTTPS and the stream is HTTP to avoid mixed-content error
    const isMixedContent = window.location.protocol === "https:" && url.startsWith("http:");

    if (proxyEnabled || isMixedContent) {
      const base = proxyBase ? proxyBase.replace(/\/$/, "") : "";
      // If we are auto-proxying (isMixedContent) and no base is set, it defaults to current origin relative path
      return `${base}/proxy-stream?target=${encodeURIComponent(url)}`;
    }
    return url;
  };

  const handlePlayError = (err: any) => {
    console.error("Play error:", err);
    setStatus(`Error: ${err.message || "Failed to play stream"}`);
  };

  return (
    <div style={{ padding: 20, maxWidth: 720, margin: "0 auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>{currentStation?.name || "Radio"}</h1>
      {currentStation?.url && <p style={{ fontSize: 14, color: '#999', marginBottom: 10 }}>{currentStation.url}</p>}

      <p aria-live="polite" style={{ fontSize: 18, color: status.startsWith("Error") ? "red" : "#555", marginBottom: 20, minHeight: 27 }}>
        {status !== "idle" && status}
      </p>

      <div style={{ marginBottom: 32 }}>
        <AudioPlayer
          autoPlay={false}
          src={getSrc(currentStation?.url)}
          onPlay={() => setStatus("Playing")}
          onPause={() => setStatus("Paused")}
          onWaiting={() => setStatus("Buffering...")}
          onPlayError={handlePlayError}
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
            setStatus(`Error: ${msg}`);
          }}
          showSkipControls={false}
          showJumpControls={false}
          customAdditionalControls={[]}
          layout="stacked-reverse"
        />
      </div>

      <div style={{ marginTop: 20, textAlign: "left" }}>
        <h2 style={{ fontSize: 24, borderBottom: "1px solid #ddd", paddingBottom: 8 }}>Stations</h2>
        <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
          {stations.map((s, i) => (
            <li key={i} style={{ marginBottom: 12 }}>
              <button
                onClick={() => {
                   setSelectedIndex(i);
                   setStatus("idle");
                }}
                aria-pressed={selectedIndex === i}
                style={{
                  fontSize: 18,
                  padding: "12px 16px",
                  borderRadius: 8,
                  width: "100%",
                  textAlign: "left",
                  background: selectedIndex === i ? "#e9ecef" : "transparent",
                  border: "1px solid #ced4da",
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                {s.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 32, paddingTop: 24, borderTop: "2px solid #eee" }}>
        <ManualUrl onPlay={(url) => {
          const idx = stations.length;
          // Push manual station into state (simple runtime addition)
          (stations as Station[]).push({ name: "Manual URL", url });
          setSelectedIndex(idx);
          setStatus("idle");
        }} />
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <button
          onClick={() => navigate('/akashvani')}
          style={{
            padding: "12px 24px",
            fontSize: 16,
            borderRadius: 8,
            border: "none",
            background: "#007bff",
            color: "white",
            cursor: "pointer",
            width: "100%",
            maxWidth: 300
          }}
        >
          Go to Akashvani Live
        </button>
      </div>

    </div>
  );
}

function ManualUrl({ onPlay }: { onPlay: (u: string) => void }) {
  const [val, setVal] = useState("");
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
      <input
        aria-label="Manual stream URL"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="Paste stream URL (http://...)"
        style={{ fontSize: 16, padding: "12px", width: "100%", maxWidth: 400, borderRadius: 8, border: "1px solid #ccc" }}
      />
      <button onClick={() => onPlay(val)} style={{ padding: "12px 24px", fontSize: 16, borderRadius: 8, border: "none", background: "#28a745", color: "white", cursor: "pointer" }}>Add & Play</button>
    </div>
  );
}
