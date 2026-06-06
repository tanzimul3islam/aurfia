'use client';

import { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority,
  className,
  imgClassName,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(priority ?? false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inView) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  useEffect(() => {
    if (!inView) return;
    const img = containerRef.current?.querySelector('img');
    if (img?.complete) {
      setLoaded(true);
    }
  }, [inView]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', aspectRatio: `${width}/${height}` }}
    >
      <div
        className="absolute inset-0 bg-brand-light"
        style={{ opacity: loaded ? 0 : 1, transition: 'opacity 0.4s ease-out' }}
      />
      {inView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          loading={priority ? 'eager' : 'lazy'}
          className={imgClassName}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease-out' }}
        />
      )}
    </div>
  );
}
