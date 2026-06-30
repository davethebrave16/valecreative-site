#!/bin/bash
set -e

if [ ! -f .env ]; then
	echo "ERROR: .env not found. Run ./setup.sh first."
	exit 1
fi

PROJECT_ID=$(grep -E '^PUBLIC_FIREBASE_PROJECT_ID=' .env | cut -d= -f2)
if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "your_project_id" ]; then
	echo "ERROR: PUBLIC_FIREBASE_PROJECT_ID is not set in .env."
	echo "Fill in your Firebase credentials before starting the dev server."
	exit 1
fi

if [ ! -d node_modules ]; then
	echo "==> node_modules not found, running npm install..."
	npm install
fi

echo "==> Starting Astro dev server..."
npm run dev
