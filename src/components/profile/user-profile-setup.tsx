
'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { UserProfile } from '@/lib/types';

const profileSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty.'),
  height: z.coerce.number().positive('Height must be positive').optional(),
  weight: z.coerce.number().positive('Weight must be positive').optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

type UserProfileSetupProps = {
  userProfile: UserProfile;
  onSave: (data: Partial<UserProfile>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showTrigger?: boolean;
};

export function UserProfileSetup({
  userProfile,
  onSave,
  open,
  onOpenChange,
  showTrigger = false,
}: UserProfileSetupProps) {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userProfile.name,
      height: userProfile.height || undefined,
      weight: userProfile.weight || undefined,
      gender: userProfile.gender || undefined,
    },
  });

  // When the dialog opens, reset the form with the latest userProfile data
  useEffect(() => {
    if (open) {
      form.reset({
        name: userProfile.name,
        height: userProfile.height || undefined,
        weight: userProfile.weight || undefined,
        gender: userProfile.gender || undefined,
      });
    }
  }, [open, userProfile, form]);

  const onSubmit = (data: ProfileFormValues) => {
    onSave(data);
    onOpenChange(false);
    toast({
      title: 'Profile Updated',
      description: 'Your information has been saved.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button>Edit Profile</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {userProfile.height ? 'Edit Profile' : 'Welcome, Hunter!'}
          </DialogTitle>
          <DialogDescription>
            Personalize your training experience.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sung Jinwoo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (cm)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 180" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 75" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
