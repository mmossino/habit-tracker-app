'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useHabits } from '@/contexts/HabitContext'
import { Button } from '@/components/ui/button'
import { LogOut, Trash2, User, Mail, Calendar } from 'lucide-react'
import { useState } from 'react'

export default function Settings() {
  const { user, signOut } = useAuth()
  const { habits, deleteHabit } = useHabits()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleClearData = () => {
    setShowConfirmation(true)
  }

  const confirmClearData = async () => {
    try {
      setIsClearing(true)
      // Delete all habits one by one
      for (const habit of habits) {
        await deleteHabit(habit.id)
      }
      setShowConfirmation(false)
    } catch (error) {
      console.error('Error clearing data:', error)
    } finally {
      setIsClearing(false)
    }
  }

  const cancelClearData = () => {
    setShowConfirmation(false)
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
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <Trash2 size={20} className="text-red-700" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Data Management</h2>
          </div>
          
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Clear All Habits</h3>
            <p className="text-sm text-gray-600 mb-4">
              Permanently delete all your habits and progress data. This action cannot be undone.
            </p>
            
            {!showConfirmation ? (
              <Button
                onClick={handleClearData}
                disabled={habits.length === 0}
                className="glass-button bg-red-500/20 border-red-500/30 text-red-700 hover:bg-red-500/30 disabled:opacity-50 px-4 py-2 text-sm"
              >
                <Trash2 size={16} className="mr-2" />
                Clear All Data
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-red-50/60 border border-red-200/60 rounded-lg">
                  <p className="text-sm font-medium text-red-800 mb-2">
                    Are you sure you want to delete all habits?
                  </p>
                  <p className="text-xs text-red-600">
                    This will permanently delete {habits.length} habit{habits.length !== 1 ? 's' : ''} and all progress data. This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={confirmClearData}
                    disabled={isClearing}
                    className="glass-button bg-red-500/20 border-red-500/30 text-red-700 hover:bg-red-500/30 disabled:opacity-50 px-4 py-2 text-sm"
                  >
                    <Trash2 size={16} className="mr-2" />
                    {isClearing ? 'Deleting...' : 'Yes, Delete All'}
                  </Button>
                  <Button
                    onClick={cancelClearData}
                    disabled={isClearing}
                    className="glass-button bg-gray-500/20 border-gray-500/30 text-gray-700 hover:bg-gray-500/30 disabled:opacity-50 px-4 py-2 text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
            {habits.length === 0 && (
              <p className="text-xs text-gray-500 mt-2">No habits to delete</p>
            )}
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