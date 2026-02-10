# Build and Development Guide

This guide provides detailed instructions for building, running, and packaging this Electron React TypeScript template project.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Building](#building)
- [Packaging for Distribution](#packaging-for-distribution)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16 or higher recommended)
- **npm** (comes with Node.js)
- **Git** (for version control)

### Platform-Specific Requirements

#### Windows
- No additional requirements

#### macOS
- Xcode Command Line Tools: `xcode-select --install`

#### Linux
- Build tools: `sudo apt-get install build-essential`

---

## Installation

1. **Clone or download this repository**
   ```bash
   git clone <repository-url>
   cd Electron
   ```

   Or if using this as a template:
   ```bash
   # Clone into a new project folder
   git clone <repository-url> my-new-project
   cd my-new-project

   # Remove the original git history
   rm -rf .git

   # Initialize a new repository
   git init
   ```

2. **Install dependencies**
   ```bash
   npm install --save-dev
   ```

   This will install all required dependencies including:
   - Electron
   - React and React DOM
   - TypeScript
   - Webpack and related loaders
   - electron-builder (for packaging)

---

## Development

### Quick Start

**Run the app in development mode with hot reloading:**
```bash
npm run dev
```

This command:
- Watches for file changes in the `src` directory
- Automatically rebuilds when changes are detected
- Runs the Electron app with live updates

### Development Scripts

#### `npm run dev`
**Recommended for development**
- Starts webpack in watch mode
- Launches Electron application
- Automatically reloads on code changes
- Best for active development

#### `npm start`
**Quick test run**
- Builds the application once
- Starts the Electron app
- No hot reloading
- Good for testing the production build locally

#### `npm run watch`
**Build watching only**
- Runs webpack in watch mode
- Does not start Electron
- Useful if you want to control when to launch the app

---

## Building

### Development Build

```bash
npm run build
```

This command:
- Compiles TypeScript to JavaScript
- Bundles the main process code ([dist/main.js](dist/main.js))
- Bundles the renderer process code ([dist/renderer.js](dist/renderer.js))
- Generates the HTML file ([dist/index.html](dist/index.html))
- Outputs to the `dist` directory
- Uses development mode (includes source maps)

### Production Build

Production builds are automatically created when using packaging commands, but you can manually trigger a production build:

```bash
NODE_ENV=production npm run build
```

Or on Windows:
```cmd
set NODE_ENV=production && npm run build
```

Production builds:
- Minify and optimize code
- Remove source maps (except as specified)
- Apply tree shaking
- Reduce bundle size

---

## Packaging for Distribution

The project uses **electron-builder** to create distributable packages for different platforms.

### Windows

```bash
npm run package
```

This creates:
- **NSIS Installer** (`.exe` installer)
- **Portable executable** (standalone `.exe`)

Output location: `release/` directory

**Files generated:**
- `Electron React TypeScript App Setup X.X.X.exe` - Installer
- `Electron React TypeScript App X.X.X.exe` - Portable app

### macOS

```bash
npm run package-mac
```

This creates:
- **DMG Image** (`.dmg` disk image)

Output location: `release/` directory

**Note:** Building for macOS on non-Mac systems may have limitations. For best results, build on macOS.

### Linux

```bash
npm run package-linux
```

This creates:
- **AppImage** (`.AppImage` universal format)
- **Debian Package** (`.deb` for Debian/Ubuntu)

Output location: `release/` directory

### Cross-Platform Notes

- You can typically build for Windows and Linux on any platform
- Building for macOS usually requires a Mac (or CI/CD with Mac runners)
- Signing and notarization (macOS) require developer certificates

### Distribution Build

```bash
npm run dist
```

Alternative command that builds and packages for Windows in one step.

---

## Project Structure

```
Electron/
├── assets/                 # Build resources
│   └── icon.png           # Application icon (used for all platforms)
├── dist/                  # Compiled output (generated)
│   ├── main.js           # Main process bundle
│   ├── renderer.js       # Renderer process bundle
│   └── index.html        # Generated HTML
├── release/              # Packaged applications (generated)
│   └── win-unpacked/    # Unpacked Windows build
├── src/
│   ├── main/            # Electron main process
│   │   └── main.ts      # Main process entry point
│   ├── renderer/        # React application
│   │   ├── App.tsx      # Root React component
│   │   ├── index.tsx    # Renderer entry point
│   │   └── index.html   # HTML template
│   └── styles/          # CSS styles
│       └── index.css    # Global styles
├── node_modules/        # Dependencies (generated)
├── package.json         # Project configuration and scripts
├── tsconfig.json        # TypeScript configuration
├── webpack.config.js    # Webpack build configuration
└── README.md           # Project overview
```

### Key Files

- **[src/main/main.ts](src/main/main.ts)** - Electron main process, handles window creation and app lifecycle
- **[src/renderer/App.tsx](src/renderer/App.tsx)** - Main React component
- **[src/renderer/index.tsx](src/renderer/index.tsx)** - React app initialization
- **[webpack.config.js](webpack.config.js)** - Build configuration for both main and renderer processes
- **[tsconfig.json](tsconfig.json)** - TypeScript compiler options

---

## Configuration

### Application Metadata

Edit [package.json](package.json) to customize your app:

```json
{
  "name": "your-app-name",
  "version": "1.0.0",
  "description": "Your app description",
  "author": "Your Name",
  "build": {
    "appId": "com.yourcompany.yourapp",
    "productName": "Your App Name"
  }
}
```

### Icon Configuration

Replace [assets/icon.png](assets/icon.png) with your application icon:
- Recommended size: 512x512 pixels or larger
- Format: PNG with transparency
- electron-builder will automatically generate platform-specific icons

### Build Configuration

The `build` section in [package.json](package.json) controls electron-builder settings:

```json
"build": {
  "appId": "com.electron-react-ts.app",
  "productName": "Electron React TypeScript App",
  "files": ["dist/**/*", "node_modules/**/*", "package.json"],
  "directories": {
    "buildResources": "assets",
    "output": "release"
  },
  "win": {
    "target": ["nsis", "portable"]
  },
  "mac": {
    "target": ["dmg"]
  },
  "linux": {
    "target": ["AppImage", "deb"]
  }
}
```

### Webpack Configuration

[webpack.config.js](webpack.config.js) contains two configurations:
1. **Main process** - Bundles Electron main process
2. **Renderer process** - Bundles React application

Modify these as needed for additional loaders or plugins.

---

## Troubleshooting

### Common Issues

#### 1. `npm install` fails
**Solution:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then reinstall
- Ensure you're using a compatible Node.js version

#### 2. Electron app won't start
**Solution:**
- Ensure the build completed successfully: `npm run build`
- Check for errors in the console
- Verify [dist/main.js](dist/main.js) and [dist/renderer.js](dist/renderer.js) exist

#### 3. Hot reload not working
**Solution:**
- Stop the dev server (Ctrl+C)
- Delete the `dist` folder
- Run `npm run dev` again

#### 4. Packaging fails
**Solution:**
- Ensure production build works: `NODE_ENV=production npm run build`
- Check that [assets/icon.png](assets/icon.png) exists
- Verify electron-builder configuration in [package.json](package.json)

#### 5. "Cannot find module" errors
**Solution:**
- Reinstall dependencies: `npm install`
- Check import paths in your TypeScript files
- Verify [tsconfig.json](tsconfig.json) configuration

#### 6. Windows defender or antivirus blocking
**Solution:**
- Add the project folder to antivirus exclusions
- This is common during development with Electron

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all dependencies are installed correctly
3. Ensure you're using compatible versions of Node.js and npm
4. Review the [Electron documentation](https://www.electronjs.org/docs/latest/)
5. Check [electron-builder documentation](https://www.electron.build/)

---

## Additional Resources

- [Electron Documentation](https://www.electronjs.org/docs/latest/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Webpack Documentation](https://webpack.js.org/concepts/)
- [electron-builder Documentation](https://www.electron.build/)

---

## Next Steps

After successfully building and running the template:

1. Customize [src/renderer/App.tsx](src/renderer/App.tsx) with your React components
2. Modify [src/main/main.ts](src/main/main.ts) for Electron-specific functionality
3. Update application metadata in [package.json](package.json)
4. Replace [assets/icon.png](assets/icon.png) with your app icon
5. Add your own styles to [src/styles/index.css](src/styles/index.css)
6. Build and test your application
7. Package for distribution

Happy building! 🚀
