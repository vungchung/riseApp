import { Progress } from '@/components/ui/progress';

type XpBarProps = {
  value: number;
  label: string;
};

export function XpBar({ value, label }: XpBarProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-primary">XP</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <Progress value={value} className="h-3 [&>div]:bg-primary glow-primary" />
    </div>
  );
}
