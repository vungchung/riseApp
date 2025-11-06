
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { quests } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Quest } from '@/lib/types';
import Link from 'next/link';

function QuestCard({ quest }: { quest: Quest }) {
    const [tasks, setTasks] = useState(quest.tasks);

    const toggleTask = (index: number) => {
        const newTasks = [...tasks];
        newTasks[index].completed = !newTasks[index].completed;
        setTasks(newTasks);
    };

    const allTasksCompleted = tasks.every(task => task.completed);

    return (
        <Card className={cn(allTasksCompleted && "border-green-500/50")}>
            <CardHeader>
                <CardTitle className="font-headline">{quest.title}</CardTitle>
                <CardDescription>{quest.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-3">
                    {tasks.map((task, index) => (
                        <li key={index} className="flex items-center gap-3 cursor-pointer" onClick={() => toggleTask(index)}>
                            <div className={cn("h-5 w-5 rounded-sm border border-primary flex items-center justify-center", task.completed && "bg-primary text-primary-foreground")}>
                                {task.completed && <Check className="h-4 w-4" />}
                            </div>
                            <span className={cn(task.completed && "line-through text-muted-foreground")}>{task.description}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
                 <div className="text-sm font-medium text-primary">XP Reward: {quest.xp}</div>
                 <Button disabled={!allTasksCompleted} className="w-full sm:w-auto">
                    {allTasksCompleted ? "Claim Reward" : "Complete All Tasks"}
                 </Button>
            </CardFooter>
        </Card>
    );
}


export default function QuestsPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Quests"
        description="Complete quests to gain experience and level up."
      />

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quests.map(quest => (
                <QuestCard key={quest.id} quest={quest} />
            ))}
       </div>
    </div>
  );
}
