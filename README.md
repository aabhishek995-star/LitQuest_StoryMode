# LitQuest

LitQuest is an offline-first literature revision app packaged for Android with Capacitor.

## Modules

- British Literature — existing syllabus and MCQ practice.
- Indian Literature in English — existing syllabus and MCQ practice.
- New Zealand Literature — five units, 15 prescribed texts and 315 original MCQs (20 per text, 25 for *The Whale Rider*, *Politics and Maori Literature* and *The End of the Golden Weather*).

## New Zealand Literature hub

The New Zealand module has separate entry points for:

1. Explore the syllabus.
2. MCQ question bank (all 315 questions).
3. Unit-wise practice.
4. Text-wise practice.
5. Story Mode — *The Whale Rider*.
6. Performance centre and personal leaderboard.

A mixed 100-question mock is also available. Question sets are study practice, not official past papers or exam predictions.

## Story Mode

*The Whale Rider* includes all 21 numbered chapter learning entries, with the final section heading “The Girl from the Sea” placed before Chapters Twenty and Twenty-one. The experience is linear and preserves the novel's plot sequence. Each chapter contains a paraphrased account, characters, themes, literary craft and exam focus. The learner cannot choose an alternate plot outcome.

## Run locally

```bash
npm install
npm run build
```

The build copies the web app into `www/`. To create or sync Android:

```bash
npx cap add android
npx cap sync android
```

## GitHub Actions

The workflow at `.github/workflows/android-apk.yml` builds a debug APK on pushes to `main` and uploads it as `LitQuest-Android-APK`.

## Notes

- Progress and leaderboard are local to each device.
- No account system, server or AI API is required.
- The New Zealand question bank has 20 original practice MCQs per text, with 25 for The Whale Rider, Politics and Maori Literature, and The End of the Golden Weather.
- Study notes should be checked against the student's prescribed edition and lecturer's course notes, especially for detailed line-level readings.
