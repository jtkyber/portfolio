import SectionLabel from '../../components/section_label';
import profile from '../../assets/about/profile_square2.webp';
import Glow from '../../components/glow';
import DuotoneFilter from '../../components/svg/duotone_filter';
import Contact from './contact';
import { useSelector } from 'react-redux';
import type { RootState } from '../../state/store';

export default function About() {
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);

    return (
        <section
            data-name='about'
            id='about-section'
            className='w-full flex flex-col items-center'
        >
            <SectionLabel text='About Me' />

            <div className='relative flex flex-col items-center sm:flex-row w-full max-w-180 gap-10 p-10 surface-styles'>
                <Glow />

                <div className='h-full w-full max-w-70 sm:w-[35%] flex flex-col justify-between gap-4 '>
                    <DuotoneFilter
                        id='duotone-dark'
                        shadow={darkMode ? '#12161c' : '#23221a'}
                        highlight={darkMode ? '#ffffff' : '#ffffff'}
                    />
                    <img
                        src={profile}
                        alt='Profile Picture'
                        className={`object-cover rounded-full filter-[url(#duotone-dark)_contrast(1.05)_brightness(1.10)] ring-1 ring-text/30`}
                        loading='lazy'
                    />

                    <Contact className='hidden sm:flex' />
                </div>

                <div className='flex flex-col gap-4 w-full sm:w-[65%] justify-center text-text font-normal'>
                    <p>
                        I am a Full-Stack JavaScript Developer located in
                        Marietta, GA, USA. I enjoy using modern technologies to
                        create responsive, intuitive, and scalable Single Page
                        Applications. I have a high attention to detail and love
                        solving problems. I am constantly working on personal
                        projects so that I can add new technologies to my web
                        development arsenal and continuously find new ways to
                        improve the quality of my code.
                    </p>
                    <p>
                        Away from my computer, I am an avid mountain biker. I
                        like to push myself physically and mentally, and
                        frequently ride trails that force me to conquer my
                        fears. I also enjoy other outdoor activities such as
                        hiking, snowboarding and photography. A healthy,
                        balanced lifestyle is something I highly value.
                    </p>

                    <Contact className='flex sm:hidden mt-8' />
                </div>
            </div>
        </section>
    );
}
