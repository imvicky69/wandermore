# Wandermore Setup Guide

This guide will help you set up and deploy the Wandermore blog application.

## Prerequisites

Before you begin, make sure you have:

- Node.js 18 or higher installed
- A Firebase account (free tier works fine)
- A Google Cloud account (for Google OAuth)

## Step 1: Clone and Install

```bash
git clone https://github.com/imvicky69/wandermore.git
cd wandermore
npm install
```

## Step 2: Firebase Project Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "wandermore")
4. Disable Google Analytics (optional)
5. Click "Create project"

### Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Google" provider
5. Enter project support email
6. Click "Save"

### Create Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Start in "production mode"
4. Choose a location closest to your users
5. Click "Enable"

### Set Firestore Security Rules

1. In Firestore, go to "Rules" tab
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null && request.auth.uid == resource.data.authorId;
      
      match /comments/{commentId} {
        allow read: if true;
        allow create: if request.auth != null;
        allow delete: if request.auth != null;
      }
    }
  }
}
```

3. Click "Publish"

### Enable Storage

1. In Firebase Console, go to "Storage"
2. Click "Get started"
3. Start in "production mode"
4. Use same location as Firestore
5. Click "Done"

### Set Storage Security Rules

1. In Storage, go to "Rules" tab
2. Replace with these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

### Get Firebase Config

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register app with nickname "Wandermore Web"
5. Copy the firebaseConfig object

## Step 3: Environment Variables

1. Copy the example environment file:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` with your Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Test the Application

### Test Authentication

1. Click "Log in" button in the navbar
2. Click "Continue with Google"
3. Sign in with your Google account
4. You should be redirected to the home page
5. Your profile picture should appear in the navbar

### Test Post Creation

1. Click the "+" icon in the navbar
2. Fill in the post details:
   - Title: "My First Post"
   - Caption: "This is my first post on Wandermore!"
   - Category: Choose any
   - Upload one or more images
3. Click "Publish Post"
4. You should be redirected to the home page
5. Your post should appear in the feed

### Test Interactions

1. Like your post by clicking the heart icon
2. Add a comment
3. Test the share button
4. View your profile by clicking your avatar > Profile

## Step 6: Deploy to Vercel

### Connect to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### Add Environment Variables

1. In Vercel project settings, go to "Environment Variables"
2. Add all variables from `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
3. Click "Save"

### Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Visit your deployed site
4. Test all features

### Configure Firebase for Production

1. In Firebase Console, go to Authentication > Settings
2. Add your Vercel domain to "Authorized domains"
   - Example: `wandermore.vercel.app`
3. Click "Add domain"

## Troubleshooting

### Authentication Errors

**Error: "auth/unauthorized-domain"**
- Add your domain to Firebase authorized domains in Authentication > Settings

**Error: "auth/invalid-api-key"**
- Check that your API key in `.env.local` is correct
- Ensure environment variables are set in Vercel

### Storage Errors

**Error: "storage/unauthorized"**
- Check Storage security rules
- Ensure user is authenticated before uploading

### Build Errors

**Error: "Failed to fetch font"**
- This is fixed in the current version
- If you see this, ensure `app/layout.tsx` doesn't import Google Fonts

**Error: "Firebase not initialized"**
- Check that all Firebase environment variables are set
- Restart development server after adding environment variables

### Database Errors

**Error: "Missing or insufficient permissions"**
- Check Firestore security rules
- Ensure user is authenticated for write operations

## Production Checklist

Before going to production:

- [ ] Set up proper Firebase security rules
- [ ] Enable Firebase App Check for additional security
- [ ] Set up Firebase billing alerts
- [ ] Configure proper error logging
- [ ] Test all features with multiple users
- [ ] Set up analytics (optional)
- [ ] Add a custom domain
- [ ] Enable HTTPS (automatic with Vercel)

## Advanced Configuration

### Custom Domain

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Firebase authorized domains

### Analytics

Consider adding:
- Google Analytics
- Vercel Analytics
- Firebase Analytics

### Performance Optimization

- Enable Next.js Image Optimization
- Use Vercel Edge Network
- Enable Vercel Analytics
- Optimize images before upload

## Support

If you encounter any issues:

1. Check the [GitHub Issues](https://github.com/imvicky69/wandermore/issues)
2. Review Firebase Console for errors
3. Check Vercel deployment logs
4. Create a new issue with detailed error information

## Next Steps

- Customize the color scheme in `tailwind.config.js`
- Add more categories for posts
- Implement search functionality
- Add user following feature
- Create a notification system
- Add post editing capability

Happy blogging! 🎉
