'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Mic, MicOff, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Define the interface for the speech recognition object
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

// Extend window type to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}


export function VoiceAssistantTimer() {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const errorOccurredRef = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    
    // Set initial online status
    if (typeof navigator !== 'undefined') {
        setIsOnline(navigator.onLine);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for browser support on component mount
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || !window.speechSynthesis) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      handleVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      errorOccurredRef.current = true;
      if(event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        toast({
            variant: 'destructive',
            title: 'Microphone Access Denied',
            description: 'Please enable microphone permissions to use voice commands.',
        });
      } else if (event.error === 'network') {
        toast({
            variant: 'destructive',
            title: 'Network Error',
            description: 'Speech recognition requires a network connection.',
        });
      }
      setIsListening(false);
    };
    
    recognition.onend = () => {
        if (isListening && !errorOccurredRef.current) {
            try {
                recognition.start();
            } catch (e) {
                // This can happen if the browser is closed or permissions change
                console.error("Error restarting recognition:", e);
                setIsListening(false);
            }
        } else {
            setIsListening(false);
        }
        errorOccurredRef.current = false;
    };

    recognitionRef.current = recognition;

    // Cleanup function
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.onend = null; // Prevent restart on unmount
            recognitionRef.current.stop();
        }
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isListening]); // Re-run effect if isListening changes to handle restart logic
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const speak = (text: string) => {
    if (!isSupported || !isOnline) return;
    try {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    } catch (error) {
        console.error("Speech synthesis error:", error);
    }
  };
  
  const formatTime = (seconds: number) => {
    const getSeconds = `0${seconds % 60}`.slice(-2);
    const minutes = Math.floor(seconds / 60);
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };

  const handleVoiceCommand = (command: string) => {
    if (!isOnline) return;
    if (command.includes('start timer')) {
      handleStart();
      speak('Timer started.');
    } else if (command.includes('stop timer') || command.includes('pause timer')) {
      handleStop();
      speak('Timer paused.');
    } else if (command.includes('reset timer')) {
      handleReset();
      speak('Timer reset.');
    } else if (command.includes('how much time') || command.includes('what is the time')) {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;

        let timeString = "Elapsed time is ";
        if(hours > 0) timeString += `${hours} hour${hours > 1 ? 's' : ''}, `;
        if(minutes > 0) timeString += `${minutes} minute${minutes > 1 ? 's' : ''}, `;
        timeString += `${seconds} second${seconds > 1 ? 's' : ''}.`;
        
        speak(timeString);
    }
  };

  const toggleListen = () => {
    if (!isSupported || !recognitionRef.current || !isOnline) return;
    
    setIsListening(prev => !prev);
  };
  
  const handleStart = () => setIsActive(true);
  const handleStop = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  if (!isClient) {
    // Render a placeholder on the server and initial client render
    return (
       <div className="space-y-6 flex flex-col items-center">
            <Card className="w-full max-w-md">
                <CardContent className="p-6">
                    <p className="text-center text-6xl font-mono tracking-tighter text-foreground font-bold">
                        00 : 00 : 00
                    </p>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!isSupported) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Browser Not Supported</AlertTitle>
        <AlertDescription>
          Voice recognition and synthesis are not supported in this browser. Please try Chrome or Safari. The manual timer is still available.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 flex flex-col items-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <p className="text-center text-6xl font-mono tracking-tighter text-foreground font-bold">
            {formatTime(time)}
          </p>
        </CardContent>
      </Card>
      
      {isSupported && (
        <div className="flex flex-col items-center gap-4">
            {isOnline ? (
                <>
                    <Button onClick={toggleListen} variant={isListening ? 'destructive' : 'outline'} size="lg" className="w-48">
                    {isListening ? <Mic className="mr-2" /> : <MicOff className="mr-2" />}
                    {isListening ? 'Stop Listening' : 'Start Listening'}
                    </Button>
                    <p className={cn("text-sm text-muted-foreground transition-opacity", isListening ? 'opacity-100' : 'opacity-0')}>
                        Listening for commands...
                    </p>
                </>
            ) : (
                <div className="flex items-center gap-2 text-muted-foreground p-3 rounded-md bg-muted border">
                    <WifiOff className="h-5 w-5" />
                    <p className="text-sm">Voice control disabled while offline.</p>
                </div>
            )}
        </div>
      )}


      <div className="flex w-full max-w-md justify-center space-x-4">
        <Button onClick={handleStart} disabled={isActive} className="flex-1">Start</Button>
        <Button onClick={handleStop} disabled={!isActive} className="flex-1">Pause</Button>
        <Button onClick={handleReset} variant="secondary" className="flex-1">Reset</Button>
      </div>
    </div>
  );
}
