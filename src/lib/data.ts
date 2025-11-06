import type { UserProfile, Quest, Dungeon, Badge, Analytics } from './types';
import { Award, Shield, Star, Crown, Zap } from 'lucide-react';

export const userProfile: UserProfile = {
  name: 'Hunter',
  level: 1,
  rank: 'E',
  xp: 50,
  xpToNextLevel: 200,
};

export const dailyQuest: Quest = {
  title: 'Daily Quest: Path to Power',
  description: 'Complete these tasks to gain daily experience and become stronger.',
  xp: 100,
  tasks: [
    { description: '100 Push-ups', completed: true },
    { description: '100 Sit-ups', completed: true },
    { description: '100 Squats', completed: false },
    { description: '10km Run', completed: false },
  ],
};

export const dungeons: Dungeon[] = [
  {
    id: 'dungeon-1',
    title: 'Goblin Cave',
    description: 'A 30-day starter challenge to build foundational strength and endurance.',
    duration: 30,
    difficulty: 'Beginner',
  },
  {
    id: 'dungeon-2',
    title: 'Demon Castle',
    description: 'A 60-day program focusing on intermediate techniques and increased intensity.',
    duration: 60,
    difficulty: 'Intermediate',
  },
  {
    id: 'dungeon-3',
    title: 'Volcanic Zone',
    description: 'A 90-day advanced gauntlet designed to push your limits to the absolute maximum.',
    duration: 90,
    difficulty: 'Advanced',
  },
];

export const badges: Badge[] = [
    { id: 'first-quest', name: 'Quest Novice', description: 'Completed your first quest.', Icon: Star },
    { id: 'streak-7', name: 'Week Warrior', description: 'Maintained a 7-day workout streak.', Icon: Zap },
    { id: 'dungeon-beginner', name: 'Dungeon Crawler', description: 'Completed the Beginner Dungeon.', Icon: Shield },
    { id: 'rank-c', name: 'C-Rank Hunter', description: 'Achieved the rank of C.', Icon: Award },
    { id: 'level-50', name: 'Level 50', description: 'Reached level 50.', Icon: Crown },
];

export const analytics: Analytics = {
    totalWorkouts: 42,
    currentStreak: 12,
    hoursTrained: 31.5,
    weeklyActivity: [
        { day: 'Mon', workouts: 1 },
        { day: 'Tue', workouts: 2 },
        { day: 'Wed', workouts: 1 },
        { day: 'Thu', workouts: 2 },
        { day: 'Fri', workouts: 1 },
        { day: 'Sat', workouts: 3 },
        { day: 'Sun', workouts: 0 },
    ],
    personalRecords: [
        { exercise: 'Push-ups', value: '50 reps' },
        { exercise: 'Longest Run', value: '15 km' },
        { exercise: 'Plank', value: '3 min 20s' },
    ]
};
