#!/bin/bash

# Exit on any error
set -e

echo "🚀 Setting up Heroku configuration..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found in the current directory!"
    exit 1
fi

# Load environment variables from .env file
echo "📝 Loading environment variables from .env file..."
export $(cat .env | grep -v '^#' | xargs)

# Verify required variables
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "❌ ANTHROPIC_API_KEY not found in .env file!"
    exit 1
fi

if [ -z "$CLIENT_URL" ]; then
    echo "⚠️ CLIENT_URL not found in .env file, using default..."
    CLIENT_URL="https://your-netlify-app-url.netlify.app"
fi

echo "📝 Setting environment variables on Heroku..."

# Set Anthropic API Key
echo "Setting ANTHROPIC_API_KEY..."
heroku config:set ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" --app tech-spec-generator-server

# Set Node environment
echo "Setting NODE_ENV..."
heroku config:set NODE_ENV="production" --app tech-spec-generator-server

# Set allowed client URL
echo "Setting CLIENT_URL..."
heroku config:set CLIENT_URL="$CLIENT_URL" --app tech-spec-generator-server

# Set any other variables that exist in .env
echo "Setting additional variables from .env..."
while IFS='=' read -r key value; do
    # Skip empty lines and comments
    if [ -z "$key" ] || [[ $key == \#* ]]; then
        continue
    fi
    # Skip already set variables
    if [[ $key != "ANTHROPIC_API_KEY" ]] && [[ $key != "NODE_ENV" ]] && [[ $key != "CLIENT_URL" ]]; then
        echo "Setting $key..."
        heroku config:set "$key=$value" --app tech-spec-generator-server
    fi
done < .env

echo "✅ Configuration complete! Verifying settings..."

# Verify the configuration
heroku config --app tech-spec-generator-server

echo "
🎉 Heroku configuration is set up!
🔍 All environment variables from .env have been transferred to Heroku
📌 You can now run ./deploy-server.sh to deploy your application" 