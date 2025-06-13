'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useHabits } from '@/contexts/HabitContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function CreateHabit() {
  const router = useRouter()
  const { addHabit } = useHabits()
  
  const [habitName, setHabitName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!habitName.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      
      await addHabit({
        name: habitName.trim(),
        icon: 'target',
        color: 'blue'
      })

      router.push('/')
    } catch (error) {
      console.error('Error creating habit:', error)
      // You could add a toast notification here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-3 py-4 pb-32">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Habit</h1>
        <p className="text-gray-600 text-sm">Add a new habit to track daily</p>
      </div>

      <div className="glass-card max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Habit Name */}
          <div className="space-y-3">
            <Label htmlFor="name" className="text-base font-semibold text-gray-900">
              What habit would you like to track?
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your habit name"
              value={habitName}
              onChange={(e) => setHabitName(e.target.value)}
              className="glass-input text-base py-3"
              required
              autoFocus
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              Choose something specific and achievable.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col gap-3 pt-4">
            <Button
              type="submit"
              disabled={!habitName.trim() || isSubmitting}
              className="w-full glass-button bg-blue-500/20 border-blue-500/30 text-blue-700 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base font-semibold"
            >
              <Plus size={16} className="mr-2" />
              {isSubmitting ? 'Creating...' : 'Create Habit'}
            </Button>
            <Link 
              href="/" 
              className="glass-button px-6 py-3 text-gray-700 font-medium text-center hover:scale-105 transition-transform text-sm"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
} 