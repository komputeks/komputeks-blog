import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { post_id } = req.query;
      let query = supabase.from('komputeks_comments').select('*');
      if (post_id) query = query.eq('post_id', parseInt(post_id));
      query = query.order('created_at', { ascending: false });
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    if (req.method === 'POST') {
      const { post_id, author_name, author_email, content } = req.body;
      const { data, error } = await supabase
        .from('komputeks_comments')
        .insert({ post_id, author_name, author_email, content })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    
    if (req.method === 'DELETE') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      
      const { id } = req.body;
      const { error } = await supabase.from('komputeks_comments').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
