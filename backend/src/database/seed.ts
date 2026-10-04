import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { dataSourceOptions } from './data-source.options';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { AboutContent } from '../entities/about-content.entity';
import { Experience } from '../entities/experience.entity';
import { HeroContent } from '../entities/hero-content.entity';
import { PortfolioSettings } from '../entities/portfolio-settings.entity';
import { Specialty } from '../entities/specialty.entity';
import { Category } from '../entities/category.entity';
import { Technology } from '../entities/technology.entity';


export async function seedDatabase(dataSource: DataSource): Promise<void> {

  // Create default admin user
  const userRepo = dataSource.getRepository(User);
  const existingUser = await userRepo.findOne({ where: { username: process.env.ADMIN_USERNAME || 'admin' } });

  // Sample content only on a brand-new install, never because a table was emptied on purpose.
  const firstInstall = !existingUser;

  if (!existingUser) {
    const adminUser = new User();
    adminUser.username = process.env.ADMIN_USERNAME || 'admin';
    adminUser.email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    adminUser.password_hash = await bcrypt.hash(password, 10);
    await userRepo.save(adminUser);
    console.log('✅ Admin user created');
  }

  // Create default settings
  const settingsRepo = dataSource.getRepository(PortfolioSettings);
  const existingSettings = await settingsRepo.find();

  if (existingSettings.length === 0) {
    const settings = new PortfolioSettings();
    settings.site_title = 'My Portfolio';
    settings.meta_description = 'Professional portfolio built with Angular and NestJS';
    settings.accent_color = '#F5A623';
    settings.favicon_type = 'terminal';
    settings.show_admin_link = true;
    await settingsRepo.save(settings);
    console.log('✅ Default settings created');
  }

  // Create default hero content
  const heroRepo = dataSource.getRepository(HeroContent);
  const existingHero = await heroRepo.find();

  if (existingHero.length === 0) {
    const hero = new HeroContent();
    hero.title = 'Hello, I am';
    hero.title_highlight = 'Your Name';
    hero.subtitle = 'Full Stack Developer | Angular Specialist';
    hero.description = 'Specialist in modern web development with Angular, NestJS and SQL/NoSQL databases. Passionate about creating scalable applications and exceptional user experiences.';
    await heroRepo.save(hero);
    console.log('✅ Default hero content created');
  }

  // Create default about content
  const aboutRepo = dataSource.getRepository(AboutContent);
  const existingAbout = await aboutRepo.find();

  if (existingAbout.length === 0) {
    const about = new AboutContent();
    about.bio = 'Passionate Full Stack Developer with extensive experience in Angular and the JavaScript/TypeScript ecosystem. I specialize in creating scalable web applications, reusable components, and robust frontend architectures. Expert in RxJS, NgRx, and Angular best practices.';
    about.highlights = ['5+ years of experience', 'Angular and TypeScript specialist', 'Node.js and NestJS backend'];
    await aboutRepo.save(about);
    console.log('✅ Default about content created');
  }

  // Create Categories
  const categoryRepo = dataSource.getRepository(Category);
  const existingCategories = await categoryRepo.find();
  
  const categoryMap: Record<string, Category> = {};
  
  if (firstInstall && existingCategories.length === 0) {
    const categories = [
      { 
        name: 'frontend', 
        long_title: 'Frontend Development',
        short_title: 'Frontend',
        description: 'Creating dynamic and responsive user experiences.',
        icon: 'frontend',
        color: '#3B82F6', 
        display_order: 1 
      },
      { 
        name: 'backend', 
        long_title: 'Backend Development',
        short_title: 'Backend',
        description: 'Robust server architecture, APIs and databases.',
        icon: 'backend',
        color: '#10B981', 
        display_order: 2 
      },
      { 
        name: 'tools', 
        long_title: 'Tools & DevOps',
        short_title: 'Tools',
        description: 'Workflow optimization and continuous deployment.',
        icon: 'devops',
        color: '#F59E0B', 
        display_order: 3 
      },
      { 
        name: 'database', 
        long_title: 'Database',
        short_title: 'DB',
        description: 'Data schema design and optimization.',
        icon: 'database',
        color: '#8B5CF6', 
        display_order: 4 
      },
      { 
        name: 'mobile', 
        long_title: 'Mobile Development',
        short_title: 'Mobile',
        description: 'Native and hybrid apps for iOS and Android.',
        icon: 'mobile',
        color: '#EC4899', 
        display_order: 5 
      },
    ];
    
    for (const cat of categories) {
      const saved = await categoryRepo.save(cat);
      categoryMap[cat.name.toLowerCase()] = saved;
    }
    console.log('✅ Categories created');
  } else {
    for (const cat of existingCategories) {
      categoryMap[cat.name.toLowerCase()] = cat;
    }
  }

  // Create sample technologies (Merged Skills & Technologies)
  const techRepo = dataSource.getRepository(Technology);
  const existingTechs = await techRepo.find();
  
  let savedTechs: Technology[] = [];

  if (firstInstall && existingTechs.length === 0) {
    const technologies = [
      // Frontend (Show in About = true)
      { 
        name: 'Angular', 
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg',
        show_in_about: true,
        category: 'frontend',
        category_entity: categoryMap['frontend'],
        level: 5,
        display_order: 1
      },
      { 
        name: 'React', 
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
        show_in_about: true,
        category: 'frontend',
        category_entity: categoryMap['frontend'],
        level: 4,
        display_order: 2
      },
      { 
        name: 'TypeScript', 
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
        show_in_about: true,
        category: 'frontend',
        category_entity: categoryMap['frontend'],
        level: 5,
        display_order: 3
      },
      { 
        name: 'Tailwind CSS', 
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
        show_in_about: true,
        category: 'frontend',
        category_entity: categoryMap['frontend'],
        level: 4,
        display_order: 4
      },
      // Backend (Show in About = true)
      { 
        name: 'Node.js', 
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
        show_in_about: true,
        category: 'backend',
        category_entity: categoryMap['backend'],
        level: 4,
        display_order: 5
      },
      { 
        name: 'NestJS', 
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg',
        show_in_about: true,
        category: 'backend',
        category_entity: categoryMap['backend'],
        level: 4,
        display_order: 6
      },
      { 
        name: 'PostgreSQL', 
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
        show_in_about: true,
        category: 'backend',
        category_entity: categoryMap['backend'],
        level: 4,
        display_order: 7
      },
      // Tools (Show in About = true)
      { 
        name: 'Docker', 
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
        show_in_about: true,
        category: 'tools',
        category_entity: categoryMap['tools'],
        level: 4,
        display_order: 8
      },
      { 
        name: 'Git', 
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
        show_in_about: true,
        category: 'tools',
        category_entity: categoryMap['tools'],
        level: 5,
        display_order: 9
      },
      // Other technologies (maybe not shown in about, but used in projects)
      { 
        name: 'MongoDB', 
        icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
        show_in_about: false,
        category: 'backend',
        category_entity: categoryMap['backend'],
        level: 3,
        display_order: 10
      },
    ];
    savedTechs = await techRepo.save(technologies as any[]);
    console.log('✅ Sample technologies (with skills merged) created');

  } else {
    savedTechs = existingTechs;
  }

  // Create sample projects (Linked to Technologies)
  const projectRepo = dataSource.getRepository(Project);
  const existingProjects = await projectRepo.find();
  
  if (firstInstall && existingProjects.length === 0) {
    const getTechs = (names: string[]) => savedTechs.filter(t => names.includes(t.name));

    const projects = [
      {
        title: 'Portfolio Web Creator',
        description: 'Web application to create and manage professional portfolios.',
        long_description: 'Complete platform built with Angular and NestJS that allows creating dynamic portfolios. Includes admin panel, multilingual content management, and automated Docker deployment.',
        technologies: ['Angular', 'NestJS', 'TypeScript', 'PostgreSQL', 'Docker'],
        technology_entities: getTechs(['Angular', 'NestJS', 'TypeScript', 'PostgreSQL', 'Docker']),
        featured: true,
        display_order: 1,
      },
      {
        title: 'Metrics Dashboard',
        description: 'Interactive dashboard for real-time metrics visualization.',
        long_description: 'Angular application with dynamic charts using NgRx for state management. Includes websockets for real-time updates and data export.',
        technologies: ['Angular', 'TypeScript', 'NestJS', 'PostgreSQL'],
        technology_entities: getTechs(['Angular', 'TypeScript', 'NestJS', 'PostgreSQL']),
        featured: true,
        display_order: 2,
      },
      {
        title: 'NestJS REST API',
        description: 'Robust API with JWT authentication and Swagger documentation.',
        long_description: 'Backend developed with NestJS following SOLID principles. Implements JWT authentication, DTO validation, and automatic Swagger documentation.',
        technologies: ['NestJS', 'TypeScript', 'PostgreSQL', 'Docker'],
        technology_entities: getTechs(['NestJS', 'TypeScript', 'PostgreSQL', 'Docker']),
        featured: false,
        display_order: 3,
      },
    ];
    await projectRepo.save(projects);
    console.log('✅ Sample projects created');
  }

  // Create sample specialties
  const specialtyRepo = dataSource.getRepository(Specialty);
  const existingSpecialties = await specialtyRepo.find();
  
  if (firstInstall && existingSpecialties.length === 0) {
    const specialties = [
      {
        title: 'Frontend Development',
        description: 'Creating modern and responsive user interfaces with the latest web technologies.',
        icon_type: 'frontend',
        color: 'primary',
        technologies: ['Angular', 'React', 'TypeScript', 'Tailwind CSS'],
        display_order: 1,
      },
      {
        title: 'Backend Development',
        description: 'Building robust and scalable RESTful APIs with optimized databases.',
        icon_type: 'backend',
        color: 'green',
        technologies: ['Node.js', 'NestJS', 'PostgreSQL', 'MongoDB'],
        display_order: 2,
      },
      {
        title: 'DevOps & Cloud',
        description: 'Deployment automation, containerization and cloud infrastructure management.',
        icon_type: 'devops',
        color: 'blue',
        technologies: ['Docker', 'Git', 'AWS', 'CI/CD'],
        display_order: 3,
      },
    ];
    await specialtyRepo.save(specialties);
    console.log('✅ Sample specialties created');
  }

  // Create sample experiences
  const experienceRepo = dataSource.getRepository(Experience);
  const existingExperiences = await experienceRepo.find();
  
  if (firstInstall && existingExperiences.length === 0) {
    const experiences = [
      {
        title: 'Senior Full Stack Developer',
        company: 'Tech Company',
        period: 'Ene 2022 - Presente',
        description: 'Developing scalable web applications with React and Node.js.',
        achievements: [
          'Led a team of 5 developers',
          'Implemented microservices architecture',
          'Reduced deployment time by 60%'
        ],
        is_current: true,
        display_order: 1,
      },
      {
        title: 'Full Stack Developer',
        company: 'Startup Tech',
        period: 'Mar 2019 - Dic 2021',
        description: 'Development of SPA applications and RESTful APIs.',
        achievements: [
          'MVP development in record time',
          'Performance optimization +40%',
          'Automated testing implementation'
        ],
        is_current: false,
        display_order: 2,
      },
    ];
    await experienceRepo.save(experiences);
    console.log('✅ Sample experiences created');
  }

  console.log('🎉 Database seeding completed!');
}

// Auto-run if executed directly
if (require.main === module) {
  const dataSource = new DataSource(dataSourceOptions());

  dataSource.initialize()
    .then(async () => {
      console.log('🌱 Starting seed...');
      await seedDatabase(dataSource);
      console.log('✅ Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}
