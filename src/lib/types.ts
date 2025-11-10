import type { LucideIcon } from 'lucide-react';

export type UserProfile = {
  name: string;
  level: number;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  xp: number;
  xpToNextLevel: number;
  height?: number; // in cm
  weight?: number; // in kg
  gender?: 'male' | 'female' | 'other';
};

export type Quest = {
  id: string;
  title: string;
  description: string;
  xp: number;
  tasks: { description: string; completed: boolean }[];
};

export type Dungeon = {
  id: string;
  title: string;
  description:string;
  duration: number; // in days
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'Mastery' | 'Transformation';
  badgeId: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  Icon: LucideIcon;
};

export type Analytics = {
  totalWorkouts: number;
  currentStreak: number;
  hoursTrained: number;
  weeklyActivity: { day: string; workouts: number }[];
  personalRecords: { exercise: string; value: string }[];
};
