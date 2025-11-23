# Fahrly App

Fleet management application built with TypeScript, HTML, and CSS.

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode
npm run watch
```

## Deployment

This project is configured for deployment on Vercel.

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the build settings
3. The project will build TypeScript and deploy all static files

### Project Structure

- `ts/` - TypeScript source files
- `js/` - Compiled JavaScript (generated, gitignored)
- `html/` - HTML pages
- `css/` - Stylesheets
- `index.html` - Main entry point

## Pages

- `/` - Dashboard (index.html)
- `/html/pages/fleet.html` - Fleet overview
- `/html/pages/fleet/vehicles.html` - Vehicles list
- `/html/pages/fleet/vehicle-detail.html` - Vehicle details
- `/html/pages/hr.html` - HR page

