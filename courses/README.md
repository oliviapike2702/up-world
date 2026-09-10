# courses — standalone, no membership needed
Run twice a year. Same shape each: `product/` · `marketing/` · `reporting/` · `admin/` · `sources/`.
Members: `brand-manager-boot-camp/` · `marketing-accelerator/` · `ai-course/` (coming, currently empty).
Each course's own launches/campaigns live inside that course's `marketing/` folder — not in the
top-level `../marketing/`, which is cross-product channel infra only.

`_shared/` — ⚠ empty shelf for tools that genuinely span every course. The launch-funnel
dashboard build that used to live here was Accelerator-specific (first launch tracked: TMA Sept
2026) and has moved to `marketing-accelerator/admin/launch-funnel-dashboard/`. Revisit moving it
back here if/when it's extended to other courses (BMBC support is explicitly deferred in its PRD).
