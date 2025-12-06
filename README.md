This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```env
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
# Optional: Specify a different model (default: meta-llama/Llama-3.2-1B-Instruct)
# HUGGINGFACE_MODEL=meta-llama/Llama-3.1-8B-Instruct
# Optional: Set rate limit for AI title generation per user per hour (default: 10)
# AI_RATE_LIMIT_REQUESTS=10

# Upstash Redis (required for production rate limiting)
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
```

To get a free Hugging Face API key:
1. Sign up for a free account at [huggingface.co](https://huggingface.co)
2. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Create a new token (read access is sufficient)
4. Add it to your `.env.local` file

To get a free Upstash Redis database (required for production rate limiting):
1. Sign up for a free account at [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Copy the REST URL and REST Token from the database details
4. Add them to your `.env.local` file as `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

**Note:** 
- The AI title generation feature requires the Hugging Face API key. The feature will show an error message if the key is not configured.
- The default model is `meta-llama/Llama-3.2-1B-Instruct`. If you encounter model availability issues, you can override it by setting `HUGGINGFACE_MODEL` in your `.env.local` file with a supported model from [Hugging Face](https://huggingface.co/models).
- Rate limiting is enabled to prevent abuse of the free API tier. By default, each user can generate up to 10 titles per hour. You can adjust this limit by setting `AI_RATE_LIMIT_REQUESTS` in your `.env.local` file.
- **Production deployment**: For production (e.g., Vercel), Upstash Redis is required for rate limiting to work across all serverless function instances. The free tier includes 10,000 commands per day, which is sufficient for most applications. If Upstash is not configured, rate limiting will fail open (allow requests) to prevent service disruption.

### Running the Development Server

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
