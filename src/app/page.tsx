import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]'>
      <main>
        <h1 className='text-2xl md:text-[32px] font-bold text-light-heading dark:text-dark-heading mb-2'>
          WORK IN PROGRESS...
        </h1>
        <p className='text-sm text-light-text dark:text-dark-text'>
          &copy; {new Date().getFullYear()}{' '}
          <Link
            href='https://github.com/azsanrd'
            target='_blank'
            rel='noreferrer noopener'
            className='hover:underline'
          >
            AZSA NURWAHYUDI.
          </Link>
        </p>
      </main>
    </div>
  );
}
