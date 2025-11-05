---
title: "Deploying Websites with GitHub & Cloudflare Pages"
pubDate: 2025-11-05
description: "Learn how to set up automatic deployments from GitHub repositories to Cloudflare Pages for fast, secure web hosting."
author: "Johannes"
tags: ["cloudflare", "github", "deployment", "web-hosting", "git"]
layout: "../../layouts/MarkdownPostLayout.astro"
---

# Deploying Websites with GitHub & Cloudflare Pages

Cloudflare Pages is a powerful platform that enables automatic deployment of static websites directly from your GitHub repositories. In this guide, we'll walk through the entire process of setting up continuous deployment for your web projects.

## What is Cloudflare Pages?

Cloudflare Pages is a JAMstack platform that allows you to deploy websites to Cloudflare's global network with ease. It offers:

- **Global CDN**: Your site gets distributed across Cloudflare's worldwide network
- **Automatic HTTPS**: Free SSL certificates for all sites
- **Git Integration**: Automatic deployments on every push
- **Preview Deployments**: Test changes before going live
- **Rollbacks**: Easy reverting to previous deployments
- **Zero cost**: Generous free tier for personal projects

## Prerequisites

Before we begin, make sure you have:

- A GitHub account with a repository containing your website
- A Cloudflare account (free tier is sufficient)
- Your website files in a Git repository

## Step 1: Prepare Your GitHub Repository

Ensure your repository is ready for deployment:

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **Include build configuration** (if needed):
   - For static sites: Usually no build step required
   - For frameworks: Include package.json and build scripts

## Step 2: Connect Cloudflare Pages to GitHub

1. **Navigate to Cloudflare Pages**:
   - Log in to your Cloudflare dashboard
   - Go to "Workers & Pages" → "Overview"
   - Click "Create application" → "Pages"

2. **Connect to Git**:
   - Select "Connect to Git"
   - Choose "GitHub" from the list of providers
   - Click "Install & Authorize" to grant Cloudflare access

3. **Select your repository**:
   - Browse your GitHub repositories
   - Select the repository you want to deploy
   - Click "Begin setup"

## Step 3: Configure Build Settings

Depending on your project type, configure the build settings:

### For Static HTML/CSS/JS Sites
- **Build command**: Leave empty
- **Build output directory**: `.` (root directory)
- **Root directory**: `/` (unless your site is in a subfolder)

### For Framework-Based Sites

#### React (Create React App)
- **Build command**: `npm run build`
- **Build output directory**: `build`

#### Next.js
- **Build command**: `npm run build`
- **Build output directory**: `out`

#### Astro
- **Build command**: `npm run build`
- **Build output directory**: `dist`

#### Hugo
- **Build command**: `hugo`
- **Build output directory**: `public`

#### Vue.js
- **Build command**: `npm run build`
- **Build output directory**: `dist`

### Environment Variables
If your project needs environment variables:
1. Go to "Settings" → "Environment variables"
2. Add your variables (API keys, database URLs, etc.)
3. Variables are automatically injected during builds

## Step 4: Deploy Your Site

1. **Save and Deploy**:
   - Review your configuration
   - Click "Save and Deploy"
   - Cloudflare will build and deploy your site

2. **First Deployment**:
   - Watch the build process in real-time
   - Receive a deployment URL once complete
   - Your site is now live!

## Step 5: Configure Custom Domain (Optional)

1. **Add Custom Domain**:
   - Go to "Custom domains" in your Pages project
   - Click "Set up a custom domain"
   - Enter your domain name

2. **Update DNS**:
   - Cloudflare will provide DNS records
   - Add these records to your domain registrar
   - Wait for DNS propagation (usually minutes)

## Workflow: From Development to Production

Once set up, your workflow becomes incredibly simple:

### Development
```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main
```

### Automatic Deployment
- Cloudflare detects the push automatically
- Triggers a new build and deployment
- Updates your live site within minutes

### Preview Deployments
- Every commit creates a preview URL
- Test changes before merging to main
- Share preview URLs with teammates

### Advanced Features

#### Branch Deployments
Configure different deployments for different branches:
- **Main branch**: Production deployment
- **Develop branch**: Staging environment
- **Feature branches**: Preview deployments

#### Build Hooks
For automated deployments without Git commits:
1. Go to "Build hooks" in settings
2. Create a new hook
3. Use the hook URL with POST requests:
   ```bash
   curl -X POST "your-build-hook-url"
   ```

#### Redirects and Rewrites
Create `_redirects` file in your project root:
```
# Redirect old paths to new ones
/old-path /new-path 301

# Handle SPA routing
/* /index.html 200
```

#### Header Rules
Create `_headers` file for custom headers:
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

### Best Practices

#### Performance Optimization
- Enable Cloudflare's caching features
- Optimize images and assets
- Use Cloudflare's WebP image format support
- Enable Brotli compression (automatic)

#### Security
- Keep dependencies updated
- Use environment variables for sensitive data
- Enable Cloudflare's security features
- Review build logs for vulnerabilities

#### Monitoring
- Check deployment history in the dashboard
- Set up analytics for site performance
- Monitor build failures and fix promptly
- Use Cloudflare's analytics for insights

### Troubleshooting Common Issues

#### Build Failures
- Check build logs for error messages
- Verify build command and output directory
- Ensure all dependencies are in package.json
- Check for missing environment variables

#### Deployment Delays
- Large repositories may take longer
- Complex builds increase deployment time
- Check Cloudflare status for platform issues

#### SSL Certificate Issues
- Wait a few minutes after adding custom domains
- Verify DNS records are correct
- Contact Cloudflare support if issues persist

### Alternative Deployment Methods

#### Direct Upload
For projects without Git integration:
1. Build your site locally
2. Upload files directly via Cloudflare dashboard
3. Manual process but simple for static sites

#### Wrangler CLI
For command-line enthusiasts:
```bash
# Install Wrangler
npm install -g wrangler

# Deploy
wrangler pages deploy public --project-name=my-site
```

## Conclusion

Cloudflare Pages with GitHub integration provides a seamless deployment experience for modern web projects. The combination of automatic deployments, global CDN, and generous free tier makes it an excellent choice for developers looking to host their websites efficiently.

The setup process takes just a few minutes, and once configured, you can focus on writing code while Cloudflare handles the deployment and hosting automatically. Whether you're building a personal blog, portfolio site, or production application, Cloudflare Pages offers the reliability and performance needed for modern web hosting.

Happy deploying! 🚀