import * as fs from 'fs';
import * as path from 'path';

// Start every run with no screenshots so compose.mjs never pairs a fresh capture with a stale one.
export default function globalSetup() {
  fs.rmSync(path.join(__dirname, 'report', 'shots'), { recursive: true, force: true });
}
