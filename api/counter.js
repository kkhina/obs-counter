import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // CORSヘッダーを設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const KEY = 'obs-counter-value';

  if (req.method === 'GET') {
    // カウンターの値を取得
    const value = await kv.get(KEY) || 1;
    return res.json({ value: parseInt(value) });
  }

  if (req.method === 'POST') {
    // カウンターの値を更新
    const { value } = req.body;
    await kv.set(KEY, value);
    return res.json({ value: parseInt(value) });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}