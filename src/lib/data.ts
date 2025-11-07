import type { UserProfile, Quest, Dungeon, Badge, Analytics } from './types';
import { Award, Shield, Star, Crown, Zap } from 'lucide-react';
import { MANDATORY_QUEST_ID } from './constants';

export const userProfile: UserProfile = {
  name: 'Hunter',
  level: 1,
  rank: 'E',
  xp: 0,
  xpToNextLevel: 200,
};

export const MOCK_QUESTS: Quest[] = [
    {
      id: MANDATORY_QUEST_ID,
      title: 'Mandatory: 1 Minute of Shadow Boxing',
      description: 'The System requires this basic combat drill daily to maintain your status.',
      xp: 10,
      tasks: [
        { description: 'Complete 1 minute of shadow boxing.', completed: false },
      ],
    },
    {
        id: 'strength-1',
        title: 'Beginner Strength Training',
        description: 'Focus on building a solid foundation of strength.',
        xp: 150,
        tasks: [
            { description: '3x10 Push-ups', completed: false },
            { description: '3x15 Squats', completed: false },
            { description: '3x12 Lunges (each leg)', completed: false },
            { description: '1-minute Plank', completed: false },
        ]
    },
    {
        id: 'cardio-1',
        title: 'Endurance Protocol',
        description: 'Improve your stamina and cardiovascular health.',
        xp: 120,
        tasks: [
            { description: '30 minutes of Jogging', completed: false },
            { description: '5x1 minute High Knees', completed: false },
            { description: '5x30 Jumping Jacks', completed: false },
        ]
    },
    {
        id: 'strength-2',
        title: 'Advanced Upper Body',
        description: 'Push your upper body to its limits.',
        xp: 200,
        tasks: [
            { description: '5x20 Pull-ups', completed: false },
            { description: '5x25 Dips', completed: false },
            { description: '3x15 Overhead Press', completed: false },
        ]
    },
    {
        id: 'cardio-2',
        title: 'High-Intensity Interval Training',
        description: 'A quick and intense workout to maximize calorie burn.',
        xp: 180,
        tasks: [
            { description: '20 minutes of HIIT (30s on, 30s off)', completed: false },
            { description: '5 sets of Burpees to failure', completed: false },
        ]
    }
];

export const dungeons: Dungeon[] = [
  {
    id: 'dungeon-1',
    title: 'Goblin Cave',
    description: 'A 30-day starter challenge to build foundational strength and endurance.',
    duration: 30,
    difficulty: 'Beginner',
    type: 'Mastery'
  },
  {
    id: 'dungeon-2',
    title: 'Demon Castle',
    description: 'A 60-day program focusing on intermediate techniques and increased intensity.',
    duration: 60,
    difficulty: 'Intermediate',
    type: 'Mastery'
  },
  {
    id: 'dungeon-3',
    title: 'Volcanic Zone',
    description: 'A 90-day advanced gauntlet designed to push your limits to the absolute maximum.',
    duration: 90,
    difficulty: 'Advanced',
    type: 'Mastery'
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
