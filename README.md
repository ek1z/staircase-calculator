# Staircase Calculator

An interactive sizing tool for straight-flight staircases (Finnish: *Portaiden askelluslaskuri*).
Enter the floor-to-floor height, the available horizontal run, and the stringboard
width, and the tool computes the number of steps, the rise and the going, and checks
them against the building-code limits.

A live architectural section is drawn from the inputs, including the stringboard.

## Features

- Rise and going computed for the chosen number of steps (adjustable).
- A recommendation that lands closest to the comfort rule `2 × rise + going ≈ 600–630 mm`.
- Code-compliance check per stair type (limits from Finnish decree YM 1007/2017).
- Stringboard geometry: pitch angle, vertical (plumb-cut) height, height of the lower
  edge at the top end, and the minimum width needed to seat a step.
- Live SVG section with dimension lines.
- The full input set lives in the URL query string, so any configuration can be
  bookmarked or shared by copying the link.

## Sizing basis

The limits come from the Finnish Ministry of the Environment decree on the safety of
use of buildings (YM 1007/2017). Applied maximum rise / minimum going (mm):

| Stair type | rise ≤ | going ≥ |
|---|---|---|
| Interior stair of a dwelling / accommodation unit | 190 | 250 |
| Interior stair of other primary-use spaces | 180 | 270 |
| Escape / loft or attic stair (not serving living spaces) | 220 | 220 |
| Administrative, service and retail spaces, assembly spaces | 160 | 300 |
| Exit / egress stair | 180 | 270 |
| Covered or heated exterior stair | 160 | 300 |
| Uncovered, unheated exterior stair | 130 | 390 |

The comfort rule `2 × rise + going ≈ 600–630 mm` is an established design guideline,
not a numeric value from the decree. Always confirm the interpretation with your local
building authority.

### Formulas

- rise `= H / n` (n = number of risers)
- going `= L / (n − 1)`
- pitch angle (along the nosing line) `θ = atan(rise / going)`
- stringboard vertical height (plumb-cut top end) `= W / cos θ`
- height of the board's lower edge above the lower floor at the top end `= H − W / cos θ`
- minimum board width to seat a step `= (rise · going) / √(rise² + going²)`

## Development

The project uses the **pnpm** package manager (the version is pinned in the
`packageManager` field of `package.json` and enabled via Corepack) and is written in
**TypeScript** (React + Vite).

```bash
corepack enable   # enable the pinned pnpm version
pnpm install      # install dependencies
pnpm dev          # Vite dev server
pnpm build        # type-check (tsc) + production build to dist/
pnpm typecheck    # type-check only
```

## Notes

The calculator assumes a straight flight. On a winding stair the going is measured
along the walking line and the inner edge has its own minimum dimensions. The
stringboard's top end is assumed to be plumb-cut.
