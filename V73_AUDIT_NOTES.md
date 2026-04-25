# SSW Flashcards v73 — Audit Notes for Codex

## Summary
Deep hygiene pass on v72 → v73. No cards added/removed (1345 total, ID max=1392).

## Changes Applied

### 1. JAC_OFFICIAL Furigana (MAJOR — 260 option strings)
- Added `漢字（ふりがな）` readings using full-width parentheses to 260 option strings across all 95 JAC questions
- Format: `"漢字（かんじ）(Indonesian text)"` — extractReadings() now detects these
- Updated `extractReadings()` regex to handle mixed-script readings (hiragana + katakana + alphanumeric)
- Katakana-only terms (リレー, ブレーカー, etc.) correctly skipped — no furigana needed
- Hiragana-dominant terms got inline kanji readings: `ご安全（あんぜん）に`

### 2. Wayground opts_id ✓ Removal (224 strings)
- Stripped answer-revealing `✓` markers from ALL Wayground opts_id entries
- Before: `"Pipa air panas ✓"` → After: `"Pipa air panas"`

### 3. Bug Fixes
- `FlashcardMode` search referenced non-existent `c.furi` field → fixed to `c.romaji`
- 12 cards with orphan category `"alat"` → fixed to `"alat_umum"` (were invisible in all category filters & glossary)
- `DescBlock` circled number support extended from ①-⑩ to ①-⑮
- Duplicate ⭐ emoji in bintang category: label had "⭐ Bintang" + emoji field had "⭐" → label now just "Bintang"

### 4. UI/UX
- Flashcard hint text: `"tap · swipe"` → `"ketuk = balik · geser = next"` (Indonesian, clearer)
- JAC result progress bar: 6px → 4px (matches all other progress bars)

## Codex Audit Checklist

### Things to Verify
1. **extractReadings() regex** — new regex `（([ぁ-んァ-ヴー\u30A0-\u30FFa-zA-Z0-9Ａ-Ｚ・、]+)）` must NOT match Indonesian text in ASCII parens `(...)`. Verify with edge cases.
2. **JAC option display** — test with `showHiragana=true`: furigana row should appear below JP text for options with full-width parens. Options without furigana (pure katakana) should show no furigana row.
3. **idPart extraction** — `allParens.filter(p => !hasJapanese(p)).pop()` must correctly pick the Indonesian text, not the furigana. Since furigana contains kana (detected by hasJapanese), it should be filtered out.
4. **Category filter** — verify all 1345 cards appear when "すべて" is selected. The 12 formerly-orphaned "alat" cards should now appear under "共通工具".
5. **Wayground quiz flow** — run through wg6-wg9 and verify opts_id no longer reveals the answer (no ✓ visible before answering).

### Known Remaining Issues (NOT fixed in v73)
- `lifeline5-6` cards (IDs 1364-1392) have `source: "lifeline4"` in data but comment says lifeline5-6. Not breaking — they group correctly under lifeline4 in SumberMode.
- ~266 cards have `id_text` longer than 60 chars — may overflow on narrow mobile screens. Not a data bug; these are descriptions of complex concepts.
- GlossaryMode `CAT_META` does not include vocab_exam/vocab_jac/vocab_core cards in its category listing — by design, glossary only shows concept categories.
- JAC_OFFICIAL `hiragana` field is always present for questions but empty for some `tt1`/`tt2` entries — these are 学科 questions that use Indonesian text as primary display.

### Files
- `ssw_flashcards_v73.jsx` — 6508 lines, 1345 cards, 95 JAC questions, 8 Wayground sets
