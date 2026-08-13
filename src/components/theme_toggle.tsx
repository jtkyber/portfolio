import { useColorScheme } from '../hooks/use_color_scheme';
import MoonSVG from './svg/moon.svg';
import SunSVG from './svg/sun.svg';

export default function ThemeToggle() {
    const [theme, toggleTheme] = useColorScheme();

    const toggleColorScheme = () => toggleTheme();

    return (
        <button
            role='switch'
            className={`w-fit h-fit relative border-2 border-text/90 rounded-full z-1 px-1 py-1 cursor-pointer`}
            onClick={toggleColorScheme}
        >
            <div className='relative flex flex-row'>
                <div
                    className={`absolute h-full aspect-square rounded-full bg-text -z-1 ${theme === 'dark' ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-150 ease-out`}
                ></div>
                <MoonSVG
                    className={`h-3.5 w-auto m-1 ${theme === 'dark' ? 'fill-surface' : 'fill-text'}`}
                />
                <SunSVG
                    className={`h-3.5 w-auto m-1 ${theme === 'dark' ? 'fill-text' : 'fill-surface'}`}
                />
            </div>
        </button>
    );
}
