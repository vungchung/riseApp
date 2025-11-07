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
      title: 'Daily Mandate: Shadow Boxing',
      description: 'Perform 1 minute of shadow boxing to sharpen your senses.',
      xp: 10,
      tasks: [
        { description: 'Complete 1 minute of shadow boxing.', completed: false },
      ],
    },
    {
        id: 'workout-completion',
        title: 'Workout Completion',
        description: 'Complete any workout routine.',
        xp: 50,
        tasks: [
            { description: 'Log one workout session.', completed: false },
        ]
    },
    {
        id: 'endurance-challenge',
        title: 'Endurance Challenge',
        description: 'Complete a total of 150+ reps in your workouts today.',
        xp: 75,
        tasks: [
            { description: 'Reach 150 total repetitions.', completed: false },
        ]
    },
    {
        id: 'speed-challenge',
        title: 'Speed Challenge',
        description: 'Finish a workout in under 20 minutes.',
        xp: 100,
        tasks: [
            { description: 'Complete a workout session in less than 20 minutes.', completed: false },
        ]
    },
    {
        id: 'hydration-quest',
        title: 'Hydration Quest',
        description: 'Log your water intake 8 times today.',
        xp: 25,
        tasks: [
            { description: 'Log 8 glasses of water.', completed: false },
        ]
    },
    {
        id: 'early-bird',
        title: 'Early Bird',
        description: 'Complete a workout before 9 AM.',
        xp: 50,
        tasks: [
            { description: 'Finish a workout session before 9:00 AM.', completed: false },
        ]
    },
    {
        id: 'push-mastery',
        title: 'Push Mastery',
        description: 'Complete a "Push" type workout.',
        xp: 60,
        tasks: [
            { description: 'Complete a push-focused workout.', completed: false },
        ]
    },
    {
        id: 'leg-day-dominator',
        title: 'Leg Day Dominator',
        description: 'Complete a "Legs" type workout.',
        xp: 60,
        tasks: [
            { description: 'Complete a leg-focused workout.', completed: false },
        ]
    },
     {
        id: 'full-body-blitz',
        title: 'Full-Body Blitz',
        description: 'Complete a "Full-Body" workout.',
        xp: 80,
        tasks: [
            { description: 'Complete a full-body workout.', completed: false },
        ]
    }
];

export const dungeons: Dungeon[] = [
  {
    id: 'dungeon-1',
    title: 'Push-Up Mastery (30 Days)',
    description: 'A 30-day trial to forge impeccable upper body strength, ascending from the basics to true push-up mastery.',
    duration: 30,
    difficulty: 'Beginner',
    type: 'Mastery',
    badge: 'Push-up Master'
  },
  {
    id: 'dungeon-2',
    title: 'Leg Day Domination (30 Days)',
    description: 'Carve legs of steel as you take on this 30-day challenge to become the undisputed ruler of the squat.',
    duration: 30,
    difficulty: 'Intermediate',
    type: 'Mastery',
    badge: 'Squat Emperor'
  },
   {
    id: 'dungeon-3',
    title: 'All Body Foundation (30 Days)',
    description: 'Develop a solid base across all major muscle groups with this 30-day bodyweight program. Perfect for beginners.',
    duration: 30,
    difficulty: 'Beginner',
    type: 'Transformation',
    badge: 'Solid Foundation'
  },
  {
    id: 'dungeon-4',
    title: 'Full Body Sculpt (60 Days)',
    description: 'A 60-day intermediate program using resistance to build and define muscle across your entire body.',
    duration: 60,
    difficulty: 'Intermediate',
    type: 'Transformation',
    badge: 'Body Sculptor'
  },
   {
    id: 'dungeon-5',
    title: 'Athlete Transformation (90 Days)',
    description: 'An intensive 90-day program to transform your body, combining advanced lifting, plyometrics, and skill drills.',
    duration: 90,
    difficulty: 'Advanced',
    type: 'Transformation',
    badge: 'True Athlete'
  },
];

export const badges: Badge[] = [
    { id: 'first-quest', name: 'Quest Novice', description: 'Completed your first quest.', Icon: Star },
    { id: 'streak-7', name: 'Week Warrior', description: 'Maintained a 7-day workout streak.', Icon: Zap },
    { id: 'dungeon-beginner', name: 'Dungeon Crawler', description: 'Completed a Beginner Dungeon.', Icon: Shield },
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
