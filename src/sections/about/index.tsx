import SectionLabel from '../../components/section_label';
import profile from '../../assets/about/profile_square2.webp';
import Glow from '../../components/glow';
import DuotoneFilter from '../../components/svg/duotone_filter';
import { useColorScheme } from '../../hooks/use_color_scheme';
import GithubSVG from '../../components/svg/github.svg';
import LinkedinSVG from '../../components/svg/linkedin.svg';

export default function About() {
    const [theme, _toggleTheme] = useColorScheme();

    return (
        <section
            data-name='about'
            id='about-section'
            className='w-full flex flex-col items-center'
        >
            <SectionLabel text='About Me' />

            <div className='relative flex w-full max-w-180 gap-10 p-10 surface-styles'>
                <Glow />

                <div className='h-full flex flex-col shrink-0 justify-between gap-4 w-[30%]'>
                    <DuotoneFilter
                        id='duotone-dark'
                        shadow={theme === 'dark' ? '#12161c' : '#252018'}
                        highlight={theme === 'dark' ? '#ffffff' : '#ffffff'}
                    />
                    <img
                        src={profile}
                        alt='Profile Picture'
                        className={`object-cover rounded-full filter-[url(#duotone-dark)_contrast(1.05)_brightness(1.1)] ring-1 ring-text/30`}
                    />
                    <div className='w-full flex flex-col gap-2 items-center'>
                        <div className='h-5 flex flex-row gap-3'>
                            <a
                                className='item-hover'
                                target='_blank'
                                rel='noopener noreferrer'
                                href='https://www.linkedin.com/in/joseph-kyber-a0a26916a/'
                            >
                                <LinkedinSVG />
                            </a>
                            <a
                                className='item-hover'
                                target='_blank'
                                rel='noopener noreferrer'
                                href='https://github.com/jtkyber'
                            >
                                <GithubSVG />
                            </a>
                        </div>
                        <a
                            className='text-text underline'
                            target='_blank'
                            rel='noopener noreferrer'
                            href='mailto:joeykyber@gmail.com'
                        >
                            joeykyber@gmail.com
                        </a>
                    </div>
                </div>

                <div className='flex flex-col gap-4 w-[70%] justify-center text-text font-normal'>
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
                </div>
            </div>
        </section>
    );
}
