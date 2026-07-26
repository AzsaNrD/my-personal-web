import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from './code-block';

function CustomLink({ href = '', children, ...props }: ComponentPropsWithoutRef<'a'>) {
  const isInternal = href.startsWith('/') || href.startsWith('#');
  if (isInternal) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
      {children}
    </a>
  );
}

export const mdxComponents: MDXComponents = {
  a: CustomLink,
  pre: CodeBlock,
};
