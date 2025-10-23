# DocRoster - Quick Start Guide

## 🚀 Get Started in 3 Minutes

### 1. Navigate to the Project
```bash
cd /home/mentor/work/DocRoster-figma-api-claude/docroster-app
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Start the Application
```bash
npm start
```

### 4. Open Your Browser
Navigate to: **http://localhost:4200**

## 🔑 Login Credentials

### Option 1: Demo User
- **Email**: `demo@docroster.com`
- **Password**: `password123`

### Option 2: Demo Specialist  
- **Email**: `specialist@docroster.com`
- **Password**: `specialist123`

### Option 3: Any Email (Demo Mode)
- Use **any valid email** format (e.g., `test@example.com`)
- Use **any password** with 6+ characters

## 📱 What You'll See

1. **Login Page** (/auth/login)
   - Beautiful login form with glass morphism effect
   - Email/password validation
   - Quick demo login buttons

2. **Search Page** (/search) 
   - Google Maps with 8 specialist markers
   - Each marker has specialist's avatar
   - Search functionality
   - Filter by specialty
   - Results list synchronized with map

3. **Specialist Details** (/specialist/:id)
   - Complete profile information
   - Ratings and reviews
   - Certifications
   - Contact information
   - Book appointment button

## 🎯 Key Features

✅ **8 Mock Specialists** - Fully detailed profiles
✅ **6 Specialties** - Different colors (Pediatrics, Legal, Mental Health, etc.)
✅ **Google Maps** - Custom markers with avatars
✅ **Search & Filter** - Real-time filtering
✅ **Authentication** - Session persistence
✅ **Responsive Design** - Works on all devices

## 📚 Available Documentation

- **PROJECT_SUMMARY.md** - Complete implementation overview
- **IMPLEMENTATION_GUIDE.md** - Technical documentation
- **README.md** - Project information

## 🛠️ Development Commands

```bash
# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

## 🎨 Color-Coded Specialties

- 🔵 **Pediatrics** - Blue (#3D7AFF)
- 🔵 **Laboratory** - Blue (#3D7AFF)
- 💗 **Legal Services** - Pink (#FF3D96)
- 💜 **Mental Health** - Purple (#9121B1)
- ❤️ **Cardiology** - Red (#FF6B6B)
- 💚 **Dermatology** - Teal (#4ECDC4)

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 4200
npx kill-port 4200
```

### Google Maps Not Loading
1. Check `angular.json` for Google Maps script
2. Verify API key in `src/environments/environment.ts`
3. Ensure internet connection

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 💡 Tips

- **Use Chrome DevTools** for debugging
- **Enable Location Services** for best map experience  
- **Use Quick Demo Login** buttons for fast testing
- **Check Browser Console** for errors or logs

## 📞 Need Help?

- Check **PROJECT_SUMMARY.md** for detailed information
- Review **IMPLEMENTATION_GUIDE.md** for technical details
- Inspect code comments for inline documentation

---

**Ready to explore DocRoster!** 🎉

Start with the demo login, browse specialists on the map, and click markers to view profiles.
