'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserProfile, Quest, Analytics } from '@/lib/types';
import { userProfile as initialProfile, MOCK_QUESTS, initialAnalytics } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { MANDATORY_QUEST_ID } from '@/lib/constants';

interface GameState {
  userProfile: UserProfile | null;
  quests: Quest[];
  lastDailyQuestCompletionDate: string | null;
  activeDungeonId: string | null;
  masteredDungeons: string[];
  dungeonProgress: number;
  lastDungeonProgressDate: string | null;
  unlockedBadges: string[];
  analytics: Analytics | null;
}

interface GameContextType extends Omit<GameState, 'userProfile' | 'analytics'> {
  userProfile: UserProfile | null;
  analytics: Analytics | null;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  addDailyQuest: (questId: string) => void;
  updateTask: (questId: string, taskIndex: number, completed: boolean) => void;
  claimQuestReward: (questId: string) => void;
  startDungeon: (id: string) => void;
  progressDungeon: () => void;
  masterDungeon: (id: string, badgeId: string) => void;
  isLoading: boolean;
  resetGameData: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const isServer = typeof window === 'undefined';

const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
}

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [lastDailyQuestCompletionDate, setLastDailyQuestCompletionDate] = useState<string | null>(null);
  
  // Dungeon State
  const [activeDungeonId, setActiveDungeonId] = useState<string | null>(null);
  const [masteredDungeons, setMasteredDungeons] = useState<string[]>([]);
  const [dungeonProgress, setDungeonProgress] = useState(0);
  const [lastDungeonProgressDate, setLastDungeonProgressDate] = useState<string | null>(null);

  // Badges State
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  
  // Analytics State
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const getInitialState = (): GameState => {
    const mandatoryQuest = MOCK_QUESTS.find(q => q.id === MANDATORY_QUEST_ID)!;
    const resetMandatoryQuest = { ...mandatoryQuest, tasks: mandatoryQuest.tasks.map(t => ({ ...t, completed: false })) };
    
    return {
        userProfile: initialProfile,
        quests: [resetMandatoryQuest],
        lastDailyQuestCompletionDate: null,
        activeDungeonId: null,
        masteredDungeons: [],
        dungeonProgress: 0,
        lastDungeonProgressDate: null,
        unlockedBadges: [],
        analytics: initialAnalytics,
    };
  };
  
  const resetDailyStates = useCallback((state: GameState): GameState => {
    const today = getTodayDateString();
    let updatedState = { ...state };

    // Reset daily quest if completed on a previous day
    if (state.lastDailyQuestCompletionDate && state.lastDailyQuestCompletionDate < today) {
      updatedState.lastDailyQuestCompletionDate = null;
      // Remove all non-mandatory quests
      const mandatoryQuest = MOCK_QUESTS.find(q => q.id === MANDATORY_QUEST_ID)!;
      const resetMandatoryQuest = { ...mandatoryQuest, tasks: mandatoryQuest.tasks.map(t => ({ ...t, completed: false })) };
      updatedState.quests = [resetMandatoryQuest];
    } else {
       const hasMandatory = state.quests.some(q => q.id === MANDATORY_QUEST_ID);
       if (!hasMandatory && state.lastDailyQuestCompletionDate !== today) {
           const mandatoryQuest = MOCK_QUESTS.find(q => q.id === MANDATORY_QUEST_ID)!;
           const resetMandatoryQuest = { ...mandatoryQuest, tasks: mandatoryQuest.tasks.map(t => ({ ...t, completed: false })) };
           updatedState.quests = [resetMandatoryQuest, ...state.quests];
       }
    }

    // Reset dungeon progress date if it was from a previous day
    if(state.lastDungeonProgressDate && state.lastDungeonProgressDate < today) {
        updatedState.lastDungeonProgressDate = null;
    }

    return updatedState;
  }, []);

  useEffect(() => {
    if (isServer) return;

    try {
      const savedStateRaw = localStorage.getItem('gameState');

      if (savedStateRaw) {
        let savedState: GameState = JSON.parse(savedStateRaw);
        
        // Ensure all state fields are present
        savedState.userProfile = savedState.userProfile || initialProfile;
        savedState.unlockedBadges = savedState.unlockedBadges || [];
        savedState.analytics = savedState.analytics || initialAnalytics;

        const newState = resetDailyStates(savedState);
        
        setUserProfile(newState.userProfile);
        setQuests(newState.quests);
        setLastDailyQuestCompletionDate(newState.lastDailyQuestCompletionDate);
        setActiveDungeonId(newState.activeDungeonId);
        setMasteredDungeons(newState.masteredDungeons);
        setDungeonProgress(newState.dungeonProgress);
        setLastDungeonProgressDate(newState.lastDungeonProgressDate);
        setUnlockedBadges(newState.unlockedBadges);
        setAnalytics(newState.analytics);

      } else {
        // First time load
        const initialState = getInitialState();
        setUserProfile(initialState.userProfile);
        setQuests(initialState.quests);
        setLastDailyQuestCompletionDate(initialState.lastDailyQuestCompletionDate);
        setActiveDungeonId(initialState.activeDungeonId);
        setMasteredDungeons(initialState.masteredDungeons);
        setDungeonProgress(initialState.dungeonProgress);
        setLastDungeonProgressDate(initialState.lastDungeonProgressDate);
        setUnlockedBadges(initialState.unlockedBadges);
        setAnalytics(initialState.analytics);
      }
    } catch (error) {
      console.error("Failed to load game state from localStorage", error);
       const initialState = getInitialState();
        setUserProfile(initialState.userProfile);
        setQuests(initialState.quests);
        setLastDailyQuestCompletionDate(initialState.lastDailyQuestCompletionDate);
        setActiveDungeonId(initialState.activeDungeonId);
        setMasteredDungeons(initialState.masteredDungeons);
        setDungeonProgress(initialState.dungeonProgress);
        setLastDungeonProgressDate(initialState.lastDungeonProgressDate);
        setUnlockedBadges(initialState.unlockedBadges);
        setAnalytics(initialState.analytics);
    } finally {
      setIsLoading(false);
    }
  }, [resetDailyStates]);
  
  useEffect(() => {
    if (!isLoading && !isServer) {
        const gameState: GameState = { 
          userProfile, 
          quests, 
          lastDailyQuestCompletionDate,
          activeDungeonId,
          masteredDungeons,
          dungeonProgress,
          lastDungeonProgressDate,
          unlockedBadges,
          analytics,
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }
  }, [userProfile, quests, lastDailyQuestCompletionDate, isLoading, activeDungeonId, masteredDungeons, dungeonProgress, lastDungeonProgressDate, unlockedBadges, analytics]);

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUserProfile(prevProfile => {
      if (!prevProfile) return null;
      return { ...prevProfile, ...data };
    });
  };

  const addDailyQuest = (questId: string) => {
    const questToAdd = MOCK_QUESTS.find(q => q.id === questId);
    if (questToAdd && !quests.find(q => q.id === questId)) {
      const newQuests = [...quests, { ...questToAdd, tasks: questToAdd.tasks.map(t => ({...t, completed: false})) }];
      setQuests(newQuests);
      toast({ title: "Quest Accepted!", description: `"${questToAdd.title}" has been added to your active quests.` });
    }
  };

  const updateTask = (questId: string, taskIndex: number, completed: boolean) => {
    setQuests(prevQuests => {
      return prevQuests.map(q => {
        if (q.id === questId) {
          const newTasks = [...q.tasks];
          newTasks[taskIndex] = { ...newTasks[taskIndex], completed };
          return { ...q, tasks: newTasks };
        }
        return q;
      });
    });
  };

  const claimQuestReward = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (quest && userProfile) {
      const newXp = userProfile.xp + quest.xp;
      let newLevel = userProfile.level;
      let xpToNextLevel = userProfile.xpToNextLevel;
      let newRank = userProfile.rank;

      if (newXp >= xpToNextLevel) {
        newLevel += 1;
        xpToNextLevel = Math.floor(xpToNextLevel * 1.5); 
      }
      
      const newProfile: UserProfile = {
        ...userProfile,
        xp: newXp >= xpToNextLevel ? newXp - xpToNextLevel : newXp,
        level: newLevel,
        xpToNextLevel: xpToNextLevel,
        rank: newRank,
      };
      
      let newQuests: Quest[];
      if (quest.id === MANDATORY_QUEST_ID) {
          setLastDailyQuestCompletionDate(getTodayDateString());
          // Remove the mandatory quest from the active list for today
          newQuests = quests.filter(q => q.id !== questId);
      } else {
          // Remove the optional quest from the active list
          newQuests = quests.filter(q => q.id !== questId);
      }

      setUserProfile(newProfile);
      setQuests(newQuests);
      toast({ title: "Reward Claimed!", description: `You earned ${quest.xp} XP!` });
    }
  };

  const startDungeon = (id: string) => {
    setActiveDungeonId(id);
    setDungeonProgress(1); // Start at day 1
    toast({ title: "Dungeon Started!", description: "Your long-term challenge begins now."});
  }
  
  const progressDungeon = () => {
    setDungeonProgress(p => p + 1);
    setLastDungeonProgressDate(getTodayDateString());
  }

  const addBadge = useCallback((badgeId: string) => {
    setUnlockedBadges(prev => {
        if (prev.includes(badgeId)) return prev;
        return [...prev, badgeId];
    });
    toast({ title: "Badge Unlocked!", description: "You've earned a new badge for your achievements." });
  }, [toast]);
  
  const masterDungeon = (id: string, badgeId: string) => {
    setMasteredDungeons(prev => [...prev, id]);
    setActiveDungeonId(null);
    setDungeonProgress(0);
    setLastDungeonProgressDate(null);
    
    if (badgeId) {
        addBadge(badgeId);
    }
  }

  const resetGameData = () => {
    if (isServer) return;
    localStorage.removeItem('gameState');
    window.location.reload();
  };


  return (
    <GameContext.Provider value={{ 
      userProfile, 
      quests, 
      lastDailyQuestCompletionDate, 
      activeDungeonId,
      masteredDungeons,
      dungeonProgress,
      lastDungeonProgressDate,
      unlockedBadges,
      analytics,
      updateUserProfile, 
      addDailyQuest, 
      updateTask, 
      claimQuestReward, 
      startDungeon,
      progressDungeon,
      masterDungeon,
      isLoading,
      resetGameData
      }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
