'use client';

import { PageHeader } from '@/components/page-header';
import { BarChart3, Clock, TrendingUp, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkoutChart } from '@/components/analytics/workout-chart';
import { useGame } from '@/components/providers/game-provider';
import { Skeleton } from '@/components/ui/skeleton';

const StatCard = ({
  icon: Icon,
  title,
  value,
}: {
  icon: React.ElementType;
  title: string;
  value: string | number;
}) => (
  <Card className="hover:border-accent transition-colors">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const StatCardSkeleton = () => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-4 w-4' />
        </CardHeader>
        <CardContent>
            <Skeleton className='h-8 w-16' />
        </CardContent>
    </Card>
)

export default function AnalyticsPage() {
  const { userProfile, analytics, isLoading } = useGame();

  if (isLoading || !userProfile || !analytics) {
    return (
       <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <PageHeader
            title="Analytics"
            description="Review your combat records."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
        </div>
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="font-headline">Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <Skeleton className='h-[250px] w-full' />
                </CardContent>
            </Card>
         </div>
       </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Analytics"
        description={`Hunter ${userProfile.name}, review your combat records.`}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <StatCard
          title="Total Workouts"
          value={analytics.totalWorkouts}
          icon={BarChart3}
        />
        <StatCard
          title="Current Streak"
          value={`${analytics.currentStreak} Days`}
          icon={TrendingUp}
        />
        <StatCard
          title="Hours Trained"
          value={analytics.hoursTrained}
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <WorkoutChart data={analytics.weeklyActivity} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <Trophy className="h-5 w-5 text-accent" />
                Personal Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.personalRecords.length > 0 ? (
                <ul className="divide-y divide-border">
                    {analytics.personalRecords.map(record => (
                        <li key={record.exercise} className="flex justify-between items-center py-3">
                            <span className="text-muted-foreground">{record.exercise}</span>
                            <span className="font-mono font-semibold text-lg">{record.value}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className='text-muted-foreground text-center py-4'>No personal records set yet. Keep training!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
