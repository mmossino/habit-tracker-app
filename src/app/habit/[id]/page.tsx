'use client'

import { useParams, useRouter } from 'next/navigation'
import { useHabits } from '@/contexts/HabitContext'
import { getMonthDays, formatDate, isToday, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Check, X, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isAfter, isBefore, startOfDay } from 'date-fns'
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
      <div className="container mx-auto px-4 py-6 pb-24">
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
      <div className="container mx-auto px-4 py-6 pb-24">
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

  // Calculate stats - FIXED: only include days up to today
  const today = startOfDay(new Date())
  const currentMonthEntries = habit.entries.filter(entry => {
    const entryDate = new Date(entry.date)
    return isSameMonth(entryDate, currentDate) && !isAfter(startOfDay(entryDate), today)
  })
  
  // Get all days in current month up to today (FIXED)
  const monthDays = getMonthDays(currentDate)
  const daysUpToToday = monthDays.filter(day => !isAfter(startOfDay(day), today))
  
  const completedDays = currentMonthEntries.filter(e => e.completed).length
  const failedDays = currentMonthEntries.filter(e => !e.completed).length
  const totalDaysUpToToday = daysUpToToday.length
  const completionRate = totalDaysUpToToday > 0 ? Math.round((completedDays / totalDaysUpToToday) * 100) : 0

  return (
    <div className="container mx-auto px-3 py-4 pb-24">
      <div className="mb-6">
        {/* Habit Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{habit.name}</h1>
          <p className="text-gray-600 text-sm">Track your daily progress</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 max-w-sm mx-auto">
          <Button
            onClick={openEditDialog}
            disabled={isUpdating}
            className="glass-button bg-blue-500/20 border-blue-500/30 text-blue-700 hover:bg-blue-500/30 px-4 py-2 text-sm flex-1"
          >
            <Edit3 size={16} className="mr-2" />
            Edit
          </Button>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                disabled={isDeleting}
                className="glass-button text-red-600 border-red-500/30 hover:bg-red-500/20 px-4 py-2 text-sm flex-1"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel border-white/30 mx-4">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Delete Habit</DialogTitle>
                <DialogDescription className="text-gray-600 text-sm">
                  Are you sure you want to delete &quot;{habit.name}&quot;? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 flex-col sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteDialog(false)}
                  disabled={isDeleting}
                  className="glass-button px-4 py-2 text-sm w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteHabit}
                  disabled={isDeleting}
                  className="bg-red-500/20 border-red-500/30 text-red-700 hover:bg-red-500/30 px-4 py-2 text-sm w-full sm:w-auto"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="glass-panel border-white/30 mx-4">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">Edit Habit</DialogTitle>
                <DialogDescription className="text-gray-600 text-sm">
                  Change the name of your habit.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editName" className="text-sm font-semibold text-gray-900">
                    Habit Name
                  </Label>
                  <Input
                    id="editName"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="glass-input"
                    placeholder="Enter habit name"
                    disabled={isUpdating}
                  />
                </div>
              </div>
              <DialogFooter className="gap-2 flex-col sm:flex-row">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                  disabled={isUpdating}
                  className="glass-button px-4 py-2 text-sm w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditHabit}
                  disabled={!editName.trim() || isUpdating}
                  className="bg-blue-500/20 border-blue-500/30 text-blue-700 hover:bg-blue-500/30 disabled:opacity-50 px-4 py-2 text-sm w-full sm:w-auto"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="glass-card text-center p-4">
          <div className="text-2xl font-bold text-green-600 mb-1">{completedDays}</div>
          <div className="text-xs text-gray-600 font-medium">Completed</div>
        </div>
        <div className="glass-card text-center p-4">
          <div className="text-2xl font-bold text-red-600 mb-1">{failedDays}</div>
          <div className="text-xs text-gray-600 font-medium">Failed</div>
        </div>
        <div className="glass-card text-center p-4">
          <div className="text-2xl font-bold text-blue-600 mb-1">{completionRate}%</div>
          <div className="text-xs text-gray-600 font-medium">Success Rate</div>
        </div>
        <div className="glass-card text-center p-4">
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalDaysUpToToday}</div>
          <div className="text-xs text-gray-600 font-medium">Days Tracked</div>
        </div>
      </div>

      {/* Calendar */}
      <div className="glass-card">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="glass-button p-2 hover:scale-105 transition-transform"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextMonth}
              className="glass-button p-2 hover:scale-105 transition-transform"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
            <div key={index} className="text-center text-xs font-semibold text-gray-500 py-2">
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
                  "aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-semibold transition-all duration-200 relative min-h-[2.5rem]",
                  !isCurrentMonth && "text-gray-300 cursor-not-allowed border-gray-200 bg-gray-50/30",
                  isFutureDate && isCurrentMonth && "text-gray-400 cursor-not-allowed border-gray-300 bg-gray-100/30",
                  isCurrentMonth && !isFutureDate && state === 'incomplete' && "habit-incomplete hover:scale-105 bg-gray-100/50 border-gray-400",
                  isCurrentMonth && state === 'completed' && "habit-completed hover:scale-105 bg-green-100/80 border-green-500",
                  isCurrentMonth && state === 'failed' && "habit-failed hover:scale-105 bg-red-100/80 border-red-500",
                  isTodayDate && isCurrentMonth && "ring-2 ring-blue-500/50"
                )}
              >
                <span className={cn(
                  isTodayDate && isCurrentMonth && "font-bold",
                  state === 'completed' && isCurrentMonth && "text-green-800",
                  state === 'failed' && isCurrentMonth && "text-red-800",
                  state === 'incomplete' && isCurrentMonth && "text-gray-700"
                )}>
                  {format(date, 'd')}
                </span>
                {state === 'completed' && isCurrentMonth && (
                  <Check size={10} className="absolute top-0.5 right-0.5 text-green-800" />
                )}
                {state === 'failed' && isCurrentMonth && (
                  <X size={10} className="absolute top-0.5 right-0.5 text-red-800" />
                )}
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-6 pt-4 border-t border-white/20">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded habit-completed bg-green-100/80 border-green-500"></div>
            <span className="text-xs text-gray-600">Done</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded habit-failed bg-red-100/80 border-red-500"></div>
            <span className="text-xs text-gray-600">Failed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded habit-incomplete bg-gray-100/50 border-gray-400"></div>
            <span className="text-xs text-gray-600">Not tracked</span>
          </div>
        </div>
      </div>
    </div>
  )
} 