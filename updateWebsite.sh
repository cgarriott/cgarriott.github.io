#!/bin/sh
# Commit and push site changes to GitHub.
# Pushing to main triggers the GitHub Actions workflow that builds the
# Hugo site and deploys it to GitHub Pages.
#
# Usage: ./updateWebsite.sh "commit message"

set -e

cd "$(dirname "$0")"

commit_message="$1"
if [ -z "$commit_message" ]; then
  commit_message="Update site"
fi

git add -A
git commit -m "$commit_message"
git push origin main

echo "Pushed to main. GitHub Actions will build and deploy to GitHub Pages."
