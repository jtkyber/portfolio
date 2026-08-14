import GithubSVG from '../../components/svg/github.svg';
import LinkedinSVG from '../../components/svg/linkedin.svg';
import type { ClassNameProp } from '../../types/app.types';

export default function Contact({ className }: ClassNameProp) {
    return (
        <div className={`w-full flex-col gap-2 items-center ${className}`}>
            <div className='h-5 flex flex-row gap-3'>
                <a
                    className='item-hover'
                    target='_blank'
                    rel='noopener noreferrer'
                    href='https://www.linkedin.com/in/joseph-kyber-a0a26916a/'
                >
                    <LinkedinSVG />
                </a>
                <a
                    className='item-hover'
                    target='_blank'
                    rel='noopener noreferrer'
                    href='https://github.com/jtkyber'
                >
                    <GithubSVG />
                </a>
            </div>
            <a
                className='text-text underline'
                target='_blank'
                rel='noopener noreferrer'
                href='mailto:joeykyber@gmail.com'
            >
                joeykyber@gmail.com
            </a>
        </div>
    );
}
