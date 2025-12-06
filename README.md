# Online Radio Streamer

A modern, accessible, and responsive online radio player built with React, Vite, and TypeScript. This application features a clean interface, robust audio playback using `react-h5-audio-player`, and PWA support for installation on desktop and mobile devices.

## Features

*   **Live Radio Streaming**: Plays configured radio streams with support for various audio formats.
*   **Station Management**: Easily switch between configured stations.
*   **Manual URL Support**: Add and play custom stream URLs on the fly.
*   **PWA Support**: Installable as a native-like app with offline fallback and custom branding.
*   **Responsive Design**: optimized for both desktop and mobile screens.
*   **Accessibility**: Built with semantic HTML and ARIA labels for better accessibility.

## Configuration

The application is configured using environment variables.

**Note**: The `.env` file is committed to the repository for this project setup. You can modify it directly to change the default stations.

### Environment Variables

*   `VITE_RADIO_PRIMARY_NAME`: Name of the default radio station.
*   `VITE_RADIO_PRIMARY_URL`: Stream URL for the default station.
*   `VITE_RADIO_ADDITIONAL`: A JSON string array of additional stations.
*   `VITE_RADIO_PROXY_ENABLED`: (Optional) Set to `true` to enable proxying (requires backend proxy).
*   `VITE_RADIO_PROXY_BASE`: (Optional) Base URL for the proxy server.

**Example `.env` content:**

```bash
VITE_RADIO_PRIMARY_NAME="Radio Sri Lanka"
VITE_RADIO_PRIMARY_URL="http://220.247.227.20:8000/RSLstream"
VITE_RADIO_ADDITIONAL='[{"name":"Example FM","url":"http://1.2.3.4:8000/stream.mp3"}]'
```

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Build for production**:
    ```bash
    npm run build
    ```

4.  **Preview production build**:
    ```bash
    npm run preview
    ```

## PWA

This application is configured as a Progressive Web App (PWA).
- **Icons**: Radio logo assets are in the `public` directory.
- **Manifest**: Generated automatically by `vite-plugin-pwa`.
- **Offline**: Service worker caches critical assets for offline shell support.

## Technologies

-   [React](https://react.dev/)
-   [Vite](https://vitejs.dev/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [react-h5-audio-player](https://github.com/lhz516/react-h5-audio-player)
- [react-h5-audio-player](https://github.com/lhz516/react-h5-audio-player)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/)

## Deployment (Netlify)

This project includes a `netlify.toml` configuration file for easy deployment. It also includes an Edge Function to proxy HTTP streams over HTTPS to avoid mixed-content errors.

### Enabling the Proxy (Required for HTTPS sites)
If your deployed site is HTTPS (which Netlify is by default), playing an HTTP radio stream will fail. To fix this:

1.  In Netlify, go to **Site settings > Environment variables**.
2.  Add `VITE_RADIO_PROXY_ENABLED` with value `true`.
3.  (Optional) `VITE_RADIO_PROXY_BASE` can be left empty to use the deployed site's own proxy function.

### Deployment Options

### Option 1: Drag and Drop
1.  Run `npm run build` locally.
2.  Drag the `dist` folder to the Netlify Drop area.
**Note**: Drag and drop might not deploy Edge Functions correctly. **Git Integration is generally required for Edge Functions.**

### Option 2: Git Integration (Recommended)
1.  Push your code to GitHub/GitLab/Bitbucket.
2.  Log in to Netlify and "Import from Git".
3.  Netlify will detect the settings from `netlify.toml`:
    -   **Build Command**: `npm run build`
    -   **Publish Directory**: `dist`
4.  **Important**: In "Site settings" > "Environment variables", add the variables from your `.env` file (e.g., `VITE_RADIO_PRIMARY_NAME`, `VITE_RADIO_PRIMARY_URL`, etc.).
