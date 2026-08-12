export type Technology =
    | 'JavaScript'
    | 'TypeScript'
    | 'Rust'
    | 'React'
    | 'Next.js'
    | 'Redux'
    | 'HTML'
    | 'CSS'
    | 'SCSS'
    | 'PostCSS'
    | 'Tailwind CSS'
    | 'Bootstrap'
    | 'NextAuth'
    | 'TanStack Router'
    | 'TanStack Query'
    | 'Git'
    | 'Node.js'
    | 'Express'
    | 'PostgreSQL'
    | 'MongoDB'
    | 'Amazon S3'
    | 'jQuery'
    | 'Cheerio'
    | 'Puppeteer'
    | 'Figma'
    | 'REST APIs'
    | 'Mapbox'
    | 'WebGPU'
    | 'Recharts'
    | 'Mongoose'
    | 'Redux Toolkit'
    | 'Pusher'
    | 'Vercel'
    | 'Neon'
    | 'Heroku'
    | 'Knex'
    | 'Dexie';

export type SkillLevel = 'core' | 'proficient' | 'familiar';

export type Skill = {
    name: Technology;
    level: SkillLevel;
};

export type SkillsByCategory = {
    category: 'Languages' | 'Frontend' | 'Backend' | 'Databases' | 'Tooling';
    list: Skill[];
};
