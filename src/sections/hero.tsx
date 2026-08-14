import { useColorScheme } from '../hooks/use_color_scheme';

export default function Hero() {
    const [theme, _toggleTheme] = useColorScheme();

    return (
        <section
            data-name='hero-section'
            id='hero-section'
            className='w-full h-screen flex flex-col justify-end pl-10 pb-60 gap-4'
        >
            <div className='flex flex-col flex-nowrap gap-4'>
                <h3
                    className={`text-6xl ${theme === 'dark' ? 'text-text' : 'text-primary'} font-medium font-heading`}
                >
                    Full-Stack Developer
                </h3>
                <p className='text-lg max-w-lg text-text font-light'>
                    I build functional, technically diverse web applications,
                    from real-time platforms to custom engines.
                </p>
            </div>
            <div className='flex flex-row gap-4'>
                <a href='#projects-section'>
                    <button
                        className={`cta-button ${theme === 'dark' ? 'bg-text ring-text' : 'bg-primary'}`}
                    >
                        View Projects
                    </button>
                </a>
                <button
                    className={`cta-button ${theme === 'dark' ? 'text-text ring-text' : 'text-primary'}`}
                >
                    Download Resume
                </button>
            </div>
        </section>
    );
}
