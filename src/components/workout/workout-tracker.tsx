'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { performPoseEstimation, PoseEstimationOutput } from '@/ai/flows/pose-estimation-rep-counting';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

type WorkoutTrackerProps = {
  exerciseType: string;
};

export default function WorkoutTracker({ exerciseType }: WorkoutTrackerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [result, setResult] = useState<PoseEstimationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOn(true);
      setError(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions and try again.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setIsTracking(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isTracking) {
      intervalId = setInterval(() => {
        captureFrameAndEstimate();
      }, 2000); // Capture frame every 2 seconds
    }
    return () => clearInterval(intervalId);
  }, [isTracking]);

  const captureFrameAndEstimate = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (video.readyState < 2 || !context) { // Ensure video is ready
      return;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const cameraFeedDataUri = canvas.toDataURL('image/jpeg');

    startTransition(async () => {
      try {
        const output = await performPoseEstimation({ cameraFeedDataUri, exerciseType });
        setResult(output);
      } catch (e) {
        console.error('Pose estimation failed:', e);
        setError('An error occurred during pose estimation.');
      }
    });
  };

  const toggleTracking = () => {
    if (!isCameraOn) {
        startCamera().then(() => {
            setIsTracking(true);
        })
    } else {
        setIsTracking(!isTracking);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-muted flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`h-full w-full object-cover ${isCameraOn ? 'block' : 'hidden'}`}
            />
            {!isCameraOn && (
              <div className="text-center text-muted-foreground">
                <p>Camera is off</p>
                <Button variant="link" onClick={startCamera}>Turn on camera to begin</Button>
              </div>
            )}
             {isTracking && isPending && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                        <Skeleton className="h-8 w-8 rounded-full mx-auto mb-2" />
                        <p>Analyzing...</p>
                    </div>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <canvas ref={canvasRef} className="hidden" />

      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button onClick={toggleTracking} size="lg" className="md:col-span-1">
          {isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </Button>
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <Card className="text-center">
                <CardHeader className="pb-2">
                    <CardDescription>Rep Count</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-5xl font-bold font-mono text-accent glow-accent">{result?.repCount ?? 0}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardDescription>Form Feedback</CardDescription>
                </CardHeader>
                <CardContent>
                     <p className="text-sm text-center md:text-left h-12 flex items-center justify-center">
                        {isPending && !result ? "Waiting for feedback..." : result?.formFeedback ?? "No feedback yet."}
                     </p>
                </CardContent>
            </Card>
        </div>
      </div>

       <div className="mt-4 flex justify-end">
          <Button variant="outline" onClick={stopCamera} disabled={!isCameraOn}>Turn Off Camera</Button>
       </div>
    </div>
  );
}
