# Parity report: Angular 19 (baseline) vs Angular 21 (upgraded)

Same Playwright specs run against both apps: `baseline` = `master` (Angular 19.0.0) on http://localhost:4000, `upgraded` = this branch (Angular 21.2) on http://localhost:4200. Both use the same local Express API on http://localhost:9000.

**Result: 30 passed, 0 failed (15 per project), `retries: 0`.**

The API is local and in-memory (not a shared public backend), so retries are off. Tests run serially (`workers: 1`) because both projects share that in-memory store; the edit-course spec restores the course it changes via the API after each test.

## Flows

| Page / flow | Spec | Baseline | Upgraded |
|---|---|---|---|
| Home: toolbar, heading, both category tabs | home.spec.ts | pass | pass |
| Home: Beginners tab lists courses sorted by seqNo, actions enabled | home.spec.ts | pass | pass |
| Home: Advanced tab lists advanced courses | home.spec.ts | pass | pass |
| About page via ABOUT link | navigation.spec.ts | pass | pass |
| COURSES link returns to the catalogue | navigation.spec.ts | pass | pass |
| Unknown route redirects to `/` | navigation.spec.ts | pass | pass |
| VIEW COURSE opens course 12 with first lessons page | course.spec.ts | pass | pass |
| Paginator next/previous and page size 3 -> 5 | course.spec.ts | pass | pass |
| Sort by # descending | course.spec.ts | pass | pass |
| Search filter (`mock` -> 1 row, `zzz` -> 0 rows) | course.spec.ts | pass | pass |
| Course without lessons shows an empty table | course.spec.ts | pass | pass |
| EDIT opens dialog prefilled with the course | edit-course.spec.ts | pass | pass |
| Clearing a required field marks it invalid | edit-course.spec.ts | pass | pass |
| Close dismisses without saving | edit-course.spec.ts | pass | pass |
| Save persists a timestamped title and refreshes the list | edit-course.spec.ts | pass | pass |

## Screenshots (baseline left, upgraded right)

| Page | Pixel diff | Side by side |
|---|---|---|
| home-beginners | 0% | [side-by-side/home-beginners.png](side-by-side/home-beginners.png) |
| home-advanced | 0% | [side-by-side/home-advanced.png](side-by-side/home-advanced.png) |
| about | 0% | [side-by-side/about.png](side-by-side/about.png) |
| course-detail | 0.022% | [side-by-side/course-detail.png](side-by-side/course-detail.png) |
| edit-dialog | 0.017% | [side-by-side/edit-dialog.png](side-by-side/edit-dialog.png) |
| edit-dialog-invalid | 0.017% | [side-by-side/edit-dialog-invalid.png](side-by-side/edit-dialog-invalid.png) |

`course-detail`: the active sort arrow on the `#` column is fully dark in the upgraded app and grey in the baseline. Most likely cause: Angular Material 20+ dropped `@angular/animations` from the sort header, so the arrow now renders its final state immediately instead of animating in. The cause is inferred, not confirmed. The `edit-dialog` diffs are a few pixels inside the dialog's form fields.

Raw numbers: [diff.json](diff.json).

## Reproduce

```bash
# API (port 9000)
npm run server
# baseline (master) on 4000, from a separate worktree
git worktree add ../atc-baseline origin/master && (cd ../atc-baseline && npm ci && npx ng serve --port 4000 --proxy-config ./proxy.json)
# upgraded (this branch) on 4200
npx ng serve --port 4200 --proxy-config ./proxy.json
# suite + side-by-side report
cd parity && npm ci && npx playwright install chromium && npx playwright test && node compose.mjs
```
