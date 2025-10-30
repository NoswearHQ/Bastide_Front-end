// Script pour générer dynamiquement le sitemap.xml depuis l'API
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = process.env.VITE_API_BASE_URL || 'https://api.bastide.com.tn';
const SITE_BASE = 'https://bastide.tn';

// URLs statiques qui seront toujours dans le sitemap
const staticUrls = [
  { loc: `${SITE_BASE}/`, changefreq: 'weekly', priority: '1.0' },
  { loc: `${SITE_BASE}/services`, changefreq: 'weekly', priority: '0.8' },
  { loc: `${SITE_BASE}/produits`, changefreq: 'daily', priority: '0.9' },
  { loc: `${SITE_BASE}/location-materiel`, changefreq: 'weekly', priority: '0.7' },
  { loc: `${SITE_BASE}/actualites`, changefreq: 'weekly', priority: '0.7' },
  { loc: `${SITE_BASE}/engagements`, changefreq: 'weekly', priority: '0.7' },
  { loc: `${SITE_BASE}/catalogue`, changefreq: 'weekly', priority: '0.7' },
  { loc: `${SITE_BASE}/contact`, changefreq: 'weekly', priority: '0.7' },
];

async function fetchAllArticles() {
  try {
    console.log('🔍 Fetching articles from API...');
    
    let allArticles = [];
    let page = 1;
    const limit = 100; // Récupérer 100 articles à la fois
    
    while (true) {
      const response = await fetch(`${API_BASE}/crud/articles?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch articles`);
      }
      
      const data = await response.json();
      
      if (!data.rows || data.rows.length === 0) {
        break; // Plus d'articles
      }
      
      allArticles = allArticles.concat(data.rows);
      console.log(`  📄 Fetched ${data.rows.length} articles from page ${page}`);
      
      // Si on a récupéré tous les articles, on s'arrête
      if (allArticles.length >= data.total) {
        break;
      }
      
      page++;
    }
    
    console.log(`✅ Total articles fetched: ${allArticles.length}`);
    return allArticles;
    
  } catch (error) {
    console.error('❌ Error fetching articles:', error);
    return [];
  }
}

function generateSitemap(articles = []) {
  console.log('\n📝 Generating sitemap.xml...');
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Ajouter les URLs statiques
  staticUrls.forEach(url => {
    sitemap += `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>
`;
  });

  // Ajouter les articles
  articles.forEach(article => {
    if (article.slug) {
      sitemap += `  <url>
    <loc>${SITE_BASE}/articles/${article.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }
  });

  sitemap += '</urlset>\n';
  
  console.log(`✅ Generated sitemap with ${staticUrls.length + articles.length} URLs`);
  
  return sitemap;
}

async function main() {
  try {
    console.log('🚀 Starting sitemap generation...\n');
    
    // Fetch articles
    const articles = await fetchAllArticles();
    
    // Generate sitemap
    const sitemap = generateSitemap(articles);
    
    // Write to public directory
    const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(outputPath, sitemap, 'utf8');
    
    console.log(`\n✅ Sitemap generated successfully at: ${outputPath}`);
    console.log(`📊 Total URLs: ${staticUrls.length + articles.length}`);
    console.log('   - Static URLs:', staticUrls.length);
    console.log('   - Article URLs:', articles.length);
    
  } catch (error) {
    console.error('\n❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

main();

