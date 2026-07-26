'use client';

import { motion, type HTMLMotionProps } from 'motion/react';

type FadeInProps = HTMLMotionProps<'div'> & { delay?: number };

export function FadeIn({ delay = 0, children, ...props }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4, ease: 'easeOut', delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
