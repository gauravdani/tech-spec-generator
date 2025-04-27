import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateSpecification } from './services/claude';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Basic spec generation endpoint
app.post('/api/generate-spec', async (req, res) => {
  try {
    const formData = req.body;
    
    // Validate input
    if (!formData.businessType || !formData.platformType || !formData.deviceType || !formData.trackingTool) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate specification using Claude
    const specification = await generateSpecification(formData);

    res.json({ specification });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate specification',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

const PORT: number = parseInt(process.env.PORT || '3001', 10);

// Add error handling for server startup
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = PORT + 1;
    console.log(`Port ${PORT} is already in use. Trying port ${nextPort}`);
    app.listen(nextPort, () => {
      console.log(`Server running on port ${nextPort}`);
    });
  } else {
    console.error('Server error:', err);
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
}); 