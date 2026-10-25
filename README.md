# UIDrop

An open-source gallery of copy-paste HTML/CSS UI snippets. Browse, preview live, copy the code, or contribute your own with a pull request.

- Every snippet is a single file in `snippets/`.
- Previews run in sandboxed iframes with no JavaScript.
- The site is static, so it deploys free to GitHub Pages.
- No backend, database, or accounts to run.

## Quick start

```bash
git clone https://github.com/your-username/uidrop.git
cd uidrop-gallery
npm install
npm run dev
```

Then open the local URL Vite prints.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Builds the snippet index and starts the dev server |
| `npm run build` | Builds the site into `dist/` |
| `npm run preview` | Serves the built site locally |
| `npm run validate` | Checks every snippet and fails on any problem |

## How it works

`scripts/build-snippets.mjs` reads each file in `snippets/`, parses its header comment (title, author, category), and writes `src/snippets.json`. The app in `src/main.js` imports that file and renders the gallery. Snippets added through the on-page form are saved in the visitor's browser only. **Copy contribution file** produces the exact file format for a pull request.

## Deploy

1. Push the repo to GitHub.
2. In **Settings > Pages**, set the source to **GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml` and publishes the site.

## Contribute

Read [CONTRIBUTING.md](CONTRIBUTING.md). Adding a snippet takes one small file.

## Roadmap

- [ ] Search by tag as well as category
- [ ] Dark-mode preview toggle per snippet
- [ ] React and Tailwind export for each snippet
- [ ] Optional backend (Supabase) for submissions and likes
- [ ] Moderation queue for community submissions

## License

MIT. See [LICENSE](LICENSE).
