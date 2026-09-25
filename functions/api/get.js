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

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS })
}

export async function onRequestGet(context) {
  const { env } = context

  if (!env.LIGHTFIELD_KV) {
    return json({
      pixels: null,
      name: null,
      history: [],
      message: 'LIGHTFIELD_KV is not configured',
    })
  }

  const raw = await env.LIGHTFIELD_KV.get('pixels')
  let latest = null
  if (raw) {
    try {
      latest = JSON.parse(raw)
    } catch {
      latest = null
    }
  }

  let pixels = null
  let name = null
  if (latest) {
    if (Array.isArray(latest)) {
      pixels = latest
    } else if (Array.isArray(latest.pixels)) {
      pixels = latest.pixels
      name = latest.name || null
    }
  }

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
    .map((e) =>
      Array.isArray(e)
        ? { name: '', pixels: e, time: 0 }
        : { name: e && e.name, pixels: e && e.pixels, time: e && e.time }
    )
    .filter((e) => Array.isArray(e.pixels))
    .map((e) => ({ name: e.name || '', pixels: e.pixels, time: e.time || 0 }))
    .reverse()

  return json({ pixels, name, history })
}