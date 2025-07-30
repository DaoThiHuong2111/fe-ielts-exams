#!/usr/bin/env node

import express from 'express';
import crypto from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const execAsync = promisify(exec);
const app = express();

// Configuration
const config = {
  port: process.env.PORT || 3122,
  host: process.env.HOST || '0.0.0.0',
  webhookSecret: process.env.WEBHOOK_SECRET || 'your-webhook-secret',
  targetBranch: process.env.TARGET_BRANCH || 'staging',
  projectPath: process.env.PROJECT_PATH || '/var/www/fe-ielts-exams'
};

// Middleware
app.use(express.json({ limit: '10mb' }));

// Simple logger
const log = (message, data = {}) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data);
};

// Verify GitHub signature
const verifySignature = (payload, signature) => {
  if (!signature) return false;
  
  const hmac = crypto.createHmac('sha256', config.webhookSecret);
  hmac.update(payload);
  const calculatedSignature = `sha256=${hmac.digest('hex')}`;
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(calculatedSignature)
  );
};

// Execute command
const executeCommand = async (command, cwd = config.projectPath) => {
  log(`Executing: ${command}`);
  try {
    const { stdout, stderr } = await execAsync(command, { cwd });
    if (stderr) log('Command stderr:', { stderr });
    log('Command completed:', { stdout: stdout.substring(0, 200) });
    return { success: true, stdout, stderr };
  } catch (error) {
    log('Command failed:', { error: error.message });
    throw error;
  }
};

// Deploy function
const deploy = async (branch) => {
  try {
    log('🚀 Starting deployment...', { branch });
    
    // Change to project directory
    process.chdir(config.projectPath);
    
    // Pull latest changes
    await executeCommand(`git pull origin ${branch}`);
    
    // Docker deployment
    await executeCommand('docker-compose down');
    await executeCommand('docker-compose build --no-cache');
    await executeCommand('docker-compose up -d');
    
    // Cleanup old images
    await executeCommand('docker image prune -f');
    
    log('✅ Deployment completed successfully!');
    return { success: true, message: 'Deployment completed' };
    
  } catch (error) {
    log('❌ Deployment failed:', { error: error.message });
    return { success: false, error: error.message };
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({
    name: 'Simple Webhook Server',
    status: 'running',
    timestamp: new Date().toISOString(),
    config: {
      targetBranch: config.targetBranch,
      projectPath: config.projectPath
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.post('/webhook', async (req, res) => {
  try {
    const signature = req.get('X-Hub-Signature-256');
    const payload = JSON.stringify(req.body);
    
    // Verify signature
    if (!verifySignature(payload, signature)) {
      log('❌ Invalid signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    const { ref, repository, head_commit } = req.body;
    const branch = ref.replace('refs/heads/', '');
    
    log('📥 Webhook received:', { 
      branch, 
      repository: repository.full_name,
      commit: head_commit?.id?.substring(0, 7)
    });
    
    // Check target branch
    if (branch !== config.targetBranch) {
      log('📋 Branch ignored:', { branch, targetBranch: config.targetBranch });
      return res.json({ 
        message: 'Branch ignored', 
        branch, 
        targetBranch: config.targetBranch 
      });
    }
    
    // Check if not a deletion
    if (!head_commit) {
      log('📋 Deletion event ignored');
      return res.json({ message: 'Deletion event ignored' });
    }
    
    // Start deployment
    const result = await deploy(branch);
    
    if (result.success) {
      res.json({
        message: 'Deployment completed successfully',
        branch,
        commit: head_commit.id.substring(0, 7)
      });
    } else {
      res.status(500).json({
        error: 'Deployment failed',
        message: result.error,
        branch,
        commit: head_commit.id.substring(0, 7)
      });
    }
    
  } catch (error) {
    log('❌ Webhook error:', { error: error.message });
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    availableEndpoints: ['/', '/health', '/webhook']
  });
});

// Start server
app.listen(config.port, config.host, () => {
  log('🎣 Simple webhook server started', {
    port: config.port,
    host: config.host,
    targetBranch: config.targetBranch,
    projectPath: config.projectPath
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  log('👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  log('👋 Shutting down gracefully...');
  process.exit(0);
});