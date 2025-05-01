#!/bin/bash

# Exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging functions
log_success() { echo -e "${GREEN}✓ $1${NC}"; }
log_info() { echo -e "ℹ️ $1"; }
log_warning() { echo -e "${YELLOW}⚠️ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Function to safely set Heroku config
set_heroku_config() {
    local key=$1
    local value=$2
    
    log_info "Checking $key..."
    
    # Check if variable is already set with the same value
    local current_value=$(heroku config:get $key --app tech-spec-generator-server 2>/dev/null)
    local exit_code=$?
    
    if [ $exit_code -ne 0 ]; then
        log_warning "Failed to check existing value for $key"
        return 1
    fi
    
    if [ "$current_value" == "$value" ]; then
        log_success "$key is already set with the correct value"
        return 0
    fi
    
    log_info "Setting $key..."
    if heroku config:set "$key=$value" --app tech-spec-generator-server 2>/dev/null; then
        log_success "Successfully set $key"
        return 0
    else
        log_warning "Failed to set $key"
        return 1
    fi
}

# Function to validate environment
validate_environment() {
    log_info "Validating environment..."
    
    # Check for .env file
    if [ ! -f ".env" ]; then
        log_error ".env file not found in server directory!"
        exit 1
    fi

    # Check for required variables
    if [ -z "$ANTHROPIC_API_KEY" ]; then
        log_error "ANTHROPIC_API_KEY not found in .env file!"
        exit 1
    fi

    # Verify Heroku remote exists
    if ! git remote | grep -q "heroku"; then
        log_error "Heroku remote not found. Please run: heroku git:remote -a tech-spec-generator-server"
        exit 1
    fi
}

# Function to configure Heroku environment
configure_heroku() {
    log_info "Setting up Heroku configuration..."

    # Set required variables
    set_heroku_config "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY" || log_warning "Failed to set ANTHROPIC_API_KEY"
    set_heroku_config "NODE_ENV" "production" || log_warning "Failed to set NODE_ENV"
    set_heroku_config "CLIENT_URL" "https://iridescent-kitsune-bb54c5.netlify.app" || log_warning "Failed to set CLIENT_URL"

    # Set MAX_TOKENS
    if [ -n "$MAX_TOKENS" ]; then
        set_heroku_config "MAX_TOKENS" "$MAX_TOKENS" || log_warning "Failed to set MAX_TOKENS"
    else
        set_heroku_config "MAX_TOKENS" "1000" || log_warning "Failed to set default MAX_TOKENS"
    fi

    # Set any other variables from .env
    while IFS='=' read -r key value; do
        # Skip empty lines, comments, and special variables
        if [ -z "$key" ] || [[ $key == \#* ]] || \
           [[ $key == "ANTHROPIC_API_KEY" ]] || \
           [[ $key == "NODE_ENV" ]] || \
           [[ $key == "MAX_TOKENS" ]] || \
           [[ $key == "PORT" ]] || \
           [[ $key == "CLIENT_URL" ]]; then
            continue
        fi
        set_heroku_config "$key" "$value" || log_warning "Failed to set $key"
    done < .env

    log_info "Note: Heroku will automatically assign its own PORT variable"
}

# Function to deploy to Heroku
deploy_to_heroku() {
    log_info "Deploying to Heroku..."
    log_info "This will push the server directory to Heroku main branch..."
    
    echo -n "🚀 Continue with deployment? (y/n): "
    read -r answer

    if [ "$answer" = "y" ]; then
        log_info "Pushing to Heroku..."
        cd .. && git push heroku main:main || { 
            log_error "Heroku deployment failed"
            exit 1
        }
        log_success "Heroku deployment complete!"
        
        # Verify deployment
        log_info "Verifying deployment..."
        if curl -s https://tech-spec-generator-server-a925ce447590.herokuapp.com/api/health | grep -q "status.*ok"; then
            log_success "Server is responding correctly!"
        else
            log_error "Health check failed"
            echo "Response from server:"
            curl -v https://tech-spec-generator-server-a925ce447590.herokuapp.com/api/health
            exit 1
        fi
    else
        log_info "Deployment cancelled"
        exit 0
    fi
}

# Main deployment process
main() {
    log_info "Starting server deployment process..."

    # Step 1: Ensure we're on main branch
    log_info "Checking out main branch..."
    git checkout main || { log_error "Failed to checkout main branch"; exit 1; }

    # Step 2: Pull latest changes
    log_info "Pulling latest changes..."
    git pull || { log_error "Failed to pull latest changes"; exit 1; }

    # Step 3: Move to server directory
    cd server || { log_error "Failed to move to server directory"; exit 1; }

    # Step 4: Load environment variables
    log_info "Loading environment variables..."
    export $(cat .env | grep -v '^#' | xargs)

    # Step 5: Validate environment
    validate_environment

    # Step 6: Configure Heroku
    configure_heroku

    # Step 7: Deploy
    deploy_to_heroku
}

# Run the deployment
main 