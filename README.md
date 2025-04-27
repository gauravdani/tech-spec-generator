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
