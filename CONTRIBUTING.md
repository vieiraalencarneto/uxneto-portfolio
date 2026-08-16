# Contributing

## GitHub Workflow

Every task follows this flow: Issue -> Branch -> PR -> Merge = Deploy.

### 1. Issue first

Before any work, check if an open issue exists. If not:

```bash
gh issue create --title "feat: description" --label feature
```

Labels: `feature`, `fix`, `content`, `seo`, `performance`, `analytics`.

### 2. Branch per issue

```bash
git checkout -b issue-<number>-<short-slug>
# e.g. issue-3-supabase-schema
```

Never commit directly to `master`.

### 3. Commit messages

Conventional Commits format, with optional issue reference:

```
feat: add home page scroll UI (refs #5)
fix: sanitize HTML in case study content (refs #8)
chore: update Biome config
```

The `commit-msg` hook runs commitlint automatically.

### 4. PR to master

```bash
git push -u origin issue-<number>-<short-slug>
gh pr create --title "feat: ..." --body "$(cat <<'EOF'
Closes #<number>

## What changed
- ...

## Verification
- [ ] ...
EOF
)"
```

The PR body must start with `Closes #<number>`.

### 5. Merge = Deploy

Merging to `master` triggers Vercel deploy automatically.
Only merge when the feature is working and verified in preview.

---

## Local setup

```bash
cp .env.example .env.local
# fill in Supabase credentials

npm install
npm run dev
```

## Scripts

```bash
npm run lint          # biome lint
npm run format        # biome format --write
npm run type-check    # tsc --noEmit
npm run test          # vitest run
npm run test:e2e      # playwright test
npm run import:csv:dry   # preview CSV import (no DB writes)
npm run import:csv       # run live CSV import
```
