# Ricky Sullivan Himself

This is a static Astro blog based on the Monograph theme. It has no database, Ghost runtime,
newsletter, contact form, or member system.

## Local commands

```sh
npm ci
npm test
npm run check
npm run build
npm run verify:build
npm run dev
```

`npm run verify:build` checks the generated reading routes, RSS, sitemap, robots file, legacy
redirects, and confirms that the recovered Ghost draft is not on the home page.

## Recovered content

Three recovered posts are published from `src/content/posts/`. The recovered draft is deliberately
excluded. Images live in `public/media/images/`; documents live in `public/media/documents/`.
The raw Ghost export is not part of this repository.

`npm run migrate:ghost -- --source /path/to/ghost-recovery` is a one-time local migration helper.
It replaces `src/content/posts/`, so only run it against a known recovery folder.

## Pages CMS

The root `.pages.yml` describes the GitHub-backed editorial interface for
[Pages CMS](https://app.pagescms.org). It manages posts, site settings, images, and documents
directly in this repository. Connecting the GitHub App is an external setup step and is not
performed by the codebase itself.

## Cloudflare Pages

Use the repository’s standard Astro build settings:

- Build command: `npm run build`
- Output directory: `dist`
- Node: 22 or newer

`public/_redirects` keeps the three legacy Ghost post URLs working. Configure
`blog.rickysullivan.com.au` only when the preview deployment has been approved.
