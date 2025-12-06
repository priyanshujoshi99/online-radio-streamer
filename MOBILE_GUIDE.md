# Mobile App Guide (Capacitor)

This project has been configured with Capacitor to generate a native Android application.

## Prerequisites

1.  **Node.js & npm**: Already installed.
2.  **Android Studio**: Required to compile the final APK and run the emulator.
    *   Download from: [developer.android.com/studio](https://developer.android.com/studio)
    *   Ensure "Android SDK Command-line Tools" is installed via the SDK Manager.

## Quick Start

We have added helper scripts to `package.json`:

1.  **Sync Changes**:
    Whenever you make changes to your React code (src/), you need to rebuild the web assets and sync them to the native project:
    ```bash
    npm run mobile:sync
    ```
    This runs `npm run build` and `npx cap sync`.

2.  **Open in Android Studio**:
    To build the APK or run on a connected device/emulator:
    ```bash
    npm run mobile:open
    ```
    This will launch Android Studio with the `android/` project open.

## Building the APK (in Android Studio)

1.  Wait for Gradle sync to finish (bottom bar).
2.  Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3.  Once finished, a notification will appear. Click "locate" to find the `.apk` file.
    *   Usually found in `android/app/build/outputs/apk/debug/app-debug.apk`.
4.  Copy this file to your phone and install it!

## Development Tips

*   **Live Reload**: For faster development without rebuilding every time, you can configure Capacitor to load from the dev server URL.
    *   Edit `capacitor.config.ts`:
        ```typescript
        server: {
          url: 'http://YOUR_LOCAL_IP:5173',
          cleartext: true
        }
        ```
    *   (Remember to remove this before building the production APK!)

## Asset Generation (Icons & Splash)

To generate app icons and splash screens:
1.  Place your source icon (1024x1024) at `resources/icon.png`.
2.  Place splash screen (2732x2732) at `resources/splash.png`.
3.  Run: `npx capacitor-assets generate` (requires installing `@capacitor/assets` first).
