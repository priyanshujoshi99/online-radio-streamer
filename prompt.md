# Embed Akashvani live page in app using `iframe-resizer`

**Goal**
Embed `https://akashvani.gov.in/radio/live.php` in our existing React + Vite + TypeScript app using the `iframe-resizer` library so the iframe height auto-adjusts to content and provides a polished experience for users (large controls, accessible). The integration must prefer the official iframe-resizer approach (parent + child scripts), but include fallback implementations if we cannot modify the target site.

---

## Important technical constraint (read first)

`iframe-resizer` works best when **both** sides cooperate: the parent uses `iframeResizer()` and the framed page includes `iframeResizer.contentWindow.min.js`. If we **cannot** add the contentWindow script to `akashvani.gov.in`, automatic sizing will be inaccurate or impossible. This prompt provides three approaches:

1. **Preferred (recommended)** — Ask Akashvani to add `iframeResizer.contentWindow.min.js` to `/radio/live.php`. Minimal change on their side; best UX.
2. **Fallback A — Proxy wrapper** — Serve a same-origin wrapper page on our domain that loads the remote page into a nested iframe and injects the contentWindow script (requires a server proxy to fetch the remote HTML and inject script; be aware of legal/CSP implications).
3. **Fallback B — Non-cooperative, best-effort** — Use parent-only resizing strategies (polling height, fixed/responsive height, CSS) without child script. Simpler but less reliable.

State in the ticket which approach you want. I recommend **Preferred** when possible; otherwise **Proxy wrapper** as a pragmatic engineering fallback.

---

## Tasks (high level)

* Add dependency: `iframe-resizer` (and optionally `iframe-resizer-react`).
* Implement a new React component `AkashvaniIframe` that:

  * Loads the remote URL in an iframe.
  * Uses `iframe-resizer` to resize height automatically (parent side).
  * Falls back gracefully to a fixed/responsive height if automatic resizing fails.
  * Exposes props: `src`, `title`, `sandbox`, `allow` and `className`.
* If using Proxy wrapper: implement a server endpoint `/proxy/wrap-akashvani` that fetches the remote HTML, injects `iframeResizer.contentWindow.min.js`, and serves that wrapper page. (Document legal/CSP concerns).
* Accessibility: title attribute, focusable controls, large fonts for older users, keyboard-friendly.
* Security: sandbox attributes, no unnecessary `allow` flags; document reason for relaxing `sandbox` if needed (e.g., audio autoplay).
* Tests & acceptance criteria (playback + resizing).

---

## Implementation details — Parent (React) — Preferred approach

**Install**

```bash
# parent (frontend)
npm install iframe-resizer iframe-resizer-react
# or
yarn add iframe-resizer iframe-resizer-react
```

**Component: `src/components/AkashvaniIframe.tsx`**

```tsx
// src/components/AkashvaniIframe.tsx
import React, { useEffect, useRef, useState } from 'react';
import { iframeResizer } from 'iframe-resizer/js/iframeResizer'; // parent-side API
// Optionally, if using wrapper component:
// import IframeResizer from 'iframe-resizer-react';

type Props = {
  src?: string;
  title?: string;
  className?: string;
  // allow autoplay if audio needs to start (be careful with autoplay policy)
  allow?: string;
  sandbox?: string;
  fallbackHeight?: number;
};

export default function AkashvaniIframe({
  src = 'https://akashvani.gov.in/radio/live.php',
  title = 'Akashvani Live Radio',
  className,
  allow = 'autoplay; fullscreen',
  sandbox = 'allow-scripts allow-same-origin',
  fallbackHeight = 700,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [resizerActive, setResizerActive] = useState<boolean | null>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    // Parent-side init: requires contentWindow script on the child page.
    // Options: log, auto-resize, checkOrigin false if cross-domain? use caution.
    const options = {
      checkOrigin: false, // set true and add origins in production if child is trusted
      log: false,
      resizedCallback: (data: any) => {
        setResizerActive(true);
      },
      heightCalculationMethod: 'bodyOffset', // try different methods if needed
    };

    const ifr = iframeRef.current;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (iframeResizer as any)(options, ifr);

    // Clean up on unmount
    return () => {
      try {
        // remove the resizer instance
        // @ts-expect-error iframeResizer removes via iFrameResize
        if (ifr && (ifr as any).iFrameResizer) {
          (ifr as any).iFrameResizer.removeListeners();
        }
      } catch (e) {
        // ignore
      }
    };
  }, [iframeRef.current]);

  // show fallback height when resizer hasn't activated after N seconds
  useEffect(() => {
    const t = setTimeout(() => {
      if (resizerActive === null) setResizerActive(false);
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={className} aria-live="polite">
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        style={{
          width: '100%',
          height: resizerActive ? undefined : fallbackHeight,
          border: 0,
          minHeight: fallbackHeight,
        }}
        // sandbox: prefer to restrict; allow-same-origin is needed if contentWindow script reads same-origin
        sandbox={sandbox}
        allow={allow}
      />
      {!resizerActive && (
        <div style={{ marginTop: 12, color: '#666', fontSize: 14 }}>
          Note: automatic resizing is not active. If content appears clipped, please use the "Open in new tab" button.
        </div>
      )}
      <div style={{ marginTop: 10 }}>
        <a href={src} target="_blank" rel="noopener noreferrer" style={{ fontSize: 16 }}>
          Open Akashvani live in a new tab
        </a>
      </div>
    </div>
  );
}
```

**Notes**

* `checkOrigin: false` simplifies cross-origin use for development. In production, prefer listing allowed origin(s) and set `checkOrigin: true`.
* `heightCalculationMethod` can be tuned: `bodyScroll`, `documentElementScroll`, `max`, `taggedElement`, etc.
* This parent code expects the child page to include the `iframeResizer.contentWindow.min.js` script.

---

## Child-side (preferred) — Add to `https://akashvani.gov.in/radio/live.php`

**One-line** (ask site owner to add in `<head>` or just before `</body>`):

```html
<script src="https://cdn.jsdelivr.net/npm/iframe-resizer/js/iframeResizer.contentWindow.min.js"></script>
```

This enables the child page to post its height/size to the parent so the parent can auto-adjust. Minimal footprint and the officially recommended way.

---

## Fallback A — Proxy wrapper (inject child script server-side)

If Akashvani cannot add the script, implement a server endpoint that fetches the remote HTML and injects the `contentWindow` script before serving. **Caveats**: must confirm legal & CSP compliance and be careful with dynamic content, cookies, and HTTPS.

**Example Express serverless wrapper (conceptual)**

```ts
// server/routes/wrapAkashvani.ts (Node/Express)
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.get('/wrap-akashvani', async (req, res) => {
  const target = 'https://akashvani.gov.in/radio/live.php';
  const r = await fetch(target, { headers: { 'User-Agent': 'our-app/1.0' }});
  let html = await r.text();

  // inject script before closing </body>
  const inject = '<script src="https://cdn.jsdelivr.net/npm/iframe-resizer/js/iframeResizer.contentWindow.min.js"></script>';
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${inject}</body>`);
  } else {
    html += inject;
  }

  // set same-origin so the iframeParent has same domain as wrapper
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
});

export default router;
```

Then point the `AkashvaniIframe` src to `/wrap-akashvani`. This yields a same-origin iframe for better control but may be fragile and may violate remote site's terms — **document and confirm permission**.

---

## Fallback B — No cooperation: best-effort resizing + UX fallback

If you cannot add script nor proxy, do:

* Use a reasonably large `fallbackHeight` (e.g., 700–1000px).
* Implement a polling logic to attempt to measure the iframe's scrollHeight via `postMessage` cannot be used, so polling is limited — but you can detect `load` event and gradually increase height or provide a "Fit height" button that opens content in new tab.
* Provide a clear CTA: `Open in new tab` so users can access full page.

This is the least ideal, but acceptable when edit/proxy options are impossible.

---

## Accessibility & UX (older users focus)

* Provide a visible, large `title` and `Open in new tab` link next to iframe.
* Ensure controls and links are large (≥18–20px), high contrast.
* Add `aria-live` status messages for loading/error states.
* If audio autoplay is desired, request `allow="autoplay"` and instruct users to press Play if browser blocks autoplay.

---

## Security & privacy

* Use `sandbox` attribute to limit iframe if the child is untrusted. Typical value: `sandbox="allow-scripts allow-same-origin"` (but `allow-same-origin` reduces sandboxing; include only if required).
* Use `rel="noopener noreferrer"` on external links.
* If you proxy remote HTML, be careful to sanitize or avoid executing remote inline scripts you don't control. The wrapper approach injects contentWindow script — minimize other modifications.
* Document data retention and logging for the proxy server (if implemented).

---

## Acceptance criteria

1. Parent component `AkashvaniIframe` exists and is used at the designated route/page.
2. When child includes `iframeResizer.contentWindow.min.js`, the iframe height auto-adjusts to the child content (no scrollbars).
3. If child script is absent, a fallback height is applied and the UI shows a prominent `Open in new tab` link.
4. Accessibility: iframe has `title`, status messages aria-live, and large controls for target demographics.
5. Security: sandbox and `allow` attributes are documented and validated; any proxy wrapper implemented has documented legal sign-off.
6. Unit tests: component renders correctly, toggles state when resizer is active, shows fallback when resizer fails (simulate by not loading contentWindow script).

---

## Dev & QA notes to include in the ticket

* **Ask Akashvani**: Add `iframeResizer.contentWindow.min.js` to `https://akashvani.gov.in/radio/live.php`. Provide the exact script tag (CDN URL).
* If no cooperation, request approval to implement Proxy wrapper (legal + ops).
* Test on desktop & mobile browsers (Chrome, Safari iOS — check autoplay behavior).
* Verify CSP (Content-Security-Policy) headers on `akashvani.gov.in` — if CSP blocks embedding, you’ll need their cooperation.
* Document decisions about `sandbox` flags and `allow` values (e.g., `allow="autoplay; microphone; fullscreen"` only if strictly required).
