# Authentication Setup

This habit tracker now includes complete authentication using Supabase Auth UI.

## Features Implemented

### ✅ **Authentication Pages**
- **Login Page** (`/login`) - Beautiful login/signup form using Supabase Auth UI
- **Protected Routes** - All app routes require authentication
- **Auto-redirect** - Unauthenticated users are redirected to login

### ✅ **Authentication Methods**
- **Email/Password** - Traditional email and password authentication
- **Magic Link** - Passwordless login via email magic links
- **Social Login** - Google and GitHub OAuth providers
- **Password Reset** - Forgot password functionality

### ✅ **User Management**
- **User Context** - Global authentication state management
- **Auto Session Management** - Automatic session handling and refresh
- **Sign Out** - Logout functionality available in navigation and settings

### ✅ **Data Security**
- **Row Level Security (RLS)** - Users can only access their own data
- **User-specific Habits** - Each habit is associated with the authenticated user
- **Secure Policies** - Database policies ensure data isolation

## Authentication Flow

1. **Unauthenticated User**:
   - Redirected to `/login` page
   - Can sign up, sign in, or use social providers
   - Can request password reset or magic link

2. **Authentication Process**:
   - Supabase handles all authentication logic
   - JWT tokens are automatically managed
   - Session state is synced across tabs

3. **Authenticated User**:
   - Access to all app features
   - Data is automatically filtered by user ID
   - Can sign out from navigation or settings

## Database Schema Updates

### User Association
```sql
-- Added user_id column to habits table
ALTER TABLE habits ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Updated RLS policies for user-specific access
CREATE POLICY "Users can manage their own habits" ON habits
    FOR ALL USING (user_id = auth.uid() OR auth.uid() IS NULL);

CREATE POLICY "Users can manage their own habit entries" ON habit_entries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM habits 
            WHERE habits.id = habit_entries.habit_id 
            AND (habits.user_id = auth.uid() OR auth.uid() IS NULL)
        )
    );
```

## Components

### AuthProvider (`src/contexts/AuthContext.tsx`)
- Manages global authentication state
- Handles session changes and user data
- Provides sign out functionality

### AuthWrapper (`src/components/AuthWrapper.tsx`)
- Protects routes from unauthenticated access
- Handles redirects between login and app
- Shows loading states during auth checks

### Login Page (`src/app/login/page.tsx`)
- Uses Supabase Auth UI components
- Custom styling to match app design
- Supports all authentication methods

## Styling

The login page uses a custom theme that matches the app's glass morphism design:

- **Glass Effects** - Backdrop blur and transparency
- **Custom Colors** - Blue accent colors matching the app
- **Responsive Design** - Works on all screen sizes
- **Smooth Animations** - Transitions and hover effects

## Configuration

### Supabase Auth UI Setup
```typescript
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'

<Auth
  supabaseClient={supabase}
  appearance={{ theme: ThemeSupa }}
  providers={['google', 'github']}
  redirectTo={`${window.location.origin}/`}
/>
```

### Environment Variables
The app uses the same Supabase configuration:
- **Project URL**: `https://ysjdkgxdndipwwhzqgrv.supabase.co`
- **Anon Key**: Configured in `src/lib/supabase.ts`

## Security Features

1. **Row Level Security** - Database-level access control
2. **JWT Validation** - Automatic token validation
3. **Session Management** - Secure session handling
4. **CSRF Protection** - Built-in CSRF protection
5. **Data Isolation** - Users can only access their own data

## Usage

1. **Visit the app** - Automatically redirected to login if not authenticated
2. **Sign up/Sign in** - Use email, social providers, or magic links
3. **Use the app** - Full access to habit tracking features
4. **Sign out** - Available in navigation and settings

The authentication is now fully integrated and provides a secure, user-friendly experience! 