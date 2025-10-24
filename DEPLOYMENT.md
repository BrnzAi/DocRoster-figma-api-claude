# DocRoster - Deployment Guide

## GitHub Pages Deployment

### Prerequisites
- Node.js 18+ installed
- Angular CLI installed globally: `npm install -g @angular/cli`

### Build for Production

1. Navigate to the app directory:
```bash
cd docroster-app
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Build for GitHub Pages:
```bash
npm run deploy
```

This command will:
- Build the app in production mode
- Output to `/docs` folder (GitHub Pages serves from this folder)
- Set correct base href for GitHub Pages
- Create .nojekyll file to bypass Jekyll processing
- Create 404.html for Angular routing support

### GitHub Pages Configuration

1. Push your code to GitHub
2. Go to repository Settings → Pages
3. Set Source to: **Deploy from a branch**
4. Select branch: **main**
5. Select folder: **/docs**
6. Click Save

Your app will be available at: `https://yourusername.github.io/DocRoster-figma-api-claude/`

### Local Development

Run locally:
```bash
cd docroster-app
npm start
```

App will be available at: `http://localhost:4200/`

### Figma Tools

All Figma data extraction and SCSS generation tools are in `/figma-tools` directory:

- `auto-generate-scss.js` - Generate SCSS from any Figma JSON export
- `generate-search-scss.js` - Generate styles specifically for search page
- `search-layout.json` - Extracted Figma design data

#### Usage Example:
```bash
cd figma-tools
node auto-generate-scss.js search-layout.json
```

### Environment Variables

Google Maps API key is configured in `src/environments/environment.ts`:
```typescript
export const environment = {
  googleMapsApiKey: 'YOUR_API_KEY_HERE'
};
```

### Troubleshooting

**Issue:** App shows blank page on GitHub Pages
**Solution:** Make sure base-href in build:prod script matches your repository name

**Issue:** Routing doesn't work on refresh
**Solution:** 404.html is automatically created to handle Angular routing

**Issue:** Map doesn't load
**Solution:** Check that Google Maps API key is set in environment files
