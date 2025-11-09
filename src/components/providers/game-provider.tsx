'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserProfile, Quest } from '@/lib/types';
import { userProfile as initialProfile, MOCK_QUESTS } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { MANDATORY_QUEST_ID } from '@/lib/constants';

interface GameContextType {
  userProfile: UserProfile | null;
  quests: Quest[];
  updateUserProfile: (data: Partial<UserProfile>) => void;
  addDailyQuest: (questId: string) => void;
  updateTask: (questId: string, taskIndex: number, completed: boolean) => void;
  claimQuestReward: (questId: string) => void;
  isLoading: boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const isServer = typeof window === 'undefined';

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadGameState = useCallback(() => {
    if (isServer) {
        // On the server, and for the initial client render, we use a default/empty state.
        setUserProfile(initialProfile);
        const mandatoryQuest = MOCK_QUESTS.find(q => q.id === MANDATORY_QUEST_ID);
        setQuests(mandatoryQuest ? [mandatoryQuest] : []);
        setIsLoading(true); // Remain in loading state on server
        return;
    };
    
    try {
      const savedProfile = localStorage.getItem('userProfile');
      const savedQuests = localStorage.getItem('activeQuests');
      
      let currentProfile: UserProfile;
      if (savedProfile) {
        currentProfile = JSON.parse(savedProfile);
      } else {
        currentProfile = initialProfile;
        localStorage.setItem('userProfile', JSON.stringify(currentProfile));
      }
      setUserProfile(currentProfile);

      let currentQuests: Quest[];
      if (savedQuests) {
        currentQuests = JSON.parse(savedQuests);
      } else {
        const mandatoryQuest = MOCK_QUESTS.find(q => q.id === MANDATORY_QUEST_ID);
        currentQuests = mandatoryQuest ? [mandatoryQuest] : [];
        localStorage.setItem('activeQuests', JSON.stringify(currentQuests));
      }
      setQuests(currentQuests);

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
    // We only want to load from localStorage on the client, after the initial render.
    loadGameState();
  }, [loadGameState]);

  const saveGameState = useCallback((profile: UserProfile, activeQuests: Quest[]) => {
    if (isServer) return;
    try {
      localStorage.setItem('userProfile', JSON.stringify(profile));
      localStorage.setItem('activeQuests', JSON.stringify(activeQuests));
    } catch (error) {
      console.error("Failed to save game state to localStorage", error);
    }
  }, []);

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUserProfile(prevProfile => {
      if (!prevProfile) return null;
      const newProfile = { ...prevProfile, ...data };
      saveGameState(newProfile, quests);
      return newProfile;
    });
  };

  const addDailyQuest = (questId: string) => {
    const questToAdd = MOCK_QUESTS.find(q => q.id === questId);
    if (questToAdd && !quests.find(q => q.id === questId)) {
      const newQuests = [...quests, { ...questToAdd, tasks: questToAdd.tasks.map(t => ({...t, completed: false})) }];
      setQuests(newQuests);
      if(userProfile) saveGameState(userProfile, newQuests);
      toast({ title: "Quest Accepted!", description: `"${questToAdd.title}" has been added to your active quests.` });
    }
  };

  const updateTask = (questId: string, taskIndex: number, completed: boolean) => {
    setQuests(prevQuests => {
      const newQuests = prevQuests.map(q => {
        if (q.id === questId) {
          const newTasks = [...q.tasks];
          newTasks[taskIndex] = { ...newTasks[taskIndex], completed };
          return { ...q, tasks: newTasks };
        }
        return q;
      });
      if(userProfile) saveGameState(userProfile, newQuests);
      return newQuests;
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
        // Simple progression, can be made more complex
        xpToNextLevel = Math.floor(xpToNextLevel * 1.5); 
      }
      
      const newProfile: UserProfile = {
        ...userProfile,
        xp: newXp % xpToNextLevel,
        level: newLevel,
        xpToNextLevel: xpToNextLevel,
        rank: newRank,
      };

      const newQuests = quest.id === MANDATORY_QUEST_ID 
        ? quests.map(q => q.id === questId ? {...q, tasks: q.tasks.map(t => ({...t, completed: false}))} : q)
        : quests.filter(q => q.id !== questId);

      setUserProfile(newProfile);
      setQuests(newQuests);
      saveGameState(newProfile, newQuests);
      toast({ title: "Reward Claimed!", description: `You earned ${quest.xp} XP!` });
    }
  };

  return (
    <GameContext.Provider value={{ userProfile, quests, updateUserProfile, addDailyQuest, updateTask, claimQuestReward, isLoading }}>
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
