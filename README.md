# Portfolio Creator

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
- **Specialties Management**: Customizable specialty cards
- **About & Hero Editor**: Edit bio, highlights, and hero section
- **Settings**: 
  - Site title and meta description
  - Social links (LinkedIn, GitHub, Email)
  - Favicon selection (6 preset icons)
  - Accent color customization
  - Toggle admin link in navigation

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/portfolio-creator.git
cd portfolio-creator
```

2. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with secure values:
```env
POSTGRES_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key_here
ADMIN_PASSWORD=your_admin_password
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

> ⚠️ **Security**: Generate a secure JWT secret with `openssl rand -hex 32`

3. **Start the application**
```bash
docker-compose up --build
```

4. **Access the application**
- Frontend: http://localhost:4200
- API: http://localhost:3000
- Admin Panel: http://localhost:4200/admin/login

### Default Admin Credentials
- Username: `admin` (or `ADMIN_USERNAME` from .env)
- Password: `admin123` (or `ADMIN_PASSWORD` from .env)

## 📁 Project Structure

```
portfolio-creator/
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── auth/              # JWT authentication
│   │   ├── database/          # Database connection & seeding
│   │   ├── entities/          # TypeORM entities
│   │   ├── projects/          # Projects CRUD
│   │   ├── skills/            # Skills CRUD
│   │   ├── specialties/       # Specialties CRUD
│   │   ├── settings/          # Site settings
│   │   ├── hero/              # Hero section
│   │   └── about/             # About section
│   └── Dockerfile
├── frontend/                   # Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/          # Services, guards, models
│   │   │   ├── pages/         # Public pages
│   │   │   ├── admin/         # Admin panel components
│   │   │   └── shared/        # Shared components
│   │   └── styles.css         # Global styles
│   └── Dockerfile
├── nginx/                      # Reverse proxy config
├── docker-compose.yml          # Container orchestration
├── .env.example               # Environment template
└── .gitignore                 # Git ignore rules
```

## 🔧 Configuration

### Environment Variables

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

## 🛠️ Development

### Running Locally (without Docker)

**Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

### Rebuilding After Changes

When changing backend DTOs or entities:
```bash
docker-compose down
docker-compose build --no-cache backend
docker-compose up
```

### API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/projects` | List all projects | No |
| POST | `/api/projects` | Create project | Yes |
| PUT | `/api/projects/:id` | Update project | Yes |
| DELETE | `/api/projects/:id` | Delete project | Yes |
| GET | `/api/skills` | List all skills | No |
| GET | `/api/specialties` | List specialties | No |
| GET | `/api/settings` | Get site settings | No |
| PUT | `/api/settings` | Update settings | Yes |
| POST | `/api/auth/login` | Authenticate | No |

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

Icons are automatically loaded from [DevIcon](https://devicon.dev/). The system matches technology names to icons.

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

Made with ❤️ using Angular & NestJS
