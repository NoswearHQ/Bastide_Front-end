import { useEffect, useState } from "react";
import { safeProductImage } from "@/lib/images";

type Props = { src?: string | null; alt: string; className?: string };

export function ImageThumb({ src, alt, className }: Props) {
  const [imgSrc, setImgSrc] = useState<string>(safeProductImage(src));

  // si la prop src change (changement de page/recherche), on recalcule une seule fois
  useEffect(() => {
    setImgSrc(safeProductImage(src));
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className ?? "w-16 h-16 object-cover rounded-md border bg-gray-50"}
      // IMPORTANT: on remplace par le fallback en **état local** pour ne pas revenir au src cassé
      onError={() => setImgSrc("/images/bastidelogo.png")}
      loading="lazy"
      decoding="async"
    />
  );
}
