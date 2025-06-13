export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  weeklyGoal?: number;
  createdAt: Date;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  createdAt: Date;
}

export interface HabitWithEntries extends Habit {
  entries: HabitEntry[];
}

export type HabitColor = 
  | 'blue' 
  | 'green' 
  | 'purple' 
  | 'pink' 
  | 'orange' 
  | 'red' 
  | 'yellow' 
  | 'indigo';

export type HabitIcon = 
  | 'activity'
  | 'book'
  | 'coffee'
  | 'dumbbell'
  | 'heart'
  | 'moon'
  | 'sun'
  | 'water-drop'
  | 'zap'
  | 'target'; 