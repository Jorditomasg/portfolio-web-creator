# Portfolio Web Creator - Quick Deploy 🚀

Deploy your own portfolio website in 3 steps!

## Quick Start

### 1. Create project folder
```bash
mkdir portfolio && cd portfolio
```

### 2. Download deployment files
```bash
curl -O https://raw.githubusercontent.com/Jorditomasg/portfolio-web-creator/main/deploy/docker-compose.yml
curl -O https://raw.githubusercontent.com/Jorditomasg/portfolio-web-creator/main/deploy/.env.example
mv .env.example .env
```

### 3. Configure and run
```bash
# Edit .env with your passwords
nano .env

# Start!
docker-compose up -d
```

**That's it!** 🎉

- Website: http://localhost
- Admin: http://localhost/admin/login
- Credentials: admin / admin123

---

## Configuration

Edit `.env` before starting:

| Variable | Required | Description |
|----------|----------|-------------|
| `POSTGRES_PASSWORD` | ✅ | Database password |
| `JWT_SECRET` | ✅ | Auth secret (`openssl rand -hex 32`) |
| `ADMIN_PASSWORD` | | Admin login password |
| `PORT` | | Exposed port (default: 80) |

---

## Commands

```bash
docker-compose up -d     # Start
docker-compose down      # Stop
docker-compose logs -f   # View logs
docker-compose pull      # Update
```

---

Made with ❤️ using Angular & NestJS
