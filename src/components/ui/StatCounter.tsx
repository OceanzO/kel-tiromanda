'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface StatCounterProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  suffix?: string;
}

export default function StatCounter({ value, label, icon, suffix = '' }: StatCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center justify-center text-center p-6 h-full premium-card border border-primary/10 transition-all duration-300"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {icon && (
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary text-2xl">{icon}</div>
      )}
      <span className={`font-heading font-bold text-accent ${value.includes('Belum') || value.includes('Unknown') ? 'text-lg md:text-xl' : 'text-3xl md:text-4xl'}`}>
        {value}{suffix}
      </span>
      <span className="text-foreground-muted text-sm md:text-base mt-2 font-medium">
        {label}
      </span>
    </motion.div>
  );
}
