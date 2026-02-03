# 11 Web Keyboard Practice

Premium typing speed trainer built with React 19, Vite 6, and Tailwind CSS v4. Track your words-per-minute (WPM), accuracy, and speed in real-time with sophisticated visual feedback.

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4
- **Build Tool**: Vite 6
- **Icons**: Lucide React
- **Animations**: Framer Motion, Canvas Confetti
- **Testing**: Vitest, React Testing Library

## Features

- Real-time WPM and accuracy tracking
- High score persistence via localStorage
- Confetti celebration on test completion
- Responsive design for all screen sizes
- Keyboard navigation (Tab + Enter to restart)
- Accessibility support with ARIA labels

## Quick Start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Live Deployments

Auto-deployed from GitHub main branch:

| Platform | URL |
|----------|-----|
| **Vercel** | https://11-web-keyboard-practice.vercel.app |
| **Render** | https://11-web-keyboard-practice.onrender.com |
| **Firebase** | https://web-keyboard-practice.web.app |
| **AWS Amplify** | https://main.web-keyboard-practice.amplifyapp.com |
| **GitHub Pages** | https://mk-knight23.github.io/11-web-keyboard-practice/ |

## Deployment Configuration

### Render
- Blueprint: `render.yaml`
- Build Command: `npm run build`
- Publish Directory: `dist`

### Vercel
- Configuration: `vercel.json`
- Auto-deploy on push to main

### Firebase Hosting
- Configuration: `firebase.json`
- GitHub Actions workflow: `.github/workflows/firebase-deploy.yml`

### AWS Amplify
- Configuration: `amplify.yml`
- Build output: `dist`

---

*Maintained by [Kazi Musharraf](https://github.com/mk-knight23)*
