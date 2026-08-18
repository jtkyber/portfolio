import { useState, useEffect } from 'react';

export function useColorScheme(): [boolean, () => void] {
    const html = document.documentElement;

    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const darkModeStored = localStorage.getItem('darkMode');
        const darkModeStoredParsed = darkModeStored
            ? JSON.parse(darkModeStored)
            : null;

        if (
            typeof darkModeStoredParsed === 'boolean' &&
            darkModeStoredParsed !== html.classList.contains('dark')
        ) {
            toggle();
        }

        const hasDarkClass = html.classList.contains('dark');
        return hasDarkClass;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mutationObserver = new MutationObserver((mutationList) => {
            for (const item of mutationList) {
                if (item.attributeName === 'class') {
                    const hasDarkClass = html.classList.contains('dark');
                    setIsDarkMode(hasDarkClass);
                    localStorage.setItem('darkMode', hasDarkClass.toString());
                    break;
                }
            }
        });

        mutationObserver.observe(html, { attributes: true });

        return () => mutationObserver.disconnect();
    }, []);

    function toggle() {
        if (html.classList.contains('dark')) html.classList.remove('dark');
        else html.classList.add('dark');
    }

    return [isDarkMode, toggle];
}
