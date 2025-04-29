# TrackForge AI Client Deployment Guide

This guide provides step-by-step instructions for building and deploying the TrackForge AI client application to Netlify.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A Netlify account
- Git repository with your code

## Local Build Instructions

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a production build:
   ```bash
   npm run build
   ```
   or 

   ```
   npx vite build --outDir dist

   ```
   This will create a `build` directory with optimized production files.

   npm --workspace trackforge-ai-client run build

## Deploying to Netlify

### Option 1: Deploy via Netlify UI (Recommended for first deployment)

1. Log in to your Netlify account
2. Click "Add new site" > "Import an existing project"
3. Connect your Git repository
4. Configure the build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `build`
5. Click "Deploy site"

### Option 2: Deploy via Netlify CLI

1. Install Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize Netlify in your project:
   ```bash
   cd client
   netlify init
   ```

4. Deploy the site:
   ```bash
   netlify deploy --prod
   ```

## Environment Variables

If your application uses environment variables, you'll need to configure them in Netlify:

1. Go to Site settings > Build & deploy > Environment
2. Add your environment variables:
   - `REACT_APP_API_URL`: Your API endpoint URL
   - Add any other environment variables your app needs

## Continuous Deployment

Netlify automatically:
- Builds your site when you push to your Git repository
- Provides preview deployments for pull requests
- Handles SSL certificates and CDN distribution

## Troubleshooting

If you encounter build issues:
1. Check the build logs in Netlify dashboard
2. Verify all dependencies are in package.json
3. Ensure environment variables are properly set
4. Check for any build errors in the local build process

## Additional Resources

- [Netlify Docs](https://docs.netlify.com/)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)
- [Netlify CLI Documentation](https://docs.netlify.com/cli/get-started/)

# Tech Spec Generator

A web application for generating technical specifications for various business types and tracking tools.

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Features

- Generate technical specifications for various business types
- Support for multiple tracking tools
- PDF export functionality
- Modern, responsive UI 