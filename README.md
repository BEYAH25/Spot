# Spotify Playlists and songs Migrator

A self-hosted tool to migrate your Spotify playlists, liked songs, and albums from one account to another.

## 🚀 Features
- Log in to both source and destination Spotify accounts
- Select playlists, liked songs, and albums to migrate
- Secure OAuth2 login (no manual API keys)
- Progress feedback and error handling

## 🛠️ Setup Instructions

### 1. Register a Spotify Developer App
- Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications)
- Click **Create App**
- Name: `SpotifyMigrator`
- Redirect URI: `http://127.0.0.1:3000/api/token/callback`
- Copy your **Client ID** and **Client Secret**

### 2. Configure Environment Variables
Create a `.env` file in the root directory:

```
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEXTAUTH_SECRET=super-secret-value
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:3000/
```

### 3. Install Dependencies
```
npm install
```

### 4. Run Locally
```
npm run dev
```

### 5. Deploy
- Add your deployed URL as a redirect URI in the Spotify dashboard (e.g., `https://your-app.vercel.app/api/token/callback`)
- Set environment variables in your deployment platform

---

## 📁 Project Structure

```
app/
  layout.tsx
  page.tsx
  migrate/page.tsx
  api/token/
    source/route.ts
    destination/route.ts
    callback/route.ts
    get/route.ts
components/
  AccountSelector.tsx
  PlaylistSelector.tsx
  MigrationStatus.tsx
lib/
  spotify.ts
  auth.ts
.env.local
next.config.ts
tailwind.config.ts
package.json
README.md
```

---

## 🧠 Notes
- Tokens are stored securely in HTTP-only cookies
- Only one migration at a time is supported (per browser session)
- For issues, open an issue on GitHub or contact the author 