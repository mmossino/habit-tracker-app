'use client'

import { useParams, useRouter } from 'next/navigation'
import { useHabits } from '@/contexts/HabitContext'
import { formatDate, isToday, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Check, X, ChevronLeft, ChevronRight, Edit3, ArrowLeft } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isAfter, startOfDay } from 'date-fns'
import { useState } from 'react'

export default function HabitDetail() {
  const params = useParams()
  const router = useRouter()
  const { getHabitWithEntries, deleteHabit, toggleHabitEntry, updateHabit, loading } = useHabits()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editName, setEditName] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  
  const habitId = params.id as string
  const habit = getHabitWithEntries(habitId)

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 pb-40">
        <div className="text-center max-w-sm mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-100 rounded mb-6"></div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card p-4">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!habit) {
    return (
      <div className="container mx-auto px-4 py-6 pb-40">
        <div className="text-center max-w-sm mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Habit not found</h1>
        </div>
      </div>
    )
  }

  const handleDeleteHabit = async () => {
    try {
      setIsDeleting(true)
      await deleteHabit(habitId)
      setShowDeleteDialog(false)
      router.push('/')
    } catch (error) {
      console.error('Error deleting habit:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditHabit = async () => {
    if (!editName.trim() || isUpdating) return

    try {
      setIsUpdating(true)
      await updateHabit(habitId, { name: editName.trim() })
      setShowEditDialog(false)
      setEditName('')
    } catch (error) {
      console.error('Error updating habit:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const openEditDialog = () => {
    setEditName(habit.name)
    setShowEditDialog(true)
  }

  const handleToggleEntry = async (date: Date) => {
    // Only allow toggling for today or past dates
    if (isAfter(startOfDay(date), startOfDay(new Date()))) {
      return
    }
    
    try {
      await toggleHabitEntry(habitId, date)
    } catch (error) {
      console.error('Error toggling entry:', error)
    }
  }

  const getEntryForDate = (date: Date) => {
    const dateStr = formatDate(date)
    return habit.entries.find(entry => entry.date === dateStr)
  }

  const getHabitState = (date: Date) => {
    const entry = getEntryForDate(date)
    if (!entry) return 'incomplete'
    if (entry.completed) return 'completed'
    return 'failed'
  }

  // Calendar logic
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  // Calculate stats - FIXED: improved date handling to prevent first-day-of-month bug
  const today = startOfDay(new Date())
  
  // Helper function to properly parse date strings to avoid timezone issues
  const parseEntryDate = (dateStr: string): Date => {
    // Ensure consistent parsing by explicitly constructing date
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day) // month is 0-indexed
  }
  
  const currentMonthEntries = habit.entries.filter(entry => {
    const entryDate = parseEntryDate(entry.date)
    return isSameMonth(entryDate, currentDate) && !isAfter(startOfDay(entryDate), today)
  })
  
  const completedDays = currentMonthEntries.filter(e => e.completed).length
  const failedDays = currentMonthEntries.filter(e => !e.completed).length
  const totalTrackedDays = completedDays + failedDays // Only count days with actual entries
  
  // Success rate based only on tracked days (completed vs failed)
  const completionRate = totalTrackedDays > 0 ? Math.round((completedDays / totalTrackedDays) * 100) : 0

  return (
    <div className="container mx-auto px-4 py-6 pb-40 max-w-md">
      {/* Header with Back Button and Habit Name */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.push('/')}
          className="glass-button p-3 hover:scale-105 transition-transform"
          title="Back to Home"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 capitalize">{habit.name}</h1>
        <div className="w-[48px]"></div> {/* Spacer for balance */}
      </div>

      {/* Calendar */}
      <div className="glass-card p-6 mb-8">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={previousMonth}
              className="glass-button p-3 hover:scale-105 transition-transform"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextMonth}
              className="glass-button p-3 hover:scale-105 transition-transform"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-8">
          {/* Day Headers */}
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <div key={index} className="text-center text-sm font-semibold text-gray-500 py-3">
              {day}
            </div>
          ))}

          {/* Calendar Days */}
          {calendarDays.map((date) => {
            const state = getHabitState(date)
            const isCurrentMonth = isSameMonth(date, currentDate)
            const isTodayDate = isToday(date)
            const isFutureDate = isAfter(startOfDay(date), startOfDay(new Date()))

            return (
              <button
                key={date.toISOString()}
                onClick={() => isCurrentMonth && !isFutureDate && handleToggleEntry(date)}
                disabled={!isCurrentMonth || isFutureDate}
                className={cn(
                  "aspect-square rounded-xl border-2 flex items-center justify-center text-base font-semibold transition-all duration-200 relative min-h-[48px] hover:shadow-lg",
                  !isCurrentMonth && "text-gray-300 cursor-not-allowed border-gray-200 bg-gray-50/30",
                  isFutureDate && isCurrentMonth && "text-gray-400 cursor-not-allowed border-gray-300 bg-gray-100/30",
                  isCurrentMonth && !isFutureDate && state === 'incomplete' && "habit-incomplete hover:scale-105 bg-gray-100/60 border-gray-400 text-gray-700",
                  isCurrentMonth && state === 'completed' && "habit-completed hover:scale-105 bg-green-100/90 border-green-500 text-green-800",
                  isCurrentMonth && state === 'failed' && "habit-failed hover:scale-105 bg-red-100/90 border-red-500 text-red-800",
                  isTodayDate && isCurrentMonth && "ring-3 ring-blue-500/60 shadow-lg"
                )}
              >
                <span className={cn(
                  "text-base",
                  isTodayDate && isCurrentMonth && "font-bold text-lg"
                )}>
                  {format(date, 'd')}
                </span>
                {state === 'completed' && isCurrentMonth && (
                  <Check size={12} className="absolute top-1 right-1 text-green-700" />
                )}
                {state === 'failed' && isCurrentMonth && (
                  <X size={12} className="absolute top-1 right-1 text-red-700" />
                )}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 pt-6 border-t border-white/20">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-lg habit-completed bg-green-100/90 border-green-500"></div>
            <span className="text-sm font-medium text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-lg habit-failed bg-red-100/90 border-red-500"></div>
            <span className="text-sm font-medium text-gray-600">Failed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-lg habit-incomplete bg-gray-100/60 border-gray-400"></div>
            <span className="text-sm font-medium text-gray-600">Not tracked</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass-card text-center p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl font-bold text-green-600 mb-2">{completedDays}</div>
          <div className="text-sm font-semibold text-gray-700">Completed</div>
        </div>
        <div className="glass-card text-center p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl font-bold text-red-600 mb-2">{failedDays}</div>
          <div className="text-sm font-semibold text-gray-700">Failed</div>
        </div>
        <div className="glass-card text-center p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl font-bold text-blue-600 mb-2">{completionRate}%</div>
          <div className="text-sm font-semibold text-gray-700">Success Rate</div>
        </div>
        <div className="glass-card text-center p-6 hover:shadow-lg transition-shadow">
          <div className="text-3xl font-bold text-gray-900 mb-2">{totalTrackedDays}</div>
          <div className="text-sm font-semibold text-gray-700">Days Tracked</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={openEditDialog}
          disabled={isUpdating}
          className="glass-button bg-blue-500/20 border-blue-500/30 text-blue-700 hover:bg-blue-500/30 hover:shadow-lg px-6 py-4 text-base font-semibold flex-1 transition-all"
        >
          <Edit3 size={18} className="mr-3" />
          Edit Habit
        </Button>

        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              disabled={isDeleting}
              className="glass-button text-red-600 border-red-500/30 hover:bg-red-500/20 hover:shadow-lg px-6 py-4 text-base font-semibold flex-1 transition-all"
            >
              <Trash2 size={18} className="mr-3" />
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-panel border-white/30 mx-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Delete Habit</DialogTitle>
              <DialogDescription className="text-gray-600 text-base">
                Are you sure you want to delete &quot;{habit.name}&quot;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-3 flex-col sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                disabled={isDeleting}
                className="glass-button px-6 py-3 text-base font-semibold w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteHabit}
                disabled={isDeleting}
                className="bg-red-500/20 border-red-500/30 text-red-700 hover:bg-red-500/30 px-6 py-3 text-base font-semibold w-full sm:w-auto"
              >
                {isDeleting ? 'Deleting...' : 'Delete Habit'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="glass-panel border-white/30 mx-4">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Edit Habit</DialogTitle>
              <DialogDescription className="text-gray-600 text-base">
                Change the name of your habit.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="editName" className="text-base font-semibold text-gray-900">
                  Habit Name
                </Label>
                <Input
                  id="editName"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="glass-input text-base py-3"
                  placeholder="Enter habit name"
                  disabled={isUpdating}
                />
              </div>
            </div>
            <DialogFooter className="gap-3 flex-col sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={isUpdating}
                className="glass-button px-6 py-3 text-base font-semibold w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditHabit}
                disabled={!editName.trim() || isUpdating}
                className="bg-blue-500/20 border-blue-500/30 text-blue-700 hover:bg-blue-500/30 disabled:opacity-50 px-6 py-3 text-base font-semibold w-full sm:w-auto"
              >
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 