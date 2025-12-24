# Deployment Instructions

This guide covers deploying the React TypeScript Vite starter to Netlify.

## Netlify Manual Deployment

### Prerequisites

- A Netlify account
- Built production files (run `npm run build`)

### Method 1: Netlify Dashboard (Drag & Drop)

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Deploy to Netlify**

   - Log in to [Netlify](https://app.netlify.com)
   - Go to "Sites" → "Add new site" → "Deploy manually"
   - Drag and drop the `dist` folder to the deployment area
   - Your site will be live with a random URL

3. **Configure custom domain** (optional)

   - Go to Site settings → Domain management
   - Add your custom domain

### Method 2: Netlify CLI

1. **Install Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**

   ```bash
   netlify login
   ```

3. **Initialize and deploy**

   ```bash
   netlify init
   netlify deploy --prod
   ```

   Follow the prompts to configure your site.

### Method 3: Git Integration (Recommended for CI/CD)

1. **Connect your repository**

   - In Netlify dashboard, click "Add new site" → "Import an existing project"
   - Connect your Git provider (GitHub, GitLab, Bitbucket)
   - Select your repository

2. **Configure build settings**

   Netlify will auto-detect these from `netlify.toml`:
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Deploy**

   - Click "Deploy site"
   - Netlify will build and deploy automatically
   - Future pushes to your main branch will trigger automatic deployments

## Configuration Files

### netlify.toml

The project includes a `netlify.toml` file with:

- Build configuration
- Redirect rules for SPA routing

### public/_redirects

Contains redirect rules for client-side routing:

```
/*    /index.html   200
```

This ensures all routes are handled by React Router.

## Environment Variables

If you're using environment variables:

1. Go to Site settings → Environment variables
2. Add your variables (e.g., `VITE_BASE_URL`)
3. Redeploy the site

## Build Settings

Default build settings (configured in `netlify.toml`):

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: Use Netlify's default (or specify in `.nvmrc`)

## Troubleshooting

### Routes not working

- Ensure `_redirects` file is in the `public` folder
- Verify `netlify.toml` redirect rules are correct
- Check that the build output includes the `_redirects` file

### Build failures

- Check Node.js version compatibility
- Review build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`

### Environment variables not working

- Variables must be prefixed with `VITE_` to be exposed to the client
- Redeploy after adding new variables
- Check variable names match your code

## Post-Deployment

1. **Update base URL**

   - Set `VITE_BASE_URL` in Netlify environment variables
   - Update `app.config.ts` if needed

2. **Test SEO**

   - Verify meta tags are correct
   - Test Open Graph tags with [Open Graph Debugger](https://www.opengraph.xyz/)

3. **Configure custom domain**

   - Add domain in Netlify dashboard
   - Update DNS records as instructed
   - SSL certificate is automatically provisioned

## Other Deployment Options

While this template is optimized for Netlify, it can be deployed to:

- **Vercel**: Similar setup, uses `vercel.json` for configuration
- **GitHub Pages**: Requires additional build configuration
- **AWS S3 + CloudFront**: Manual setup required
- **Any static hosting**: Build output in `dist` folder is portable