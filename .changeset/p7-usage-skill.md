---
"@dg-design/react": minor
---

Ship an agent usage-guide skill inside the package.

- `skill/dg-design/SKILL.md` plus `skill/dg-design/references/<component>.md` for all 42 components: purpose, when not to use, key API, accessibility notes, and type-checked examples.
- `AGENT-SETUP.md` tells a coding agent (Claude Code, Codex, others) how to link the skill (symlink by default, copy with a version file otherwise) and where to keep project-specific layout rules (`dg-design.local.md` at the project root, never inside the package skill).
- No runtime or API changes.
