// scripts/add-sdk-script.js
const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

// Ensure sections exist
pkg.scripts = pkg.scripts || {};
pkg.devDependencies = pkg.devDependencies || {};

// Add our SDK generation script
pkg.scripts.generateSdk = 'openapi-typescript openapi.json --output src/lib/sdk/openapi.ts';

// Add the devDependencies
Object.assign(pkg.devDependencies, {
  "openapi-typescript": "^10.0.0",
  "ts-node": "^10.0.0",
  "commander": "^9.0.0",
  "node-fetch": "^2.6.7"
});

// Write back
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
console.log('✅ package.json updated with generateSdk script and devDependencies');
