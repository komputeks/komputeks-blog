import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { slug, category, tag, search, featured, breaking, editors_pick, limit, offset, status } = req.query;
      
      let query = supabase.from('komputeks_posts').select('*, komputeks_categories(*), komputeks_users(*)', { count: 'exact' });
      
      if (slug) {
        query = query.eq('slug', slug).single();
        const { data, error } = await query;
        if (error) throw error;
        // Get tags for this post
        const { data: postTags } = await supabase
          .from('komputeks_post_tags')
          .select('komputeks_tags(*)')
          .eq('post_id', data.id);
        data.tags = postTags?.map(pt => pt.komputeks_tags) || [];
        // Get comments
        const { data: comments } = await supabase
          .from('komputeks_comments')
          .select('*')
          .eq('post_id', data.id)
          .order('created_at', { ascending: false });
        data.comments = comments || [];
        return res.status(200).json(data);
      }
      
      if (category) query = query.eq('category_id', parseInt(category));
      if (search) query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,content.ilike.%${search}%`);
      if (featured === 'true') query = query.eq('is_featured', true);
      if (breaking === 'true') query = query.eq('is_breaking', true);
      if (editors_pick === 'true') query = query.eq('is_editors_pick', true);
      if (status) query = query.eq('status', status);
      else query = query.eq('status', 'published');
      
      query = query.order('published_at', { ascending: false });
      
      if (limit) query = query.limit(parseInt(limit));
      if (offset) query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit || '10') - 1);
      
      const { data, error, count } = await query;
      if (error) throw error;
      
      // Get tags for each post
      if (data) {
        for (const post of data) {
          const { data: postTags } = await supabase
            .from('komputeks_post_tags')
            .select('komputeks_tags(*)')
            .eq('post_id', post.id);
          post.tags = postTags?.map(pt => pt.komputeks_tags) || [];
        }
      }
      
      return res.status(200).json({ data, count });
    }
    
    if (req.method === 'POST') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      
      const { data: { user } } = await supabase.auth.getUser(token);
      if (!user) return res.status(401).json({ error: 'Unauthorized' });
      
      const { title, slug, excerpt, content, cover_image, category_id, status, is_featured, is_breaking, is_editors_pick, tags } = req.body;
      
      const { data, error } = await supabase
        .from('komputeks_posts')
        .insert({ title, slug, excerpt, content, cover_image, category_id, author_id: user.id, status, is_featured, is_breaking, is_editors_pick })
        .select()
        .single();
      if (error) throw error;
      
      // Add tags
      if (tags && tags.length > 0) {
        const tagInserts = tags.map(tag_id => ({ post_id: data.id, tag_id }));
        await supabase.from('komputeks_post_tags').insert(tagInserts);
      }
      
      return res.status(201).json(data);
    }
    
    if (req.method === 'PUT') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      
      const { id, title, slug, excerpt, content, cover_image, category_id, status, is_featured, is_breaking, is_editors_pick, tags, views } = req.body;
      
      const updateData = { title, slug, excerpt, content, cover_image, category_id, status, is_featured, is_breaking, is_editors_pick, updated_at: new Date().toISOString() };
      if (views !== undefined) updateData.views = views;
      
      const { data, error } = await supabase
        .from('komputeks_posts')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      
      // Update tags
      if (tags) {
        await supabase.from('komputeks_post_tags').delete().eq('post_id', id);
        if (tags.length > 0) {
          const tagInserts = tags.map(tag_id => ({ post_id: id, tag_id }));
          await supabase.from('komputeks_post_tags').insert(tagInserts);
        }
      }
      
      return res.status(200).json(data);
    }
    
    if (req.method === 'DELETE') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      
      const { id } = req.body;
      await supabase.from('komputeks_post_tags').delete().eq('post_id', id);
      await supabase.from('komputeks_comments').delete().eq('post_id', id);
      const { error } = await supabase.from('komputeks_posts').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
