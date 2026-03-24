# MMLABS Brand Discovery

Brand identity discovery intake app. Guides clients through a quiz, generates an AI-powered brand brief, and collects reactions before finalizing.

## Setup

1. Clone and install:
   ```bash
   git clone <repo-url>
   cd mmlabs
   npm install
   ```

2. Create `.env.local` with:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/xnjgezjr
   ```

3. **Formspree setup:**
   - Go to [formspree.io](https://formspree.io), create a free account
   - Click "New Form", name it (e.g. "MMLABS Discovery")
   - Copy the endpoint URL (e.g. `https://formspree.io/f/xxxxxxxx`)
   - Add it as `NEXT_PUBLIC_FORMSPREE_ENDPOINT` in `.env.local`

4. Run locally:
   ```bash
   npm run dev
   ```

## Deploy

1. Push to GitHub
2. Connect the repo in [Vercel](https://vercel.com)
3. Add both environment variables in Vercel project settings:
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_FORMSPREE_ENDPOINT`
4. Deploy

## Customizing for a future client

To reuse this app for a different client:

1. Update the client context block in `app/api/generate-brief/route.ts`
2. Update the pre-confirmed answers in the quiz hints (screen components)
3. Update the nav brand name and intro copy in `App.tsx` and `Screen0.tsx`
