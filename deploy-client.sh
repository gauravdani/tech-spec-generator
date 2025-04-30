#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting client deployment process..."

# Step 1: Ensure we're on main branch
echo "📍 Checking out main branch..."
git checkout main || { echo "❌ Failed to checkout main branch"; exit 1; }

# Step 2: Pull latest changes
echo "⬇️ Pulling latest changes..."
git pull || { echo "❌ Failed to pull latest changes"; exit 1; }

# Step 3: Move to client directory
echo "📂 Moving to client directory..."
cd client || { echo "❌ Failed to move to client directory"; exit 1; }

# Step 4: Build the project
echo "🏗️ Building the project..."
npx vite build --outDir dist || { echo "❌ Build failed"; exit 1; }

# Step 5: Check Netlify login status and login if needed
echo "🔑 Checking Netlify login status..."
if ! netlify status 2>/dev/null; then
    echo "📝 Please log in to Netlify..."
    netlify login || { echo "❌ Netlify login failed"; exit 1; }
fi

# Step 6: Initial Netlify deploy (draft)
echo "🌐 Deploying to Netlify (draft)..."
DEPLOY_OUTPUT=$(netlify deploy 2>&1)
if [ $? -ne 0 ]; then
    echo "❌ Netlify draft deployment failed"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi
echo "$DEPLOY_OUTPUT"

# Step 7: Prompt for production deployment
echo -n "🚀 Deploy to production? (y/n): "
read -r answer

if [ "$answer" = "y" ]; then
    echo "🌍 Deploying to production..."
    netlify deploy --prod || { echo "❌ Production deployment failed"; exit 1; }
    echo "✅ Production deployment complete!"
else
    echo "⏹️ Production deployment cancelled"
fi 