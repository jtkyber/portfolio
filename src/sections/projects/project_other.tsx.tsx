import Glow from '../../components/glow';
import GithubSVG from '../../components/svg/github.svg';
import WebsiteSVG from '../../components/svg/website.svg';
import { useColorScheme } from '../../hooks/use_color_scheme';
import type { ProjectOther } from '../../types/projects.types';

export default function ProjectOther({ project }: { project: ProjectOther }) {
    const [theme, _toggleTheme] = useColorScheme();

    return (
        <div
            data-name='project-other'
            className='w-full flex-[1_1_max-content] relative surface-styles'
        >
            <Glow />

            <div
                data-name='project-contents'
                className='relative w-full h-full flex flex-col gap-1 px-4 py-2 pt-3 justify-between z-1'
            >
                <div
                    data-name='top'
                    className='flex flex-row justify-between gap-4'
                >
                    <div
                        data-name='tag-container'
                        className='w-full flex flex-col justify-start gap-1'
                    >
                        <h5 className={`custom-tag p-0 text-accent/90`}>
                            {project.tag}
                        </h5>

                        {project?.inProgress ? (
                            <h5
                                className={`custom-tag p-0 text-primary/90 text-nowrap`}
                            >
                                In Progress
                            </h5>
                        ) : null}
                    </div>

                    <h3 className='w-full text-lg font-light text-text font-heading text-center text-wrap sm:text-nowrap'>
                        {project.title}
                    </h3>

                    <div
                        data-name='link-container'
                        className='w-full h-4 flex flex-row justify-end gap-3'
                    >
                        <a
                            className='text-nowrap text-accent text-sm font-bold item-hover'
                            target='_blank'
                            rel='noopener noreferrer'
                            href={project.github}
                        >
                            <GithubSVG theme={theme} />
                        </a>
                        <a
                            className='text-nowrap text-accent text-sm font-bold item-hover'
                            target='_blank'
                            rel='noopener noreferrer'
                            href={project.site ?? project.github}
                        >
                            <WebsiteSVG theme={theme} />
                        </a>
                    </div>
                </div>

                <h5 className='text-sm font-medium text-text/90 text-center'>
                    {project.description}
                </h5>
            </div>
        </div>
    );
}
