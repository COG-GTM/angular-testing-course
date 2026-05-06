import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const SOURCE_DIR = './screenshots/source';
const REACT_DIR = './screenshots/react';
const DIFF_DIR = './screenshots/diff';
const THRESHOLD = 0.02; // 2% mismatch threshold

interface ComparisonResult {
  name: string;
  mismatchPercent: number;
  passed: boolean;
  heightDiff?: number;
  error?: string;
}

function compareImages(sourcePath: string, reactPath: string, diffPath: string): ComparisonResult {
  const name = path.basename(sourcePath);

  try {
    const sourceImg = PNG.sync.read(fs.readFileSync(sourcePath));
    const reactImg = PNG.sync.read(fs.readFileSync(reactPath));

    const width = Math.max(sourceImg.width, reactImg.width);
    const height = Math.min(sourceImg.height, reactImg.height);
    const heightDiff = Math.abs(sourceImg.height - reactImg.height);

    // Create images sized to the comparison region
    const paddedSource = new PNG({ width, height });
    const paddedReact = new PNG({ width, height });

    // Fill with white background
    paddedSource.data.fill(255);
    paddedReact.data.fill(255);

    // Copy image data (clipped to comparison height)
    PNG.bitblt(sourceImg, paddedSource, 0, 0, Math.min(sourceImg.width, width), height, 0, 0);
    PNG.bitblt(reactImg, paddedReact, 0, 0, Math.min(reactImg.width, width), height, 0, 0);

    const diff = new PNG({ width, height });
    const numDiffPixels = pixelmatch(
      paddedSource.data,
      paddedReact.data,
      diff.data,
      width,
      height,
      { threshold: 0.5, includeAA: false }
    );

    fs.writeFileSync(diffPath, PNG.sync.write(diff));

    const totalPixels = width * height;
    const mismatchPercent = (numDiffPixels / totalPixels) * 100;

    // Height difference tolerance: allow up to 2% height variance
    const maxHeight = Math.max(sourceImg.height, reactImg.height);
    const heightDiffPercent = (heightDiff / maxHeight) * 100;

    return {
      name,
      mismatchPercent: Math.round(mismatchPercent * 100) / 100,
      passed: mismatchPercent < THRESHOLD * 100 && heightDiffPercent < 2,
      heightDiff,
    };
  } catch (err) {
    return {
      name,
      mismatchPercent: 100,
      passed: false,
      error: String(err),
    };
  }
}

function main() {
  if (!fs.existsSync(DIFF_DIR)) {
    fs.mkdirSync(DIFF_DIR, { recursive: true });
  }

  const sourceFiles = fs.readdirSync(SOURCE_DIR).filter((f) => f.endsWith('.png'));
  const results: ComparisonResult[] = [];

  for (const file of sourceFiles) {
    const sourcePath = path.join(SOURCE_DIR, file);
    const reactPath = path.join(REACT_DIR, file);
    const diffPath = path.join(DIFF_DIR, file);

    if (!fs.existsSync(reactPath)) {
      results.push({
        name: file,
        mismatchPercent: 100,
        passed: false,
        error: 'React screenshot not found',
      });
      continue;
    }

    results.push(compareImages(sourcePath, reactPath, diffPath));
  }

  console.log('\n=== Visual Regression Test Results ===\n');
  let passCount = 0;
  let failCount = 0;

  for (const result of results) {
    const status = result.passed ? 'PASS' : 'FAIL';
    const icon = result.passed ? '✓' : '✗';
    const heightInfo = result.heightDiff !== undefined && result.heightDiff > 0 ? ` (height diff: ${result.heightDiff}px)` : '';
    console.log(`${icon} [${status}] ${result.name}: ${result.mismatchPercent}% mismatch${heightInfo}${result.error ? ` (${result.error})` : ''}`);
    if (result.passed) passCount++;
    else failCount++;
  }

  console.log(`\nTotal: ${results.length} | Passed: ${passCount} | Failed: ${failCount}`);
  console.log(`Threshold: <${THRESHOLD * 100}% pixel difference, <2% height variance\n`);

  if (failCount > 0) {
    process.exit(1);
  }
}

main();
