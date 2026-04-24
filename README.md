# SSW Konstruksi Study App v2.0

Aplikasi PWA (Progressive Web App) untuk belajar persiapan ujian SSW (Specified Skilled Worker) Konstruksi Jepang.

## Fitur

- **1194 Flashcards** dari berbagai kategori:
  - Salam & Etika (20)
  - Hukum & Regulasi (65)
  - Jenis Pekerjaan (300)
  - Listrik (130)
  - Telekomunikasi (59)
  - Pipa & Plumbing (126)
  - Isolasi Termal (44)
  - Pemadam Kebakaran (38)
  - Keselamatan Kerja (143)
  - Karier & Hak (127)
  - Alat & Mesin (142)

- **136 Soal Quiz** dari 4 set PDF:
  - SSW Konstruksi 5 (15 soal)
  - SSW Konstruksi 6 (22 soal)
  - SSW Konstruksi 7 (50 soal)
  - SSW Konstruksi 8 (49 soal)

- **Mode Belajar**:
  - Flashcards dengan flip animation
  - Quiz pilihan ganda dengan timer
  - Matching game
  - Fill in the blank

- **Fitur Tambahan**:
  - Dark mode
  - Progress tracking
  - Statistik belajar
  - Bookmark kartu
  - Search & filter
  - Export/import data
  - PWA ready (offline support)

## Deploy ke GitHub Pages

### Opsi 1: Deploy dari branch `gh-pages`

1. Buat branch baru `gh-pages` di repo GitHub:
```bash
git checkout --orphan gh-pages
git rm -rf .
```

2. Copy semua file dari folder `dist/` ke root repo

3. Commit dan push:
```bash
git add .
git commit -m "Deploy SSW Study App v2.0"
git push origin gh-pages
```

4. Di GitHub repo Settings > Pages, pilih source "Deploy from a branch" dan pilih `gh-pages`

### Opsi 2: GitHub Actions Auto-Deploy

1. Push source code ke branch `main`
2. File `.github/workflows/deploy.yml` sudah disediakan
3. Setiap push ke main akan otomatis deploy ke GitHub Pages

## Tech Stack

- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS v4
- Lucide React (icons)
- PWA Manifest + Service Worker

## Development

```bash
npm install
npm run dev     # Development server
npm run build   # Production build (output: dist/)
```

## Data

- `public/data/cards.json` - 1194 flashcards
- `public/data/quizzes.json` - 136 quiz questions

## Credit

- Original data: SSW Konstruksi PDF materials
- Original JSX app: ssw_flashcards_v64a.jsx
