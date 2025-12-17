import Redis from 'ioredis';

let redis;

function getRedis() {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL);
  }
  return redis;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const KEY = 'obs-counter-value';
  const client = getRedis();

  try {
    if (req.method === 'GET') {
      const value = await client.get(KEY);
      return res.json({ value: parseInt(value) || 1 });
    }

    if (req.method === 'POST') {
      const { value } = req.body;
      await client.set(KEY, value);
      return res.json({ value: parseInt(value) });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Redis error:', error);
    return res.status(500).json({ error: error.message });
  }
}