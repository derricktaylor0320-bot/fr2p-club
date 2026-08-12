import { useState } from "react";

interface EmblemImageProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

export function EmblemImage({ src, fallbackSrc, alt, className, loading = "lazy" }: EmblemImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [usedFallback, setUsedFallback] = useState(false);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => {
        if (!usedFallback) {
          setUsedFallback(true);
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
