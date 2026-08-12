function hexToUnit(hex: string, channel: 'r' | 'g' | 'b'): string {
    const map = { r: 1, g: 3, b: 5 };
    const i = map[channel];
    const val = parseInt(hex.slice(i, i + 2), 16);
    return (val / 255).toFixed(3);
}

export default function DuotoneFilter({
    id = 'duotone',
    shadow = '#111827',
    highlight = '#EAF1F6',
}) {
    return (
        <svg className='absolute w-0 h-0'>
            <filter id={id}>
                <feColorMatrix
                    type='matrix'
                    values='0.33 0.33 0.33 0 0
                                               0.33 0.33 0.33 0 0
                                               0.33 0.33 0.33 0 0
                                               0 0 0 1 0'
                />
                <feComponentTransfer colorInterpolationFilters='sRGB'>
                    <feFuncR
                        type='table'
                        tableValues={`${hexToUnit(shadow, 'r')} ${hexToUnit(highlight, 'r')}`}
                    />
                    <feFuncG
                        type='table'
                        tableValues={`${hexToUnit(shadow, 'g')} ${hexToUnit(highlight, 'g')}`}
                    />
                    <feFuncB
                        type='table'
                        tableValues={`${hexToUnit(shadow, 'b')} ${hexToUnit(highlight, 'b')}`}
                    />
                </feComponentTransfer>
            </filter>
        </svg>
    );
}
