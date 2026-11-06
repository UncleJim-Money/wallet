# Uncle Jim — customisation notes for this fork

Fork of [`shocknet/wallet2`](https://github.com/shocknet/wallet2) (AGPL-3.0).
This file is ours; everything else starts as upstream. Keep it that way — the
fewer upstream files we edit, the cheaper the weekly merge from `upstream/main`.

Branch model: `main` mirrors upstream, `uncle-jim` holds everything below.
Use `../scripts/sync-upstream.sh app https://github.com/shocknet/wallet2.git`.

## What this branch changes

### 1. Theme (zero-conflict, additive)
`src/theme/uncle-jim.css` is a **new file**, imported in `src/App.tsx` after
`./theme/variables.css`. It overrides 96 Ionic tokens for light and dark.
`src/theme/variables.css` is left **untouched on purpose** — upstream owns it.

### 2. Colour sweep (21 files, will conflict on merge)
Hardcoded SHOCK blues replaced. These files are the ones to re-check after every
upstream merge:

| Was | Now | Role |
|---|---|---|
| `#29abe2` (+shade `#2496c7`, tint `#3eb3e5`) | `#F4706C` / `#D6625F` / `#FF8B88` | primary sky blue |
| `#0F4C81` (+`#0d4372`, `#275e8e`) | `#0D0D1A` / `#080810` / `#22222F` | secondary navy |
| `#7b3fe4` (+`#6c37c9`, `#8852e7`) | `#F5BB45` / `#C8862A` / `#F7C667` | tertiary purple |
| rgb triplets `41,171,226` / `15,76,129` / `123,63,228` | `244,112,108` / `13,13,26` / `245,187,69` | alpha composites |

Files touched: `index.html`, `vite.config.ts`, `capacitor.config.ts`,
`src/Assets/SvgIconLibrary.tsx`,
`src/styles/_buttons.module.scss`, `src/Containers/Header/Header.scss`,
`src/Components/Buttons/GradientButton`, `src/Components/Modals/{Modal,MenuList,EditSourceModal}`,
`src/Pages/{Contacts,Send,Prefs,Offers,Automation,Invitations,LinkedApp,Metrics}`.

### 3. Brand artwork (additive — new files only)

Upstream's brand is **rasterised**, so no text search finds it. The visible
SHOCKWALLET wordmark and the blue bolt live in PNG/JPG files:

| Upstream asset | Where it shows | Replaced by |
|---|---|---|
| `src/Assets/Images/isolated logo.png` | `Icons.Logo()`, HomeHeader, Metrics header, CreateIdentity hero, source avatars | `src/Assets/Images/uj-mark.png` |
| `src/Assets/Images/wallet_new_text.png` | Header lockup, CreateIdentity hero | `src/Assets/Images/uj-text.png` |
| `src/Assets/Images/bootstrap_source.jpg` | Lightning.Pub source avatar | `src/Assets/Images/uj-mark.png` |
| `public/pub_logo.png` | `pub_header` wordmark | `public/uj-wordmark.png` |
| `public/pwa-*.png`, `apple-touch-icon.png`, `favicon.*` | install/PWA/favicon | `public/uj-*.png` |

The originals are left in the tree, unreferenced, so upstream merges stay clean.
Regenerate everything with `../scripts/make-app-assets.sh` (needs ImageMagick +
Chrome; Chrome is used because ImageMagick's internal MSVG drops stroke geometry).

`public/.well-known/` is **deleted**. It declared SHOCK's iOS app ID and Android
package + signing fingerprints as handlers for links on our origin — serving it
would let the real Shockwallet app claim deep links from `app.unclejim.money`.

### 4. Identity
- `capacitor.config.ts` → appId `money.unclejim.app`, appName `Uncle Jim`,
  deep-link scheme `unclejim://`, splash/status/edge background `#0D0D1A`
- `index.html` → title, description, `apple-mobile-web-app-title`, favicon set
- `vite.config.ts` → PWA manifest `name`/`short_name` = "Uncle Jim", icons → `uj-*`
- `package.json` → name `uncle-jim-app`

## Still to do before this is shippable

1. **Screen-by-screen visual QA.** The brand rasters are swapped and the three
   user-visible "Shockwallet" strings (clipboard permission alert, debug report
   title + filename) are reworded, but only `/identity/create` has actually been
   looked at. The rest needs a funded source attached.

   Deliberately **not** changed: `__shockwallet_lai_`, `_shockwallet`,
   `doc/shockwallet/identity_`, `shockwallet:prefs` and friends. They are storage
   keys and Nostr `d`-tags — renaming them silently orphans every existing user's
   local data and produces no visible brand benefit.
   `src/Components/NavigationMenu/index.tsx:104` still says "Shockwallet" but sits
   inside a commented-out block.
2. **External service dependencies** — decide each, do not blindly rewrite:

   | Reference | What it does | Your call |
   |---|---|---|
   | `rates.shockwallet.app/v2/prices/` | BTC price feed for display | keep as a dependency, or run your own rates endpoint |
   | ~~`docs.shock.network`~~ | help + legal links | **done** — now `unclejim.money/terms`, `/privacy`, `/support` via `src/constants.ts` |
   | `shockwallet.app`, `my.shockwallet.app` | canonical/share URLs | → `app.unclejim.money` |
   | `cdn.shockwallet.app/card2.png` | one image asset | self-host or replace |
   | `test-auth.shock.network` / `VITE_SANCTUM_URL` | Sanctum remote signer | only if you adopt remote signing; otherwise leave default |

3. **`.env` for the web build** — set these or the app will point at SHOCK's infra:
   `VITE_NOSTR_RELAYS`, `VITE_NOSTR_PUB_DESTINATION`, `VITE_DEFAULT_BRIDGE_URL`,
   `VITE_SANCTUM_URL`, `VITE_FIREBASE_CONFIG` + `VITE_FIREBASE_VAPID_KEY`
   (push notifications need **your own** Firebase project — free tier is enough),
   `VITE_KEYLINK_APP_ID`.
4. **AGPL compliance** — the running service must offer users the complete source of
   this modified version, notices intact, plus a prominent "modified" notice.
   A "Source" link in Settings pointing at the public repo satisfies §13.

## Build

```
npm ci
npm run build:web        # ionic build --prod → dist/
npx serve dist           # local check; needs SPA fallback for deep links
```

Deploy `dist/` to Cloudflare Pages or GitHub Pages as `app.unclejim.money`.
SPA fallback required: unknown paths → `/index.html`.
