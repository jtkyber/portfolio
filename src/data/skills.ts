import type { SkillsByCategory } from '../types/skills.types';

export const skillsByCat: SkillsByCategory[] = [
    {
        category: 'Languages',
        list: [
            {
                name: 'JavaScript',
                level: 'core',
            },
            {
                name: 'TypeScript',
                level: 'core',
            },
            {
                name: 'HTML',
                level: 'core',
            },
            {
                name: 'CSS',
                level: 'core',
            },
            {
                name: 'Rust',
                level: 'familiar',
            },
        ],
    },
    {
        category: 'Frontend',
        list: [
            {
                name: 'React',
                level: 'core',
            },
            {
                name: 'Next.js',
                level: 'proficient',
            },
            {
                name: 'Tailwind CSS',
                level: 'core',
            },
            {
                name: 'SCSS',
                level: 'proficient',
            },
            {
                name: 'TanStack Router',
                level: 'proficient',
            },
            {
                name: 'TanStack Query',
                level: 'proficient',
            },
            {
                name: 'Redux Toolkit',
                level: 'proficient',
            },
            {
                name: 'Recharts',
                level: 'proficient',
            },
            {
                name: 'Mapbox',
                level: 'familiar',
            },
            {
                name: 'WebGPU',
                level: 'proficient',
            },
        ],
    },
    {
        category: 'Backend',
        list: [
            {
                name: 'Node.js',
                level: 'core',
            },
            {
                name: 'Express',
                level: 'proficient',
            },
            {
                name: 'REST APIs',
                level: 'core',
            },
            {
                name: 'NextAuth',
                level: 'familiar',
            },
            {
                name: 'Pusher',
                level: 'familiar',
            },
            {
                name: 'Cheerio',
                level: 'proficient',
            },
            {
                name: 'Puppeteer',
                level: 'proficient',
            },
        ],
    },
    {
        category: 'Databases',
        list: [
            {
                name: 'PostgreSQL',
                level: 'proficient',
            },
            {
                name: 'MongoDB',
                level: 'familiar',
            },
            {
                name: 'Mongoose',
                level: 'familiar',
            },
            {
                name: 'Knex',
                level: 'proficient',
            },
        ],
    },
    {
        category: 'Tooling',
        list: [
            {
                name: 'Figma',
                level: 'core',
            },
            {
                name: 'Amazon S3',
                level: 'familiar',
            },
            {
                name: 'Vercel',
                level: 'proficient',
            },
            {
                name: 'Heroku',
                level: 'proficient',
            },
            {
                name: 'Neon',
                level: 'proficient',
            },
        ],
    },
];
