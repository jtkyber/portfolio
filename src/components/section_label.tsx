export default function SectionLabel({ text }: { text: string }) {
    return (
        <h2 className='w-full text-center text-text/90 font-light text-2xl font-heading'>
            {text}
        </h2>
    );
}
