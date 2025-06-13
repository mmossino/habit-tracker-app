'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { Habit, HabitEntry, HabitWithEntries } from '@/types/habit'
import { formatDate } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface HabitContextType {
  habits: Habit[]
  entries: HabitEntry[]
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => Promise<void>
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  toggleHabitEntry: (habitId: string, date: Date) => Promise<void>
  getHabitWithEntries: (habitId: string) => HabitWithEntries | null
  getHabitsWithEntries: () => HabitWithEntries[]
  exportData: () => string
  importData: (data: string) => Promise<void>
  loading: boolean
}

const HabitContext = createContext<HabitContextType | undefined>(undefined)

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [entries, setEntries] = useState<HabitEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const loadData = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Load habits for the current user
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (habitsError) throw habitsError

      // Load entries for the current user's habits
      const { data: entriesData, error: entriesError } = await supabase
        .from('habit_entries')
        .select('*')
        .in('habit_id', (habitsData || []).map(h => h.id))
        .order('date', { ascending: false })

      if (entriesError) throw entriesError

      // Convert database format to app format
      const formattedHabits: Habit[] = (habitsData || []).map(habit => ({
        id: habit.id,
        name: habit.name,
        icon: habit.icon,
        color: habit.color,
        createdAt: new Date(habit.created_at)
      }))

      const formattedEntries: HabitEntry[] = (entriesData || []).map(entry => ({
        id: entry.id,
        habitId: entry.habit_id,
        date: entry.date,
        completed: entry.completed,
        createdAt: new Date(entry.created_at)
      }))

      setHabits(formattedHabits)
      setEntries(formattedEntries)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  // Load data from Supabase when user changes
  useEffect(() => {
    if (user) {
      loadData()
    } else {
      // Clear data when user logs out
      setHabits([])
      setEntries([])
      setLoading(false)
    }
  }, [user, loadData])

  const addHabit = async (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase
        .from('habits')
        .insert({
          name: habitData.name,
          icon: habitData.icon,
          color: habitData.color,
          user_id: user.id
        })
        .select()
        .single()

      if (error) throw error

      const newHabit: Habit = {
        id: data.id,
        name: data.name,
        icon: data.icon,
        color: data.color,
        createdAt: new Date(data.created_at)
      }

      setHabits(prev => [...prev, newHabit])
    } catch (error) {
      console.error('Error adding habit:', error)
      throw error
    }
  }

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { data, error } = await supabase
        .from('habits')
        .update({
          name: updates.name,
          icon: updates.icon,
          color: updates.color
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      setHabits(prev => prev.map(habit => 
        habit.id === id 
          ? { 
              ...habit, 
              name: data.name,
              icon: data.icon,
              color: data.color
            }
          : habit
      ))
    } catch (error) {
      console.error('Error updating habit:', error)
      throw error
    }
  }

  const deleteHabit = async (id: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setHabits(prev => prev.filter(habit => habit.id !== id))
      setEntries(prev => prev.filter(entry => entry.habitId !== id))
    } catch (error) {
      console.error('Error deleting habit:', error)
      throw error
    }
  }

  const toggleHabitEntry = async (habitId: string, date: Date) => {
    if (!user) throw new Error('User not authenticated')

    const dateStr = formatDate(date)
    const existingEntry = entries.find(
      entry => entry.habitId === habitId && entry.date === dateStr
    )

    try {
      if (existingEntry) {
        // Three-state logic: completed → failed → incomplete (delete)
        if (existingEntry.completed) {
          // Change from completed to failed
          const { error } = await supabase
            .from('habit_entries')
            .update({ completed: false })
            .eq('id', existingEntry.id)

          if (error) throw error

          setEntries(prev => prev.map(entry =>
            entry.id === existingEntry.id
              ? { ...entry, completed: false }
              : entry
          ))
        } else {
          // Change from failed to incomplete (delete entry)
          const { error } = await supabase
            .from('habit_entries')
            .delete()
            .eq('id', existingEntry.id)

          if (error) throw error

          setEntries(prev => prev.filter(entry => entry.id !== existingEntry.id))
        }
      } else {
        // Create new entry as completed (incomplete → completed)
        const { data, error } = await supabase
          .from('habit_entries')
          .insert({
            habit_id: habitId,
            date: dateStr,
            completed: true
          })
          .select()
          .single()

        if (error) throw error

        const newEntry: HabitEntry = {
          id: data.id,
          habitId: data.habit_id,
          date: data.date,
          completed: data.completed,
          createdAt: new Date(data.created_at)
        }

        setEntries(prev => [...prev, newEntry])
      }
    } catch (error) {
      console.error('Error toggling habit entry:', error)
      throw error
    }
  }

  const getHabitWithEntries = (habitId: string): HabitWithEntries | null => {
    const habit = habits.find(h => h.id === habitId)
    if (!habit) return null

    const habitEntries = entries.filter(entry => entry.habitId === habitId)
    return { ...habit, entries: habitEntries }
  }

  const getHabitsWithEntries = (): HabitWithEntries[] => {
    return habits.map(habit => ({
      ...habit,
      entries: entries.filter(entry => entry.habitId === habit.id)
    }))
  }

  const exportData = () => {
    const data = {
      habits,
      entries,
      exportedAt: new Date().toISOString(),
      userId: user?.id
    }
    return JSON.stringify(data, null, 2)
  }

  const importData = async (jsonData: string) => {
    if (!user) throw new Error('User not authenticated')

    try {
      const data = JSON.parse(jsonData)
      
      if (!data.habits || !data.entries) {
        throw new Error('Invalid data format')
      }

      // Clear existing data for this user
      const { data: userHabits } = await supabase
        .from('habits')
        .select('id')
        .eq('user_id', user.id)

      if (userHabits && userHabits.length > 0) {
        const habitIds = userHabits.map(h => h.id)
        
        await supabase
          .from('habit_entries')
          .delete()
          .in('habit_id', habitIds)

        await supabase
          .from('habits')
          .delete()
          .eq('user_id', user.id)
      }

      // Import habits
      if (data.habits.length > 0) {
        const { error: habitsError } = await supabase
          .from('habits')
          .insert(data.habits.map((habit: Habit) => ({
            id: habit.id,
            name: habit.name,
            icon: habit.icon,
            color: habit.color,
            user_id: user.id,
            created_at: habit.createdAt
          })))

        if (habitsError) throw habitsError
      }

      // Import entries
      if (data.entries.length > 0) {
        const { error: entriesError } = await supabase
          .from('habit_entries')
          .insert(data.entries.map((entry: HabitEntry) => ({
            id: entry.id,
            habit_id: entry.habitId,
            date: entry.date,
            completed: entry.completed,
            created_at: entry.createdAt
          })))

        if (entriesError) throw entriesError
      }

      // Reload data
      await loadData()
    } catch (error) {
      console.error('Error importing data:', error)
      throw error
    }
  }

  const value: HabitContextType = {
    habits,
    entries,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitEntry,
    getHabitWithEntries,
    getHabitsWithEntries,
    exportData,
    importData,
    loading
  }

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  )
}

export function useHabits() {
  const context = useContext(HabitContext)
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider')
  }
  return context
} 