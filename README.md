# Glass Bridge Game Simulation

A simulation of the Glass Bridge Game built with Next.js and TypeScript, featuring animated character introductions and gameplay with text-to-speech narration.

## Overview

This application simulates the Glass Bridge Game in two main phases:

1. **Introduction Phase**: 8 characters are introduced with their names, avatars, and introductions, narrated using text-to-speech.
2. **Gameplay Phase**: Characters take turns stepping on glass tiles to cross a bridge. If they step on the wrong tile, they fall.

## Features

- Character introductions with staggered animations
- Animated glass bridge gameplay
- Text-to-speech narration using browser's built-in speech synthesis (can be replaced with Lemonfox.ai when API key is provided)
- Responsive UI following the provided design

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- TailwindCSS for styling
- Framer Motion for animations
- Howler.js for audio management
- Axios for API requests

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd harshit-assignment
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Lemonfox.ai Integration

To enable the Lemonfox.ai text-to-speech:

1. Add your Lemonfox API key to `.env.local`:

```
NEXT_PUBLIC_LEMONFOX_API_KEY=your-api-key-here
```

2. Uncomment the Lemonfox implementation in `src/hooks/useTTS.ts`

## Project Structure

- `src/components/` - React components for the UI
- `src/hooks/` - Custom hooks including text-to-speech functionality
- `src/types/` - TypeScript interfaces and types
- `src/utils/` - Utility functions, including API interaction
- `public/` - Static assets

## Architecture Decisions

- **State Management**: Using React's built-in useState and useEffect hooks for state management as the application is relatively small.
- **Component Design**: Components are designed to be reusable and modular.
- **Animation Strategy**: Using Framer Motion for smooth animations and transitions between game phases.
- **Audio Integration**: Custom useTTS hook to abstract text-to-speech functionality, making it easy to switch between browser TTS and Lemonfox.ai.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# glassgame
# glassgame
# glassgame
