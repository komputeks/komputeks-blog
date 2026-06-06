import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { slug, parent_id } = req.query;
      
      let query = supabase.from('komputeks_categories').select('*');
      
      if (slug) {
        query = query.eq('slug', slug).single();
        const { data, error } = await query;
        if (error) throw error;
        // Get children
        const { data: children } = await supabase
          .from('komputeks_categories')
          .select('*')
          .eq('parent_id', data.id);
        data.children = children || [];
        return res.status(200).json(data);
      }
      
      if (parent_id !== undefined) {
        query = query.eq('parent_id', parent_id === 'null' ? null : parseInt(parent_id));
      }
      
      query = query.order('name');
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    if (req.method === 'POST') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      
      const { name, slug, description, parent_id } = req.body;
      const { data, error } = await supabase
        .from('komputeks_categories')
        .insert({ name, slug, description, parent_id: parent_id || null })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    
    if (req.method === 'PUT') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      
      const { id, name, slug, description, parent_id } = req.body;
      const { data, error } = await supabase
        .from('komputeks_categories')
        .update({ name, slug, description, parent_id: parent_id || null })
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
      const { error } = await supabase.from('komputeks_categories').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
