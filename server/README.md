# Server

This is the backend server for the Analytics Technical Specification Generator.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Add your Anthropic API key to the `.env` file

## Development

To start the development server:

```bash
npm run dev
```

This will start the server with hot reloading enabled on port 3001.

## Simple Deployment Options

### Option 1: Direct Deployment (Recommended for Beginners)

1. Install Node.js on your server
2. Copy the server files to your server:
   ```bash
   # From the project root
   cp -r server /path/to/your/server
   ```
3. Navigate to the server directory and install dependencies:
   ```bash
   cd /path/to/your/server
   npm install
   ```
4. Create a `.env` file with your configuration:
   ```bash
   # In the server directory
   cp .env.example .env
   # Edit .env with your configuration
   nano .env
   ```
5. Start the server:
   ```bash
   # In the server directory
   npm start
   ```

### Option 2: Using PM2 (For Production)

1. Install PM2 globally (can be done from any directory):
   ```bash
   npm install -g pm2
   ```

2. Navigate to the server directory and start with PM2:
   ```bash
   cd /path/to/your/server
   pm2 start npm --name "tech-spec-server" -- start
   ```

3. Useful PM2 commands (can be run from any directory):
   ```bash
   pm2 status              # Check server status
   pm2 logs               # View logs
   pm2 restart all        # Restart server
   pm2 stop all          # Stop server
   ```

### Option 3: Using Railway.app (One-Click Deployment)

1. Create an account at [Railway.app](https://railway.app)
2. From your project root directory, initialize Railway:
   ```bash
   # Install Railway CLI (if needed)
   npm i -g @railway/cli

   # Login to Railway
   railway login

   # Initialize project (run this in the server directory)
   cd server
   railway init
   ```
3. Add your environment variables through Railway dashboard:
   - `ANTHROPIC_API_KEY`: Your Anthropic API key
   - `PORT`: Server port (default: 3001)
   - `NODE_ENV`: Set to "production"
4. Deploy your server:
   ```bash
   # In the server directory
   railway up
   ```

> **Note:** Make sure to only commit the essential files mentioned in the Project Structure above. Remove any unused files or dependencies from package.json to avoid build errors.

## Docker Deployment

### Prerequisites

1. Install Docker Desktop:
   - For Windows: Download and install from [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
   - For Mac: Download and install from [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
   - For Linux: Follow the [Docker Engine installation guide](https://docs.docker.com/engine/install/)

2. Verify Docker installation:
   ```bash
   docker --version
   ```

### Step-by-Step Deployment

1. Create a `Dockerfile` in the server directory:
   ```bash
   # Create a new file named Dockerfile (no extension)
   touch Dockerfile
   ```

2. Add the following content to the Dockerfile:
   ```dockerfile
   # Use Node.js 18 Alpine as the base image
   FROM node:18-alpine

   # Set the working directory in the container
   WORKDIR /app

   # Copy package files
   COPY package*.json ./

   # Install dependencies
   RUN npm install

   # Copy the rest of the application code
   COPY . .

   # Expose port 3001
   EXPOSE 3001

   # Start the application
   CMD ["npm", "start"]
   ```

3. Create a `.dockerignore` file to exclude unnecessary files:
   ```bash
   # Create a new file named .dockerignore
   touch .dockerignore
   ```

4. Add the following content to `.dockerignore`:
   ```
   node_modules
   npm-debug.log
   .env
   .git
   .gitignore
   README.md
   ```

5. Build the Docker image:
   ```bash
   # Navigate to the server directory
   cd server

   # Build the image
   docker build -t tech-spec-server .
   ```

6. Create a `.env` file for Docker (if not already present):
   ```bash
   # Copy the example env file
   cp .env.example .env

   # Edit the .env file with your actual values
   nano .env
   ```

7. Run the Docker container:
   ```bash
   # Run the container
   docker run -p 3001:3001 --env-file .env tech-spec-server
   ```

### Docker Commands Reference

- List running containers:
  ```bash
  docker ps
  ```

- Stop a container:
  ```bash
  docker stop <container_id>
  ```

- Remove a container:
  ```bash
  docker rm <container_id>
  ```

- List Docker images:
  ```bash
  docker images
  ```

- Remove a Docker image:
  ```bash
  docker rmi tech-spec-server
  ```

### Troubleshooting

1. If you get a "port already in use" error:
   ```bash
   # Find the process using port 3001
   lsof -i :3001

   # Kill the process
   kill -9 <PID>
   ```

2. If you need to rebuild the image after making changes:
   ```bash
   # Remove the old image
   docker rmi tech-spec-server

   # Rebuild the image
   docker build -t tech-spec-server .
   ```

3. To view container logs:
   ```bash
   docker logs <container_id>
   ```

> **Note:** Make sure your `.env` file is present in the server directory before building the image. The `.env` file should contain your Anthropic API key and other necessary environment variables.

## Google Cloud Platform Deployment

### Prerequisites

1. Install Google Cloud SDK:
   - Download and install from [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
   - Initialize the SDK:
     ```bash
     gcloud init
     ```

2. Enable required APIs:
   ```bash
   gcloud services enable containerregistry.googleapis.com
   gcloud services enable run.googleapis.com
   ```

### Step-by-Step GCP Deployment

1. Configure Docker for Google Container Registry:
   ```bash
   # Configure Docker to use gcloud as a credential helper
   gcloud auth configure-docker
   ```

2. Tag your Docker image for Google Container Registry:
   ```bash
   # Replace PROJECT_ID with your GCP project ID
   docker tag tech-spec-server gcr.io/PROJECT_ID/tech-spec-server
   ```

3. Push the image to Google Container Registry:
   ```bash
   docker push gcr.io/PROJECT_ID/tech-spec-server
   ```

4. Deploy to Cloud Run:
   ```bash
   gcloud run deploy tech-spec-server \
     --image gcr.io/PROJECT_ID/tech-spec-server \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars="ANTHROPIC_API_KEY=your_api_key"
   ```

### Environment Variables in GCP

1. Set environment variables in Cloud Run:
   ```bash
   gcloud run services update tech-spec-server \
     --update-env-vars="ANTHROPIC_API_KEY=your_api_key,NODE_ENV=production"
   ```

2. Or use Secret Manager for sensitive data:
   ```bash
   # Create a secret
   gcloud secrets create claude-api-key --data-file=.env

   # Grant access to Cloud Run
   gcloud secrets add-iam-policy-binding claude-api-key \
     --member="serviceAccount:PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
     --role="roles/secretmanager.secretAccessor"
   ```

### Monitoring and Logs

1. View logs:
   ```bash
   gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=tech-spec-server"
   ```

2. Monitor the service:
   ```bash
   gcloud run services describe tech-spec-server
   ```

### Cleanup

1. Delete the Cloud Run service:
   ```bash
   gcloud run services delete tech-spec-server
   ```

2. Delete the container image:
   ```bash
   gcloud container images delete gcr.io/PROJECT_ID/tech-spec-server --force-delete-tags
   ```

> **Note:** Replace `PROJECT_ID` with your actual Google Cloud project ID. You can find your project ID by running `gcloud config get-value project`.

## API Endpoints

- `POST /api/generate-spec`: Generate technical specification
  - Request body: Form data with business type and tracking requirements
  - Response: Generated technical specification in HTML format

## Project Structure

```
server/
├── src/                    # Source code
│   ├── controllers/       # API endpoints
│   │   └── specController.ts    # Main specification generator
│   ├── services/         # Business logic
│   │   └── claudeService.ts     # Claude API integration
│   ├── routes/           # Route definitions
│   │   └── api.ts              # API routes
│   ├── utils/            # Helper functions
│   │   └── promptBuilder.ts    # Prompt generation
│   └── app.ts            # Main application
├── .env.example         # Environment template
├── package.json         # Dependencies
└── tsconfig.json       # TypeScript config
```

## Dependencies

Make sure your package.json includes these essential dependencies:

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3",
    "axios": "^1.3.4",
    "@anthropic-ai/sdk": "^0.10.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^18.15.11",
    "typescript": "^5.0.4",
    "ts-node": "^10.9.1"
  }
}
```

## Troubleshooting

### Common Build Issues

1. **TypeScript Errors**
   - Remove unused imports and files
   - Make sure all required dependencies are installed
   - Run `npm install` to update dependencies

2. **Missing Dependencies**
   ```bash
   # Install required dependencies
   npm install express dotenv axios @anthropic-ai/sdk
   npm install -D @types/express @types/node typescript ts-node
   ```

3. **Build Process**
   ```bash
   # Clean install dependencies
   rm -rf node_modules
   npm install

   # Build the project
   npm run build
   ```

4. **Port Conflicts**
   ```bash
   # Find process using port 3000
   lsof -i :3000

   # Kill the process
   kill -9 <PID>

   # Or change the port in .env
   PORT=3001
   ```

### Cleanup Required Files

Before deploying, remove these unused files that cause TypeScript errors:
```bash
rm src/models/Spec.ts
rm src/middleware/rateLimit.ts
rm src/services/auth.ts
rm src/services/socket.ts
```

And remove these unused dependencies from package.json:
```json
{
  "dependencies": {
    // Remove these
    "express-rate-limit": "...",
    "rate-limit-redis": "...",
    "ioredis": "...",
    "mongoose": "...",
    "socket.io": "..."
  }
}
```

### Railway Deployment Issues

If you encounter build errors on Railway:

1. Check the build logs for specific errors
2. Make sure all dependencies are in package.json
3. Verify TypeScript configuration
4. Remove any unused files or dependencies
5. Make sure port configuration is correct in Railway dashboard

## Environment Variables

- `PORT`: Server port (default: 3001)
- `ANTHROPIC_API_KEY`: Your Anthropic API key
- `NODE_ENV`: Environment (development/production) 


M2 is a Production Process Manager for Node.js applications
                     with a built-in Load Balancer.

                Start and Daemonize any application:
                $ pm2 start app.js

                Load Balance 4 instances of api.js:
                $ pm2 start api.js -i 4

                Monitor in production:
                $ pm2 monitor

                Make pm2 auto-boot at server restart:
                $ pm2 startup

                To go further checkout:
                http://pm2.io/


                        -------------

[PM2] Spawning PM2 daemon with pm2_home=/Users/dan0002g/.pm2
[PM2] PM2 Successfully daemonized
[PM2] Starting /opt/homebrew/bin/npm in fork_mode (1 instance)
[PM2] Done.
┌────┬─────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name                │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼─────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ tech-spec-server    │ default     │ N/A     │ fork    │ 65644    │ 0s     │ 0    │ online    │ 0%       │ 1.7mb    │ dan0002g │ disabled │
└────┴────────────────────