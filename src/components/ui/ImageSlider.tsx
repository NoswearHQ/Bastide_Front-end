import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ImageSliderProps = {
  images?: string[];
  intervalMs?: number; // autoplay interval
  className?: string;
};

const defaultImages = Array.from({ length: 8 }).map((_, i) => `/logo/${i + 1}.webp`);

export default function ImageSlider({ images = defaultImages, intervalMs = 4000, className = "" }: ImageSliderProps) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const count = images.length;

  const goTo = (i: number) => setIndex((i + count) % count);
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  useEffect(() => {
    if (count <= 1) return;
    timerRef.current && window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, Math.max(2500, intervalMs));
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [count, intervalMs]);

  const slides = useMemo(() => images.map((src, i) => ({ src, i })), [images]);

  return (
    <div className={`relative w-full overflow-hidden bg-gray-50 border-b border-gray-200 ${className}`} aria-roledescription="carousel">
      {/* Slides */}
      <div className="relative w-full h-[500px] md:h-[600px]">
        {slides.map(({ src, i }) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${i === index ? "opacity-100" : "opacity-0"}`}
            aria-hidden={i !== index}
          >
            <img
              src={src}
              alt="Bannière Bastide"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain object-center"
            />
            {/* Optional overlay for readability if text is added later */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Controls */}
      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Slide précédent"
            onClick={prev}
            className="group absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white shadow transition focus:outline-none focus:ring-2 focus:ring-medical-primary"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700 group-hover:text-gray-900" />
          </button>
          <button
            type="button"
            aria-label="Slide suivant"
            onClick={next}
            className="group absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white shadow transition focus:outline-none focus:ring-2 focus:ring-medical-primary"
          >
            <ChevronRight className="h-5 w-5 text-gray-700 group-hover:text-gray-900" />
          </button>
        </>
      )}

      {/* Dots */}
      {count > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {slides.map(({ i }) => (
            <button
              key={i}
              aria-label={`Aller au slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                i === index ? "bg-white shadow ring-2 ring-white/70 scale-110" : "bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}


