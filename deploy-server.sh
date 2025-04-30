#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting server deployment process..."

# Step 1: Ensure we're on main branch
echo "📍 Checking out main branch..."
git checkout main || { echo "❌ Failed to checkout main branch"; exit 1; }

# Step 2: Pull latest changes
echo "⬇️ Pulling latest changes..."
git pull || { echo "❌ Failed to pull latest changes"; exit 1; }

# Step 3: Setup Heroku configuration
echo "🔧 Setting up Heroku configuration..."
cd server || { echo "❌ Failed to move to server directory"; exit 1; }

if [ ! -f ".env" ]; then
    echo "❌ .env file not found in server directory!"
    exit 1
fi

# Load and set environment variables from .env file
echo "📝 Loading environment variables from .env file..."
export $(cat .env | grep -v '^#' | xargs)

# Verify and set required variables
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "❌ ANTHROPIC_API_KEY not found in .env file!"
    exit 1
fi

echo "📝 Setting environment variables on Heroku..."
heroku config:set ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" --app tech-spec-generator-server
heroku config:set NODE_ENV="production" --app tech-spec-generator-server
heroku config:set CLIENT_URL="https://iridescent-kitsune-bb54c5.netlify.app" --app tech-spec-generator-server

# Set MAX_TOKENS if provided in .env, otherwise use default
if [ -n "$MAX_TOKENS" ]; then
    echo "Setting MAX_TOKENS from .env..."
    heroku config:set MAX_TOKENS="$MAX_TOKENS" --app tech-spec-generator-server
else
    echo "Setting default MAX_TOKENS=1000..."
    heroku config:set MAX_TOKENS="1000" --app tech-spec-generator-server
fi

# Note about PORT
echo "ℹ️ Note: Heroku will automatically assign its own PORT variable"
echo "   Your application should use: process.env.PORT || 3000"

# Set any other variables that exist in .env
while IFS='=' read -r key value; do
    # Skip empty lines, comments, and special variables
    if [ -z "$key" ] || [[ $key == \#* ]] || \
       [[ $key == "ANTHROPIC_API_KEY" ]] || \
       [[ $key == "NODE_ENV" ]] || \
       [[ $key == "PORT" ]] || \
       [[ $key == "CLIENT_URL" ]]; then
        continue
    fi
    heroku config:set "$key=$value" --app tech-spec-generator-server
done < .env

# Step 4: Verify Heroku remote exists
echo "🔍 Verifying Heroku remote..."
if ! git remote | grep -q "heroku"; then
    echo "❌ Heroku remote not found. Please run the following command once:"
    echo "heroku git:remote -a tech-spec-generator-server"
    exit 1
fi

# Step 5: Deploy to Heroku
echo "🌐 Deploying to Heroku..."
echo "This will push the server directory to Heroku main branch..."
echo -n "🚀 Continue with deployment? (y/n): "
read -r answer

if [ "$answer" = "y" ]; then
    echo "🌍 Pushing to Heroku..."
    # Push the current branch's server subdirectory to Heroku main
    cd .. && git push heroku main:main || { 
        echo "❌ Heroku deployment failed"
        exit 1
    }
    echo "✅ Heroku deployment complete!"
    
    # Verify deployment
    echo "🔍 Verifying deployment..."
    if curl -s https://tech-spec-generator-server-a925ce447590.herokuapp.com/api/health | grep -q "status.*ok"; then
        echo "✅ Server is responding correctly!"
    else
        echo "❌ Health check failed"
        echo "Response from server:"
        curl -v https://tech-spec-generator-server-a925ce447590.herokuapp.com/api/health
        exit 1
    fi
else
    echo "⏹️ Deployment cancelled"
fi 