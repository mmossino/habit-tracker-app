module.exports = {
  name: 'habit-tracker',
  displayName: 'Habit Tracker',
  description: 'A beautiful habit tracking app with Apple-inspired liquid glass design',
  version: '1.0.0',
  
  // Build configuration
  build: {
    command: 'npm run build',
    outputDirectory: '.next',
    installCommand: 'npm install'
  },
  
  // Environment variables (if needed)
  env: {
    NODE_ENV: 'production'
  },
  
  // Static site configuration
  static: true,
  
  // Custom headers for better performance
  headers: [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        }
      ]
    }
  ],
  
  // Redirect configuration
  redirects: [
    {
      source: '/home',
      destination: '/',
      permanent: true
    }
  ]
} 