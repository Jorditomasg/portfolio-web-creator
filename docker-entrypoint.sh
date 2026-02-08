#!/bin/sh
set -e

# Sync backend volume (updates code from image to volume)
echo "🔄 Syncing backend source code from image..."
rsync -a --info=progress2 --exclude='.env' /app/backup/backend/ /app/backend/

# Sync frontend volume
echo "🔄 Syncing frontend source code from image..."
rsync -a --info=progress2 /app/backup/frontend/ /app/frontend/

# Map POSTGRES_ vars to DATABASE_ vars (so user only needs one set in docker-compose)
export DATABASE_HOST=${DATABASE_HOST:-db}
export DATABASE_PORT=${DATABASE_PORT:-5432}
export DATABASE_USER=${DATABASE_USER:-${POSTGRES_USER:-portfolio_user}}
export DATABASE_PASSWORD=${DATABASE_PASSWORD:-${POSTGRES_PASSWORD:-admin123}}
export DATABASE_NAME=${DATABASE_NAME:-${POSTGRES_DB:-portfolio_db}}

# Generate .env file from environment variables for backend (and Seed)
cat > /app/backend/.env << EOF
DATABASE_HOST=${DATABASE_HOST}
DATABASE_PORT=${DATABASE_PORT}
DATABASE_USER=${DATABASE_USER}
DATABASE_PASSWORD=${DATABASE_PASSWORD}
DATABASE_NAME=${DATABASE_NAME}
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
