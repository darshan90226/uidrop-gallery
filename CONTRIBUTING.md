# Contributing to UIDrop

Thanks for adding a snippet. Each snippet is one HTML file in `snippets/`.

## Add a snippet

1. Fork the repo and create a branch.
2. Create `snippets/your-snippet-name.html` with this shape:

```html
<!--
title: Pill toggle
author: @yourname
category: Forms
-->
<style>/* your CSS */</style>
<label class="s"><input type="checkbox"><span></span></label>
```

3. Run `npm run validate`. It must pass with no problems.
4. Run `npm run dev` and check your snippet looks right in light and dark mode.
5. Open a pull request.

You can also build your snippet on the site's live preview and use **Copy contribution file** to get the correct format.

## Rules

- Category must be one of: Buttons, Forms, Cards, Loaders, Navigation, Layout.
- HTML and CSS only. No `<script>` tags.
- No external URLs (images, fonts, stylesheets). Inline everything.
- Keep each snippet under 8 KB.
- Use class names that are short and specific to your snippet. Previews are isolated, so names can't clash.
- You must have the right to share the code. By submitting, you agree it is released under the MIT license.

## Code changes

For changes to the site itself (`src/`, `scripts/`), open an issue first for anything large. Keep dependencies minimal.

## Conduct

Be kind and assume good intent. Harassment and spam get snippets and accounts removed.
