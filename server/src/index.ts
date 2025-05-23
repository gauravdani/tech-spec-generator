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
    await generateSpecification(formData, res);
  } catch (error) {
    console.error('Error generating specification:', error);
    res.status(500).json({ error: 'Failed to generate specification' });
  }
});

// Function to try starting the server on different ports
const startServer = async (initialPort: number) => {
  let currentPort = initialPort;
  const maxAttempts = 10; // Try up to 10 different ports
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      await new Promise<void>((resolve, reject) => {
        const server = app.listen(currentPort, () => {
          console.log(`Server running on port ${currentPort}`);
          
          // Update the client's API URL if needed
          if (currentPort !== initialPort) {
            console.log(`⚠️  API is running on a different port than expected.`);
            console.log(`⚠️  Please update the client's API URL to use port ${currentPort}`);
          }
          
          resolve();
        }).on('error', (err: NodeJS.ErrnoException) => {
          if (err.code === 'EADDRINUSE') {
            currentPort++;
            reject(err);
          } else {
            console.error('Server error:', err);
            reject(err);
          }
        });

        // Handle graceful shutdown
        process.on('SIGTERM', () => {
          console.log('SIGTERM signal received: closing HTTP server');
          server.close(() => {
            console.log('HTTP server closed');
          });
        });
      });
      
      // If we get here, the server started successfully
      return currentPort;
    } catch (err) {
      if (attempt === maxAttempts - 1) {
        console.error(`Failed to start server after trying ${maxAttempts} ports`);
        throw err;
      }
      // Otherwise, continue to the next port
    }
  }
};

// Start the server beginning with port 3001
startServer(3001).then((port) => {
  // Log the actual port being used
  console.log(`✅ Server is ready and listening on port ${port}`);
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
}); 