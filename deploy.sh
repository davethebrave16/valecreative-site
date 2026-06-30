#!/bin/bash
set -e

if [ ! -f .env ]; then
	echo "ERROR: .env not found. Run ./setup.sh first."
	exit 1
fi

PROJECT_ID=$(grep -E '^PUBLIC_FIREBASE_PROJECT_ID=' .env | cut -d= -f2)
if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "your_project_id" ]; then
	echo "ERROR: PUBLIC_FIREBASE_PROJECT_ID is not set in .env."
	exit 1
fi

echo "==> Building site..."
npm run build

echo ""
echo "Build complete. Summary:"
echo "  Target: Firebase Hosting (project from .firebaserc)"
echo "  Output: dist/"
echo ""
read -p "Deploy to Firebase Hosting? [y/N] " CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
	echo "Deploy cancelled."
	exit 0
fi

echo "==> Deploying..."
firebase deploy --only hosting
echo ""
echo "Deploy complete."
