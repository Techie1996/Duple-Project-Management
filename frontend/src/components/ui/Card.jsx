import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function Card({ children, className, hover, ...props }) {
  const Comp = hover ? motion.div : 'div';
  const extra = hover
    ? { whileHover: { y: -2 }, transition: { duration: 0.18 }, className: 'cursor-pointer' }
    : {};
  return (
    <Comp
      className={cn(
        'rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-card backdrop-blur transition-shadow',
        hover && 'hover:shadow-card-hover hover:border-slate-300',
        className
      )}
      {...extra}
      {...props}
    >
      {children}
    </Comp>
  );
}
