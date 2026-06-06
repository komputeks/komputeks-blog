import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { id } = req.query;
      
      if (id) {
        const { data, error } = await supabase
          .from('komputeks_users')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return res.status(200).json(data);
      }
      
      const { data, error } = await supabase
        .from('komputeks_users')
        .select('*')
        .order('full_name');
      if (error) throw error;
      return res.status(200).json(data);
    }
    
    if (req.method === 'POST') {
      const { id, email, full_name, avatar_url, bio, role } = req.body;
      const { data, error } = await supabase
        .from('komputeks_users')
        .insert({ id, email, full_name, avatar_url, bio, role })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    
    if (req.method === 'PUT') {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ error: 'Unauthorized' });
      
      const { id, full_name, avatar_url, bio, role } = req.body;
      const { data, error } = await supabase
        .from('komputeks_users')
        .update({ full_name, avatar_url, bio, role })
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
      const { error } = await supabase.from('komputeks_users').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
