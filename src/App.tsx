import { useEffect, useRef } from 'react';
import Navbar from './components/navbar';
import Hero from './sections/hero';
import Projects from './sections/projects';
import { render } from './smoke_effect/renderer';
import campingScene from './assets/camping_theme/camp_scene.png';
import campingSceneDay from './assets/camping_theme/camp_scene_day.png';
import moon from './assets/camping_theme/moon.png';
import pine from './assets/camping_theme/pine.png';
import { useColorScheme } from './hooks/use_color_scheme';
import Skills from './sections/skills';
import About from './sections/about';
import DuotoneFilter from './components/svg/duotone_filter';

function App() {
    const hasRun = useRef(false);
    const [theme, _toggleTheme] = useColorScheme();

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
            <div
                data-name='moon-container'
                className='absolute top-24 right-1/10 w-full flex justify-end p-8 select-none'
            >
                <div className='absolute top-0 right-0 w-250 h-250 -m-110'>
                    <div className='absolute -z-1 w-full h-full rounded-full radial-exp opacity-100'></div>
                    {theme === 'dark' ? (
                        <img
                            src={moon}
                            alt='Moon'
                            className='absolute w-30 h-auto top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2 cursor-pointer'
                        />
                    ) : null}
                </div>
            </div>

            <div className='absolute w-full h-screen top-0 hidden sm:block'>
                <DuotoneFilter
                    id='duotone-tree-dark'
                    shadow='#06090e'
                    highlight='#1c273a'
                />
                {theme === 'light' ? (
                    <>
                        <img
                            src={pine}
                            alt='Pine Tree'
                            className='absolute bottom-0 right-0 h-full object-cover overflow-visible scale-200 origin-bottom translate-x-1/2 -mr-22 translate-y-25 -rotate-2'
                        />
                        <img
                            src={pine}
                            alt='Pine Tree'
                            className='absolute bottom-0 left-0 h-full scale-300 origin-bottom -translate-x-1/2 -ml-40 -translate-y-50 rotate-5 object-cover overflow-visible'
                        />
                    </>
                ) : (
                    <>
                        <img
                            src={pine}
                            alt='Pine Tree'
                            className='absolute bottom-0 right-0 h-full object-cover overflow-visible scale-200 origin-bottom translate-x-1/2 -mr-22 translate-y-25 -rotate-2 filter-[url(#duotone-tree-dark)]'
                        />
                        <img
                            src={pine}
                            alt='Pine Tree'
                            className='absolute bottom-0 left-0 h-full scale-300 origin-bottom -translate-x-1/2 -ml-40 -translate-y-50 rotate-5 object-cover overflow-visible filter-[url(#duotone-tree-dark)]'
                        />
                    </>
                )}
            </div>

            <div className='w-full absolute bottom-0 flex justify-center -z-3 -mb-20'>
                {theme === 'light' ? (
                    <img
                        src={campingSceneDay}
                        alt='Camping Scene Sunrise'
                        className='w-400 object-cover max-w-none mask-[linear-gradient(to_bottom,transparent,black_50%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_50%)]'
                    />
                ) : (
                    <img
                        src={campingScene}
                        alt='Camping Scene'
                        className='w-400 object-cover max-w-none mask-[linear-gradient(to_bottom,transparent,black_15%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,black_15%)]'
                    />
                )}
            </div>

            <div className='absolute inset-0 w-full'>
                <Navbar />
            </div>

            <div
                data-name='contents'
                className='relative w-full px-8 flex flex-col max-w-max-body-w mb-70'
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
