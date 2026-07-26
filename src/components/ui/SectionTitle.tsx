'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  theme?: 'light' | 'dark';
}

export default function SectionTitle({
  title,
  subtitle,
  align = 'center',
  theme = 'light',
}: SectionTitleProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[align];

  const textColor = theme === 'dark' ? 'text-white' : 'text-foreground';
  const subtitleColor = theme === 'dark' ? 'text-white/70' : 'text-foreground-muted';

  return (
    <motion.div
      ref={ref}
      className={`flex flex-col ${alignClass} mb-12 md:mb-16`}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2
        className={`font-heading text-3xl md:text-4xl lg:text-5xl font-bold ${textColor} mb-4`}
      >
        {title}
      </h2>

      {/* Toraja Accent Divider */}
      <div className="toraja-divider w-48 md:w-64">
        <div className="toraja-icon" />
      </div>

      {subtitle && (
        <p className={`${subtitleColor} text-base md:text-lg max-w-2xl mt-2 leading-relaxed`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
