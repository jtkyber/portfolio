import type { ClassNameProp } from '../../types/app.types';

export default function MoonSVG({ className }: ClassNameProp) {
    return (
        <svg
            viewBox='0 0 15 16'
            xmlns='http://www.w3.org/2000/svg'
            className={className}
        >
            <path
                d='M8.3119 0.00503143C3.68971 -0.155078 0 3.52745 0 7.99451C0 12.4135 3.60129 16 8.03859 16C11.0209 16 13.6093 14.3829 15 11.9812C8.96302 11.7811 5.28135 5.23262 8.3119 0.00503143Z'
                fill='inherit'
            />
        </svg>
    );
}
