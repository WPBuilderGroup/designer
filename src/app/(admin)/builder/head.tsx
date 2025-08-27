export default function Head() {
  return (
    <>
      {/* GrapesJS stylesheet loaded via CDN to avoid Turbopack CSS parsing issues */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/grapesjs@0.21.13/dist/css/grapes.min.css"
      />
    </>
  )
}

