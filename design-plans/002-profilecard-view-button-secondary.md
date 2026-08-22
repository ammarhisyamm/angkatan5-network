# Normalize ProfileCard View action to neutral secondary hierarchy

Written against: d44feabd4dd5d66f16646b5d4d2c8af8be491d4c

## Evidence chain

- Surface: `/dashboard` Featured Community Members grid via `app/(member)/dashboard/page.tsx:98-107` (`grid md:grid-cols-2 gap-4` → `ProfileCard×4`) adjacent to Latest Opportunities grid `app/(member)/dashboard/page.tsx:118-127` (`OpportunityCard×3`).
- Problem: Same affordance (“View” on a card) renders opposing hierarchies — `ProfileCard` blue `subtle` (primary) vs `OpportunityCard` gray `secondary` (neutral), diluting the “blue as sole primary” rule and making two sibling sections compete.
- Design evidence: `components/ui/Button.tsx:82-96` compatibility wrapper maps `subtle→primary/lighter (bg-primary-alpha-10 #EEF2FF text-primary-base #4169D8)` vs `secondary→neutral/lighter (bg-bg-weak-50 #F7F8FA text-text-sub-600 #697386)`; palette intent `app/globals.css:441-448` declares `#4169D8` as sole primary and `#EEF2FF` as subtle, with neutral surfaces for secondary actions.
- Owner: `components/member/ProfileCard.tsx:59` (`variant="subtle"`), `components/member/OpportunityCard.tsx:79` (`variant="secondary"`), `components/ui/Button.tsx:89-96` (`variantMap`), `app/globals.css:441-448`.
- Scope and affected surfaces: `components/member/ProfileCard.tsx:58-61` (primary change), consumers `app/(member)/dashboard/page.tsx:101`, `app/(member)/discover/page.tsx` (if it renders `ProfileCard`), `app/(member)/profile/[id]/page.tsx` (profile detail may reuse card). `OpportunityCard` is reference exemplar, not changed.
- Uncertainty: none — mapping and render proven via imports; no ambiguity in hierarchy intent (welcome header’s `Complete Profile` remains the blue `subtle` primary).

## Design decision

Change `ProfileCard` “View Profile” button from `variant="subtle"` (blue) to `variant="secondary"` (neutral/gray), aligning it with `OpportunityCard` “View” and reserving blue for the single primary action in the Welcome header (`Complete Profile`). This restores the 60/30/10 neutral-dominant hierarchy without creating a new variant.

## Reuse

- `Button` `variant="secondary"` → `neutral/lighter` (`bg-bg-weak-50 text-text-sub-600 ring-transparent hover:bg-bg-white-0 hover:text-text-strong-950 hover:ring-stroke-soft-200`) and `size="sm"` → `xsmall` (`h-8 gap-1.5 rounded-lg px-3 text-[13px]`)
- `--color-bg-weak-50 #F7F8FA`, `--color-text-sub-600 #697386`, `--color-stroke-soft-200 #E5E7EB`, `focus-visible:ring-primary-base` retained
- Exemplar: `components/member/OpportunityCard.tsx:79`

If a new primitive is required, state why: No new primitive — `secondary` already exists and expresses the neutral View action.

## Changes

1. `components/member/ProfileCard.tsx:58-61`
   - Change: `<Button variant="subtle" size="sm">View Profile <ArrowRight .../></Button>` → `<Button variant="secondary" size="sm">View Profile <ArrowRight className="size-3.5" strokeWidth={1.5} /></Button>` (retain `size="sm"` mapping to `xsmall`, `ArrowRight`, `Link href={`/profile/${member.id}`}` wrapper, `StatusBadge` left of footer).
   - Preserve: Card `rounded-xl border-stroke-soft-200 bg-bg-white-0 p-5`, avatar `size-12 ring-1`, verified badge `bg-primary-base`, name `text-base font-semibold`, role `text-sm text-text-sub-600`, company `text-xs text-text-soft-400`, bio `line-clamp-2 text-sm`, `Tag` `bg-[#F2F4F7] text-[#475467]` (`Tag.tsx:8`), footer `border-t px-5 py-3`.
   - Verify: All `ProfileCard` instances show gray View button (`#F7F8FA` bg, `#697386` text, hover white bg + `#E5E7EB` ring) visually matching `OpportunityCard` View buttons in the same viewport; welcome `Complete Profile` remains the only blue `subtle` button on `/dashboard`.

## Scope

- Inherit: `app/(member)/dashboard/page.tsx:101` Featured grid, `app/(member)/discover/page.tsx` (any `ProfileCard` list), any other `ProfileCard` consumer.
- Verify: `OpportunityCard.tsx:79` (exemplar unchanged), `app/(member)/dashboard/page.tsx:68` welcome `Button variant="subtle"` (must stay blue), `Tag.tsx:8` neutral tags (must stay `#F2F4F7/#475467`), `Button.tsx` variantMap.
- Exclude: Changing `OpportunityCard` tone, altering `StatusBadge` semantics (`success/warning/primary`), or introducing a new button variant; `discover` filters/sort logic.

## Validation

- Product: On `/dashboard`, 4 featured cards and 3 opportunity cards all show gray View buttons with identical hover; only “Complete Profile” is blue. Member can still tap “View Profile” → navigates to `/profile/[id]`.
- Interface: Routes `/dashboard`, `/discover`; card states with 0–3+ skill tags, verified/unverified badge, long names; viewports 375, 768, 1024, 1440; button `hover`, `focus-visible`, `disabled` (not used here).
- System: Confirm `grep -R 'ProfileCard' --include="*.tsx" app` shows only `variant="secondary"` for View; no new `bg-primary-alpha-10` on ProfileCard footers; token reuse passes `secondary` → `neutral/lighter`.
- Repository: `npx tsc --noEmit` → no errors; `npm run build` → 17 routes compiled; `npm run lint` → no new `ProfileCard.tsx` errors.

## Stop conditions

- Stop if `Button.tsx:89` `variantMap` changes meaning of `secondary`/`subtle`, if `ProfileCard` is intentionally designated a primary CTA surface (requires product decision reversal), or if `OpportunityCard` exemplar switches away from `secondary`.

## Design documentation

- After acceptance and validation: Record in `DESIGN.md` (when created) or code comment at `components/ui/Button.tsx:89`: “Card View actions use `secondary` (neutral/lighter); `subtle` (primary/lighter) reserved for single primary per view (e.g., Complete Profile on dashboard).”
