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
    return json({ pixels: null, message: 'LIGHTFIELD_KV is not configured' })
  }

  const raw = await env.LIGHTFIELD_KV.get('pixels')
  let pixels = null
  if (raw) {
    try {
      pixels = JSON.parse(raw)
    } catch {
      pixels = null
    }
  }

  return json({ pixels })
}