import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { tag_slug, limit, offset } = req.query;
      
      // Get tag
      const { data: tag, error: tagError } = await supabase
        .from('komputeks_tags')
        .select('*')
        .eq('slug', tag_slug)
        .single();
      if (tagError) throw tagError;
      
      // Get posts with this tag
      let query = supabase
        .from('komputeks_post_tags')
        .select('komputeks_posts(*, komputeks_categories(*), komputeks_users(*))', { count: 'exact' })
        .eq('tag_id', tag.id);
      
      if (limit) query = query.limit(parseInt(limit));
      if (offset) query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit || '10') - 1);
      
      const { data, error, count } = await query;
      if (error) throw error;
      
      const posts = data?.map(d => d.komputeks_posts) || [];
      
      return res.status(200).json({ tag, posts, count });
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
