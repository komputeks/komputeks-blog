import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { post_id } = req.query;
      
      // Get current post
      const { data: currentPost } = await supabase
        .from('komputeks_posts')
        .select('published_at')
        .eq('id', parseInt(post_id))
        .single();
      
      if (!currentPost) return res.status(404).json({ error: 'Post not found' });
      
      // Get previous post
      const { data: prevPost } = await supabase
        .from('komputeks_posts')
        .select('id, title, slug, cover_image')
        .eq('status', 'published')
        .lt('published_at', currentPost.published_at)
        .order('published_at', { ascending: false })
        .limit(1)
        .single();
      
      // Get next post
      const { data: nextPost } = await supabase
        .from('komputeks_posts')
        .select('id, title, slug, cover_image')
        .eq('status', 'published')
        .gt('published_at', currentPost.published_at)
        .order('published_at', { ascending: true })
        .limit(1)
        .single();
      
      return res.status(200).json({ prev: prevPost || null, next: nextPost || null });
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
