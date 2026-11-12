import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const viteBin = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js');

if (!existsSync(viteBin)) {
  console.error('Frontend dependencies are missing. From the repo root, run: npm install');
  process.exit(1);
}

function start(name, command, args, cwd) {
  const child = spawn(command, args, {
    cwd,
    stdio: ['inherit', 'pipe', 'pipe'],
  });
  const pending = { stdout: '', stderr: '' };

  const write = (stream, key, chunk) => {
    pending[key] += chunk.toString().replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = pending[key].split('\n');
    pending[key] = lines.pop() ?? '';

    for (const line of lines) {
      if (line.trim() !== '') {
        stream.write(`[${name}] ${line}\n`);
      }
    }
  };

  child.stdout.on('data', (chunk) => write(process.stdout, 'stdout', chunk));
  child.stderr.on('data', (chunk) => write(process.stderr, 'stderr', chunk));
  child.on('error', (error) => {
    console.error(`[${name}] ${error.message}`);
    stop(1);
  });

  return child;
}

const children = [
  start('site', process.execPath, [viteBin], root),
  start(
    'api',
    'php',
    ['artisan', 'serve', '--host=127.0.0.1', '--port=8000'],
    path.join(root, 'backend'),
  ),
];

let stopping = false;

function stop(code = 0) {
  if (stopping) {
    return;
  }
  stopping = true;

  for (const child of children) {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill('SIGTERM');
    }
  }

  setTimeout(() => process.exit(code), 300);
}

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));

for (const child of children) {
  child.on('exit', (code, signal) => {
    if (!stopping && signal !== 'SIGTERM') {
      stop(code ?? 1);
    }
  });
}
