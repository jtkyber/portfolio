import { useState, useEffect } from 'react';
import type { ColorScheme } from '../types/app.types';

export function useColorScheme(): [ColorScheme, () => void] {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const html = document.documentElement;
        const hasDarkClass = html.classList.contains('dark');
        return hasDarkClass;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const html = document.documentElement;
        const mutationObserver = new MutationObserver((mutationList) => {
            for (const item of mutationList) {
                if (item.attributeName === 'class') {
                    const hasDarkClass = html.classList.contains('dark');
                    setIsDarkMode(hasDarkClass);
                    break;
                }
            }
        });

        mutationObserver.observe(html, { attributes: true });

        return () => mutationObserver.disconnect();
    }, []);

    const toggle = () => {
        const html = document.documentElement;
        if (html.classList.contains('dark')) html.classList.remove('dark');
        else html.classList.add('dark');
    };

    return [isDarkMode ? 'dark' : 'light', toggle];
}
