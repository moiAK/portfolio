# Artist Portfolio Website

## Project Overview
A modern, minimalist portfolio website for an artist. Showcases artwork in a gallery with title, description, and purchase availability. Designed for easy maintenance — adding new art or updating sold status requires only editing a single data file.

## Architecture
- **Framework**: Static site using HTML, CSS, vanilla JavaScript (no build step)
- **Hosting**: GitHub Pages (deployed from `main` branch or `docs/` folder)
- **Data Source**: Single `data/artworks.json` file — the only file to edit when managing artwork
- **Images**: Stored in `images/gallery/` directory

## Directory Structure
```
portfolio/
├── CLAUDE.md
├── index.html              # Single-page app with sections
├── css/
│   └── style.css           # All styles (modern, minimalist)
├── js/
│   └── main.js             # Gallery rendering, filtering, navigation
├── data/
│   └── artworks.json       # Artwork entries (title, description, image, available)
├── images/
│   ├── gallery/            # Artwork images (optimized for web)
│   └── profile/            # Artist headshot / about page images
└── .github/
    └── workflows/
        └── deploy.yml      # GitHub Actions → GitHub Pages auto-deploy
```

## Pages / Sections (Single-Page Layout)
1. **Hero** — Artist name, tagline, subtle background
2. **About** — Bio, artist statement, photo
3. **Gallery** — Grid of artwork cards (title, description, availability badge)
4. **Contact** — Contact form or email link, social media links

## Artwork Data Format (`data/artworks.json`)
```json
[
  {
    "id": 1,
    "title": "Sunset Over the Valley",
    "description": "Oil on canvas, 24x36 inches. Inspired by the golden hour light of the Pacific Northwest.",
    "image": "images/gallery/sunset-valley.jpg",
    "available": true,
    "year": 2024
  },
  {
    "id": 2,
    "title": "Morning Fog",
    "description": "Watercolor, 18x24 inches.",
    "image": "images/gallery/morning-fog.jpg",
    "available": false,
    "year": 2023
  }
]
```

### How to Maintain
- **Add new artwork**: Add an entry to `data/artworks.json`, drop the image in `images/gallery/`
- **Mark as sold**: Set `"available": false` for that entry in `artworks.json`
- **Reorder**: Move entries up/down in the JSON array (displayed in array order)
- **Remove**: Delete the entry from the JSON array

## Design Principles
- **Modern & minimalist**: Generous whitespace, clean typography, muted color palette
- **No infinite scroll**: Paginated gallery or single-page grid (all visible at once, or paginated with prev/next)
- **Responsive**: Mobile-first, works on all screen sizes
- **Fast**: No frameworks, no build step, minimal dependencies
- **Accessible**: Semantic HTML, alt text on images, keyboard navigable

## Gallery Behavior
- Artwork displayed as cards in a responsive grid
- Each card shows: image thumbnail, title, short description, availability badge ("Available" / "Sold")
- Clicking a card opens a lightbox/modal with full-size image and full description
- Optional filter: show all / available only
- No infinite scroll — paginated or full grid

## Deployment
- Push to `main` branch triggers GitHub Actions workflow
- Workflow deploys contents to GitHub Pages
- Site available at `https://<username>.github.io/<repo-name>/`

## Tech Stack
- HTML5
- CSS3 (custom properties, grid, flexbox)
- Vanilla JavaScript (ES6+)
- GitHub Actions for CI/CD
- GitHub Pages for hosting

## Commands
- **Local dev**: Open `index.html` in browser (or use `python3 -m http.server` for JSON fetch)
- **Deploy**: Push to `main` — GitHub Actions handles the rest
- **Add artwork**: Edit `data/artworks.json` + add image to `images/gallery/`
