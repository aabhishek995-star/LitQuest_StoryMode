# LitQuest Story Mode – The Whale Rider (Prototype)

## What's included
- Story Mode hub linked from New Zealand Literature on the home screen.
- A 21-chapter map. Chapter 1 is playable; chapters 2–21 are intentionally marked as upcoming until their source-grounded scene scripts and learning checkpoints are authored.
- Chapter 1 playable narrative based on the uploaded novel's opening chapter (printed pages 1–7): opening landscape and the ancestral whale-rider episode.
- Optional exploration choices that reveal explanations but do not change canonical plot events.
- Learning pause with summary, figures, themes, and literary craft tabs.
- Three original knowledge-check questions with explanations and retry.
- Local progress storage.
- Original generated landscape artwork and a second underwater visual.
- Offline synthetic ambience and stylised whale-call sound design, with independent ambience/effects volume controls.

## Source fidelity
The uploaded novel is the authority for narrative sequence. Chapter 1 text is paraphrased, not reproduced. The prototype does not reproduce the novel's copyrighted prose. The 50–51 scan supplied separately is not used as Chapter 1 material; it belongs later in the novel and will be mapped to its correct chapter in a later content pass.

The Bookey guide was treated only as a secondary study aid and is not used to override the novel. Chapter 2–21 content is not falsely represented as finished: those chapters remain visibly upcoming.

## Audio note
All included sound effects are original synthetic sound design created for this prototype. The whale-call is whale-inspired, not an authentic animal recording. See `assets/whale-rider/AUDIO_CREDITS.md`.

## Run locally
Open `index.html` in a modern browser for basic testing. For PWA/offline service-worker testing, serve the folder through a local HTTP server. For Android, run:

```bash
npm install
npm run build
npx cap add android   # only if the android folder does not already exist
npx cap sync android
npx cap open android
```

The existing GitHub Actions workflow can also build the APK after the updated project is pushed to the repository.
