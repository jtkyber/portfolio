import type { ComponentProps } from 'react';

export type ColorScheme = 'light' | 'dark';

export interface ClassNameProp {
    className?: ComponentProps<any>['className'];
}
