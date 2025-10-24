# Security Fix - Google Maps API Keys

## What Was Fixed

1. **Removed exposed Google Maps API keys** from:
   - `docroster-app/src/index.html` (AIzaSyCD8jcJuPEbDCeE77zbBzhWCY6djGOBq9U)
   - `demo-map/app.module.ts` (AIzaSyDP6Ces1p8-GIfHQqeu6fQalR4cfDHKjMo)

2. **Fixed GitHub Pages 404 error**:
   - Moved files from `docs/browser/` to `docs/` root
   - Updated deploy script to handle Angular 19's new output structure

3. **Created environment configuration**:
   - `environment.example.ts` - Safe template file
   - Environment files now excluded from git
   - API keys loaded from environment config

## Setup Instructions

### 1. Configure Your Google Maps API Key

Copy the example environment file:
```bash
cd docroster-app/src/environments
cp environment.example.ts environment.ts
cp environment.example.ts environment.prod.ts
```

Edit both files and add your Google Maps API key:
```typescript
export const environment = {
  production: false, // or true for prod
  googleMapsApiKey: 'YOUR_ACTUAL_API_KEY_HERE',
  googleMapsMapId: 'YOUR_ACTUAL_MAP_ID_HERE',
  defaultCenter: {
    lat: 49.2827,
    lng: -123.1207
  },
  defaultZoom: 13
};
```

### 2. Update index.html

Edit `docroster-app/src/index.html` and replace the placeholder:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&libraries=places,marker" async defer></script>
```

### 3. Get a Google Maps API Key

If you don't have one:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Maps JavaScript API
4. Create credentials → API Key
5. Restrict the API key to your domain/localhost

### 4. Revoke Exposed Keys (IMPORTANT!)

The old API keys were exposed in git history. You should:

1. **Revoke old keys** in Google Cloud Console:
   - `AIzaSyCD8jcJuPEbDCeE77zbBzhWCY6djGOBq9U`
   - `AIzaSyDP6Ces1p8-GIfHQqeu6fQalR4cfDHKjMo`

2. **Generate new API keys** and use them in your environment files

## Deployment to GitHub Pages

The deployment process is now fixed:

```bash
cd docroster-app
npm run deploy
```

This will:
1. Build the production app with correct base href
2. Move files from `docs/browser/` to `docs/` root (GitHub Pages requirement)
3. Create `.nojekyll` file
4. Copy `index.html` to `404.html` for Angular routing

Then commit and push:
```bash
git add docs/
git commit -m "Deploy to GitHub Pages"
git push origin main
```

Your site will be available at:
```
https://brnzai.github.io/DocRoster-figma-api-claude/
```

## What's Protected Now

✅ No API keys in git repository
✅ Environment files excluded from version control
✅ Template files provided for other developers
✅ GitHub Pages deployment fixed
✅ 404 routing configured for Angular SPA

## For Other Developers

When cloning this repo:
1. Copy `environment.example.ts` to `environment.ts` and `environment.prod.ts`
2. Add your own Google Maps API key
3. Update `index.html` with your API key
4. Run `npm install`
5. Run `ng serve` for development

## Current Status

✅ API keys removed from source code
✅ GitHub Pages 404 error fixed
✅ Environment configuration setup
✅ Ready for secure deployment
