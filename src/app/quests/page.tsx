'use client';

import { useEffect, useState } from 'react';
import { useGame } from "@/components/providers/game-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle2, Timer } from "lucide-react";
import { MOCK_QUESTS } from "@/lib/data";
import QuestsOverview from "@/components/quests-overview";
import { cn } from "@/lib/utils";
import { MANDATORY_QUEST_ID } from "@/lib/constants";
import { PageHeader } from '@/components/page-header';

function DailyQuestTimer() {
  const [timeLeft, setTimeLeft] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Set initial value
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(interval);
  }, []);

  if (!isClient) {
    return (
        <Card className="bg-card/80 border-destructive/50 backdrop-blur-sm text-center py-8 sm:py-12">
            <CardContent className="p-4 pt-4">
                <Timer className="w-10 h-10 sm:w-12 sm:h-12 text-destructive mx-auto mb-4"/>
                <h3 className="text-lg sm:text-xl font-headline font-bold text-destructive">Daily Mandate Completed</h3>
                <p className="text-muted-foreground mt-2 text-sm sm:text-base">Your mandatory quest is done for today. It will reset soon.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="bg-card/80 border-destructive/50 backdrop-blur-sm text-center py-8 sm:py-12">
      <CardContent className="p-4 pt-4">
        <Timer className="w-10 h-10 sm:w-12 sm:h-12 text-destructive mx-auto mb-4"/>
        <h3 className="text-lg sm:text-xl font-headline font-bold text-destructive">Daily Mandate Completed</h3>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">Your mandatory quest is done for today. It will reset in:</p>
        <p className="text-2xl font-mono font-bold text-foreground mt-3">{timeLeft}</p>
      </CardContent>
    </Card>
  );
}

export default function QuestsPage() {
    const { quests, addDailyQuest, lastDailyQuestCompletionDate } = useGame();

    const activeQuestIds = quests.map(q => q.id);
    const availableQuests = MOCK_QUESTS.filter(q => !activeQuestIds.includes(q.id) && q.id !== MANDATORY_QUEST_ID);
    
    const today = new Date().toISOString().split('T')[0];
    const isDailyQuestCompleted = lastDailyQuestCompletionDate === today;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <PageHeader
            title="Quests"
            description="Accept daily challenges to earn XP and level up."
        />
      <div>
        <h2 className="text-2xl font-bold font-headline mb-2">Active Quests</h2>
        <p className="text-muted-foreground mb-4">Your currently accepted challenges. The mandatory quest resets daily.</p>
        <div className="mt-4">
            {quests.length > 0 ? (
                <QuestsOverview quests={quests} />
            ) : isDailyQuestCompleted ? (
                <DailyQuestTimer />
            ) : (
                <Card className="text-center py-12">
                    <CardContent>
                    <h3 className="text-xl font-headline font-bold">No Active Quests</h3>
                    <p className="text-muted-foreground mt-2">Visit the Quest Board to accept new quests.</p>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold font-headline text-accent mb-4">Quest Board</h2>
        <p className="text-muted-foreground mb-4">Accept additional daily quests to earn more XP. These reset at the end of the day.</p>
        
        {availableQuests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableQuests.map(quest => {
                const isAdded = activeQuestIds.includes(quest.id);
                return (
                <Card key={quest.id} className="bg-card/80 border-primary/20 backdrop-blur-sm flex flex-col">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline">{quest.title}</CardTitle>
                        <CardDescription>{quest.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                       <div className="text-sm font-semibold text-accent">
                            +{quest.xp} XP
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full"
                            onClick={() => addDailyQuest(quest.id)}
                            disabled={isAdded}
                        >
                            {isAdded ? <><CheckCircle2 /> Added</> : <><PlusCircle/> Accept Quest</>}
                        </Button>
                    </CardFooter>
                </Card>
            )})}
            </div>
        ) : (
             <Card className="bg-card/80 border-primary/20 backdrop-blur-sm text-center py-12">
                 <CardContent className="p-4 pt-4">
                    <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-accent mx-auto mb-4"/>
                    <h3 className="text-lg sm:text-xl font-headline font-bold">Quest Board Cleared!</h3>
                    <p className="text-muted-foreground mt-2 text-sm sm:text-base">You've accepted all available quests for today. Check back tomorrow for more!</p>
                 </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
