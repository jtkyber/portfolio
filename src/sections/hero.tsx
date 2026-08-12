export default function Hero() {
    return (
        <section
            data-name='hero-section'
            className='w-full h-screen flex items-end pb-60'
        >
            <div className='flex flex-col flex-nowrap gap-4 pl-10'>
                <h3 className='text-6xl text-text/90 font-medium font-heading'>
                    Full-Stack Developer
                </h3>
                <p className='text-lg max-w-lg text-text font-light'>
                    I build web applications from the ground up — thoughtful
                    frontends in React and Next.js, solid backends with Node and
                    PostgreSQL, and everything in between. Six years of personal
                    projects have given me a genuine love for the full spectrum
                    of the stack.
                </p>
            </div>
        </section>
    );
}
