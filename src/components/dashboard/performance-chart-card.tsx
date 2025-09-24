'use client';

import { Line, LineChart, CartesianGrid, XAxis, Tooltip } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig
} from '@/components/ui/chart';
import { LineChart as LucideLineChart } from 'lucide-react';

const chartData = [
  { week: 'Week 1', memoryScore: 82, patternScore: 75 },
  { week: 'Week 2', memoryScore: 85, patternScore: 78 },
  { week: 'Week 3', memoryScore: 80, patternScore: 82 },
  { week: 'Week 4', memoryScore: 88, patternScore: 80 },
  { week: 'Week 5', memoryScore: 86, patternScore: 85 },
  { week: 'Week 6', memoryScore: 90, patternScore: 88 },
];

const chartConfig = {
  memoryScore: {
    label: 'Memory Score',
    color: 'hsl(var(--primary))',
  },
  patternScore: {
    label: 'Pattern Score',
    color: 'hsl(var(--accent-foreground))',
  },
} satisfies ChartConfig;

export function PerformanceChartCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <LucideLineChart className="h-5 w-5 text-primary" />
            <span>Performance Trends</span>
        </CardTitle>
        <CardDescription>
          Your cognitive task scores over the last 6 weeks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 6)}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent hideIndicator />}
            />
            <Line
              dataKey="memoryScore"
              type="natural"
              stroke="var(--color-memoryScore)"
              strokeWidth={2}
              dot={true}
            />
            <Line
              dataKey="patternScore"
              type="natural"
              stroke="var(--color-patternScore)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
