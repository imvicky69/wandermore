# Wandermore - A Travel Blog Platform

Wandermore is a modern, Instagram-inspired travel blog platform built with Next.js and Firebase. Share your journey with the world through photos, videos, and stories.

## Features

- **Google Authentication**: Sign in/sign up with Google
- **Create Posts**: Upload images and videos with captions
- **Multi-Image Gallery**: Support for multiple images in a single post with carousel navigation
- **Real-time Likes**: Like posts with real-time updates
- **Comments**: Comment on posts with user authentication
- **User Profiles**: View your posts and profile information
- **Firebase Storage**: All media files are securely stored in Firebase Storage
- **Instagram-like UI**: Clean, modern interface inspired by Instagram

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Language**: TypeScript
- **Hosting**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project with Authentication, Firestore, and Storage enabled
- Google OAuth configured in Firebase

### Installation

1. Clone the repository:
```bash
git clone https://github.com/imvicky69/wandermore.git
cd wandermore
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase project credentials:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Google Authentication in Authentication > Sign-in methods
3. Create a Firestore database in production mode
4. Enable Firebase Storage
5. Set up Firebase Storage security rules:
```
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

6. Set up Firestore security rules:
```
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

## Project Structure

```
wandermore/
├── app/
│   ├── components/       # React components
│   │   ├── Navbar.tsx
│   │   ├── PostView.tsx
│   │   ├── LikeButton.tsx
│   │   └── CommentSection.tsx
│   ├── context/          # React context providers
│   │   └── AuthContext.tsx
│   ├── create/           # Create post page
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── profile/          # User profile page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── firebase/
│   └── config.js         # Firebase configuration
└── public/               # Static assets
```

## Features in Detail

### Authentication
- Google Sign-in/Sign-up
- Protected routes for authenticated users
- User session management
- Profile information from Google account

### Blog Posts
- Create posts with title, caption, and category
- Upload multiple images or videos
- Image preview before publishing
- Gallery view with carousel navigation
- Real-time like counter
- Comment system with user authentication

### User Profile
- View all your posts
- Display profile information
- Post count statistics

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Design inspired by Instagram
- Built with Next.js and Firebase
- Icons from Heroicons

