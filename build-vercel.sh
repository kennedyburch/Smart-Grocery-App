#!/bin/bash
# Vercel build script

echo "Installing dependencies..."
npm ci

echo "Building frontend..."
cd packages/frontend
npm run build

echo "Build complete!"
