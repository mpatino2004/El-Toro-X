# New Home Buyer Lead Generator

A conversion-focused landing page built to capture **first-time home buyer leads** for realtors. Includes lead forms, a mortgage affordability calculator, and a downloadable buyer guide.

## What it does for your business

- **Captures buyer leads 24/7** — name, email, phone, budget, timeline, and preferred areas
- **Qualifies leads upfront** — budget range and buying timeline so you know who's serious
- **Builds trust before the call** — free buyer guide and mortgage calculator
- **SEO-ready** — customizable city/market metadata for local search
- **CRM-ready** — webhook integration for Zapier, Make, Follow Up Boss, etc.

## Quick start

1. Edit `config.js` with your name, city, phone, email, and service areas
2. Open `index.html` in a browser (or deploy — see below)
3. Share the link on social, business cards, email signature, and Google Business Profile

### Customize your info

Open `config.js` and update:

```javascript
window.REALTOR_CONFIG = {
  name: "Jane Smith",
  brokerage: "Smith Realty Group",
  phone: "(555) 987-6543",
  email: "jane@smithrealty.com",
  city: "Austin",
  state: "TX",
  serviceAreas: ["Downtown", "Round Rock", "Cedar Park", "Pflugerville"],
  licenseNumber: "DRE #12345678",
  webhookUrl: "https://hooks.zapier.com/hooks/catch/...",  // optional
  // ...
};
```

## Lead capture

Leads are saved in the browser's localStorage and can be sent to your CRM via webhook.

### Connect to your CRM (Zapier)

1. Create a Zap: **Webhooks by Zapier → Catch Hook**
2. Copy the webhook URL into `config.js` → `webhookUrl`
3. Map fields to your CRM (Follow Up Boss, kvCORE, HubSpot, etc.)

### Export leads manually

Open the site in your browser, open DevTools console, and run:

```javascript
exportLeads()
```

This downloads a CSV of all captured leads.

### View leads in admin panel

Open `admin.html` in the same browser where leads were captured to view and export them.

## Deploy for free

### GitHub Pages

1. Push this folder to a GitHub repo
2. Settings → Pages → Source: main branch, folder `/realtor-buyer-leads`
3. Your site will be live at `https://yourusername.github.io/repo-name/`

### Netlify

1. Drag the `realtor-buyer-leads` folder to [netlify.com/drop](https://app.netlify.com/drop)
2. Done — you get a live URL instantly

### Custom domain

Point your domain (e.g. `buywithjane.com`) to your hosting provider and use this as your buyer landing page.

## How to get more buyers with this

1. **Link everywhere** — Google Business Profile, Instagram bio, email signature, yard sign QR code
2. **Run ads to this page** — Facebook/Instagram ads targeting "first-time home buyer" + your city
3. **Offer the free guide** — post about it on social; the guide captures emails from people not ready to call yet
4. **Follow up fast** — leads who hear back within 5 minutes are 10x more likely to convert
5. **Add your city to config** — helps with local SEO when deployed

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main landing page with lead forms |
| `buyer-guide.html` | Downloadable first-time buyer guide |
| `config.js` | Your branding and contact info |
| `css/styles.css` | Styling |
| `js/app.js` | Forms, calculator, lead storage |
| `admin.html` | View and export captured leads |

## License

Free to use and customize for your real estate business.
