This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Google Maps Integration

### Environment Setup

Create a `.env.local` file in the project root and set:

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_KEY
```

Use the provided API key by replacing `YOUR_GOOGLE_MAPS_KEY` with your key.

### Component Usage

Import and render the map component:

```tsx
import GoogleMap from "./components/maps/GoogleMap";

export default function Page() {
  return (
    <GoogleMap
      center={{ lat: 6.869, lng: 3.653 }}
      zoom={12}
      mapTypeId="roadmap"
      height={360}
      width="100%"
    />
  );
}
```

### Props

- `center`: `{ lat: number; lng: number }` initial center
- `zoom`: `number` initial zoom
- `mapTypeId`: `"roadmap" | "satellite" | "terrain" | "hybrid"`
- `height`: `number | string`
- `width`: `number | string`
- `className`: `string`
- `onReady`: `() => void`
- `onError`: `(message: string) => void`

### Controls

- Zoom control, fullscreen control, and map type selector are enabled by default.

### Error Handling

- Displays messages for script loading failure, invalid or missing API key, and connectivity issues.

### Performance

- Dynamically loads the Google Maps script once and reuses it.
- Cleans up timers on unmount.
- Debounces map option updates.
