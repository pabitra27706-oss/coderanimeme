# 🎯 CoderAnimeMe

### Code. Create. Grow.

**A modern programming portfolio & creator platform built for the public learning journey**

[![Live Site](https://img.shields.io/badge/Live-coderanimeme.github.io-ff4d6d?style=for-the-badge&logo=github)](https://pabitra27706-oss.github.io/coderanimeme/)
[![YouTube](https://img.shields.io/badge/YouTube-@coderanimeme-00c2ff?style=for-the-badge&logo=youtube)](https://youtube.com/@coderanimeme)
[![License](https://img.shields.io/badge/License-MIT-31d0aa?style=for-the-badge)](LICENSE)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)

---

[🌐 Live Demo](https://pabitra27706-oss.github.io/coderanimeme/) • [📺 YouTube](https://youtube.com/@coderanimeme) • [💻 GitHub](https://github.com/pabitra27706-oss) • [📖 Documentation](#features)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Admin Panel](#-admin-panel)
- [Local Development](#-local-development)
- [Content Management](#-content-management)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Connect](#-connect)

---

## 🎨 About

**CoderAnimeMe** is a developer portfolio and YouTube creator platform designed for **learning in public**. This website serves as the central hub for:

- 🚀 **Programming Projects** — Showcasing Python, web development, and creative coding experiments
- 🎥 **Tutorial Videos** — YouTube content with embedded source code and downloadable files
- 📂 **Source Code Vault** — Every tutorial comes with copy-paste ready code files
- 📈 **Public Journey** — Documenting the creator's growth from beginner to advanced developer

Built with **vanilla JavaScript**, **modern CSS**, and a **glass-morphism design** system, the site prioritizes speed, accessibility, and mobile-first responsive design.

---

## ✨ Features

### 🎯 Core Features

- **🌓 Dark/Light Theme** — Persistent theme toggle with localStorage
- **📱 Fully Responsive** — Phone-first design, works perfectly on all devices
- **⚡ Blazing Fast** — No frameworks, pure vanilla JS, under 500KB total
- **🎨 Glass-morphism UI** — Modern translucent cards with backdrop blur
- **🔍 SEO Optimized** — Proper meta tags, structured data, sitemap
- **♿ Accessible** — ARIA labels, semantic HTML, keyboard navigation

### 📂 Content Features

- **📝 Dynamic Content Loading** — JSON-based content management
- **💾 One-Click Code Copy** — Copy individual files or download all as ZIP
- **🎨 Syntax Highlighting** — Prism.js with custom theme matching site colors
- **🔗 Cross-Linking** — Projects ↔ Videos relationship system
- **🖼️ Auto-Generated Thumbnails** — CSS-based fallback thumbnails per category
- **📥 Multi-File Download** — Download tutorial code as organized ZIP files

### 🛠️ Admin Panel (Mode A + Mode B)

- **🔐 Password-Protected Admin** — SHA-256 encrypted, persistent login
- **📊 Dashboard** — Content overview, stats, registry management
- **📝 Manual Form (Mode A)** — Full-featured JSON generator with all fields
- **⚡ Quick Add (Mode B)** — Paste AI-generated input JSON, auto-fills form
- **💾 Auto ID Generation** — Smart video-XXX and project-XXX incrementing
- **📤 Export/Import Backup** — Download and restore full content registry
- **📍 File Placement Guide** — Shows exactly where to place generated files

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties, Grid, Flexbox, backdrop-filter
- **Vanilla JavaScript** — No frameworks, modular ES6+ code
- **Prism.js** — Syntax highlighting for code blocks
- **JSZip** — Client-side ZIP file generation

### Design System
- **Fonts:** Outfit (headings), Inter (body), JetBrains Mono (code)
- **Colors:** Pink (#ff4d6d) + Cyan (#00c2ff) gradient system
- **Animation:** Intersection Observer reveal, subtle float effects
- **Theme:** Glass-morphism with dark/light mode support

### Content
- **JSON Database** — Flat-file content storage
- **Python** — Source code for turtle graphics tutorials
- **Markdown** — Documentation and guides

---

## 📁 Project Structure

```
coderanimeme/
│
├── 📄 index.html              # Homepage
├── 📄 projects.html           # Projects list page
├── 📄 project.html            # Project detail page
├── 📄 videos.html             # Videos list page
├── 📄 video.html              # Video detail page with code
├── 📄 about.html              # About page
├── 📄 contact.html            # Contact page
│
├── 📁 assets/
│   ├── 📁 css/
│   │   ├── theme.css          # CSS variables & theme
│   │   ├── base.css           # Reset & typography
│   │   ├── components.css     # Cards, buttons, UI
│   │   ├── layout.css         # Grid, sections, containers
│   │   ├── animations.css     # Reveal, transitions
│   │   └── responsive.css     # Mobile breakpoints
│   │
│   ├── 📁 js/
│   │   ├── main.js            # App initialization
│   │   ├── loader.js          # JSON data fetching
│   │   ├── ui.js              # Card rendering
│   │   ├── detail.js          # Detail page logic
│   │   ├── theme.js           # Dark/light toggle
│   │   ├── nav.js             # Navigation + mobile menu
│   │   └── animate.js         # Scroll reveal animations
│   │
│   ├── 📁 data/
│   │   ├── index.json         # Content registry
│   │   ├── profile.json       # Creator info
│   │   ├── skills.json        # Skills list
│   │   ├── 📁 videos/
│   │   │   ├── video-001.json
│   │   │   └── video-002.json
│   │   └── 📁 projects/
│   │       ├── project-001.json
│   │       └── project-placeholder.json
│   │
│   ├── 📁 code/
│   │   └── 📁 video/
│   │       ├── video-001/
│   │       │   └── main.py
│   │       └── video-002/
│   │           └── rainbow_flower.py
│   │
│   └── 📁 images/
│       ├── favicon.svg
│       ├── 📁 videos/
│       │   └── video-002/
│       │       └── rainbow-flower-thumb.jpg
│       └── 📁 projects/
│           └── placeholder.png
│
├── 📁 admin/                  # Password-protected admin panel
│   ├── auth.html              # Login page
│   ├── index.html             # Dashboard
│   ├── create-manual.html     # Mode A: Full manual form
│   ├── create-quick.html      # Mode B: AI JSON paste form
│   ├── config.json            # Password hashes (SHA-256)
│   └── 📁 assets/
│       ├── 📁 css/
│       │   └── admin.css      # Standalone admin styles
│       └── 📁 js/
│           ├── auth.js        # Login & session management
│           ├── storage.js     # localStorage registry
│           ├── json-generator.js # JSON builder
│           ├── form-handler.js   # AI input parser
│           └── quick-form.js     # Mode B form logic
│
├── 📄 robots.txt
├── 📄 sitemap.xml
├── 📄 LICENSE
└── 📄 README.md
```

---

## 🔐 Admin Panel

The site includes a **full-featured admin panel** for content management without editing JSON files directly.

### Access

Navigate to: `https://yourdomain.com/admin/auth.html`

**Default passwords:**
- `India00@`
- `India00@@`

> ⚠️ **Security Note:** Change password hashes in `admin/config.json` before deploying.

### Features

#### 📊 Dashboard
- Content overview (total videos, projects)
- Next auto-generated ID preview
- Video & project registry with delete option
- Export/Import backup system
- File placement guide with folder structure

#### Mode A — Manual Form
- Full form with all fields editable
- Tag input with chip UI (Enter or comma to add)
- Dynamic file entries (add/remove multiple files)
- Live link toggle
- "What I Learned" list (projects)
- JSON preview before download
- Auto-suggest next ID button

#### Mode B — Quick Add (AI-Assisted)
- Paste AI-generated input JSON
- Auto-fill form with editable fields
- Supports multi-file videos
- Type detection (video vs project)
- Example AI prompt included
- One-click parse and fill

### Generating Password Hashes

Open browser console and run:

```javascript
const sha256 = async (text) => {
  const buffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text)
  );
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
};

sha256("YourPasswordHere").then(console.log);
```

Copy the output and update `admin/config.json` → `passwordHashes` array.

---

## 💻 Local Development

### Prerequisites
- Any modern web browser
- Local development server (optional but recommended)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/pabitra27706-oss/coderanimeme.git
   cd coderanimeme
   ```

2. **Serve locally** (choose one method):

   **Option A: Python**
   ```bash
   python -m http.server 8000
   ```

   **Option B: Node.js**
   ```bash
   npx serve
   ```

   **Option C: VS Code Live Server**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

3. **Open in browser**
   ```
   http://localhost:8000
   ```

4. **Access admin panel**
   ```
   http://localhost:8000/admin/auth.html
   ```

---

## 📝 Content Management

### Adding a New Video

#### Option 1: Manual JSON
Create `assets/data/videos/video-003.json`:

```json
{
  "id": "video-003",
  "title": "Python Snake Game Tutorial",
  "description": "Build a classic snake game with Python turtle.",
  "longDescription": "Full walkthrough...",
  "category": "tutorial",
  "tags": ["python", "turtle", "game"],
  "youtubeUrl": "https://youtube.com/watch?v=...",
  "datePublished": "2025-05-15",
  "duration": "15:30",
  "sourceRepo": "https://github.com/...",
  "hasLiveLink": false,
  "liveLink": null,
  "thumbnail": "",
  "files": [
    {
      "name": "snake.py",
      "path": "assets/code/video/video-003/snake.py",
      "language": "python"
    }
  ]
}
```

#### Option 2: Admin Panel (Recommended)
1. Login to admin panel
2. Choose **Manual Form** or **Quick Add**
3. Fill form / paste AI JSON
4. Download generated JSON
5. Place files in correct folders

### File Placement

After generating JSON, place files:

```
assets/data/videos/video-003.json        ← Generated JSON
assets/code/video/video-003/snake.py     ← Python source
assets/images/videos/video-003/thumb.jpg ← Optional thumbnail
```

### Update Registry

Edit `assets/data/index.json`:

```json
{
  "videos": [
    {
      "id": "video-003",
      "file": "assets/data/videos/video-003.json",
      "featured": true
    }
  ]
}
```

---

## 🚀 Deployment

### GitHub Pages (Current)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings
   - Pages → Source → main branch
   - Save

3. **Access site**
   ```
   https://yourusername.github.io/coderanimeme/
   ```

### Other Platforms

**Netlify / Vercel**
- Connect GitHub repo
- Build command: (none needed, static site)
- Publish directory: `/`

**Custom Domain**
- Add CNAME file with your domain
- Update DNS records to point to hosting

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Dark/light theme system
- [x] Mobile-responsive design
- [x] Project & video detail pages
- [x] Code copy & ZIP download
- [x] Syntax highlighting
- [x] Admin panel (Mode A + Mode B)
- [x] Auto-thumbnail fallback
- [x] Live link toggle
- [x] localStorage session persistence

### 🔄 In Progress
- [ ] Search functionality
- [ ] Tag filtering system
- [ ] View counter analytics

### 🎯 Planned Features
- [ ] Comments section (GitHub Discussions integration)
- [ ] RSS feed for updates
- [ ] Email newsletter subscription
- [ ] Playlists/series grouping
- [ ] Code playground (interactive editor)
- [ ] Multi-language support
- [ ] PWA (Progressive Web App)

---

## 🤝 Contributing

Contributions are welcome! This is a personal portfolio project, but suggestions and improvements are appreciated.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Reporting Issues

Found a bug? [Open an issue](https://github.com/pabitra27706-oss/coderanimeme/issues) with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

You are free to:
- ✅ Use this code for your own portfolio
- ✅ Modify and adapt the design
- ✅ Use it commercially

**Just give credit** by linking back to this repo or mentioning CoderAnimeMe.

---

## 🔗 Connect

<div align="center">

[![YouTube](https://img.shields.io/badge/YouTube-@coderanimeme-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@coderanimeme)
[![GitHub](https://img.shields.io/badge/GitHub-pabitra27706--oss-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/pabitra27706-oss)
[![Website](https://img.shields.io/badge/Website-coderanimeme-00D4FF?style=for-the-badge&logo=google-chrome&logoColor=white)](https://pabitra27706-oss.github.io/coderanimeme/)

---

### ⭐ Star this repo if you find it useful!

**Built with 💙 by CoderAnimeMe**

*Code. Create. Grow.*

