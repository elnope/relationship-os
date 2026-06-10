#!/bin/bash

# =============================================================================
# Relationship OS - Database Setup Script
# =============================================================================
# This script helps you set up the database for local development
# 
# Usage:
#   ./scripts/setup-db.sh
#
# Requirements:
#   - Supabase project created
#   - DATABASE_URL and DIRECT_URL in .env.local
# =============================================================================

set -e

echo "🔧 Relationship OS - Database Setup"
echo "===================================="
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found!"
    echo ""
    echo "Please create .env.local with your Supabase connection strings:"
    echo "  DATABASE_URL=..."
    echo "  DIRECT_URL=..."
    echo ""
    echo "See .env.example for reference."
    exit 1
fi

# Load environment variables
source .env.local

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is not set in .env.local"
    echo ""
    echo "Please add your Supabase connection string to .env.local"
    exit 1
fi

echo "✅ Environment variables loaded"
echo ""

# Run Prisma generate
echo "📦 Generating Prisma Client..."
npx prisma generate
echo ""

# Push schema to database
echo "🗄️  Pushing schema to database..."
npx prisma db push
echo ""

# Ask about seeding
echo ""
read -p "Do you want to seed the database with sample data? (y/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    npm run db:seed
else
    echo "⏭️  Skipping seed"
fi

echo ""
echo "===================================="
echo "✅ Database setup complete!"
echo ""
echo "Next steps:"
echo "  1. Run 'npm run dev' to start the development server"
echo "  2. Open http://localhost:3000"
echo ""
