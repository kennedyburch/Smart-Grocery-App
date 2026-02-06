# Vercel Deployment Instructions

## Frontend-Only Deployment

Since you're deploying only the frontend to Vercel (and the backend will be separate), follow these steps:

### 1. Environment Variables in Vercel

In your Vercel dashboard, add these environment variables:

- `VITE_API_BASE_URL` = `https://your-backend-domain.com/api`

**Important**: Replace `your-backend-domain.com` with your actual backend deployment URL.

### 2. Vercel Configuration

The `vercel.json` file is already configured to:
- Build only the frontend package
- Output to the correct directory
- Handle client-side routing with rewrites

### 3. Backend Deployment

Your backend needs to be deployed separately. Common options:
- **Railway**: Easy Node.js deployment
- **Render**: Free tier available
- **Heroku**: Traditional choice
- **DigitalOcean App Platform**: Affordable option

### 4. CORS Configuration

Make sure your backend CORS settings allow your Vercel domain:

```javascript
// In your backend CORS config
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174', 
  'http://localhost:5175',
  'https://your-vercel-app.vercel.app' // Add your Vercel URL
];
```

### 5. Database

Your PostgreSQL database also needs to be hosted. Options:
- **Supabase**: PostgreSQL with additional features
- **PlanetScale**: MySQL but can be adapted
- **Railway**: Also offers PostgreSQL
- **Neon**: Serverless PostgreSQL

### Current Issue

The app is trying to connect to `localhost:3000` which won't work in production. You need to:

1. Deploy your backend first
2. Set the `VITE_API_BASE_URL` environment variable in Vercel to point to your backend
3. Redeploy the frontend

### Frontend-Only Demo

If you want to deploy just the frontend as a demo (without backend functionality), you could:
1. Remove API calls temporarily
2. Use mock data
3. Deploy successfully to show the UI

Let me know which approach you'd like to take!
