import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as allEntities from '../entities'; // Import all for datasource config
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { AboutContent } from '../entities/about-content.entity';
import { Experience } from '../entities/experience.entity';
import { HeroContent } from '../entities/hero-content.entity';
import { PortfolioSettings } from '../entities/portfolio-settings.entity';
import { Specialty } from '../entities/specialty.entity';
import { Category } from '../entities/category.entity';
import { Technology } from '../entities/technology.entity';
import { Contact } from '../entities/contact.entity';


export async function seedDatabase(dataSource: DataSource): Promise<void> {

  // Create default admin user
  const userRepo = dataSource.getRepository(User);
  const existingUser = await userRepo.findOne({ where: { username: process.env.ADMIN_USERNAME || 'admin' } });

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
    settings.site_title = 'Mi Portfolio';
    settings.meta_description = 'Portfolio profesional desarrollado con Angular y NestJS';
    settings.accent_color = '#F5A623';
    settings.favicon_type = 'terminal';
    settings.show_admin_link = true;
    settings.enable_contact_form = true;
    await settingsRepo.save(settings);
    console.log('✅ Default settings created');
  }

  // Create default hero content
  const heroRepo = dataSource.getRepository(HeroContent);
  const existingHero = await heroRepo.find();

  if (existingHero.length === 0) {
    const hero = new HeroContent();
    hero.title = 'Hola, soy';
    hero.title_highlight = 'Tu Nombre';
    hero.title_en = 'Hello, I am';
    hero.title_highlight_en = 'Your Name';
    hero.subtitle = 'Full Stack Developer | Especialista Angular';
    hero.subtitle_en = 'Full Stack Developer | Angular Specialist';
    hero.description = 'Especialista en desarrollo web moderno con Angular, NestJS y bases de datos SQL/NoSQL. Apasionado por crear aplicaciones escalables y experiencias de usuario excepcionales.';
    hero.description_en = 'Specialist in modern web development with Angular, NestJS and SQL/NoSQL databases. Passionate about creating scalable applications and exceptional user experiences.';
    await heroRepo.save(hero);
    console.log('✅ Default hero content created');
  }

  // Create default about content
  const aboutRepo = dataSource.getRepository(AboutContent);
  const existingAbout = await aboutRepo.find();

  if (existingAbout.length === 0) {
    const about = new AboutContent();
    about.bio = 'Desarrollador Full Stack apasionado con amplia experiencia en Angular y el ecosistema JavaScript/TypeScript. Me especializo en crear aplicaciones web escalables, componentes reutilizables y arquitecturas frontend robustas. Experto en RxJS, NgRx y buenas prácticas de Angular.';
    about.bio_en = 'Passionate Full Stack Developer with extensive experience in Angular and the JavaScript/TypeScript ecosystem. I specialize in creating scalable web applications, reusable components, and robust frontend architectures. Expert in RxJS, NgRx, and Angular best practices.';
    about.highlights = ['5+ años de experiencia', 'Especialista en Angular y TypeScript', 'Backend con Node.js y NestJS'];
    about.highlights_en = ['5+ years of experience', 'Angular and TypeScript specialist', 'Node.js and NestJS backend'];
    await aboutRepo.save(about);
    console.log('✅ Default about content created');
  }

  // Create Categories
  const categoryRepo = dataSource.getRepository(Category);
  const existingCategories = await categoryRepo.find();
  
  const categoryMap: Record<string, Category> = {};
  
  if (existingCategories.length === 0) {
    const categories = [
      { 
        name: 'frontend', 
        long_title: 'Desarrollo Frontend', 
        short_title: 'Frontend',
        description: 'Creación de experiencias de usuario dinámicas y responsivas.',
        long_title_en: 'Frontend Development',
        short_title_en: 'Frontend',
        description_en: 'Creating dynamic and responsive user experiences.',
        icon: 'frontend',
        color: '#3B82F6', 
        display_order: 1 
      },
      { 
        name: 'backend', 
        long_title: 'Desarrollo Backend', 
        short_title: 'Backend',
        description: 'Arquitectura de servidores, APIs y bases de datos robustas.',
        long_title_en: 'Backend Development',
        short_title_en: 'Backend',
        description_en: ' robust server architecture, APIs and databases.',
        icon: 'backend',
        color: '#10B981', 
        display_order: 2 
      },
      { 
        name: 'tools', 
        long_title: 'Herramientas & DevOps', 
        short_title: 'Tools',
        description: 'Optimización de flujos de trabajo y despliegue continuo.',
        long_title_en: 'Tools & DevOps',
        short_title_en: 'Tools',
        description_en: 'Workflow optimization and continuous deployment.',
        icon: 'devops',
        color: '#F59E0B', 
        display_order: 3 
      },
      { 
        name: 'database', 
        long_title: 'Base de Datos', 
        short_title: 'DB',
        description: 'Diseño y optimización de esquemas de datos.',
        long_title_en: 'Database',
        short_title_en: 'DB',
        description_en: 'Data schema design and optimization.',
        icon: 'database',
        color: '#8B5CF6', 
        display_order: 4 
      },
      { 
        name: 'mobile', 
        long_title: 'Desarrollo Móvil', 
        short_title: 'Mobile',
        description: 'Aplicaciones nativas e híbridas para iOS y Android.',
        long_title_en: 'Mobile Development',
        short_title_en: 'Mobile',
        description_en: 'Native and hybrid apps for iOS and Android.',
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

  if (existingTechs.length === 0) {
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
  
  if (existingProjects.length === 0) {
    const getTechs = (names: string[]) => savedTechs.filter(t => names.includes(t.name));

    const projects = [
      {
        title: 'Portfolio Web Creator',
        title_en: 'Portfolio Web Creator',
        description: 'Aplicacion web para crear y gestionar portfolios profesionales.',
        description_en: 'Web application to create and manage professional portfolios.',
        long_description: 'Plataforma completa desarrollada con Angular y NestJS que permite crear portfolios dinamicos. Incluye panel de administracion, gestion de contenido multilenguaje, y despliegue automatizado con Docker.',
        long_description_en: 'Complete platform built with Angular and NestJS that allows creating dynamic portfolios. Includes admin panel, multilingual content management, and automated Docker deployment.',
        technologies: ['Angular', 'NestJS', 'TypeScript', 'PostgreSQL', 'Docker'],
        technology_entities: getTechs(['Angular', 'NestJS', 'TypeScript', 'PostgreSQL', 'Docker']),
        featured: true,
        display_order: 1,
      },
      {
        title: 'Dashboard de Metricas',
        title_en: 'Metrics Dashboard',
        description: 'Dashboard interactivo para visualizacion de metricas en tiempo real.',
        description_en: 'Interactive dashboard for real-time metrics visualization.',
        long_description: 'Aplicacion Angular con graficos dinamicos usando NgRx para state management. Incluye websockets para actualizaciones en tiempo real y exportacion de datos.',
        long_description_en: 'Angular application with dynamic charts using NgRx for state management. Includes websockets for real-time updates and data export.',
        technologies: ['Angular', 'TypeScript', 'NestJS', 'PostgreSQL'],
        technology_entities: getTechs(['Angular', 'TypeScript', 'NestJS', 'PostgreSQL']),
        featured: true,
        display_order: 2,
      },
      {
        title: 'API REST con NestJS',
        title_en: 'NestJS REST API',
        description: 'API robusta con autenticacion JWT y documentacion Swagger.',
        description_en: 'Robust API with JWT authentication and Swagger documentation.',
        long_description: 'Backend desarrollado con NestJS siguiendo principios SOLID. Implementa autenticacion JWT, validacion de DTOs, y documentacion automatica con Swagger.',
        long_description_en: 'Backend developed with NestJS following SOLID principles. Implements JWT authentication, DTO validation, and automatic Swagger documentation.',
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
  
  if (existingSpecialties.length === 0) {
    const specialties = [
      {
        title: 'Desarrollo Frontend',
        title_en: 'Frontend Development',
        description: 'Creación de interfaces de usuario modernas y responsivas con las últimas tecnologías web.',
        description_en: 'Creating modern and responsive user interfaces with the latest web technologies.',
        icon_type: 'frontend',
        color: 'primary',
        technologies: ['Angular', 'React', 'TypeScript', 'Tailwind CSS'],
        display_order: 1,
      },
      {
        title: 'Desarrollo Backend',
        title_en: 'Backend Development',
        description: 'Arquitectura de APIs RESTful robustas y escalables con bases de datos optimizadas.',
        description_en: 'Building robust and scalable RESTful APIs with optimized databases.',
        icon_type: 'backend',
        color: 'green',
        technologies: ['Node.js', 'NestJS', 'PostgreSQL', 'MongoDB'],
        display_order: 2,
      },
      {
        title: 'DevOps & Cloud',
        title_en: 'DevOps & Cloud',
        description: 'Automatización de despliegues, contenedorización y gestión de infraestructura en la nube.',
        description_en: 'Deployment automation, containerization and cloud infrastructure management.',
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
  
  if (existingExperiences.length === 0) {
    const experiences = [
      {
        title: 'Senior Full Stack Developer',
        title_en: 'Senior Full Stack Developer',
        company: 'Tech Company',
        period: 'Ene 2022 - Presente',
        description: 'Desarrollo de aplicaciones web escalables con React y Node.js.',
        description_en: 'Developing scalable web applications with React and Node.js.',
        achievements: [
          'Liderazgo de equipo de 5 desarrolladores',
          'Implementacion de arquitectura de microservicios',
          'Reduccion del tiempo de deploy en 60%'
        ],
        achievements_en: [
          'Led a team of 5 developers',
          'Implemented microservices architecture',
          'Reduced deployment time by 60%'
        ],
        is_current: true,
        display_order: 1,
      },
      {
        title: 'Full Stack Developer',
        title_en: 'Full Stack Developer',
        company: 'Startup Tech',
        period: 'Mar 2019 - Dic 2021',
        description: 'Desarrollo de aplicaciones SPA y APIs RESTful.',
        description_en: 'Development of SPA applications and RESTful APIs.',
        achievements: [
          'Desarrollo de MVPs en tiempo record',
          'Optimizacion de rendimiento +40%',
          'Implementacion de testing automatizado'
        ],
        achievements_en: [
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

  // Create sample contact message
  const contactRepo = dataSource.getRepository(Contact);
  const existingContacts = await contactRepo.find();
  
  if (existingContacts.length === 0) {
    const contacts = [
      {
        name: 'Juan García',
        email: 'juan.garcia@ejemplo.com',
        subject: 'Consulta sobre proyecto Angular',
        message: '¡Hola! He visto tu portfolio y me gustaría hablar contigo sobre un proyecto que tenemos en mente. Necesitamos desarrollar una aplicación web con Angular y NestJS. ¿Podrías contactarme para discutir los detalles?',
        read: false,
      },
      {
        name: 'María López',
        email: 'maria.lopez@empresa.com',
        subject: 'Oportunidad laboral',
        message: 'Buenos días, soy reclutadora de una empresa tecnológica y tu perfil nos parece muy interesante. Estamos buscando desarrolladores Angular senior. ¿Te interesaría conocer más sobre la posición?',
        read: true,
      }
    ];
    await contactRepo.save(contacts);
    console.log('✅ Sample contact messages created');
  }

  console.log('🎉 Database seeding completed!');
}

// Auto-run if executed directly
if (require.main === module) {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USER || 'portfolio_user',
    password: process.env.DATABASE_PASSWORD || 'portfolio_pass',
    database: process.env.DATABASE_NAME || 'portfolio_db',
    entities: Object.values(allEntities),
    synchronize: true, // Auto-create schema if missing
  });

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
