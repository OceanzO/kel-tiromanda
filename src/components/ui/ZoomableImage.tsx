'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaSearchPlus } from 'react-icons/fa';
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

interface ZoomableImageProps {
  src: string;
  alt: string;
  fallbackText: string;
}

export default function ZoomableImage({ src, alt, fallbackText }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400 font-medium text-center px-6">{fallbackText}</p>
      </div>
    );
  }

  return (
    <>
      <div 
        className="relative w-full h-full min-h-[300px] cursor-zoom-in group overflow-hidden rounded-xl border border-black/5 bg-white"
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain transition-transform duration-500 group-hover:scale-105"
          onError={() => setHasError(true)}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="bg-white/95 text-black px-5 py-2.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 font-bold text-sm">
            <FaSearchPlus className="text-accent" /> Lihat Penuh
          </div>
        </div>
      </div>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={[{ src, alt }]}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 5,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 300,
          doubleClickMaxStops: 2,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: true,
        }}
        carousel={{ finite: true }}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
      />
    </>
  );
}
