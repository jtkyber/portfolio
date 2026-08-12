import SectionLabel from '../../components/section_label.tsx';
import { projectsHighlighted, projectsOther } from '../../data/projects';
import ProjectHighlighted from './project_highlighted';
import ProjectOther from './project_other.tsx';

export default function Projects() {
    return (
        <section
            data-name='projects'
            id='projects-section'
            className='flex flex-col'
        >
            <SectionLabel text='Projects' />

            <div
                data-name='highlighted-projects'
                className='grid grid-cols-[repeat(auto-fit,minmax(min(22rem,100%),1fr))] gap-10'
            >
                {projectsHighlighted.map((p) => {
                    return <ProjectHighlighted key={p.id} project={p} />;
                })}
            </div>

            <div
                data-name='other-projects'
                className='flex flex-row flex-wrap gap-x-10 gap-y-5'
            >
                {projectsOther.map((p) => {
                    return <ProjectOther key={p.id} project={p} />;
                })}
            </div>
        </section>
    );
}
