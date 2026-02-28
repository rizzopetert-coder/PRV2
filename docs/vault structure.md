# The Vault — File Structure (Phase I)

```
app/
├── vault/
│   ├── page.jsx                        # /vault — Hub landing page
│   ├── layout.jsx                      # Shared SEO metadata + nav shell
│   ├── lexicon/
│   │   ├── page.jsx                    # /vault/lexicon — State definitions + Hammer Index
│   │   ├── layout.jsx                  # SEO: canonical, OG, schema.org
│   │   └── [state-id]/
│   │       └── page.jsx                # /vault/lexicon/[state-id] — Individual State pages
│   └── intelligence/
│       ├── page.jsx                    # /vault/intelligence — Intel Memos + community feed
│       ├── layout.jsx                  # SEO: canonical, OG
│       └── [memo-id]/
│           └── page.jsx                # Individual memo with discussion thread
│
├── secure/
│   └── vault/
│       ├── page.jsx                    # /secure/vault — Gated shell (token wall)
│       ├── layout.jsx                  # Token middleware hook (Phase II)
│       └── [...slug]/
│           └── page.jsx                # Dynamic proprietary content routes
│
components/
└── vault/
    ├── LexiconGrid.jsx                 # 12-state search and filter UI
    ├── HammerIndex.jsx                 # Citation list component
    ├── SocialTokenTrigger.jsx          # Social share / token-earn CTA
    ├── StateCard.jsx                   # Individual state summary card
    ├── MemoCard.jsx                    # Intelligence memo preview card
    └── VaultNav.jsx                    # Hub navigation between layers
│
data/
├── vault-manifest.json                 # Master content map (states → citations → memos)
├── hammer-citations.json               # Hammer Citation Index (100+ entries)
├── external-intel.json                 # Industry feed schema (SHRM, HBR, Gartner, Gallup)
└── institutional-states.json           # 12 Locked States master definitions
│
middleware.ts                           # Token verification (stub for Phase II)
```