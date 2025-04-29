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
5. Start the application:

   **Option 1: Start both client and server (recommended)**
   ```bash
   npm run dev
   ```
   This will start both the client and server concurrently.

   **Option 2: Start server only**
   ```bash
   cd server && npm run dev
   ```
   This will start the server with hot reloading enabled.

   **Option 3: Start client only**
   ```bash
   cd client && npm run dev
   ```
   This will start the client with hot reloading enabled.

   > **Note:** The `start.js` script at the root level is an alternative way to start the application, but it's recommended to use `npm run dev` for consistency and to take advantage of hot reloading.

## Usage

1. Open your browser and navigate to `http://localhost:5173` (client)
2. Select your business type
3. Fill in the required information about your analytics needs
4. Click "Generate Specification" to create a detailed technical specification
5. Use the "Copy to Clipboard" button to copy the generated specification

> **Note:** The client runs on port 5173 (Vite's default port) and communicates with the server on port 3001.

## Project Structure

- `client/` - React frontend application
- `server/` - Express backend server
- `.env` - Environment variables (not in version control)
- `.env.example` - Example environment variables template

## Technologies Used

- React with TypeScript
- Node.js/Express
- Claude AI API
- Tailwind CSS
- Vite

## Dynamic Prompt Structure

The application uses the following dynamic prompt structure for generating specifications:

```typescript
const generatePrompt = (formData: FormData): string => {
  return `As a data engineer, generate a detailed, privacy-compliant event tracking specification document for a ${formData.businessType} business.

Technical Context:
- Platform: ${formData.platformTypes.join(', ')}
- Device Type: ${formData.deviceTypes.join(', ')}
- Tracking Tool: ${formData.trackingTool}

For each event, include:
1. Event Name and Description
2. Required and Optional Properties (in a table format)
3. Implementation Example
4. Trigger Conditions
5. Testing Guidelines

Formatting Requirements:
1. Use proper HTML structure with semantic elements
2. Format event property tables with the following columns:
   - Property Name
   - Required/Optional
   - Data Type
   - Description
   - Example Value

3. Format code examples using syntax-highlighted code blocks:
   \`\`\`javascript
   // Code example here
   \`\`\`

4. Use consistent heading levels:
   - H1 for document title
   - H2 for main sections
   - H3 for subsections
   - H4 for event names

5. Ensure proper spacing between sections for readability

Format the output as a well-structured document that can be easily read and copied.`;
};
```

### Prompt Components

1. **Business Context**
   - Business Type
   - Platform Types (multiple selection)
   - Device Types (multiple selection)
   - Tracking Tool

2. **Event Documentation Requirements**
   - Event Name and Description
   - Property Tables (Required/Optional)
   - Implementation Examples
   - Trigger Conditions
   - Testing Guidelines

3. **Formatting Guidelines**
   - HTML Structure
   - Table Format
   - Code Block Format
   - Heading Hierarchy
   - Document Spacing

### Response Format

The generated specification includes:
- Properly formatted HTML with semantic elements
- Tables for event properties
- Syntax-highlighted code examples
- Consistent heading structure
- Clear spacing and readability

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

### Development

To start the development server:

```bash
# Start the backend server
cd server
npm install
npm run dev

# In a new terminal, start the frontend
cd client
npm install
npm run dev
```

### Build Process

To build the project for production:

```bash
cd client
npm run build
```

The build process will generate optimized files in the `dist` directory. Note that there might be warnings about chunk sizes being larger than 500 kB after minification. To optimize the build in the future, consider:

1. Using dynamic imports for code splitting
2. Configuring manual chunks in the Rollup options
3. Adjusting the chunk size warning limit

### Docker Deployment (Server)

To deploy the server using Docker:

1. Create a `Dockerfile` in the server directory:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   EXPOSE 3001
   CMD ["npm", "start"]
   ```

2. Build the Docker image:
   ```bash
   cd server
   docker build -t tech-spec-server .
   ```

3. Run the container:
   ```bash
   docker run -p 3001:3001 --env-file .env tech-spec-server
   ```

> **Note:** Make sure your `.env` file is present in the server directory before building the image.

### Project Structure

- `client/` - React frontend application
- `server/` - Express backend server
- `.env` - Environment variables (not in version control)
- `.env.example` - Example environment variables template