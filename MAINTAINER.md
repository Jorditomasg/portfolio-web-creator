# Maintainer Guide - Docker Hub Deployment

## Building and Pushing the Unified Image

### Prerequisites
- Docker installed and logged in: `docker login`
- Access to `jorditomasg` Docker Hub account

### Build Commands

```bash
# Build the unified image (backend + frontend in one)
docker build -t jorditomasg/portfolio:latest -f Dockerfile .

# Optional: Tag with version
docker tag jorditomasg/portfolio:latest jorditomasg/portfolio:v1.0.0

# Push to Docker Hub
docker push jorditomasg/portfolio:latest
docker push jorditomasg/portfolio:v1.0.0  # If versioned
```

### Multi-Architecture Build (Optional)

For ARM and AMD64 support:

```bash
# Create buildx builder (first time only)
docker buildx create --name multiarch --use

# Build and push for multiple architectures
docker buildx build --platform linux/amd64,linux/arm64 \
  -t jorditomasg/portfolio:latest \
  -f Dockerfile \
  --push .
```

## Testing Locally

Before pushing to Docker Hub, test the image locally:

```bash
# Build locally
docker build -t portfolio-test:local -f Dockerfile .

# Create a test docker-compose.yml (see README Method 2)
# Then run:
docker compose up

# Access at http://localhost:4200
# Login: admin / demo123
```

## Image Architecture

The unified image contains:
- **Backend** (port 3000) - NestJS API running with Node.js
- **Frontend** (port 4200) - Angular app served with `serve` package
- Both processes run concurrently via shell command

Environment variables are converted to `.env` file automatically via `docker-entrypoint.sh`.

## Updating the Image

1. Make changes to backend or frontend
2. Rebuild the unified image: `docker build -t jorditomasg/portfolio:latest -f Dockerfile .`
3. Test locally
4. Push to Docker Hub: `docker push jorditomasg/portfolio:latest`
5. Users pull the new image with `docker compose pull && docker compose up -d`

## File Structure

```
Dockerfile       # Multi-stage build for unified image (no nginx)
docker-entrypoint.sh     # Generates .env from environment variables
MAINTAINER.md           # This file (not for end users)
README.md               # User-facing documentation with docker-compose.yml
```
