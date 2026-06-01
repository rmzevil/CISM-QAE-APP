# CISM QAE → Android App

Your study tool is a self-contained web app. Here are three ways to get it onto Android,
from easiest to most "native." All of them keep every feature working (offline study,
localStorage progress, jsonbin sync, Anthropic examples, timer, search).

This folder (`android-app/`) already contains everything the PWA routes need:

```
index.html                  ← the app, with PWA tags + service worker registration
manifest.webmanifest        ← app name, icons, theme color, standalone display
sw.js                       ← service worker (offline caching)
icon-192.png / icon-512.png ← launcher icons (CISM logo)
icon-maskable-512.png       ← adaptive/maskable icon for Android
apple-touch-icon.png        ← iOS home-screen icon (bonus)
favicon-32.png
```

---

## Route 1 — Installable PWA (no build tools, ~10 minutes) ✅ recommended first

A Progressive Web App installs to the Android home screen with its own icon, runs
full-screen (no browser chrome), and works offline. It is not on the Play Store, but it
behaves like an app. **Requires hosting over HTTPS** (a service worker won't run from a
local file).

**Steps:**
1. Create a free GitHub repository and upload the entire contents of this `android-app/`
   folder (keep the file names exactly as-is).
2. Repo → **Settings → Pages** → Source: `main` branch, root folder → Save.
3. After ~1 minute you get a URL like `https://<you>.github.io/<repo>/`.
4. Open that URL in **Chrome on Android** → menu (⋮) → **Add to Home screen / Install app**.
5. Done — it now launches like an app, full-screen, offline-capable.

> Any static HTTPS host works (Netlify, Cloudflare Pages, Vercel, Firebase Hosting).
> Netlify/Cloudflare: just drag-and-drop the folder.

---

## Route 2 — Real `.apk` via PWABuilder (free, ~20 minutes, Play-Store-ready)

Once Route 1 is hosted, turn it into a signed Android package without writing code.

1. Go to **https://www.pwabuilder.com**.
2. Paste your hosted URL (from Route 1) → **Start**.
3. It validates the manifest + service worker (both are already included here).
4. Click **Package for stores → Android** → choose **Signed APK / AAB**.
5. Download the generated package. Install the `.apk` directly on a device (enable
   "install unknown apps"), or upload the `.aab` to the Google Play Console to publish.

PWABuilder generates and manages the signing key for you, or lets you supply your own.

---

## Route 3 — Native wrapper with Capacitor (fully offline APK, no hosting needed)

If you want a real APK that bundles the HTML locally (no server at all), wrap it with
[Capacitor](https://capacitorjs.com). You need **Node.js**, **Android Studio**, and the
**Android SDK** installed on your machine.

```bash
# 1. New project
mkdir cism-qae-android && cd cism-qae-android
npm init -y
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Put the web assets in ./www
mkdir www
cp /path/to/android-app/index.html            www/index.html
cp /path/to/android-app/manifest.webmanifest  www/
cp /path/to/android-app/sw.js                  www/
cp /path/to/android-app/icon-*.png            www/
cp /path/to/android-app/favicon-32.png        www/
cp /path/to/android-app/apple-touch-icon.png  www/

# 3. Initialise Capacitor (appId must be reverse-domain, e.g. com.yourname.cismqae)
npx cap init "CISM QAE" com.yourname.cismqae --web-dir=www

# 4. Add Android + open in Android Studio
npx cap add android
npx cap copy
npx cap open android
```

In Android Studio: **Build → Build Bundle(s)/APK(s) → Build APK(s)**. The output
`app-debug.apk` installs directly; for Play Store, create a signed release build
(**Build → Generate Signed Bundle/APK**).

App icon: replace the files under `android/app/src/main/res/mipmap-*` with the provided
icons, or use Android Studio's **Image Asset** tool and point it at `icon-512.png`.

Note: with Capacitor the app is fully offline by default, so the service worker isn't
required — but leaving it in is harmless.

---

## Which should you pick?

| Goal | Route |
|---|---|
| Fastest app-like experience on your own phone | **1 (PWA)** |
| A real installable `.apk` to share, minimal effort | **2 (PWABuilder)** |
| Publish on Google Play | **2** (upload the `.aab`) or **3** (signed release) |
| 100% offline APK with no hosting at all | **3 (Capacitor)** |

For your use case — a personal CISM trainer — **Route 1 then Route 2** is the path of
least resistance: host once, install as a PWA today, generate a shareable APK whenever
you want one.

---

## Notes

- **Progress & sync:** localStorage persists inside the PWA/WebView, and jsonbin cloud
  sync works in all routes, so your progress carries across devices if you configure it.
- **Anthropic "Real World Example":** works in all routes (standard HTTPS fetch).
- **Updating the app:** replace `index.html` and bump the `CACHE` version string in
  `sw.js` (e.g. `cism-qae-v2`) so installed PWAs pick up the new build. For Capacitor,
  re-run `npx cap copy` and rebuild.
