# Analytics Technical Specification Generator

A web application that generates detailed technical specifications for analytics tracking implementation using Claude AI.

## Features

- Generate comprehensive analytics tracking specifications
- Support for multiple business types (eCommerce, OTT, SaaS, EdTech, Fintech, Gaming)
- Customizable event categories based on business type
- AI-powered specification generation using Claude
- Modern, responsive UI

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Add your Claude API key to the `.env` file
5. Start the server:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Select your business type
3. Fill in the required information about your analytics needs
4. Click "Generate Specification" to create a detailed technical specification
5. Use the "Copy to Clipboard" button to copy the generated specification

## Project Structure

- `public/` - Static files (HTML, CSS, JavaScript)
- `server.js` - Express server and API endpoints
- `.env` - Environment variables (not in version control)
- `.env.example` - Example environment variables template

## Technologies Used

- Node.js
- Express
- Claude AI API
- HTML/CSS/JavaScript
