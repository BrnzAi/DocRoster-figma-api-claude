# Figma Tools

Automated tools for extracting Figma designs and generating Angular SCSS styles.

## 📁 Files

### JSON Data Exports
- `search-layout.json` - Exported search page layout from Figma
- `figma-design.json` - Complete Figma design data (if exists)
- `extracted-data.json` - Extracted component data (if exists)

### Generator Scripts
- `auto-generate-scss.js` - **Universal SCSS generator** from any Figma JSON export
- `generate-search-scss.js` - Search page specific SCSS generator

### Legacy Analysis Scripts
- `analyze-*.js` - Various Figma design analysis tools
- `download-*.js` - Image and asset download utilities
- `extract-*.js` - Data extraction tools
- `get-*.js` - Figma API data fetching utilities

## 🚀 Quick Start

### Generate SCSS from Figma JSON

```bash
cd figma-tools
node auto-generate-scss.js search-layout.json
```

This will output SCSS styles to console, ready to copy into your component files.

### Output to File

```bash
node auto-generate-scss.js search-layout.json ../docroster-app/src/app/components/search/search.component.scss
```

## 📖 How It Works

1. **Export from Figma**: Right-click frame → "Copy as JSON" or use Figma API
2. **Save JSON**: Save to `figma-tools/your-design.json`
3. **Run Generator**: `node auto-generate-scss.js your-design.json`
4. **Copy Styles**: Use generated SCSS in your Angular components

## 🎨 What Gets Generated

The auto-generator extracts:
- ✅ Dimensions (width, height)
- ✅ Colors (fills, backgrounds)
- ✅ Borders (strokes)
- ✅ Border radius
- ✅ Box shadows
- ✅ Backdrop filters
- ✅ Typography (font family, size, weight, line-height, letter-spacing)
- ✅ Flexbox layout (direction, alignment, gap, padding)

## 🔧 Customization

Edit `auto-generate-scss.js` to:
- Add more CSS property mappings
- Customize output format
- Add component-specific logic
- Filter or transform values

## 📝 Example Output

Input JSON:
```json
{
  "name": "search-box",
  "rect": { "width": 266, "height": 48 },
  "fills": [{ "type": "SOLID", "color": { "r": 1, "g": 1, "b": 1 } }]
}
```

Generated SCSS:
```scss
.search-box {
  width: 266px;
  height: 48px;
  background: rgb(255, 255, 255);
}
```

## 🎯 Best Practices

1. **Export Complete Frames**: Select the entire component/page frame in Figma
2. **Clean Names**: Use clear, descriptive names in Figma (they become CSS class names)
3. **Use Auto Layout**: Figma Auto Layout properties convert to Flexbox
4. **Test Output**: Always review generated styles before using in production
5. **Iterate**: Re-export and regenerate as design changes

## 🔗 Integration with DocRoster App

Generated styles are used in:
- `docroster-app/src/app/components/search/search.component.scss`
- `docroster-app/src/app/components/auth/login.component.scss`
- `docroster-app/src/app/components/auth/register.component.scss`

## 💡 Tips

- **Batch Generate**: Process multiple JSON files in a loop
- **Version Control**: Keep JSON exports in git for design history
- **Compare**: Use git diff to see design changes over time
- **Automate**: Add to CI/CD pipeline for automated style generation

## 🐛 Troubleshooting

**Issue**: Generated class names have special characters
**Solution**: Clean up Figma layer names (use only letters, numbers, hyphens)

**Issue**: Colors not matching Figma exactly
**Solution**: Check opacity values in both fills and effects

**Issue**: Layout not matching
**Solution**: Ensure Auto Layout is used in Figma, not manual positioning

## 📚 Resources

- [Figma API Documentation](https://www.figma.com/developers/api)
- [Figma Plugin API](https://www.figma.com/plugin-docs/)
- [Angular SCSS Guide](https://angular.io/guide/component-styles)
