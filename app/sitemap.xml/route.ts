import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hauslash.co'

  const staticPages = [
    { url: '', priority: 1.0, changefreq: 'daily' },
    { url: '/services', priority: 0.9, changefreq: 'weekly' },
    { url: '/about', priority: 0.8, changefreq: 'monthly' },
    { url: '/contact', priority: 0.8, changefreq: 'monthly' },
    { url: '/aftercare', priority: 0.8, changefreq: 'monthly' },
    { url: '/book', priority: 0.95, changefreq: 'daily' },
    { url: '/policies', priority: 0.7, changefreq: 'yearly' },
  ]

  // Get services from database for additional sitemap entries
  let services: any[] = []
  try {
    const sql = getDb()
    const rows = await sql`SELECT slug FROM services WHERE active = true`
    services = rows
  } catch (error) {
    console.error('Error fetching services for sitemap:', error)
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  `.trim()
    )
    .join('\n')}
  ${services
    .map(
      (service) => `
  <url>
    <loc>${baseUrl}/book?service=${service.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  `.trim()
    )
    .join('\n')}
</urlset>`

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
