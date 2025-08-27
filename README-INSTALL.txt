Install steps (src/ structure):

1) Packages
   npm i grapesjs grapesjs-preset-webpage pg
   npm i -D ts-node tsconfig-paths typescript

2) Docker
   docker compose up -d

3) .env.local
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/grapes_saas
   PUBLIC_BASE_DOMAIN=pages.localtest.me

4) Run migrations
   - Open http://localhost:8080 (Adminer)
   - Execute SQL: schema.sql

5) Seed templates
   npx ts-node -r tsconfig-paths/register scripts/seed-landing-templates.ts

6) Start dev
   npm run dev

7) Flow
   /workspaces -> create workspace
   /workspaces/{ws}/projects -> create project (choose template)
   /(admin)/builder?project={slug}&page=home -> edit -> Publish
   open http://{slug}.pages.localtest.me:3000/
