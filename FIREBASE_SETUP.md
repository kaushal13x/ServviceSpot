# Firebase Setup Guide for ServiceSpot

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Enter project name: `servicespot` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. Optionally enable **Google** provider for social login

## 3. Create Firestore Database

1. Go to **Firestore Database** > **Create database**
2. Choose **Start in test mode** (for development)
3. Select your preferred location
4. Click "Done"

## 4. Get Web App Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web app" icon (`</>`)
4. Register app with name: `ServiceSpot Web`
5. Copy the configuration object

## 5. Environment Variables

Create `.env.local` file in your project root:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 6. Firestore Security Rules

Go to **Firestore Database** > **Rules** and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read shops (for public browsing)
    match /shops/{shopId} {
      allow read: if true;
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.ownerId || 
         request.auth.uid == request.resource.data.ownerId);
    }
  }
}
```

## 7. Test Your Setup

1. Restart your development server: `npm run dev`
2. Visit: http://localhost:3000/test-firebase
3. Check that all services show "✅ Connected"
4. Try the Firestore test button

## 8. Deploy to Production

### Vercel Deployment:
1. Push your code to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Firebase Hosting (Alternative):
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Database Collections Structure

### Users Collection (`/users/{uid}`)
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  role: 'user' | 'shopkeeper',
  phone?: string,
  address?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Shops Collection (`/shops/{shopId}`)
```javascript
{
  id: string,
  ownerId: string, // References users/{uid}
  name: string,
  category: string,
  phone: string,
  whatsapp?: string,
  email?: string,
  address: string,
  description?: string,
  openingTime: string, // "09:00"
  closingTime: string, // "21:00"
  images: string[], // Array of image URLs
  isActive: boolean,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Troubleshooting

### Common Issues:

1. **"Missing required env variable"**
   - Check `.env.local` file exists and has all variables
   - Restart development server after adding env vars

2. **"Permission denied" errors**
   - Check Firestore security rules
   - Ensure user is authenticated before writing data

3. **"Firebase app not initialized"**
   - Check Firebase configuration in `.env.local`
   - Verify all NEXT_PUBLIC_ prefixes are correct

4. **Build errors**
   - Run `npm run build` to check for TypeScript errors
   - Check browser console for runtime errors

### Getting Help:
- Visit `/test-firebase` page to diagnose issues
- Check browser console for detailed error messages
- Verify Firebase project settings match your env vars