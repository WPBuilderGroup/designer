export default function Head() {
  return (
    <>
      {/* Load GrapesJS CSS from local public/ to avoid bundler parse issues */}
      <link rel="stylesheet" href="/grapesjs/grapes.min.css" />
    </>
  )
}

