# Book Examples — Dataset for the Website "Examples" Page

Every code, prompt, pseudocode, and configuration example from *Agentic Programming*,
extracted **verbatim** from the manuscript and organized by chapter. This is the dataset
the website "Examples" page renders from (see `../website-agent-prompt.md`).

## Layout

- `manifest.json` — the structured dataset (one entry per example). This is the source of truth.
- `index.md` — a human-readable list of every example, by chapter.
- `chapter-NN/` and `appendix-a/` — the individual example files, ready to download.

## Manifest fields

`chapter`, `chapter_order`, `order` (position within the chapter), `title`, `type`,
`description` (the sentence that introduces the example in the book), `filename`,
`dir`, `content` (verbatim), and `source_line` (line in the source markdown).

## What's included (156 examples)

Types: `json` (64), `prompt` (46), `yaml` (24), `pseudocode` (7), `shell` (7),
`config` (4), `code` (4). (`config` = the Chapter 17 workflow-composition sketches:
stage-name outlines that show how workflows compose, rather than valid YAML/JSON.)

## What's excluded (76 blocks, deliberately)

Extracted from 232 total set-off blocks; these categories were dropped:

- **Directory / file-tree layouts** (10 + ~15 mixed dir/file listings) — e.g., `.harness/runs/story-184/` listings. (Per author decision.)
- **ASCII flow diagrams and figure stanzas** (9) — arrow/box-drawing diagrams (the real figures are the book's SVGs).
- **Sample model outputs and logs** (18) — generated responses, event-history/log dumps, and generated Markdown artifacts (escalation summaries, completion reports) — illustrative, not reusable.
- **Purely illustrative snippets** (37) — one-off fragments shown to make a point (e.g., a deliberately weak verifier finding), context inventories, and decomposition/tier sketches.
- **Exact duplicates** (2) — the same block repeated in a chapter (kept the first occurrence).

Note: the four Chapter 17 workflow-composition sketches were **included** (as `config`),
since the book states every example is available on the site.

## Two things to know

- **Verbatim.** `content` is byte-for-byte from the manuscript; only the leading set-off
  tab was removed. Internal indentation is preserved exactly. Do not reformat or re-indent.
- **Titles are a first pass.** They're auto-derived from the introducing sentence. The
  config/artifact titles (Workflow state record, Verifier result, Story definition, …) are
  reliable; some prompt and miscellaneous titles are generic ("Prompt example") or plain.
  They are safe to rename in `manifest.json` — filenames are derived from titles, so
  regenerate filenames if you rename.

## Regeneration

Produced by scripts (extract → classify → emit). If the manuscript's examples change,
re-run the extraction rather than hand-editing files, so verbatim fidelity is preserved.
