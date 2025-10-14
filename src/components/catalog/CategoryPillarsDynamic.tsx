import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getCategories, getProducts, type Category, type Product } from "@/lib/api";
import { imageUrl, parseGallery } from "@/lib/images";

type Pillar = { id: string; slug: string; title: string; total: number; cover: string };

const CACHE_KEY = "bastide:pillars:v1";
const TTL_MS = 6 * 60 * 60 * 1000; // 6h

function coverFromProduct(p?: Product | null): string {
  if (!p) return imageUrl(null);
  const firstGallery = parseGallery(p.galerie_json)[0];
  return imageUrl(p.image_miniature || firstGallery || null);
}

function preload(src: string) {
  if (!src) return;
  const img = new Image();
  img.src = src;
}

function PillarSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-medical bg-white animate-pulse">
      <div className="h-36 bg-gray-200" />
      <div className="p-5">
        <div className="h-5 w-40 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export default function CategoryPillarsDynamic({
  limit = 4,
  onlyTopLevel = true,
  orderBy = "desc",
}: {
  limit?: number;
  onlyTopLevel?: boolean;
  orderBy?: "asc" | "desc";
}) {
  const [pillars, setPillars] = useState<Pillar[] | null>(null);
  const [loading, setLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  // 1) Lecture cache synchrone → rendu instantané
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const { at, data } = JSON.parse(raw);
        if (Array.isArray(data) && Date.now() - at < TTL_MS) {
          setPillars(data);
          setLoading(false); // on affiche tout de suite
        }
      }
    } catch {}
  }, []);

  // 2) Revalidation en arrière-plan (toujours)
  useEffect(() => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    (async () => {
      try {
        const catRes = await getCategories({ limit: 500 });
        let cats: Category[] = (catRes.rows || []).filter(c => (onlyTopLevel ? !c.parent_id : true));

        // Limiter le nombre d’appels parallèles (utile si beaucoup de catégories)
        const take = cats.slice(0, 12); // ajustable

        // Construit les promesses en parallèle avec un timeout de 5s par requête
        const withData = await Promise.all(
          take.map(async (c) => {
            if (ac.signal.aborted) return null;
            const p = new Promise<Pillar>(async (resolve) => {
              try {
                const res = await getProducts({ categoryId: c.id, limit: 1, page: 1 });
                const first = res.rows?.[0] ?? null;
                const total = Number(res.total || 0);
                const cover = coverFromProduct(first);
                resolve({ id: c.id, slug: c.slug, title: c.nom, total, cover });
              } catch {
                resolve({ id: c.id, slug: c.slug, title: c.nom, total: 0, cover: imageUrl(null) });
              }
            });
            // timeout 5s
            const timeout = new Promise<Pillar>((resolve) =>
              setTimeout(() => resolve({ id: c.id, slug: c.slug, title: c.nom, total: 0, cover: imageUrl(null) }), 5000)
            );
            return Promise.race([p, timeout]);
          })
        );

        const filtered = (withData.filter(Boolean) as Pillar[]).filter(x => x.total > 0);

        filtered.sort((a, b) => (orderBy === "asc" ? a.total - b.total : b.total - a.total));
        const final = filtered.slice(0, limit);

        // Précharge les images
        final.forEach(f => preload(f.cover));

        setPillars(final);
        setLoading(false);

        // Écrit dans le cache
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: final }));
        } catch {}
      } catch {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [limit, onlyTopLevel, orderBy]);

  // UI
  if (loading && !pillars) {
    return (
      <div className="medical-grid medical-grid--4">
        <PillarSkeleton /><PillarSkeleton /><PillarSkeleton /><PillarSkeleton />
      </div>
    );
  }

  if (!pillars || pillars.length === 0) {
    return <div className="text-center text-gray-500">Aucune catégorie disponible pour le moment.</div>;
  }

  return (
    <div className="medical-grid medical-grid--4">
      {pillars.map((p) => (
        <Link
          key={p.id}
          to={`/produits?categoryId=${p.id}`}
          className="group rounded-2xl overflow-hidden shadow-medical bg-white hover:shadow-medical-xl transition"
        >
          <div className="h-36 w-full overflow-hidden">
            <img
              src={p.cover}
              alt={p.title}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
              loading="lazy"
            />
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <ArrowRight className="h-4 w-4 opacity-60 group-hover:translate-x-0.5 group-hover:opacity-100 transition" />
            </div>
            <p className="text-sm text-gray-600">{p.total} articles</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
