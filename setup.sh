#!/bin/bash
set -e

echo "==> Installing dependencies..."
npm install

if [ ! -f .env ]; then
	cp .env.example .env
	echo "==> Created .env from .env.example — fill in your Firebase credentials before running the dev server."
else
	echo "==> .env already exists, skipping copy."
fi

if [ ! -f .firebaserc ]; then
	cp .firebaserc.example .firebaserc
	echo "==> Created .firebaserc from .firebaserc.example — update the project ID before deploying."
else
	echo "==> .firebaserc already exists, skipping copy."
fi

if ! command -v firebase &> /dev/null; then
	echo "==> WARNING: Firebase CLI not found. Install it with: npm install -g firebase-tools"
	echo "    Then log in with: firebase login"
else
	echo "==> Firebase CLI found: $(firebase --version)"
	if ! firebase projects:list &> /dev/null 2>&1; then
		echo "==> Not logged in to Firebase. Run: firebase login"
	fi
fi

echo ""
echo "Setup complete. Next steps:"
echo "  1. Fill in your Firebase credentials in .env"
echo "  2. Update .firebaserc with your Firebase project ID"
echo "  3. Run ./rundev.sh to start the dev server"
