import Glow from '../../components/glow';
import SectionLabel from '../../components/section_label';
import { skillsByCat } from '../../data/skills';
import type { Skill, SkillLevel } from '../../types/skills.types';
import SkillKeyItem from './skill_key_item';

const skillStyleMap: Record<SkillLevel, string> = {
    core: 'bg-primary border-2 border-primary text-background',
    proficient: 'border-2 border-primary text-primary',
    familiar: 'border-2 border-text/60 text-text/60',
};

const skillSortMap: Record<SkillLevel, number> = {
    core: 0,
    proficient: 1,
    familiar: 2,
};

export default function Skills() {
    const skillSortFn = (a: Skill, b: Skill) => {
        return skillSortMap[a.level] - skillSortMap[b.level];
    };

    return (
        <section
            data-name='skills'
            id='skills-section'
            className='flex flex-col gap-8'
        >
            <SectionLabel text='Skills' />

            <div
                data-name='skill-container'
                className='relative w-full flex flex-col gap-6 px-10 py-8 surface-styles'
            >
                <Glow />

                <div
                    data-name='skill-key'
                    className='w-full flex flex-row justify-center gap-4'
                >
                    <SkillKeyItem text='core' className='bg-primary' />
                    <SkillKeyItem
                        text='proficient'
                        className='border-2 border-primary'
                    />
                    <SkillKeyItem
                        text='familiar'
                        className='border-2 border-text/60'
                    />
                </div>

                <div data-name='skill-contents' className='flex flex-col'>
                    {skillsByCat.map((cats) => (
                        <div
                            key={cats.category}
                            className='relative flex flex-col sm:flex-row w-full gap-8 py-7 items-center after-content-[""] after:absolute after:inset-0 after:h-full after:ml-10 after:border-b after:border-text/10 last:after:border-0'
                        >
                            <h3 className='w-25 flex-none text-text text-lg font-light text-center sm:text-left text-nowrap'>
                                {cats.category}
                            </h3>

                            <div className='flex flex-row flex-wrap justify-center sm:justify-start gap-4'>
                                {cats.list.sort(skillSortFn).map((skill) => (
                                    <h5
                                        key={skill.name}
                                        className={`custom-tag ${skillStyleMap[skill.level]}`}
                                    >
                                        {skill.name}
                                    </h5>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
