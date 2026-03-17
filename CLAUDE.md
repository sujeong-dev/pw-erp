# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Tech Stack

- **Next.js 16** (App Router, RSC enabled)
- **React 19** with TypeScript
- **Tailwind CSS v4** — uses `@theme inline` blocks in `app/globals.css`, no `tailwind.config.js`
- **shadcn/ui** — style: `radix-mira`, base: `radix`
- **HugeIcons** (`@hugeicons/react`) — this is the configured `iconLibrary`, not `lucide-react`
- **MCP server**: `shadcn` MCP available via `.mcp.json`

## Path Aliases

| Alias | Path |
|---|---|
| `@/components` | UI components |
| `@/components/ui` | shadcn UI primitives |
| `@/lib` | Utilities |
| `@/hooks` | Custom hooks |

`cn()` utility is at `@/lib/utils` — use it for all conditional className merging.

## shadcn/ui Rules

Components are added as source code via CLI: `pnpm dlx shadcn@latest add <component>`

Before adding, check if already installed: `pnpm dlx shadcn@latest info`

### Critical styling rules

- **Semantic colors only** — `bg-primary`, `text-muted-foreground`, never `bg-blue-500`
- **No `space-x-*`/`space-y-*`** — use `flex gap-*` or `flex flex-col gap-*`
- **`size-*` when width = height** — `size-10` not `w-10 h-10`
- **No manual `dark:` overrides** — semantic tokens handle light/dark automatically
- **`className` for layout only** — not for overriding component colors/typography
- **No manual `z-index`** on Dialog, Sheet, Popover, Drawer, etc.

### Icons (HugeIcons)

Import from `@hugeicons/react`. Icons inside `Button` use `data-icon` attribute, no sizing classes:

```tsx
import { Search01Icon } from "@hugeicons/react"

<Button>
  <Search01Icon data-icon="inline-start" />
  Search
</Button>
```

### Forms

Use `FieldGroup` + `Field`, never raw `div` with `space-y-*`:

```tsx
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="email">Email</FieldLabel>
    <Input id="email" />
  </Field>
</FieldGroup>
```

Validation: `data-invalid` on `Field`, `aria-invalid` on the control.

### Component composition

- Dialog/Sheet/Drawer always need a `Title` (use `className="sr-only"` if visually hidden)
- Use full `Card` composition: `CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`
- `Button` has no `isPending`/`isLoading` — compose with `Spinner` + `data-icon` + `disabled`
- Use `Alert` for callouts, `Empty` for empty states, `toast()` from `sonner` for toasts

## RSC Note

Since `rsc: true`, components using `useState`, `useEffect`, event handlers, or browser APIs need `"use client"` at the top of the file.
