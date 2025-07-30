#!/bin/bash

# This script will add a new tag on the main branch
# This will trigger a release action (deploy to prod) using GitHub Actions

git checkout main || { echo "Error: Failed to switch to the 'main' branch."; exit 1; }
git pull || { echo "Error: Failed to pull the latest changes from 'main'."; exit 1; }

if [[ -n $(git status --porcelain) ]]; then
  echo "Error: There are uncommitted changes. Please commit or stash them before tagging."
  exit 1
fi

VERSION=$(cat package.json | jq -r '.version')
VERSION=${VERSION//\"/}
echo "Releasing a new version - $VERSION"

git tag $VERSION || { echo "Error: Failed to create tag $VERSION."; exit 1; }
git push origin --tags || { echo "Error: Failed to push tags to origin."; exit 1; }

echo "Tag $VERSION has been successfully created and pushed."