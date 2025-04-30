#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting server deployment process..."

# Store the root directory path
ROOT_DIR=$(pwd)

# Step 1: Ensure we're on main branch
echo "📍 Checking out main branch..."
git checkout main || { echo "❌ Failed to checkout main branch"; exit 1; }

# Step 2: Pull latest changes
echo "⬇️ Pulling latest changes..."
git pull || { echo "❌ Failed to pull latest changes"; exit 1; }

# Step 3: Verify Heroku remote exists
echo "🔍 Verifying Heroku remote..."
if ! git remote | grep -q "heroku"; then
    echo "❌ Heroku remote not found. Please run the following command once:"
    echo "heroku git:remote -a tech-spec-generator-server"
    exit 1
fi

# Step 4: Deploy to Heroku
echo "🌐 Deploying to Heroku..."
echo "This will push the server directory to Heroku main branch..."
echo -n "🚀 Continue with deployment? (y/n): "
read -r answer

if [ "$answer" = "y" ]; then
    echo "🌍 Pushing to Heroku..."
    # Push the current branch's server subdirectory to Heroku main
    git push heroku main:main || { 
        echo "❌ Heroku deployment failed"
        exit 1
    }
    echo "✅ Heroku deployment complete!"
else
    echo "⏹️ Deployment cancelled"
fi 