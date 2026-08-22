import { useEffect, useRef } from 'react';
import Navbar from './components/navbar';
import Hero from './sections/hero';
import Projects from './sections/projects';
import { render } from './effects/renderer';
import campingSceneNight from './assets/camping_theme/camp_scene_night.webp';
import campingSceneDay from './assets/camping_theme/camp_scene_day.webp';
import moon from './assets/camping_theme/moon.webp';
import pine from './assets/camping_theme/pine_day.svg';
import pine_dark from './assets/camping_theme/pine_night.svg';
import { useColorScheme } from './hooks/use_color_scheme';
import Skills from './sections/skills';
import About from './sections/about';

function App() {
    const hasRun = useRef(false);
    const [darkMode, _toggleDarkMode] = useColorScheme();

    useEffect(() => {
        if (hasRun.current) return;

        render();

        hasRun.current = true;
    }, []);

    return (
        <div
            data-name='app-container'
            className='relative flex w-full justify-center font-body'
        >
            {darkMode ? (
                <div
                    data-name='moon-container'
                    className='fixed top-20 right-1/20 w-full flex justify-end p-8 select-none'
                >
                    <div className='absolute top-0 right-0 w-250 h-250 -m-110'>
                        <div className='absolute w-full h-full rounded-full radial-exp opacity-100'></div>

                        <img
                            src={moon}
                            alt='Moon'
                            className='absolute w-30 h-auto top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2'
                        />
                    </div>
                </div>
            ) : null}

            <div className='absolute w-full h-screen top-0 hidden sm:block'>
                <div className={darkMode ? 'hidden' : 'block'}>
                    <img
                        src={pine}
                        alt='Pine Tree'
                        fetchPriority='high'
                        className='absolute bottom-0 right-0 h-full object-cover overflow-visible scale-200 origin-bottom translate-x-1/2 -mr-22 translate-y-25 -rotate-2'
                    />
                    <img
                        src={pine}
                        alt='Pine Tree'
                        fetchPriority='high'
                        className='absolute bottom-0 left-0 h-full scale-300 origin-bottom -translate-x-1/2 -ml-40 -translate-y-50 rotate-5 object-cover overflow-visible'
                    />
                </div>

                <div className={darkMode ? 'block' : 'hidden'}>
                    <img
                        src={pine_dark}
                        alt='Pine Tree'
                        className='absolute bottom-0 right-0 h-full object-cover overflow-visible scale-200 origin-bottom translate-x-1/2 -mr-22 translate-y-25 -rotate-2'
                        loading='eager'
                    />
                    <img
                        src={pine_dark}
                        alt='Pine Tree'
                        className='absolute bottom-0 left-0 h-full scale-300 origin-bottom -translate-x-1/2 -ml-40 -translate-y-50 rotate-5 object-cover overflow-visible'
                        loading='eager'
                    />
                </div>
            </div>

            <div className='w-full absolute bottom-0 flex justify-center -mb-20'>
                {darkMode ? (
                    <img
                        src={campingSceneNight}
                        alt='Camping Scene'
                        className='w-400 object-cover max-w-none'
                    />
                ) : (
                    <img
                        src={campingSceneDay}
                        alt='Camping Scene Sunrise'
                        className='w-400 object-cover max-w-none mask-[linear-gradient(to_bottom,transparent,black_50%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_50%)]'
                    />
                )}
            </div>

            <div className='absolute inset-0 w-full'>
                <Navbar />
            </div>

            <div
                data-name='contents'
                className='relative w-full px-8 flex flex-col max-w-max-body-w mb-70 z-1'
            >
                <Hero />

                <Projects />

                <Skills />

                <About />
            </div>
        </div>
    );
}

export default App;
