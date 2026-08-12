import type { ComponentPropsWithoutRef } from 'react';

interface DivProps extends ComponentPropsWithoutRef<'div'> {
    text: string;
}

export default function SkillKeyItem({
    text,
    className = 'transparent',
}: DivProps) {
    return (
        <div className='flex flex-row gap-2 items-center'>
            <div
                className={`w-3 aspect-square rounded-full ${className}`}
            ></div>
            <h4 className='text-sm font-medium text-text/90 capitalize'>
                {text}
            </h4>
        </div>
    );
}
