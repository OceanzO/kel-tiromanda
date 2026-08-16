import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://tiromanda.tanatorajakab.go.id';

  // Define static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  try {
    // Fetch dynamic news routes
    const { data: news } = await supabase
      .from('news')
      .select('id, updated_at, date')
      .order('date', { ascending: false });

    if (news) {
      const newsRoutes = news.map((item) => ({
        url: `${baseUrl}/berita/${item.id}`,
        lastModified: new Date(item.updated_at || item.date || Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }));
      routes.push(...newsRoutes);
    }
  } catch (error) {
    console.error('Failed to fetch news for sitemap:', error);
  }

  return routes;
}
