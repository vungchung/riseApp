'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

type WorkoutChartProps = {
  data: { day: string; workouts: number }[];
};

export function WorkoutChart({ data }: WorkoutChartProps) {
  return (
    <ChartContainer
      config={{
        workouts: {
          label: 'Workouts',
          color: 'hsl(var(--primary))',
        },
      }}
      className="h-[250px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} tickMargin={8} />
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" hideLabel />}
          />
          <Bar dataKey="workouts" fill="hsl(var(--primary))" radius={8} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
