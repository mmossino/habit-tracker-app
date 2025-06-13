# Supabase Integration

This habit tracker application is now integrated with Supabase for data persistence.

## Database Schema

### Tables

#### `habits`
- `id` (UUID, Primary Key)
- `name` (Text, Required)
- `icon` (Text, Default: 'target')
- `color` (Text, Default: 'blue')
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

#### `habit_entries`
- `id` (UUID, Primary Key)
- `habit_id` (UUID, Foreign Key to habits.id)
- `date` (Date, Required)
- `completed` (Boolean, Default: false)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)
- Unique constraint on (habit_id, date)

## Features

✅ **Real-time Data Sync**: All data is stored in Supabase PostgreSQL database
✅ **Automatic Timestamps**: Created and updated timestamps are managed automatically
✅ **Data Integrity**: Foreign key constraints and unique constraints ensure data consistency
✅ **Row Level Security**: RLS is enabled for both tables
✅ **Type Safety**: Generated TypeScript types for better development experience
✅ **Loading States**: Proper loading indicators while data is being fetched
✅ **Error Handling**: Graceful error handling for all database operations
✅ **Import/Export**: Backup and restore functionality with Supabase data

## Configuration

The application is configured to use:
- **Project URL**: `https://ysjdkgxdndipwwhzqgrv.supabase.co`
- **Database**: PostgreSQL 15.8.1.100
- **Region**: us-east-2

## Security

- Row Level Security (RLS) is enabled on all tables
- Currently configured with permissive policies for development
- Function security warnings have been addressed
- Search path is properly configured for database functions

## Sample Data

The database includes sample habits and entries for testing:
- Morning Exercise
- Read for 30 minutes  
- Drink 8 glasses of water

## Development

The application automatically:
1. Loads data from Supabase on startup
2. Shows loading states while fetching data
3. Handles async operations with proper error handling
4. Syncs all changes to the database in real-time

## Migration History

1. `create_habits_table` - Created habits table with RLS and triggers
2. `create_habit_entries_table` - Created habit_entries table with relationships and indexes
3. `fix_function_security` - Fixed function security warning by setting search_path

All data operations are now handled through Supabase instead of localStorage, providing a much more robust and scalable solution. 