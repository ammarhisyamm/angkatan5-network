# Normalize My Profile to the shared design system

Written against: 9a3c9f12b5f47ebb8f263f6c7f7fab2c63d083bf

## Evidence chain

- Surface: `/my-profile`, rendered through `app/(member)/layout.tsx`.
- Problem: The profile page introduces a second visual language: raw `zinc-*` classes, hardcoded colors, custom card treatments, and local tag/input styles appear alongside the shared `kumo-*` system.
- Design evidence: `app/globals.css:430-487` defines the product palette and semantic aliases; `components/ui/Surface.tsx:6` owns cards; `components/ui/Input.tsx:8` owns text inputs; `components/ui/Select.tsx:8` owns selects; `components/ui/Tag.tsx:16` owns tags; `components/ui/Button.tsx:20-26` owns actions.
- Owner: `app/(member)/my-profile/page.tsx:149-634` is the affected composition; shared primitives above are the governing owners.
- Scope and affected surfaces: `/my-profile` only, including hero, Professional, Skills, Availability, Social, danger zone, and share modal. Existing shared primitive consumers remain unchanged.
- Uncertainty: None for token and primitive reuse; verify visual density after replacement at mobile and desktop widths.

## Design decision

Normalize the page onto the existing semantic tokens and shared primitives without changing profile behavior or information architecture. This removes the local styling fork while preserving the page’s current identity and content.

## Reuse

- `kumo-base`, `kumo-tint`, `kumo-line`, `kumo-strong`, `kumo-subtle`, `kumo-inactive`, `kumo-brand`, `error-*`
- `LayerCard`, `Input`, `Textarea`, `Select`, `Tag`/`Badge`, `Button`, `Modal`
- Exemplars: `components/member/ProfileCard.tsx`, `app/(member)/dashboard/page.tsx`, `components/ui/*`

No new primitive is required; the existing system already expresses the profile page’s surfaces, controls, actions, and tags.

## Changes

1. `app/(member)/my-profile/page.tsx:149-603`
   - Change: Replace raw `zinc-*`/hex color classes and local card/tag treatments with matching semantic `kumo-*` and status tokens and shared `LayerCard`/`Tag` compositions. Use existing `Input`/`Textarea`/`Select` and `Button` variants for all editable controls and actions, including the local select helper at the bottom of the file.
   - Preserve: Existing profile fields, edit/save flow, modal flow, links, danger-zone intent, responsive grid, and status semantics.
   - Verify: Hero, cards, tags, fields, links, and modal content use the same color, border, radius, spacing, and focus language as dashboard and member cards; no raw `zinc-*` or hardcoded UI colors remain in this page.

## Scope

- Inherit: Only `/my-profile`; shared primitive APIs are not changed.
- Verify: Empty skills/links, long names and bios, editing states, save confirmation, share modal, and 375/768/1024/1440px widths.
- Exclude: Data model, copy changes, navigation, account deletion behavior, and new design tokens.

## Validation

- Product: View and edit every profile section; save changes; open share modal; confirm all current flows remain intact.
- Interface: Check read/edit states, empty states, long content, tags, links, danger zone, and modal at mobile and desktop widths.
- System: `rg -n 'zinc-|#[0-9A-Fa-f]{6}' 'app/(member)/my-profile/page.tsx'` → no local palette remains; confirm shared primitive usage.
- Repository: `npm run lint` → no new lint errors; `npm run build` → successful production build.

## Stop conditions

- Stop if a required profile treatment cannot be expressed by existing primitives without inventing a new product decision.
- Stop if normalization changes profile behavior or requires changing shared primitive APIs.

## Design documentation

- After acceptance and validation: record that profile surfaces use semantic tokens and shared primitives in `DESIGN.md` when that document is introduced; otherwise none.
