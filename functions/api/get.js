const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const CACHE_CONTROL = 'public, s-maxage=10, stale-while-revalidate=5'

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json', 'Cache-Control': CACHE_CONTROL },
  })

function normalizeEntry(e) {
  return Array.isArray(e)
    ? { name: '', pixels: e, time: 0 }
    : { name: (e && e.name) || '', pixels: e && e.pixels, time: (e && e.time) || 0 }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function onRequestGet(context) {
  const { request, env } = context

  const fallback = {
    pixels: null,
    name: null,
    time: null,
    history: [],
    random: false,
    message: 'LIGHTFIELD_KV is not configured',
  }

  if (!env.LIGHTFIELD_KV) {
    return json(fallback)
  }

  const url = new URL(request.url)
  const afterParam = Number(url.searchParams.get('after'))
  const after = Number.isFinite(afterParam) && afterParam > 0 ? afterParam : null

  const raw = await env.LIGHTFIELD_KV.get('pixels')
  let latest = null
  if (raw) {
    try {
      latest = JSON.parse(raw)
    } catch {
      latest = null
    }
  }
  latest = latest ? normalizeEntry(latest) : null

  const rawHistory = await env.LIGHTFIELD_KV.get('history')
  let history = []
  if (rawHistory) {
    try {
      history = JSON.parse(rawHistory)
    } catch {
      history = []
    }
  }
  if (!Array.isArray(history)) history = []
  history = history
    .map(normalizeEntry)
    .filter((e) => Array.isArray(e.pixels))
    .reverse()

  const noNew = after !== null && latest && latest.time === after

  if (noNew) {
    const pool = history.filter((e) => e.time !== latest.time)
    const pick = pool.length ? pool[Math.floor(Math.random() * pool.length)] : latest
    return json({ pixels: pick.pixels, name: pick.name, time: pick.time, history, random: true })
  }

  return json({
    pixels: latest ? latest.pixels : null,
    name: latest ? latest.name : null,
    time: latest ? latest.time : null,
    history,
    random: false,
  })
}