# Normalize profile heading hierarchy

Written against: 9a3c9f12b5f47ebb8f263f6c7f7fab2c63d083bf

## Evidence chain

- Surface: `/my-profile`, especially the two-column profile content layout.
- Problem: Primary left-column sections use `<h2>`, while secondary right-column sections use `<h3>`, but all four section headings share the same `19px`, bold, `leading-7` presentation. Semantic hierarchy and visual hierarchy therefore disagree.
- Design evidence: The application already distinguishes page titles, section titles, and card titles through `text-page-title`, `text-section-title`, and `text-card-title` in `app/globals.css` and across dashboard/admin pages.
- Owner: `app/(member)/my-profile/page.tsx:280-507`; type tokens are owned by `app/globals.css`.
- Scope and affected surfaces: Professional, Skills, Availability, and Social sections on `/my-profile`.
- Uncertainty: None; preserve the existing document structure and map visual levels to the existing type scale.

## Design decision

Use the shared heading scale so `<h2>` profile sections receive the established section-title treatment and `<h3>` side-column sections receive the established card-title treatment. Keep the heading elements and section order unchanged.

## Reuse

- `text-section-title` for primary section headings
- `text-card-title` for secondary/card headings
- Exemplar: `app/(member)/dashboard/page.tsx:70-80` and `app/admin/skills/page.tsx:101-108`

No new typography token is required.

## Changes

1. `app/(member)/my-profile/page.tsx:282-285,333-337,404-407,492-495`
   - Change: Replace the local `text-[19px] font-bold leading-7 text-[#111827]` treatment with `text-section-title text-kumo-strong` for Professional and Skills, and `text-card-title text-kumo-strong` for Availability and Social. Keep `<h2>`/`<h3>` semantics, icons, labels, and count badge.
   - Preserve: Existing section layout, edit controls, responsive columns, and heading content.
   - Verify: Visual size and weight communicate the same hierarchy as the DOM structure; icons and action controls remain aligned.

## Scope

- Inherit: Only the four section headers on `/my-profile`.
- Verify: Read/edit states and 375/768/1024/1440px widths.
- Exclude: Hero name, danger-zone heading, page title, section order, and content copy.

## Validation

- Product: Navigate `/my-profile` and confirm all sections remain discoverable and editable.
- Interface: Compare primary and secondary section headings in read and edit states across responsive widths.
- System: Confirm no `text-[19px] font-bold` profile section heading remains and existing type tokens are reused.
- Repository: `npm run lint` → no new lint errors; `npm run build` → successful production build.

## Stop conditions

- Stop if the type tokens are removed or no longer represent the documented heading scale.

## Design documentation

- After acceptance and validation: none; this reuses the existing type scale.
