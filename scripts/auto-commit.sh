#!/bin/bash

# Auto-commit script for Cursor agents
# This script will automatically commit and push changes to GitHub
# Vercel will automatically deploy from GitHub

# Get the current timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Check if there are any changes to commit
if [[ -n $(git status --porcelain) ]]; then
    echo "🔄 Changes detected, committing..."
    
    # Add all changes
    git add .
    
    # Create commit message with timestamp
    COMMIT_MESSAGE="Auto-commit: Changes made at $TIMESTAMP"
    
    # Commit changes
    git commit -m "$COMMIT_MESSAGE"
    
    # Push to GitHub
    echo "🚀 Pushing to GitHub..."
    git push origin main
    
    echo "✅ Successfully committed and pushed changes!"
    echo "🌐 Vercel will automatically deploy from GitHub"
    echo "📱 Check deployment status at: https://vercel.com/dashboard"
else
    echo "ℹ️ No changes to commit"
fi 