import ThemeToggle from './theme_toggle';

export default function Navbar() {
    return (
        <div className='sticky inset-0 w-full h-nav-height z-100 after:content-[""] after:inset-0 after:absolute after:w-full after:h-full after:backdrop-blur-sm after:-z-1'>
            <div
                data-name='blur-layer'
                className='absolute -z-1 inset-0 w-full h-full bg-background shadow-lg shadow-black/15 opacity-100'
            ></div>

            <nav
                data-name='navbar'
                className='w-full max-w-max-body-w h-full flex items-center justify-between px-6 m-auto'
            >
                <div data-name='left' className='hidden sm:block'>
                    <a href='#hero-section'>
                        <h1 className='text-text text-2xl font-normal font-body text-nowrap tracking-wide'>
                            Joey Kyber
                        </h1>
                    </a>
                </div>

                <div
                    data-name='right'
                    className='w-full flex flex-row cursor-pointer gap-4 items-center justify-between sm:justify-end'
                >
                    <div className='text-sm text-text/90 font-semibold order-1 sm:order-0'>
                        <a
                            href='#projects-section'
                            className='p-2 sm:p-4 item-hover'
                        >
                            Projects
                        </a>
                        <a
                            href='#skills-section'
                            className='p-2 sm:p-4 item-hover'
                        >
                            Skills
                        </a>
                        <a
                            href='#about-section'
                            className='p-2 sm:p-4 item-hover'
                        >
                            About
                        </a>
                    </div>

                    <ThemeToggle />
                </div>
            </nav>
        </div>
    );
}
