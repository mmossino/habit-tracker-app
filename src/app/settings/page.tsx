'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useHabits } from '@/contexts/HabitContext'
import { Button } from '@/components/ui/button'
import { LogOut, Download, Upload, User, Mail, Calendar } from 'lucide-react'
import { useState } from 'react'

export default function Settings() {
  const { user, signOut } = useAuth()
  const { exportData, importData, habits } = useHabits()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const data = exportData()
      
      // Create and download the file
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsImporting(true)
      
      // Read file content as string
      const reader = new FileReader()
      const fileContent = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => {
          const result = e.target?.result
          if (typeof result === 'string') {
            resolve(result)
          } else {
            reject(new Error('Failed to read file'))
          }
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsText(file)
      })
      
      await importData(fileContent)
    } catch (error) {
      console.error('Error importing data:', error)
    } finally {
      setIsImporting(false)
      // Reset the input
      event.target.value = ''
    }
  }

  return (
    <div className="container mx-auto px-3 py-4 pb-28">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600 text-sm">Manage your account and data</p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Account Information */}
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <User size={20} className="text-blue-700" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Account</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
              <Mail size={16} className="text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-xs text-gray-600">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-gray-50/50 rounded-lg">
              <Calendar size={16} className="text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Member since</p>
                <p className="text-xs text-gray-600">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Download size={20} className="text-green-700" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Data Management</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Export Data</h3>
              <p className="text-sm text-gray-600 mb-3">
                Download all your habits and progress data as a JSON file.
              </p>
              <Button
                onClick={handleExport}
                disabled={isExporting || habits.length === 0}
                className="glass-button bg-green-500/20 border-green-500/30 text-green-700 hover:bg-green-500/30 disabled:opacity-50 px-4 py-2 text-sm"
              >
                <Download size={16} className="mr-2" />
                {isExporting ? 'Exporting...' : 'Export Data'}
              </Button>
              {habits.length === 0 && (
                <p className="text-xs text-gray-500 mt-2">No habits to export</p>
              )}
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Import Data</h3>
              <p className="text-sm text-gray-600 mb-3">
                Upload a previously exported JSON file to restore your data.
              </p>
              <div className="relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  disabled={isImporting}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  id="import-file"
                />
                <Button
                  disabled={isImporting}
                  className="glass-button bg-blue-500/20 border-blue-500/30 text-blue-700 hover:bg-blue-500/30 disabled:opacity-50 px-4 py-2 text-sm"
                  asChild
                >
                  <label htmlFor="import-file" className="cursor-pointer">
                    <Upload size={16} className="mr-2" />
                    {isImporting ? 'Importing...' : 'Import Data'}
                  </label>
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Warning: This will replace all existing data
              </p>
            </div>
          </div>
        </div>

        {/* Sign Out */}
        <div className="glass-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <LogOut size={20} className="text-red-700" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Sign Out</h2>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Sign out of your account. Your data will be saved and available when you sign back in.
            </p>
            <Button
              onClick={handleSignOut}
              className="glass-button bg-red-500/20 border-red-500/30 text-red-700 hover:bg-red-500/30 px-4 py-2 text-sm"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 