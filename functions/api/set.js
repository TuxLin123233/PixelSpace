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

export async function onRequestPost(context) {
  const { request, env } = context

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const pixels = Array.isArray(body) ? body : body && body.pixels
  const isValid =
    Array.isArray(pixels) &&
    pixels.length === 256 &&
    pixels.every((p) => Array.isArray(p) && p.length === 3)
  if (!isValid) {
    return json({ error: 'pixels 必须是 256×3 的二维数组（每个元素是 [r,g,b]）' }, 400)
  }

  const bodyName = body && typeof body.name === 'string' ? body.name : ''
  const headerName = request.headers.get('X-Draw-Name')
  const queryName = new URL(request.url).searchParams.get('name')
  const name = (bodyName || headerName || queryName || '').trim()
  if (!name) {
    return json({ error: '缺少 name（请带上你的名字）' }, 400)
  }

  if (!env.LIGHTFIELD_KV) {
    return json({ error: 'LIGHTFIELD_KV is not configured' }, 500)
  }

  const entry = { name, pixels, time: Date.now() }

  try {
    await env.LIGHTFIELD_KV.put('pixels', JSON.stringify(entry))

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

    history = [...history, entry].slice(-10)
    await env.LIGHTFIELD_KV.put('history', JSON.stringify(history))
  } catch (err) {
    return json({ error: 'KV write failed: ' + err.message }, 500)
  }

  return json({ ok: true, count: pixels.length, name })
}