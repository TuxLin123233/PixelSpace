const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })

async function readHistory(kv) {
  const raw = await kv.get('history')
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function onRequestPost(context) {
  const { request, env } = context

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const time = Number(body && body.time)
  if (!Number.isFinite(time)) {
    return json({ error: '缺少 time 字段' }, 400)
  }

  if (!env.LIGHTFIELD_KV) {
    return json({ error: 'LIGHTFIELD_KV is not configured' }, 500)
  }

  const history = await readHistory(env.LIGHTFIELD_KV)
  const idx = history.findIndex((e) => (e.time || 0) === time)
  if (idx === -1) {
    return json({ error: '作品不存在' }, 404)
  }

  history[idx].likes = (history[idx].likes || 0) + 1

  try {
    await env.LIGHTFIELD_KV.put('history', JSON.stringify(history))
  } catch (err) {
    return json({ error: 'KV write failed: ' + err.message }, 500)
  }

  return json({ ok: true, likes: history[idx].likes })
}

export async function onRequestGet(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const topParam = Number(url.searchParams.get('top'))
  const top = Number.isFinite(topParam) && topParam > 0 ? Math.floor(topParam) : 10

  if (!env.LIGHTFIELD_KV) {
    return json({ works: [] })
  }

  const history = await readHistory(env.LIGHTFIELD_KV)
  const sorted = history
    .filter((e) => Array.isArray(e.pixels))
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, top)
    .map((e) => ({
      pixels: e.pixels,
      name: e.name || '',
      time: e.time || 0,
      likes: e.likes || 0,
    }))

  return json({ works: sorted })
}