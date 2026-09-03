/**
 * @file index.js
 * @description Primary application bootstrap and microservice launcher for Aura Apex Banking System.
 */

const path = require('path');
const { spawn } = require('child_process');

console.log('====================================================');
console.log('   AURA APEX BANK — ENTERPRISE SYSTEM LAUNCHER');
console.log('====================================================');
console.log('Starting Core Banking Backend Server on port 5000...');

const serverProcess = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true
});

serverProcess.on('error', (err) => {
  console.error('Failed to launch backend server:', err);
});

serverProcess.on('exit', (code) => {
  console.log(`Backend server process exited with code ${code}`);
});