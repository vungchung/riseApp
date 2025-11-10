
import { PageHeader } from '@/components/page-header';
import { VoiceAssistantTimer } from '@/components/voice-assistant-timer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TrackerPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Voice Assistant"
        description="Control the timer with your voice. Try 'start timer' or 'how much time has passed?'"
      />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl sm:text-2xl">Workout Timer</CardTitle>
          <CardDescription>
            A hands-free timer to assist you during your training sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VoiceAssistantTimer />
        </CardContent>
      </Card>
    </div>
  );
}
