# UGC Ads Factory

Generate authentic UGC (User-Generated Content) ads in seconds using AI.

## Features

- 🎬 Generate vertical videos (9:16 TikTok/Reels format)
- 🤖 AI-powered video generation via KIE.ai Kling 3.0
- ⚡ Real-time video processing
- 📱 Mobile-first responsive design
- 🎨 Beautiful gradient UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Video API**: KIE.ai Kling 3.0
- **Language**: TypeScript

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
# .env.local should contain KIE.ai API key

# Run development server
npm run dev

# Open http://localhost:3000
```

## Environment Variables

```
NEXT_PUBLIC_KIE_API_KEY=your_kie_api_key_here
KIE_API_KEY=your_kie_api_key_here
```

## Usage

1. Enter product name (e.g., "Apple AirPods Pro")
2. Write a hook (opening line for the video)
3. Provide image URL (initial frame)
4. Click "Generate Video"
5. Wait 2-3 minutes for processing
6. Download your UGC video

## API Integration

Connects to KIE.ai Kling 3.0 for video generation:

```typescript
// lib/kie-client.ts handles all API calls
generateVideo(request: VideoGenerationRequest)
checkVideoStatus(taskId: string)
```

## Project Structure

```
ugc-ads-factory/
├── app/
│   ├── page.tsx          # Main component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── lib/
│   └── kie-client.ts     # KIE.ai API client
├── package.json
├── tsconfig.json
└── next.config.js
```

## Deployment

Deploy to Vercel:

```bash
npm install -g vercel
vercel
```

## License

MIT
