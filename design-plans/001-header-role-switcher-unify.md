# Unify Header role switcher with Sidebar segmented primitive

Written against: d44feabd4dd5d66f16646b5d4d2c8af8be491d4c

## Evidence chain

- Surface: `/dashboard` (and every `/(member)` and `/admin` route) via `app/(member)/layout.tsx:14-21` and `app/admin/layout.tsx:14-21` — `Sidebar` (`lg:flex`) vs `Header` (`lg:hidden` `sticky top-0 h-14`) share the same traced path.
- Problem: Two visual primitives for the same Member/Admin toggle — `Sidebar` renders a quiet segmented control, `Header` renders a single pill that swaps label text. User sees different affordance for the same navigation by viewport.
- Design evidence: Spec + `app/globals.css:430-473` Product Palette intent (“Keep Member/Admin switcher visually quiet and segmented”). `Sidebar.tsx:36-58` is the accepted implementation: container `bg-bg-weak-25 border border-stroke-soft-200 p-1 rounded-md`, segments `h-8 rounded-md text-xs font-medium`, active `bg-bg-white-0 ring-1 ring-stroke-soft-200 text-primary-base shadow-xs`, inactive `text-text-sub-600 hover:text-text-strong-950`.
- Owner: `components/shared/Sidebar.tsx:36` (exemplar), `components/shared/Header.tsx:23`, `app/globals.css:433-448` (`--color-bg-weak-25 #F9FAFB`, `--color-stroke-soft-200 #E5E7EB`, `--color-primary-base #4169D8`, `--color-primary-alpha-10 #EEF2FF`).
- Scope and affected surfaces: `components/shared/Header.tsx:23-29` (primary), `app/(member)/layout.tsx` and `app/admin/layout.tsx` inherit via import. No other surface renders a role switcher.
- Uncertainty: none — both branches proven via `MemberLayout`/`AdminLayout` render and `usePathname` `isAdmin` flag.

## Design decision

Replace the `Header` single-pill toggle with the `Sidebar` segmented primitive, reusing its exact tokens, measurements, and active-state. This resolves the root contradiction (same control, two identities) without inventing a new pattern and preserves the “quiet and segmented” intent across breakpoints.

## Reuse

- `--color-bg-weak-25` (`#F9FAFB`), `--color-bg-white-0` (`#FFFFFF`), `--color-stroke-soft-200` (`#E5E7EB`), `--color-primary-base` (`#4169D8`), `--color-text-sub-600` (`#697386`), `--color-text-strong-950` (`#20242C`)
- `ring-1 ring-stroke-soft-200`, `shadow-xs`, `h-8`, `rounded-md`, `text-xs font-medium`, `focus-visible:ring-primary-base`
- Exemplar: `components/shared/Sidebar.tsx:36-58`

If a new primitive is required, state why: No new primitive — existing system expresses the decision via `Sidebar` composition and `globals.css` tokens.

## Changes

1. `components/shared/Header.tsx:22-29`
   - Change: Replace current single `<Link class="flex h-8 items-center gap-1.5 rounded-lg bg-bg-weak-50 px-2.5">` with segmented container mirroring `Sidebar`: `<div class="flex items-center gap-1 rounded-md bg-bg-weak-25 border border-stroke-soft-200 p-1" role="tablist">` containing two `<Link role="tab" aria-selected>` segments. Segment 1 `href={isAdmin ? "/dashboard" : undefined? keep current logic as two Links: Member → "/dashboard", Admin → "/admin/dashboard"}`. Active segment: `flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-bg-white-0 ring-1 ring-stroke-soft-200 text-primary-base shadow-xs`; inactive: `flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md text-text-sub-600 hover:text-text-strong-950`. Retain `ShieldCheck size-3.5 strokeWidth=1.5` only on Admin segment and `aria-selected`/`focus-visible:ring-primary-base`.
   - Preserve: `isAdmin` detection via `usePathname().startsWith("/admin")`, href destinations (`/dashboard` ↔ `/admin/dashboard`), icon `ShieldCheck`, text labels “Member”/“Admin”, sticky `header h-14 border-b bg-bg-white-0` shell, currentUser avatar/logout block untouched.
   - Verify: At `<lg` viewport, Header shows two equal segments with quiet track (`#F9FAFB`+`#E5E7EB`) and active segment white+ring+blue text matching Sidebar at `≥lg`. Toggle still navigates correctly; focus ring visible; no layout shift in `h-14`.

## Scope

- Inherit: No downstream consumers — `Header` is leaf.
- Verify: `Sidebar.tsx:36` (exemplar unchanged), `app/(member)/layout.tsx:14`, `app/admin/layout.tsx:14` (both import `Header`), visual at 375, 768, 1024, 1440 widths; dark not applicable (light-only).
- Exclude: `BottomNav.tsx` (separate mobile nav, not a role switcher), `Sidebar` quick-demo block already removed, any new switcher variant or icon change, behavioral state management beyond `usePathname`.

## Validation

- Product: As a member on mobile, open `/dashboard` → Header switcher shows “Member” active (blue on white segment) → tap “Admin” → navigates to `/admin/dashboard` and active flips to Admin, visually identical to Sidebar behavior on desktop.
- Interface: Routes `/dashboard`, `/admin/dashboard`, `/discover`, `/admin/members`; states `isAdmin=true/false`; viewports 375, 768, 1024, 1440; `focus-visible` on both segments.
- System: Confirm no new token or class outside `globals.css` palette; `grep -R "bg-bg-weak-50" components/shared/Header.tsx` returns 0 after change; snapshot still passes `Sidebar` token reuse check.
- Repository: `npx tsc --noEmit` → no errors; `npm run build` → 17 routes compiled; `npm run lint` → no new `Header.tsx` errors (existing `temp-alignui.mjs` warnings ignored).

## Stop conditions

- Stop if `Sidebar.tsx:36` exemplar changes or is removed, if `Header` is no longer rendered via `MemberLayout`/`AdminLayout`, or if the role switcher is intended to be a single-action pill (requires spec reversal).

## Design documentation

- After acceptance and validation: none — segmented switcher already documented via `Sidebar` implementation; no new `DESIGN.md` entry required unless team adopts it as canonical primitive.
