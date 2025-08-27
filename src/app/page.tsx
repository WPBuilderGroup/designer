import Link from 'next/link'

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Designer studio</h1>
      <p className="mt-2">
        Go to <Link className="underline" href="/workspaces">/workspaces</Link>
      </p>
    </main>
  )
}
