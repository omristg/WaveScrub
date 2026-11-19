# WaveScrub

WaveScrub is a browser-based audio waveform player with precision scrubbing and optional AI transcription. Click a transcribed word to jump to its position in the audio.

## Features

- Load audio by choosing a file or dragging and dropping it.
- Zoom into the waveform, adjust playback speed, and scrub in 100 ms or 10 ms increments.
- Transcribe audio with a Groq, xAI, or OpenAI API key, with automatic or selected language detection.
- Follow and edit synchronized transcript text. Word-level navigation depends on the timestamps returned by the provider.
- Save, rename, and reopen audio and transcripts in your browser's library.
- Switch between light and dark themes.

Audio format support depends on your browser. The file picker accepts MP3, WAV, M4A, OGG, FLAC, AAC, and WebM, among other audio files.

## Getting started

No build step or package installation is required. To run locally, serve this folder over HTTP, for example:

```sh
python -m http.server 8000
```

Open `http://localhost:8000` in your browser. The app loads Tailwind CSS and WaveSurfer.js from CDNs, so an internet connection is needed to load those dependencies.

1. Choose or drop an audio file to display its waveform.
2. Use the playback controls, zoom slider, or keyboard shortcuts to navigate.
3. To transcribe, open **API Key**, enter a supported provider key, choose a language if needed, and select **Transcribe Audio**.
4. Click a word to jump to its timestamp, or select **Edit Text** to correct the transcript.
5. Select **Save** to keep the audio and transcript in the browser library. Successful transcriptions are also saved automatically.

### Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| Space | Play or pause |
| Left / Right arrow | Scrub backward / forward 100 ms |
| Shift + Left / Right arrow | Scrub backward / forward 10 ms |
| Mouse wheel over waveform | Zoom in or out |

## Deploy to GitHub Pages

1. Create a GitHub repository and push `index.html` and this README to its default branch.
2. In the repository, open **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the branch containing `index.html` and the **/(root)** folder, then save.
5. Once deployment finishes, open the URL shown in the Pages settings. A project site typically uses `https://<username>.github.io/<repository>/`.

No server or build configuration is needed. GitHub Pages serves the static app; transcription requests go directly from the browser to the selected API provider.

## Privacy and API keys

- Audio playback is local to your browser. When you request transcription, the audio and API key are sent to the selected provider. Provider charges, file limits, browser access restrictions, and data policies may apply.
- API keys are stored in browser local storage. Do not commit keys to the repository or use keys you cannot safely expose to browser-side code. Use **Clear** in the API key panel to remove a saved key.
- Saved audio and transcripts are stored in the browser's IndexedDB, not in GitHub. They are specific to that browser and site and may be lost if site data is cleared.
