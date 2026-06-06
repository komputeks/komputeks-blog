import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { slug } = req.query;
      
      if (slug) {
        const { data, error } = await supabase
          .from('komputeks_tags')
          .select('*')
          .eq('slug', slug)
          .single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      
      const { data, error } = await supabase
        .from('komputeks_tags')
        .select('*')
        .order('name');
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    if (req.method === 'POST') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      
      const { name, slug } = req.body;
      const { data, error } = await supabase
        .from('komputeks_tags')
        .insert({ name, slug })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    
    if (req.method === 'PUT') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      
      const { id, name, slug } = req.body;
      const { data, error } = await supabase
        .from('komputeks_tags')
        .update({ name, slug })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    if (req.method === 'DELETE') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      
      const { id } = req.body;
      await supabase.from('komputeks_post_tags').delete().eq('tag_id', id);
      const { error } = await supabase.from('komputeks_tags').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
