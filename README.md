# CFA — Chief Financial Agent conference experience

## What this is

This is a mobile-first, static CFA product demonstration with two research experiences: a seven-question survey for banking executives and a ten-question survey for end consumers. Each question is paired with an interactive product moment. The bank flow generates a deterministic institution thesis; the consumer flow summarizes the respondent's needs and preferred trust model. The household and economics are illustrative.

The application has no backend of its own. Responses stay in `localStorage` during the experience and are sent once to Formspree at completion.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. If no Formspree endpoint is configured, the app runs safely in demo mode, saves locally, and logs the final payload to the browser console.

The two GitHub Pages-safe routes are:

```text
#/banks
#/consumer
```

Hash routing ensures both experiences can be opened or refreshed directly on a GitHub project page without a server-side rewrite rule.

## Configure Formspree

1. Create a form at [Formspree](https://formspree.io/).
2. Copy `.env.example` to `.env.local`.
3. Replace `REPLACE_ME` with the form ID:

```env
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

To send consumer responses to a separate form, add a second optional endpoint. If it is omitted, both surveys use the primary endpoint and are distinguished by `survey_type` in consumer submissions.

```env
VITE_CONSUMER_FORMSPREE_ENDPOINT=https://formspree.io/f/YOUR_CONSUMER_FORM_ID
```

The endpoint is public by design. Do not put private API keys in client-side environment variables.

## Submission payload

Bank submissions contain:

- `schema_version` and `session_id`
- URL metadata, start/completion times, total duration, and per-step durations
- optional institution, role, asset-size, name, and work email fields
- all seven raw answers, including the two-part primary-relationship baseline, and the conditional implementation blocker
- a deterministic generated thesis
- flattened analysis columns: `q4_rank_1`, `q4_rank_2`, `q4_rank_3`, `thesis_primary`, `thesis_operating_model`, and `thesis_strategic_fit`

Raw answers remain the source of truth. The generated thesis is supplemental.

Consumer submissions contain `survey_type: consumer`, a separate session ID, all ten raw answers, optional contact details, URL metadata, and completion/per-step timing. Bank and consumer progress are stored under separate local-storage keys.

## Presenter mode

Add `?presenter=1` to show a discreet presenter control. It displays the current session ID, sync state, demo-mode notice, and a confirmed reset action. Press `R` to open or close it when focus is not inside a form field.

## URL metadata

Optional query parameters are saved with every response:

```text
?conference=ABA2026&presenter=Kash&source=conference
```

Use `presenter=1` only when presenter controls are wanted. A named presenter value is stored as response metadata without enabling those controls.

## Reset

Use **Start another conversation** on the final screen or in presenter tools. Reset requires confirmation, clears the saved device session, and generates a new UUID.

## Deploy to GitHub Pages

1. Push the repository to GitHub with `main` as the deployment branch.
2. In repository settings, open **Pages** and choose **GitHub Actions** as the source.
3. Add `VITE_FORMSPREE_ENDPOINT` as a repository Actions variable if submissions should be enabled in production. Optionally add `VITE_CONSUMER_FORMSPREE_ENDPOINT` to separate the consumer responses.
4. Push to `main`. `.github/workflows/deploy.yml` builds and publishes `dist` automatically.

Vite derives the repository base path during GitHub Actions builds, so project-page assets resolve correctly. The app uses hash routes, avoiding refresh 404s on GitHub Pages.

## Project map

- `src/data/economics.ts` — all financial assumptions and currency formatting
- `src/data/questions.ts` — executive questions, stable machine values, roles, and blockers
- `src/components/ProductDemos.tsx` — the seven interactive CFA product simulations
- `src/components/ConsumerSurvey.tsx` — the ten-step consumer survey state machine
- `src/components/ConsumerProductDemo.tsx` — consumer product moments mapped to each question
- `src/data/consumerQuestions.ts` — consumer question wording and answer options
- `src/logic/consumerPersistence.ts` — isolated consumer session storage
- `src/logic/consumerSubmission.ts` — structured consumer Formspree payload
- `src/logic/thesis.ts` — deterministic CFA thesis and strategic-fit logic
- `src/logic/persistence.ts` — UUID generation, URL metadata, and local session recovery
- `src/logic/submission.ts` — structured and flattened Formspree payloads
- `src/types/survey.ts` — strict session and submission types
- `src/App.tsx` — experience state machine, navigation, completion, and retry behavior

## Quality checks

```bash
npm run build
npm run lint
npm run test
```

The interface supports keyboard focus, visible focus states, touch-friendly controls, responsive mobile/tablet/desktop layouts, back navigation, and reduced-motion preferences.
