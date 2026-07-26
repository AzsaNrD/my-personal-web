'use client';

import { useEffect, useState } from 'react';

type Props = {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseAfterTyped?: number;
  className?: string;
};

export function Typewriter({
  words,
  typingSpeed = 90,
  deletingSpeed = 40,
  pauseAfterTyped = 1500,
  className,
}: Props) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;
    const word = words[idx];

    if (!deleting && text === word) {
      const t = setTimeout(() => setDeleting(true), pauseAfterTyped);
      return () => clearTimeout(t);
    }

    if (deleting && text === '') {
      setDeleting(false);
      setIdx((i) => (i + 1) % words.length);
      return;
    }

    const t = setTimeout(
      () => {
        setText((current) => (deleting ? current.slice(0, -1) : word.slice(0, current.length + 1)));
      },
      deleting ? deletingSpeed : typingSpeed,
    );
    return () => clearTimeout(t);
  }, [text, deleting, idx, words, typingSpeed, deletingSpeed, pauseAfterTyped]);

  return (
    <span className={className}>
      <span>{text}</span>
      <span
        aria-hidden
        className="bg-primary ml-0.5 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] animate-[blink_1s_steps(2,start)_infinite]"
      />
    </span>
  );
}
