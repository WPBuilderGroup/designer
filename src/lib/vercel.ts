const VERCEL_API = 'https://api.vercel.com'

type VercelFile = { file: string; data: string }

type DeployResult = { id: string; url: string }

export async function deployStaticSite(files: VercelFile[], name: string): Promise<DeployResult> {
  const token = process.env.VERCEL_TOKEN
  if (!token) throw new Error('Missing VERCEL_TOKEN')
  const teamId = process.env.VERCEL_TEAM_ID

  const params = new URLSearchParams()
  if (teamId) params.set('teamId', teamId)

  const res = await fetch(`${VERCEL_API}/v13/deployments?${params.toString()}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      files,
      target: 'production'
    })
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Vercel deploy failed: ${res.status} ${text}`)
  }

  const json = await res.json() as { id: string; url: string }
  return { id: json.id, url: `https://${json.url}` }
}

