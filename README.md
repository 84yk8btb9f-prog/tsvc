# TSVC Studio Website

## Folder Structure
```
tsvc/
├── index.html          → Home page
├── services.html       → Services page
├── portfolio.html      → Portfolio page
├── our-story.html      → About / Our Story
├── work-with-us.html   → Contact form
├── css/
│   └── style.css       → All styles
├── js/
│   └── main.js         → Frontend logic + data layer
└── admin/
    └── index.html      → Admin panel (manage all content)
```

---

## Admin Panel

**URL:** `/admin/index.html`
**Default password:** `tsvcadmin2025`

> ⚠️ **Change the password** before going live — edit line 1 in `/admin/index.html`:
> ```js
> const ADMIN_PASSWORD = 'tsvcadmin2025';
> ```

### What you can manage:
| Section | What to upload |
|---|---|
| **Portfolio** | Add project images (upload or URL) + titles + category tags |
| **Testimonials** | Add client name, role, testimonial text. Reorder them. |
| **Services** | Update each of the 6 service card images, names, and descriptions |

All data is stored in **localStorage** of the browser, so:
- Admin panel and website must be on the **same domain/server** to share data.
- Works on any static host: Netlify, Vercel, GitHub Pages, etc.
- **Does NOT work** if you open the files directly as `file://` from two separate browser tabs (browser security restricts cross-file localStorage).

---

## Deploying

### Option A — Netlify (recommended, free)
1. Drag the `tsvc/` folder into [netlify.com/drop](https://app.netlify.com/drop)
2. Done. Live in 30 seconds.

### Option B — Vercel
```bash
npx vercel
```

### Option C — Any shared hosting
Upload the contents of `tsvc/` to your `public_html/` folder via FTP.

---

## Contact Form

The contact form currently shows a success state after a fake 1.2s delay.
To make it actually send emails, use **FormSubmit** (free):

1. Change the form in `work-with-us.html`:
```html
<form id="contact-form" action="https://formsubmit.co/YOUR@EMAIL.COM" method="POST">
  <input type="hidden" name="_subject" value="New TSVC Brief">
  <input type="hidden" name="_captcha" value="false">
  ...
</form>
```
2. Remove the fake submit handler at the bottom of `main.js`.

---

## Fonts & Dependencies
- Google Fonts: Bebas Neue + DM Sans (loaded from Google CDN)
- No other dependencies — pure HTML/CSS/JS
- Works fully offline once fonts are cached

---

## Notes
- Portfolio images stored as base64 in localStorage = max ~5MB total.
  Use image URLs instead of uploads for large portfolios.
- The grain overlay is a pure CSS/SVG effect — no external assets.
- All animations use CSS + IntersectionObserver — no libraries needed.
