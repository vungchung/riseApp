'use client';

import { useGame } from "@/components/providers/game-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, CheckCircle2 } from "lucide-react";
import { MOCK_QUESTS } from "@/lib/data";
import QuestsOverview from "@/components/quests-overview";
import { cn } from "@/lib/utils";
import { MANDATORY_QUEST_ID } from "@/lib/constants";

export default function QuestsPage() {
    const { quests, addDailyQuest } = useGame();

    const activeQuestIds = quests.map(q => q.id);
    const availableQuests = MOCK_QUESTS.filter(q => !activeQuestIds.includes(q.id) && q.id !== MANDATORY_QUEST_ID);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline mb-2">Active Quests</h1>
        <p className="text-muted-foreground">Your currently accepted daily challenges. The mandatory quest resets daily.</p>
        <div className="mt-4">
            <QuestsOverview quests={quests} />
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
                    <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-4"/>
                    <h3 className="text-xl font-headline font-bold">Quest Board Cleared!</h3>
                    <p className="text-muted-foreground mt-2">You've accepted all available quests for today. Check back tomorrow for more!</p>
                 </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
