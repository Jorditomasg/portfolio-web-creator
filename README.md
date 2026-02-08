# Portfolio Web Creator

A modern, customizable portfolio website builder with **Angular** (frontend) and **NestJS** (backend). Features a complete admin panel, internationalization, and dynamic theming.

![Angular](https://img.shields.io/badge/Angular-19-DD0031?logo=angular)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

## ✨ Features

### Frontend
- **Angular 19** with zoneless change detection for optimal performance
- **Tailwind CSS** for modern, responsive styling
- **i18n System**: Built-in Spanish/English translation with browser detection
- **Dark Theme**: Premium dark mode design with smooth animations
- **Dynamic Theming**: Customizable accent colors and favicons

### Backend
- **NestJS** with TypeORM for robust API development
- **PostgreSQL** for reliable data storage
- **JWT Authentication** for secure admin access
- **RESTful API** with proper validation

### Admin Panel
- **Dashboard** with content overview
- **Projects Management**: Full CRUD with multilingual support
- **Skills Management**: Categorized by Frontend/Backend/Tools (1-5 level slider)
- **Technologies Management**: Centralized management of technology icons (auto-fetched from DevIcon or custom URL)
- **Specialties Management**: Customizable specialty cards with SVG icons
- **About & Hero Editor**: Edit bio, highlights, and hero section
- **Settings**: 
  - Site title and meta description
  - Social links (LinkedIn, GitHub, Email)
  - Favicon selection (6 preset icons)
  - Accent color customization
  - Toggle admin link in navigation

## 🚀 Installation

### Method 1: Clone Repository (Recommended for Development)

1. **Clone and navigate**
```bash
git clone https://github.com/Jorditomasg/portfolio-web-creator.git
cd portfolio-web-creator
```

2. **Configure environment** (optional, has defaults)
```bash
cp .env.example .env
# Edit .env if you want custom credentials
```

3. **Start with Docker Compose**
```bash
docker compose up -d
```

4. **Access the application**
- Frontend: http://localhost:4200
- Admin Panel: http://localhost:4200/admin/login
- Default login: `admin` / `admin123`

---

### Method 2: Docker Hub (Automated Deployment)

Perfect for quick deployment. The container will **automatically download and update** the source code into your local folders using the latest image.

1. **Create a directory**
```bash
mkdir portfolio && cd portfolio
```

2. **Create `docker-compose.yml`**

Copy and paste this content into a new `docker-compose.yml` file:

```yaml
services:
  db:
    image: postgres:16-alpine
    container_name: portfolio-db
    environment:
      POSTGRES_USER: portfolio_user
      POSTGRES_PASSWORD: portfolio_pass
      POSTGRES_DB: portfolio_db
    volumes:
      - postgres_data:/var/lib/postgresql/data

  app:
    image: jorditomasg/portfolio-web-creator:latest
    container_name: portfolio-app
    environment:
      # Database Configuration
      - POSTGRES_USER=portfolio_user
      - POSTGRES_PASSWORD=portfolio_pass
      - POSTGRES_DB=portfolio_db
      
      # App Configuration (No .env file needed for testing)
      - DATABASE_URL=postgresql://portfolio_user:portfolio_pass@db:5432/portfolio_db
      - JWT_SECRET=change_this_secret_in_production
      - NODE_ENV=production
      - ADMIN_USERNAME=admin
      - ADMIN_EMAIL=admin@example.com
      - ADMIN_PASSWORD=admin123
    volumes:
      - ./backend:/app/backend
      - ./frontend:/app/frontend
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "3000:3000"
      - "4200:4200"
    restart: unless-stopped

volumes:
  postgres_data:
```

3. **Start the application**
```bash
docker compose up -d
```
*The `backend` and `frontend` folders will be automatically created and populated with the latest code from the image.*

4. **Access your portfolio**
- Frontend: http://localhost:4200
- Admin Panel: http://localhost:4200/admin/login
- Login: `admin` / `admin123`

> ⚠️ **Security**: Change `JWT_SECRET` and `ADMIN_PASSWORD` for production!

---

## 🔧 Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `POSTGRES_USER` | Database username | `portfolio_user` |
| `POSTGRES_PASSWORD` | Database password | Required |
| `POSTGRES_DB` | Database name | `portfolio_db` |
| `JWT_SECRET` | JWT signing secret | Required |
| `NODE_ENV` | Environment mode | `development` |
| `ADMIN_USERNAME` | Initial admin username | `admin` |
| `ADMIN_EMAIL` | Initial admin email | `admin@example.com` |
| `ADMIN_PASSWORD` | Initial admin password | `admin123` |

### Settings (Admin Panel)

| Setting | Description |
|---------|-------------|
| **Site Title** | Displayed in browser tab and footer |
| **Main Photo URL** | Your profile photo |
| **Meta Description** | SEO description (max 160 chars) |
| **LinkedIn/GitHub/Email** | Optional social links |
| **Favicon Type** | terminal, code, rocket, star, briefcase, user |
| **Accent Color** | Primary color for buttons and highlights |
| **Show Admin Link** | Toggle "Admin" in navigation menu |
| **Contact System** | Toggle Form, Email sending, Database storage |
| **SMTP Config** | Host, Port, User, Pass for email notifications |

### Translation System

**Browser detection**: The app detects browser language and defaults to English for non-Spanish browsers. Users can toggle manually.

**Static translations** in `frontend/src/app/core/services/translation.service.ts`:
```typescript
const translations = {
  'nav.home': { es: 'Inicio', en: 'Home' },
  'nav.about': { es: 'Sobre mí', en: 'About' },
  // ...
};
```

**Database content** supports `_en` suffixed fields for bilingual content.

## 🔒 Security Best Practices

Before deploying to production:

1. **Change all default passwords** in `.env`
2. **Generate a secure JWT secret**: `openssl rand -hex 32`
3. **Never commit `.env`** to version control
4. **Use HTTPS** in production
5. **Disable admin link** in settings unless needed



## 🎨 Customization

### Favicon Options

| Type | Description |
|------|-------------|
| `terminal` | Terminal/CLI icon (default) |
| `code` | Code brackets `</>` |
| `rocket` | Rocket icon |
| `star` | Star icon |
| `briefcase` | Briefcase icon |
| `user` | User profile icon |

### Accent Colors

Default palette: Yellow (#F5A623), Green, Blue, Purple, Pink, Red

Or use the custom color picker in Settings.

### Technology Icons
 
Icons are managed centrally via the **Technologies** page in the Admin Panel. 
- **Auto-detection**: When adding a technology, the system attempts to auto-fetch the icon from [DevIcon](https://devicon.dev/).
- **Smart Tags**: In the Projects editor, typing a technology name (e.g., "Angular") will auto-suggest existing technologies and display their correctly associated icons.
- **Custom Icons**: You can manually provide any image URL for a technology if the auto-detection fails.

### Specialty Icons

| Type | Use Case |
|------|----------|
| `frontend` | UI/UX Development |
| `backend` | Server-side Development |
| `devops` | CI/CD & Cloud |
| `database` | Database Management |
| `mobile` | Mobile Development |
| `cloud` | Cloud Architecture |

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.


---

Made with ❤️ using Angular & NestJS
