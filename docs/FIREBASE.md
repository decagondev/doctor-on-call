# Firebase Setup Guide

Complete step-by-step guide to set up Firebase for the Doctor On Call application.

## Prerequisites

- Google account
- Firebase CLI installed (`npm install -g firebase-tools`)
- Node.js 18+ installed

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `doctor-on-call` (or your preferred name)
4. Click **"Continue"**
5. **Disable** Google Analytics (optional, can enable later)
6. Click **"Create project"**
7. Wait for project creation to complete
8. Click **"Continue"** to go to the project dashboard

## Step 2: Enable Authentication

### 2.1 Enable Authentication Service

1. In Firebase Console, click **"Authentication"** in the left sidebar
2. Click **"Get started"** if this is your first time
3. Click on the **"Sign-in method"** tab

### 2.2 Enable Email/Password Authentication

1. Click on **"Email/Password"**
2. Toggle **"Enable"** to ON
3. **Enable** "Email link (passwordless sign-in)" if desired (optional)
4. Click **"Save"**

### 2.3 Enable Google Authentication

1. Click on **"Google"**
2. Toggle **"Enable"** to ON
3. Enter a **Project support email** (your email)
4. Click **"Save"**

### 2.4 Configure Authorized Domains (for Production)

1. In Authentication settings, scroll to **"Authorized domains"**
2. Add your production domain (e.g., `yourdomain.com`)
3. Localhost and Firebase hosting domains are added by default

## Step 3: Create Firestore Database

### 3.1 Create Database

1. Click **"Firestore Database"** in the left sidebar
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add security rules)
4. Choose a **Cloud Firestore location** (choose closest to your users)
   - Recommended: `us-central1` (Iowa) or `europe-west1` (Belgium)
5. Click **"Enable"**
6. Wait for database creation (takes ~1 minute)

### 3.2 Deploy Security Rules

1. In Firestore Database, click on the **"Rules"** tab
2. Copy the contents of `firestore.rules` from your project root
3. Paste into the rules editor
4. Click **"Publish"**

**Alternative: Deploy via CLI**
```bash
firebase deploy --only firestore:rules
```

### 3.3 Create Indexes (if needed)

Firestore will prompt you to create indexes when you run queries. You can create them:
- Automatically when prompted in the console
- Manually in the "Indexes" tab
- Via `firestore.indexes.json` (optional)

## Step 4: Enable Cloud Storage

### 4.1 Create Storage Bucket

1. Click **"Storage"** in the left sidebar
2. Click **"Get started"**
3. Click **"Next"** through the setup wizard
4. Choose **"Start in production mode"** (we'll add security rules)
5. Select the same location as Firestore
6. Click **"Done"**

### 4.2 Configure Storage Security Rules

1. In Storage, click on the **"Rules"** tab
2. Add the following rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Profile photos
    match /profiles/{userId}/{fileName} {
      // Users can read their own photos
      allow read: if request.auth != null && 
                     (request.auth.uid == userId || 
                      resource.metadata.owner == request.auth.uid);
      
      // Users can upload their own photos
      allow write: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.size < 5 * 1024 * 1024 && // 5MB limit
                      request.resource.contentType.matches('image/.*');
      
      // Users can delete their own photos
      allow delete: if request.auth != null && 
                       request.auth.uid == userId;
    }
    
    // Default: deny all other access
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publish"**

## Step 5: Get Firebase Configuration

### 5.1 Get Web App Configuration

1. Click the **gear icon** (⚙️) next to "Project Overview"
2. Select **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** (`</>`) to add a web app
5. Register app:
   - App nickname: `Doctor On Call Web`
   - Firebase Hosting: Not set up (optional)
6. Click **"Register app"**
7. **Copy the Firebase configuration object** - you'll need this for `.env.local`

The config will look like:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 6: Set Up Environment Variables

### 6.1 Create `.env.local` File

1. In your project root, create `.env.local` file
2. Add the following variables (use values from Step 5.1):

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

3. **Important**: Never commit `.env.local` to git (it's already in `.gitignore`)

### 6.2 Verify Environment Variables

The app will throw an error on startup if any variables are missing. Check the browser console for any missing variable errors.

## Step 7: Set Up Cloud Functions

### 7.1 Initialize Firebase in Project

1. Install Firebase CLI globally (if not already installed):
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project:
```bash
cd /path/to/doctor-on-call
firebase init
```

4. Select the following:
   - ✅ Functions: Configure a Cloud Functions directory
   - ✅ Firestore: Configure security rules and indexes
   - Select your Firebase project from the list
   - Use existing `functions/` directory: **Yes**
   - Language: **TypeScript**
   - ESLint: **Yes**
   - Install dependencies: **Yes**

### 7.2 Install Functions Dependencies

```bash
cd functions
npm install
```

### 7.3 Build Functions

```bash
npm run build
```

### 7.4 Deploy Functions

```bash
# From project root
firebase deploy --only functions
```

Or from functions directory:
```bash
cd functions
npm run deploy
```

### 7.5 Verify Functions Deployment

1. In Firebase Console, go to **"Functions"**
2. You should see:
   - `approveDoctor`
   - `banUser`

## Step 8: Create Initial Admin User

### 8.1 Create Admin User via Console

1. Go to **Authentication** → **Users**
2. Click **"Add user"**
3. Enter email and password
4. Click **"Add user"**
5. Copy the **User UID**

### 8.2 Set Admin Role in Firestore

1. Go to **Firestore Database**
2. Create a new document in `users` collection:
   - Document ID: `[User UID from step 8.1]`
   - Fields:
     ```
     email: "admin@example.com" (string)
     name: "Admin User" (string)
     role: "admin" (string)
     createdAt: [timestamp] (use server timestamp)
     ```
3. Click **"Save"**

**Note**: You can also create the admin user through the app signup, then manually update the role in Firestore.

## Step 9: Test the Setup

### 9.1 Start Development Server

```bash
npm run dev
```

### 9.2 Test Authentication

1. Navigate to `/signup`
2. Create a test user account
3. Check Firebase Console → Authentication → Users (should see new user)
4. Check Firestore → `users` collection (should see user document)

### 9.3 Test Firestore Rules

1. Try to access `/dashboard` (should require authentication)
2. Try to access `/admin` (should require admin role)
3. Create a doctor account and verify it appears in Firestore

### 9.4 Test Cloud Functions

1. Create a doctor account via signup
2. Login as admin
3. Go to `/admin`
4. Try to approve the doctor
5. Check Firestore → `users` collection (approved field should be `true`)

## Step 10: Production Deployment

### 10.1 Configure Production Environment

1. Create production Firebase project (or use same project)
2. Update `.env.local` with production values (or use environment variables in hosting)
3. For Vercel/Netlify, add environment variables in their dashboards

### 10.2 Deploy Security Rules

```bash
firebase deploy --only firestore:rules
```

### 10.3 Deploy Functions

```bash
firebase deploy --only functions
```

### 10.4 Set Up Firebase Hosting (Optional)

```bash
firebase init hosting
firebase deploy --only hosting
```

## Troubleshooting

### Common Issues

#### 1. "Missing required Firebase environment variables"
- **Solution**: Check `.env.local` file exists and has all required variables
- Verify variable names start with `VITE_`
- Restart dev server after adding variables

#### 2. "Permission denied" errors
- **Solution**: Check Firestore security rules are deployed
- Verify user is authenticated
- Check user role in Firestore `users` collection

#### 3. Cloud Functions not working
- **Solution**: Verify functions are deployed: `firebase functions:list`
- Check function logs: `firebase functions:log`
- Verify admin role is set correctly

#### 4. Storage upload fails
- **Solution**: Check Storage security rules
- Verify file size < 5MB
- Check file type is image (JPEG, PNG, WebP)

#### 5. "User not found" errors
- **Solution**: Verify user document exists in `users` collection
- Check user UID matches between Auth and Firestore

### Getting Help

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- Check browser console for detailed error messages
- Check Firebase Console → Functions → Logs for function errors

## Security Checklist

Before going to production:

- [ ] Firestore security rules deployed and tested
- [ ] Storage security rules deployed
- [ ] Cloud Functions deployed
- [ ] Admin user created and tested
- [ ] Environment variables secured (not in git)
- [ ] Authorized domains configured in Authentication
- [ ] App Check enabled (optional, recommended for production)
- [ ] Rate limiting configured (via Cloud Functions)
- [ ] Error monitoring set up (optional: Sentry)

## Next Steps

After Firebase setup is complete:

1. Test all authentication flows (signup, login, Google OAuth)
2. Test doctor approval workflow
3. Test booking and appointment creation
4. Test video consultation flow
5. Set up error monitoring (optional)
6. Configure custom domain (if using Firebase Hosting)
7. Set up CI/CD for automatic deployments

## Additional Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/manage-data/structure-data)

