#!/bin/sh
set -e

# Generate .env file from environment variables
cat > /app/backend/.env << EOF
DATABASE_URL=${DATABASE_URL:-postgresql://portfolio_user:portfolio_pass@db:5432/portfolio_db}
JWT_SECRET=${JWT_SECRET:-demo_jwt_secret_change_in_production}
NODE_ENV=${NODE_ENV:-production}
ADMIN_USERNAME=${ADMIN_USERNAME:-admin}
ADMIN_EMAIL=${ADMIN_EMAIL:-admin@demo.com}
ADMIN_PASSWORD=${ADMIN_PASSWORD:-demo123}
EOF

echo "✅ Generated .env file with environment variables"

# Execute the main command
exec "$@"
