import type { Technology } from './skills.types';

export type ProjectCategory = 'SaaS' | 'API' | 'Engine' | 'Game';

export type ProjectHighlighted = {
    id: string;
    title: string;
    description: string;
    image: string;
    tech: Technology[];
    github: string;
    site: string;
    tag: ProjectCategory;
};

export type ProjectOther = {
    id: string;
    title: string;
    description: string;
    github: string;
    site: string | null;
    tag: ProjectCategory;
    inProgress: boolean;
};
