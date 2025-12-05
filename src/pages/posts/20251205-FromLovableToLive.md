---
title: 'From Lovable to Live'
pubDate: 2025-12-05
description: 'How to host your vibe-coded lovable site, for free'
author: 'Johannes'
tags: ["lovable", "cloudflare", "hosting", "vibe coding", "learning in public"]
layout: '../../layouts/MarkdownPostLayout.astro'
---

## Introduction

So you've discovered <a href="https://lovable.dev" target="_blank">Lovable.dev</a> and "vibe coded" your way to a beautiful website. Now what? This guide walks you through hosting your creation for free using Cloudflare Pages.

> **Important Caveat:** This guide only covers sites **without a database**. Keeping your site static means no backend to secure, no data leaks to worry about, and free hosting that scales beautifully.

## The 10-Step Journey

![The 10 steps from Lovable to Live: Vibe Code → Connect GitHub → Clone Locally → Remove bun.lockb → npm install → Update browserslist → Test locally → Commit → Cloudflare Pages → Custom Domain](/images/lovable-to-live-flow.svg)

---

## Step 1: Vibe Code Your Site on Lovable.dev

Head to <a href="https://lovable.dev" target="_blank">Lovable.dev</a> and start building. Describe what you want, iterate on the design, and let the AI help you create something beautiful.

**The Golden Rule:** Keep it database-free and avoid storing personal data. This keeps your site safe, simple, and free to host.

### What About Local Storage?

You can still make your site interactive using browser storage:

**sessionStorage** - Data that persists only for the current browser tab/session:
- Cleared when the tab is closed
- Great for: temporary form data, shopping cart contents during a session, wizard/multi-step form state

**localStorage** - Data that persists across browser sessions:
- Stays until explicitly cleared
- Great for: user preferences (dark mode), saved settings, cached data for offline use

```javascript
// sessionStorage example
sessionStorage.setItem('currentStep', '3');
const step = sessionStorage.getItem('currentStep');

// localStorage example  
localStorage.setItem('theme', 'dark');
const theme = localStorage.getItem('theme');
```

Both are limited to ~5MB and store strings only (use `JSON.stringify` for objects).

---

## Step 2: Connect to Your GitHub Account

In Lovable, connect your project to GitHub. This creates a repository with all your code, enabling version control and deployment pipelines.

1. Click on the GitHub integration in Lovable
2. Authorize Lovable to access your GitHub account
3. Choose to create a new repository or connect to an existing one
4. Your code is now synced!

---

## Step 3: Clone Locally (or Use GitHub Codespaces)

Get the code on your machine to make the necessary adjustments.

**Option A: Clone Locally**
```bash
git clone https://github.com/yourusername/your-lovable-project.git
cd your-lovable-project
```

**Option B: GitHub Codespaces**
Click the green "Code" button on your repo and select "Open with Codespaces" for a cloud-based dev environment—no local setup required.

---

## Step 4: Remove the `bun.lockb` File

Lovable uses Bun as its package manager, which creates a `bun.lockb` file. Cloudflare Pages expects npm/yarn, and this binary lockfile causes build failures.

```bash
rm bun.lockb
```

**Why?** Cloudflare's build system doesn't recognize Bun's lockfile format. Removing it allows npm to create its own `package-lock.json` during installation.

---

## Step 5: Run `npm install` and `npm audit fix --force`

Install dependencies using npm and fix any security vulnerabilities:

```bash
npm install
npm audit fix --force
```

**Why `--force`?** Some fixes require major version bumps that might introduce breaking changes. For a fresh Lovable project, this is usually safe. The alternative is manually reviewing each vulnerability.

---

## Step 6: Update the Browserslist Database

The browserslist database determines which browsers your CSS and JavaScript should support. An outdated list can cause build warnings or suboptimal output.

```bash
npx update-browserslist-db@latest
```

**Why?** This ensures your build targets current browser versions, potentially reducing bundle size and avoiding compatibility warnings.

---

## Step 7: Test Locally with `npm run dev`

Before committing, verify everything still works:

```bash
npm run dev
```

Open the local URL (usually `http://localhost:5173` for Vite projects) and click around. Check the console for errors.

**What to look for:**
- Pages load correctly
- No console errors
- Interactive features work
- Styles render properly

---

## Step 8: Commit Your Changes

Everything working? Time to commit:

```bash
git add .
git commit -m "Prepare for Cloudflare Pages deployment"
git push
```

Your repository now has a clean npm-based setup ready for deployment.

---

## Step 9: Set Up Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **Create application** → **Pages**
3. Connect your GitHub account if not already connected
4. Select your Lovable project repository
5. Configure the build settings:
   - **Framework preset:** Vite (or auto-detect)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
6. Click **Save and Deploy**

Cloudflare will clone your repo, install dependencies, build, and deploy. Your site will be live at `your-project.pages.dev` within minutes!

---

## Step 10: Connect Your Custom Domain

Make it official with your own domain:

1. In Cloudflare Pages, go to your project → **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain (e.g., `mysite.com` or `app.mysite.com`)
4. If your domain is already on Cloudflare, DNS records are configured automatically
5. If not, add the provided CNAME record to your DNS provider

**SSL is automatic!** Cloudflare handles HTTPS certificates for you.

---

## Done! 🎉

Your vibe-coded Lovable site is now live on the internet, hosted for free, with:
- Global CDN distribution
- Automatic HTTPS
- Unlimited bandwidth (within reasonable limits)
- Automatic deployments on every push

**Next steps to consider:**
- Set up preview deployments for branches
- Add analytics (Cloudflare Web Analytics is free)
- Configure redirects in `_redirects` file if needed

Happy shipping!
