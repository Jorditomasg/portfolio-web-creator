#!/bin/sh
set -e

# Sync backend volume (updates code from image to volume)
echo "🔄 Syncing backend source code from image..."
rsync -a --info=progress2 --exclude='.env' /app/backup/backend/ /app/backend/

# Sync frontend volume
echo "🔄 Syncing frontend source code from image..."
rsync -a --info=progress2 /app/backup/frontend/ /app/frontend/

# Generate .env file from environment variables for backend
cat > /app/backend/.env << EOF
DATABASE_URL=${DATABASE_URL:-postgresql://portfolio_user:portfolio_pass@db:5432/portfolio_db}
JWT_SECRET=${JWT_SECRET:-demo_jwt_secret_change_in_production}
NODE_ENV=${NODE_ENV:-production}
ADMIN_USERNAME=${ADMIN_USERNAME:-admin}
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@demo.com}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-demo123}
EOF

echo "✅ Environment configured"

# Run database seed
if [ -f "/app/backend/dist/database/seed.js" ]; then
    echo "🌱 Running database seed..."
    (cd /app/backend && node dist/database/seed.js) || echo "⚠️ Seed failed but continuing..."
else
    echo "⚠️ Seed script not found at /app/backend/dist/database/seed.js"
fi

# Execute the main command
exec "$@"
