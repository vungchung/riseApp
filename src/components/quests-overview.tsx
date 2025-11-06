'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Quest } from '@/lib/types';
import { useGame } from './providers/game-provider';

function QuestCard({ quest }: { quest: Quest }) {
  const { updateTask, claimQuestReward } = useGame();

  const allTasksCompleted = quest.tasks.every(task => task.completed);

  return (
    <Card className={cn(allTasksCompleted && "border-green-500/50")}>
      <CardHeader>
        <CardTitle className="font-headline">{quest.title}</CardTitle>
        <CardDescription>{quest.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {quest.tasks.map((task, index) => (
            <li
              key={index}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => updateTask(quest.id, index, !task.completed)}
            >
              <div
                className={cn(
                  "h-5 w-5 rounded-sm border border-primary flex items-center justify-center",
                  task.completed && "bg-primary text-primary-foreground"
                )}
              >
                {task.completed && <Check className="h-4 w-4" />}
              </div>
              <span className={cn(task.completed && "line-through text-muted-foreground")}>
                {task.description}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4">
        <div className="text-sm font-medium text-primary">XP Reward: {quest.xp}</div>
        <Button
          onClick={() => claimQuestReward(quest.id)}
          disabled={!allTasksCompleted}
          className="w-full sm:w-auto"
        >
          {allTasksCompleted ? "Claim Reward" : "Complete All Tasks"}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function QuestsOverview({ quests }: { quests: Quest[] }) {
  if (quests.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <h3 className="text-xl font-headline font-bold">No Active Quests</h3>
          <p className="text-muted-foreground mt-2">Visit the Quest Board to accept new quests.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quests.map(quest => (
        <QuestCard key={quest.id} quest={quest} />
      ))}
    </div>
  );
}
