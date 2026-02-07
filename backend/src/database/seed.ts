import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { Skill } from '../entities/skill.entity';
import { AboutContent } from '../entities/about-content.entity';
import { Experience } from '../entities/experience.entity';
import { HeroContent } from '../entities/hero-content.entity';
import { PortfolioSettings } from '../entities/portfolio-settings.entity';
import { Specialty } from '../entities/specialty.entity';

export async function seedDatabase(dataSource: DataSource): Promise<void> {
  console.log('🌱 Seeding database...');

  // Create admin user from env vars or defaults
  const userRepo = dataSource.getRepository(User);
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  const existingAdmin = await userRepo.findOne({ where: { username: adminUsername } });
  
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await userRepo.save({
      username: adminUsername,
      email: adminEmail,
      password_hash: passwordHash,
    });
    console.log(`✅ Admin user created (username: ${adminUsername})`);
  }

  // Create portfolio settings
  const settingsRepo = dataSource.getRepository(PortfolioSettings);
  const existingSettings = await settingsRepo.find();
  
  if (existingSettings.length === 0) {
    await settingsRepo.save({
      site_title: 'Portfolio Web Creator',
      meta_description: 'Create your professional portfolio with ease. Built with Angular, NestJS and PostgreSQL.',
      favicon_type: 'terminal',
      accent_color: '#F5A623',
      show_admin_link: false,
    });
    console.log('✅ Portfolio settings created');
  }

  // Create hero content
  const heroRepo = dataSource.getRepository(HeroContent);
  const existingHero = await heroRepo.find();
  
  if (existingHero.length === 0) {
    await heroRepo.save({
      title: 'Tu Nombre Aquí',
      title_highlight: 'Desarrollador Full Stack',
      title_en: 'Your Name Here',
      title_highlight_en: 'Full Stack Developer',
      subtitle: 'Crea tu portfolio profesional',
      subtitle_en: 'Create your professional portfolio',
      description: 'Personaliza este portfolio con tu información desde el panel de administración.',
      description_en: 'Customize this portfolio with your information from the admin panel.',
    });
    console.log('✅ Hero content created');
  }

  // Create about content
  const aboutRepo = dataSource.getRepository(AboutContent);
  const existingAbout = await aboutRepo.find();
  
  if (existingAbout.length === 0) {
    await aboutRepo.save({
      bio: 'Escribe aquí tu biografía profesional. Cuéntale al mundo quién eres y qué te apasiona.',
      bio_en: 'Write your professional biography here. Tell the world who you are and what you are passionate about.',
      highlights: [
        'Edita este contenido desde el panel de administración',
        'Añade tu experiencia y habilidades',
        'Personaliza los colores y el favicon',
        'Despliega tu portfolio en minutos',
      ],
      highlights_en: [
        'Edit this content from the admin panel',
        'Add your experience and skills',
        'Customize colors and favicon',
        'Deploy your portfolio in minutes',
      ],
    });
    console.log('✅ About content created');
  }

  // Create sample skills
  const skillRepo = dataSource.getRepository(Skill);
  const existingSkills = await skillRepo.find();
  
  if (existingSkills.length === 0) {
    const skills = [
      // Frontend examples
      { name: 'Angular', category: 'frontend', level: 5, display_order: 1 },
      { name: 'React', category: 'frontend', level: 4, display_order: 2 },
      { name: 'TypeScript', category: 'frontend', level: 5, display_order: 3 },
      { name: 'Tailwind CSS', category: 'frontend', level: 4, display_order: 4 },
      // Backend examples
      { name: 'Node.js', category: 'backend', level: 4, display_order: 1 },
      { name: 'NestJS', category: 'backend', level: 4, display_order: 2 },
      { name: 'PostgreSQL', category: 'backend', level: 4, display_order: 3 },
      // Tools examples
      { name: 'Docker', category: 'tools', level: 4, display_order: 1 },
      { name: 'Git', category: 'tools', level: 5, display_order: 2 },
    ];
    await skillRepo.save(skills as any[]);
    console.log('✅ Sample skills created');
  }

  // Create sample projects
  const projectRepo = dataSource.getRepository(Project);
  const existingProjects = await projectRepo.find();
  
  if (existingProjects.length === 0) {
    const projects = [
      {
        title: 'Proyecto Ejemplo 1',
        title_en: 'Example Project 1',
        description: 'Describe aquí tu proyecto principal',
        description_en: 'Describe your main project here',
        long_description: 'Añade una descripción detallada de tu proyecto, las tecnologías usadas y los retos superados.',
        long_description_en: 'Add a detailed description of your project, the technologies used and challenges overcome.',
        technologies: ['Angular', 'NestJS', 'PostgreSQL'],
        featured: true,
        display_order: 1,
      },
      {
        title: 'Proyecto Ejemplo 2',
        title_en: 'Example Project 2',
        description: 'Otro proyecto destacado',
        description_en: 'Another featured project',
        long_description: 'Describe las funcionalidades principales y el impacto del proyecto.',
        long_description_en: 'Describe the main features and the impact of the project.',
        technologies: ['React', 'Node.js', 'MongoDB'],
        featured: true,
        display_order: 2,
      },
    ];
    await projectRepo.save(projects);
    console.log('✅ Sample projects created');
  }

  // Create sample experience
  const expRepo = dataSource.getRepository(Experience);
  const existingExp = await expRepo.find();
  
  if (existingExp.length === 0) {
    const experiences = [
      {
        title: 'Tu Cargo',
        company: 'Tu Empresa',
        period: '2022 - Presente',
        description: 'Describe tus responsabilidades principales en este puesto.',
        achievements: [
          'Logro destacado #1',
          'Logro destacado #2',
          'Logro destacado #3',
        ],
        display_order: 1,
      },
      {
        title: 'Cargo Anterior',
        company: 'Empresa Anterior',
        period: '2019 - 2022',
        description: 'Describe tu rol y contribuciones en esta posición.',
        achievements: [
          'Proyecto importante completado',
          'Mejora de procesos',
          'Trabajo en equipo',
        ],
        display_order: 2,
      },
    ];
    await expRepo.save(experiences);
    console.log('✅ Sample experiences created');
  }

  // Create sample specialties
  const specialtyRepo = dataSource.getRepository(Specialty);
  const existingSpecialties = await specialtyRepo.find();
  
  if (existingSpecialties.length === 0) {
    const specialties = [
      {
        title: 'Frontend Development',
        title_en: 'Frontend Development',
        description: 'Desarrollo de interfaces modernas y responsive con las últimas tecnologías web.',
        description_en: 'Modern and responsive interface development with the latest web technologies.',
        color: 'primary',
        icon_type: 'frontend',
        technologies: ['Angular', 'React', 'TypeScript', 'Tailwind CSS'],
        display_order: 1,
      },
      {
        title: 'Backend Development',
        title_en: 'Backend Development',
        description: 'APIs robustas y escalables con arquitecturas limpias y bien documentadas.',
        description_en: 'Robust and scalable APIs with clean and well-documented architectures.',
        color: 'green',
        icon_type: 'backend',
        technologies: ['Node.js', 'NestJS', 'PostgreSQL'],
        display_order: 2,
      },
      {
        title: 'DevOps & Cloud',
        title_en: 'DevOps & Cloud',
        description: 'Automatización de despliegues y gestión de infraestructura cloud.',
        description_en: 'Deployment automation and cloud infrastructure management.',
        color: 'blue',
        icon_type: 'devops',
        technologies: ['Docker', 'Git', 'CI/CD'],
        display_order: 3,
      },
    ];
    await specialtyRepo.save(specialties);
    console.log('✅ Sample specialties created');
  }

  console.log('🎉 Database seeding completed!');
}
