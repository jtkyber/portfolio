import { useSelector } from 'react-redux';
import type { RootState } from '../state/store';

export default function Hero() {
    const darkMode = useSelector((state: RootState) => state.theme.darkMode);

    return (
        <section
            data-name='hero-section'
            id='hero-section'
            className='relative w-full h-screen flex justify-start items-end pb-[25vh]'
        >
            <div className='flex flex-col justify-start gap-4 ml-0 xs:ml-10'>
                <div className='flex flex-col flex-nowrap gap-4'>
                    <h3 className='text-text text-2xl font-normal block sm:hidden'>
                        Joey Kyber
                    </h3>
                    <h2
                        className={`text-5xl sm:text-6xl ${darkMode ? 'text-text' : 'text-primary'} font-medium font-heading`}
                    >
                        Full-Stack Developer
                    </h2>
                    <p className='text-lg max-w-lg text-text font-light'>
                        I build functional, technically diverse web
                        applications, from real-time platforms to custom
                        engines.
                    </p>
                </div>
                <div className='flex flex-row gap-4'>
                    <a href='#projects-section'>
                        <button
                            className={`cta-button ${darkMode ? 'bg-text ring-text' : 'bg-primary'}`}
                        >
                            View Projects
                        </button>
                    </a>
                    <button
                        className={`cta-button ${darkMode ? 'text-text ring-text' : 'text-primary'}`}
                    >
                        Download Resume
                    </button>
                </div>
            </div>
        </section>
    );
}
