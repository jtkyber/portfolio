import { useColorScheme } from '../hooks/use_color_scheme';
import MoonSVG from './svg/moon.svg';
import SunSVG from './svg/sun.svg';

export default function ThemeToggle() {
    const [theme, toggleTheme] = useColorScheme();

    const toggleColorScheme = () => toggleTheme();

    return (
        <button
            role='switch'
            className={`relative w-13 h-6.5 ring-2 ring-text rounded-full z-1 p-1.5 cursor-pointer flex flex-row items-center justify-between`}
            onClick={toggleColorScheme}
        >
            <div
                className={`absolute inset-0 w-1/2 aspect-square rounded-full bg-text -z-1 ${theme === 'dark' ? 'translate-x-0' : 'translate-x-full'} scale-80 will-change-transform transition-transform duration-150 ease-out`}
            ></div>

            <MoonSVG
                className={`h-full w-auto ${theme === 'dark' ? 'fill-surface' : 'fill-text'}`}
            />
            <SunSVG
                className={`h-full w-auto ${theme === 'dark' ? 'fill-text' : 'fill-surface'}`}
            />
        </button>
    );
}
