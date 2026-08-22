import { useColorScheme } from '../hooks/use_color_scheme';
import MoonSVG from './svg/moon.svg';
import SunSVG from './svg/sun.svg';

export default function ThemeToggle() {
    const [darkMode, toggleDarkMode] = useColorScheme();

    const toggleColorScheme = () => toggleDarkMode();

    return (
        <button
            aria-label={darkMode ? 'Light Mode' : 'Dark Mode'}
            type='button'
            role='switch'
            aria-checked={darkMode}
            className={`relative w-12 sm:w-12.5 h-6 sm:h-6.25 ring-2 ring-text rounded-full z-1 p-1.5 cursor-pointer flex flex-row items-center justify-between shrink-0`}
            onClick={toggleColorScheme}
        >
            <div
                className={`absolute inset-0 w-1/2 aspect-square rounded-full bg-text -z-1 ${darkMode ? 'translate-x-0' : 'translate-x-full'} scale-80 will-change-transform transition-transform duration-150 ease-out`}
            ></div>

            <MoonSVG
                className={`h-full w-auto ${darkMode ? 'fill-background' : 'fill-text'}`}
            />
            <SunSVG
                className={`h-full w-auto ${darkMode ? 'fill-text' : 'fill-background'}`}
            />
        </button>
    );
}
