# 🌟 Habit Tracker

A beautiful, mobile-responsive habit tracking web application built with Next.js, TypeScript, and shadcn/ui, featuring an Apple-inspired liquid glass aesthetic.

**Latest Deployment:** June 13, 2025 - Mobile-optimized with three-state tracking

![Habit Tracker Preview](https://via.placeholder.com/800x400/f0f9ff/1e40af?text=Habit+Tracker+Preview)

## ✨ Features

### 🎯 Core Functionality
- **Dashboard**: Week-view grid showing all habits with daily completion tracking
- **Create Habits**: Intuitive form to add new habits with custom icons, colors, and weekly goals
- **Habit Details**: Monthly calendar view with completion statistics and habit management
- **Settings**: Profile management, data export/import, and app statistics

### 🎨 Design & UX
- **Apple-inspired liquid glass aesthetic** with frosted glass panels
- **Fully responsive design** optimized for mobile and desktop
- **Smooth animations** and micro-interactions
- **Intuitive navigation** with side navigation (desktop) and bottom navigation (mobile)

### 🔧 Technical Features
- **TypeScript** for type safety and better development experience
- **React Context** for state management with localStorage persistence
- **shadcn/ui** components for consistent, accessible UI
- **Date-fns** for robust date handling
- **Lucide React** icons for beautiful, consistent iconography

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd habit-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage Guide

### Creating Your First Habit
1. Click the "Create Habit" button or navigate to `/create`
2. Enter a descriptive name for your habit
3. Choose an icon that represents your habit
4. Select a color theme
5. Optionally set a weekly goal (1-7 times per week)
6. Click "Create Habit"

### Tracking Daily Progress
1. On the dashboard, you'll see a week view of all your habits
2. Click the checkbox for each day to mark a habit as complete/incomplete
3. Completed days show a green checkmark
4. Click on a habit name to view detailed monthly statistics

### Managing Habits
1. Click on any habit name to view its detail page
2. See monthly calendar view with completion status
3. View statistics including completion rate and streaks
4. Delete habits using the delete button (with confirmation dialog)

### Data Management
1. Go to Settings to export your data as JSON backup
2. Import previously exported data to restore habits and progress
3. View overall statistics and manage your profile

## 🏗️ Project Structure

```
habit-tracker/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── create/            # Create habit page
│   │   ├── habit/[id]/        # Habit detail page
│   │   ├── settings/          # Settings page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Dashboard page
│   │   └── globals.css        # Global styles with glass effects
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── Navigation.tsx    # Navigation component
│   │   └── HabitIcon.tsx     # Habit icon component
│   ├── contexts/             # React contexts
│   │   └── HabitContext.tsx  # Habit state management
│   ├── lib/                  # Utility functions
│   │   └── utils.ts          # Helper functions and constants
│   └── types/                # TypeScript type definitions
│       └── habit.ts          # Habit-related types
├── firstcell.config.js       # FirstCell deployment config
└── package.json              # Dependencies and scripts
```

## 🎨 Customization

### Adding New Icons
1. Import the icon from `lucide-react` in `src/components/HabitIcon.tsx`
2. Add it to the `iconMap` and `habitIconOptions` arrays
3. Update the `HabitIcon` type in `src/types/habit.ts`

### Adding New Colors
1. Add the color to `habitColorOptions` in `src/lib/utils.ts`
2. Update the `HabitColor` type in `src/types/habit.ts`
3. Ensure the color classes are available in your Tailwind configuration

### Modifying Glass Effects
The glass aesthetic is defined in `src/app/globals.css` with these key classes:
- `.glass-panel`: Base glass effect with backdrop blur
- `.glass-card`: Glass panel with padding and rounded corners
- `.glass-button`: Interactive glass button
- `.glass-input`: Glass-styled input fields

## 🚀 Deployment

### FirstCell Deployment (One-Click)
This app is configured for one-click deployment with FirstCell:

1. **Push to your repository**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy with FirstCell**
   - Connect your repository to FirstCell
   - The `firstcell.config.js` file will automatically configure the deployment
   - Your app will be built and deployed automatically

### Manual Deployment

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
# Upload the .next folder to Netlify
```

#### Static Export
```bash
npm run build
npm run export
# Deploy the out/ folder to any static hosting service
```

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Adding New Features
1. **New Pages**: Add to `src/app/` directory following Next.js app router conventions
2. **New Components**: Add to `src/components/` with proper TypeScript types
3. **State Management**: Extend the `HabitContext` for new data requirements
4. **Styling**: Use the existing glass effect classes or extend them in `globals.css`

## 📊 Data Storage

The app uses browser localStorage for data persistence:
- **Habits**: Stored as `habits` key
- **Entries**: Stored as `habitEntries` key
- **Profile**: Stored as `profileName` key

Data is automatically saved when changes are made and loaded when the app starts.

## 🔒 Privacy & Security

- **Local Storage**: All data is stored locally in your browser
- **No Analytics**: No tracking or analytics are implemented
- **No External APIs**: The app works completely offline after initial load
- **Data Export**: You can export your data at any time from Settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - The React framework for production
- **shadcn/ui** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful & consistent icon library
- **date-fns** - Modern JavaScript date utility library

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Include screenshots for UI-related issues

---

**Built with ❤️ using Next.js, TypeScript, and shadcn/ui**
