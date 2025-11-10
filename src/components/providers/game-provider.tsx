'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserProfile, Quest } from '@/lib/types';
import { userProfile as initialProfile, MOCK_QUESTS } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { MANDATORY_QUEST_ID } from '@/lib/constants';

interface GameState {
  userProfile: UserProfile;
  quests: Quest[];
  lastDailyQuestCompletionDate: string | null;
}

interface GameContextType extends GameState {
  updateUserProfile: (data: Partial<UserProfile>) => void;
  addDailyQuest: (questId: string) => void;
  updateTask: (questId: string, taskIndex: number, completed: boolean) => void;
  claimQuestReward: (questId: string) => void;
  isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const isServer = typeof window === 'undefined';

const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
}

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [lastDailyQuestCompletionDate, setLastDailyQuestCompletionDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadGameState = useCallback(() => {
    if (isServer) {
        return;
    };
    
    try {
      const savedStateRaw = localStorage.getItem('gameState');
      const mandatoryQuest = MOCK_QUESTS.find(q => q.id === MANDATORY_QUEST_ID)!;

      if (savedStateRaw) {
        const savedState: GameState = JSON.parse(savedStateRaw);
        
        setUserProfile(savedState.userProfile);
        
        const today = getTodayDateString();
        // If the daily quest was completed on a previous day, reset it.
        if (savedState.lastDailyQuestCompletionDate && savedState.lastDailyQuestCompletionDate < today) {
            setLastDailyQuestCompletionDate(null);
            const activeQuestsWithoutDaily = savedState.quests.filter(q => q.id !== MANDATORY_QUEST_ID);
            setQuests([mandatoryQuest, ...activeQuestsWithoutDaily]);
        } else {
            setLastDailyQuestCompletionDate(savedState.lastDailyQuestCompletionDate);
            // Ensure mandatory quest is always present if not completed today
            const hasMandatory = savedState.quests.some(q => q.id === MANDATORY_QUEST_ID);
            if (!hasMandatory && savedState.lastDailyQuestCompletionDate !== today) {
                 setQuests([mandatoryQuest, ...savedState.quests]);
            } else {
                 setQuests(savedState.quests);
            }
        }
      } else {
        // First time load
        setUserProfile(initialProfile);
        setQuests([mandatoryQuest]);
        setLastDailyQuestCompletionDate(null);
      }

    } catch (error) {
      console.error("Failed to load game state from localStorage", error);
      setUserProfile(initialProfile);
      const mandatoryQuest = MOCK_QUESTS.find(q => q.id === MANDATORY_QUEST_ID);
      setQuests(mandatoryQuest ? [mandatoryQuest] : []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGameState();
  }, [loadGameState]);
  
  useEffect(() => {
    if (!isLoading) {
        const gameState: GameState = { userProfile, quests, lastDailyQuestCompletionDate };
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }
  }, [userProfile, quests, lastDailyQuestCompletionDate, isLoading]);

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUserProfile(prevProfile => {
      if (!prevProfile) return initialProfile;
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
        xp: newXp % xpToNextLevel,
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

  return (
    <GameContext.Provider value={{ userProfile, quests, lastDailyQuestCompletionDate, updateUserProfile, addDailyQuest, updateTask, claimQuestReward, isLoading }}>
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
