
import { PageHeader } from '@/components/page-header';
import WorkoutTracker from '@/components/workout/workout-tracker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TrackerPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Workout Tracker"
        description="Engage in combat training. The system will monitor your performance."
      />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Mandatory Quest: Shadow Boxing</CardTitle>
          <CardDescription>
            Practice your combat forms. The AI will count your reps and provide feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorkoutTracker exerciseType="Shadow Boxing" />
        </CardContent>
      </Card>
    </div>
  );
}
