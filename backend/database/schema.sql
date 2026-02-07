-- Users table (admin authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    long_description TEXT,
    image_url VARCHAR(500),
    demo_url VARCHAR(500),
    github_url VARCHAR(500),
    technologies TEXT[], -- PostgreSQL array type
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('frontend', 'backend', 'tools', 'other')),
    level INTEGER CHECK (level BETWEEN 1 AND 5),
    icon_url VARCHAR(500),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- About content
CREATE TABLE about_content (
    id SERIAL PRIMARY KEY,
    bio TEXT,
    image_url VARCHAR(500),
    highlights TEXT[], -- Array of highlight strings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Work philosophy
CREATE TABLE work_philosophy (
    id SERIAL PRIMARY KEY,
    statement TEXT,
    approach TEXT,
    values TEXT[], -- Array of value strings
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Experience entries
CREATE TABLE experiences (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    period VARCHAR(100),
    description TEXT,
    achievements TEXT[], -- Array of achievement strings
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hero content
CREATE TABLE hero_content (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    subtitle VARCHAR(255),
    description TEXT,
    cta_primary_text VARCHAR(100),
    cta_primary_link VARCHAR(500),
    cta_secondary_text VARCHAR(100),
    cta_secondary_link VARCHAR(500),
    background_image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio settings (site-wide editable settings)
CREATE TABLE portfolio_settings (
    id SERIAL PRIMARY KEY,
    site_title VARCHAR(255) NOT NULL DEFAULT 'Portfolio',
    main_photo_url VARCHAR(500),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure only one row exists for settings
CREATE UNIQUE INDEX idx_portfolio_settings_singleton ON portfolio_settings ((id IS NOT NULL));

-- Indexes for performance
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_order ON projects(display_order);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_order ON skills(display_order);
CREATE INDEX idx_experiences_order ON experiences(display_order);

-- Insert default admin user (password: admin123)
-- Password hash generated with bcrypt
INSERT INTO users (username, email, password_hash) 
VALUES ('admin', 'admin@portfolio.local', '$2b$10$YourBcryptHashHere');

-- Insert default portfolio settings
INSERT INTO portfolio_settings (site_title, meta_description) 
VALUES ('Portfolio - Desarrollador Full Stack', 'Portfolio profesional de un desarrollador Full Stack especializado en Angular y tecnologías modernas');
