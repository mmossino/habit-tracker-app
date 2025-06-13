'use client'

import { useHabits } from '@/contexts/HabitContext'
import { getWeekDays, formatDate, isToday, cn } from '@/lib/utils'
import { Check, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { format, getWeek, addWeeks, subWeeks, isSameWeek, isAfter, startOfDay } from 'date-fns'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  const { getHabitsWithEntries, toggleHabitEntry, loading } = useHabits()
  const habits = getHabitsWithEntries()
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date())
  
  // Auto-advance to current week when time passes
  useEffect(() => {
    const now = new Date()
    if (!isSameWeek(currentWeekDate, now, { weekStartsOn: 1 })) {
      setCurrentWeekDate(now)
    }
  }, [currentWeekDate])

  const weekDays = getWeekDays(currentWeekDate)
  const currentWeek = getWeek(currentWeekDate)
  const currentYear = currentWeekDate.getFullYear()

  const goToPreviousWeek = () => {
    setCurrentWeekDate(subWeeks(currentWeekDate, 1))
  }

  const goToNextWeek = () => {
    setCurrentWeekDate(addWeeks(currentWeekDate, 1))
  }

  const goToCurrentWeek = () => {
    setCurrentWeekDate(new Date())
  }

  const getEntryForDate = (habitId: string, date: Date) => {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return null
    
    const dateStr = formatDate(date)
    return habit.entries.find(entry => entry.date === dateStr)
  }

  const handleToggleEntry = async (habitId: string, date: Date) => {
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

  const getHabitState = (habitId: string, date: Date) => {
    const entry = getEntryForDate(habitId, date)
    if (!entry) return 'incomplete'
    if (entry.completed) return 'completed'
    return 'failed'
  }

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto px-3 pt-8 pb-28">
        <div className="text-center max-w-sm mx-auto">
          <div className="glass-card text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-200/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-100 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (habits.length === 0) {
    return (
      <div className="container mx-auto px-3 pt-8 pb-28">
        <div className="text-center max-w-sm mx-auto">
          <div className="glass-card text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gray-200/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No habits yet</h3>
              <p className="text-gray-600 text-sm">
                Create your first habit to start tracking
              </p>
            </div>
            <Link
              href="/create"
              className="glass-button inline-flex items-center gap-2 text-gray-900 font-semibold px-6 py-3"
            >
              <Plus size={18} />
              Create Habit
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isCurrentWeek = isSameWeek(new Date(), currentWeekDate, { weekStartsOn: 1 })

  return (
    <div className="container mx-auto px-3 pt-8 pb-28">
      {/* Week Navigation */}
      <div className="mb-6 text-center">
        {/* Week Navigation */}
        <div className="flex items-center justify-center gap-4 mb-2">
          <button
            onClick={goToPreviousWeek}
            className="glass-button p-2 hover:scale-105 transition-transform"
            title="Previous week"
          >
            <ChevronLeft size={18} />
          </button>
          
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-900">
              Week {currentWeek} of {currentYear}
            </div>
            <div className="text-xs text-gray-500">
              {format(currentWeekDate, 'MMMM yyyy')}
            </div>
          </div>
          
          <button
            onClick={goToNextWeek}
            className="glass-button p-2 hover:scale-105 transition-transform"
            title="Next week"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        
        {/* Current Week Button */}
        {!isCurrentWeek && (
          <button
            onClick={goToCurrentWeek}
            className="glass-button text-xs px-3 py-1 text-blue-700 bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30"
          >
            Go to Current Week
          </button>
        )}
      </div>

      <div className="glass-card">
        {/* Week Header */}
        <div className="mb-4">
          <div className="grid grid-cols-8 gap-1 pb-4 border-b border-white/20">
            {/* Header for habit column */}
            <div className="text-xs font-semibold text-gray-700 p-1 flex items-center justify-center">
              Habits
            </div>
            {weekDays.map((date) => (
              <div key={date.toISOString()} className="text-center p-1">
                <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                  <span className="hidden sm:inline">{format(date, 'EEE')}</span>
                  <span className="sm:hidden">{format(date, 'E')}</span>
                </div>
                <div className={cn(
                  "text-sm font-bold",
                  isToday(date) ? "text-blue-600" : "text-gray-700"
                )}>
                  {format(date, 'd')}
                </div>
                {isToday(date) && (
                  <div className="w-1 h-1 bg-blue-600 rounded-full mx-auto mt-1"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Habits List */}
        <div className="space-y-2">
          {habits.map((habit) => (
            <div key={habit.id}>
              <div className="grid grid-cols-8 gap-1 items-center">
                {/* Habit Name */}
                <Link
                  href={`/habit/${habit.id}`}
                  className="px-1 py-2 rounded-lg hover:bg-white/20 transition-all duration-200 min-w-0 group cursor-pointer"
                >
                  <div className="text-gray-900 text-left leading-tight group-hover:text-blue-700 transition-colors">
                    <div className="text-xs font-medium" title={habit.name}>
                      {habit.name.length > 12 ? `${habit.name.substring(0, 12)}...` : habit.name}
                    </div>
                  </div>
                </Link>

                {/* Daily Checkboxes */}
                {weekDays.map((date) => {
                  const state = getHabitState(habit.id, date)
                  const isFutureDate = isAfter(startOfDay(date), startOfDay(new Date()))
                  
                  return (
                    <div key={date.toISOString()} className="flex justify-center">
                      <button
                        onClick={() => handleToggleEntry(habit.id, date)}
                        disabled={isFutureDate}
                        className={cn(
                          "w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all duration-200",
                          !isFutureDate && "hover:scale-110 active:scale-95",
                          isFutureDate && "cursor-not-allowed opacity-50",
                          state === 'completed' && "habit-completed shadow-lg",
                          state === 'failed' && "habit-failed shadow-lg",
                          state === 'incomplete' && !isFutureDate && "habit-incomplete hover:border-gray-400",
                          state === 'incomplete' && isFutureDate && "habit-incomplete"
                        )}
                      >
                        {state === 'completed' && (
                          <Check size={12} className="text-green-800" />
                        )}
                        {state === 'failed' && (
                          <X size={12} className="text-red-700" />
                        )}
                        {state === 'incomplete' && (
                          <div className="w-2 h-2 rounded-full bg-gray-400 opacity-40" />
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Add Habit Button */}
        <div className="mt-6 pt-4 border-t border-white/20 text-center">
          <Link
            href="/create"
            className="glass-button inline-flex items-center gap-2 text-gray-900 font-semibold px-6 py-3 hover:scale-105 transition-transform"
          >
            <Plus size={16} />
            Add Habit
          </Link>
        </div>
      </div>
    </div>
  )
}
