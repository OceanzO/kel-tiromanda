'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    // Extract numeric part from value string
    const numericMatch = value.replace(/[,.\s]/g, '').match(/\d+/);
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNum = parseInt(numericMatch[0]);
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;
    const increment = targetNum / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNum) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        // Format with locale
        const formatted = Math.floor(current).toLocaleString('id-ID');
        setDisplayValue(formatted);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

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
      <span className={`font-heading font-bold text-accent ${displayValue.includes('Belum') ? 'text-lg md:text-xl' : 'text-3xl md:text-4xl'}`}>
        {displayValue}{suffix}
      </span>
      <span className="text-foreground-muted text-sm md:text-base mt-2 font-medium">
        {label}
      </span>
    </motion.div>
  );
}
