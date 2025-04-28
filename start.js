const { spawn, exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Function to check if a port is in use
function isPortInUse(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    server.listen(port);
  });
}

// Function to kill a process using a specific port
function killProcessOnPort(port) {
  return new Promise((resolve) => {
    // Different commands for different operating systems
    const isWindows = process.platform === 'win32';
    const command = isWindows
      ? `netstat -ano | findstr :${port}`
      : `lsof -i :${port} -t`;
    
    exec(command, (error, stdout) => {
      if (error || !stdout) {
        console.log(`No process found using port ${port}`);
        resolve();
        return;
      }
      
      const pid = isWindows
        ? stdout.split('\n')[0].split(/\s+/)[5]
        : stdout.trim();
      
      if (pid) {
        const killCommand = isWindows ? `taskkill /F /PID ${pid}` : `kill -9 ${pid}`;
        exec(killCommand, (err) => {
          if (err) {
            console.error(`Failed to kill process on port ${port}:`, err);
          } else {
            console.log(`Killed process ${pid} using port ${port}`);
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
}

// Start the server
async function startServer() {
  console.log('🚀 Starting server...');
  
  // Check if port 3000 is in use and kill the process if it is
  const portInUse = await isPortInUse(3000);
  if (portInUse) {
    console.log('⚠️ Port 3000 is already in use. Attempting to kill the process...');
    await killProcessOnPort(3000);
    // Wait a moment for the port to be released
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  const server = spawn('node', ['server.js'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development',
      PWD: path.resolve(__dirname, 'server')
    },
    cwd: path.resolve(__dirname, 'server')
  });
  
  // Handle server process errors
  server.on('error', (err) => {
    console.error('❌ Failed to start server:', err);
  });
  
  return server;
}

// Start the client
function startClient() {
  console.log('🌐 Starting client...');
  
  // Check if client is using npm or yarn
  const packageManager = fs.existsSync(path.join(__dirname, 'client', 'yarn.lock')) ? 'yarn' : 'npm';
  
  // Start the client using the appropriate package manager and the 'dev' script
  const client = spawn(packageManager, ['run', 'dev'], {
    stdio: 'inherit',
    cwd: path.join(__dirname, 'client')
  });
  
  // Handle client process errors
  client.on('error', (err) => {
    console.error('❌ Failed to start client:', err);
  });
  
  return client;
}

// Main function to start everything
async function start() {
  try {
    const server = await startServer();
    const client = startClient();
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('👋 Shutting down...');
      server.kill();
      client.kill();
      process.exit();
    });
  } catch (error) {
    console.error('❌ Failed to start application:', error);
    process.exit(1);
  }
}

// Start the application
start(); 