import Glow from '../../components/glow';
import GithubSVG from '../../components/svg/github.svg';
import WebsiteSVG from '../../components/svg/website.svg';
import type { ProjectHighlighted } from '../../types/projects.types';

export default function ProjectHighlighted({
    project,
}: {
    project: ProjectHighlighted;
}) {
    return (
        <div
            data-name='project-highlighted'
            className='relative w-full surface-styles'
        >
            <Glow />

            <div
                data-name='project-contents'
                className='relative flex flex-col w-full h-full gap-4 p-6 z-1'
            >
                <div
                    data-name='tag-container'
                    className='w-full flex justify-end'
                >
                    <h5 className={`custom-tag bg-accent/15 text-accent`}>
                        {project.tag}
                    </h5>
                </div>

                <div
                    data-name='image-container'
                    className='w-full aspect-video overflow-clip rounded-md ring-1 ring-text/30'
                >
                    <div className='relative w-full h-full'>
                        <picture>
                            <source
                                srcSet={`assets/projects/${project.image}.webp`}
                                media='(width >= 600px)'
                            />
                            <img
                                src={`assets/projects/small/${project.image}.webp`}
                                alt='Project Image'
                                className='absolute w-full h-full object-cover opacity-100'
                                loading='lazy'
                            />
                        </picture>
                    </div>
                </div>

                <div data-name='text-container' className='w-full'>
                    <h5 className='text-2xl font-light font-heading text-text/90 tracking-wide'>
                        {project.title}
                    </h5>
                    <p className='text-text font-medium text-md opacity-90'>
                        {project.description}
                    </p>
                </div>

                <div className='flex flex-col w-full h-full justify-between gap-6'>
                    <div
                        data-name='tech-container'
                        className='w-full flex flex-row flex-wrap gap-2'
                    >
                        {project.tech.map((t) => (
                            <h5
                                key={`${project.id}-${t}`}
                                className='custom-tag relative bg-primary/15 border-0 border-primary text-primary text-nowrap'
                            >
                                {t}
                            </h5>
                        ))}
                    </div>
                    <div
                        data-name='link-container'
                        className='w-full h-5 flex flex-row justify-center gap-6'
                    >
                        <a
                            className='item-hover'
                            target='_blank'
                            rel='noopener noreferrer'
                            href={project.github}
                            aria-label={`View ${project.title} code in github`}
                        >
                            <GithubSVG />
                        </a>
                        <a
                            className='item-hover'
                            target='_blank'
                            rel='noopener noreferrer'
                            href={project.site ?? project.github}
                            aria-label={`Visit ${project.title} live site`}
                        >
                            <WebsiteSVG />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
