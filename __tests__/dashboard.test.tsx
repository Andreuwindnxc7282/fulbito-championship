import { render, screen } from '@testing-library/react'
import { Dashboard } from '@/components/dashboard'

// Mock the components that Dashboard uses
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => <div data-testid="card" {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div data-testid="card-content" {...props}>{children}</div>,
  CardDescription: ({ children, ...props }: any) => <div data-testid="card-description" {...props}>{children}</div>,
  CardHeader: ({ children, ...props }: any) => <div data-testid="card-header" {...props}>{children}</div>,
  CardTitle: ({ children, ...props }: any) => <div data-testid="card-title" {...props}>{children}</div>,
}))

jest.mock('@/components/ui/chart', () => ({
  ChartContainer: ({ children, ...props }: any) => <div data-testid="chart-container" {...props}>{children}</div>,
  ChartTooltip: ({ ...props }: any) => <div data-testid="chart-tooltip" {...props}></div>,
  ChartTooltipContent: ({ ...props }: any) => <div data-testid="chart-tooltip-content" {...props}></div>,
}))

jest.mock('recharts', () => ({
  Bar: ({ ...props }: any) => <div data-testid="bar-chart" {...props}></div>,
  BarChart: ({ children, ...props }: any) => <div data-testid="bar-chart" {...props}>{children}</div>,
  XAxis: ({ ...props }: any) => <div data-testid="x-axis" {...props}></div>,
  YAxis: ({ ...props }: any) => <div data-testid="y-axis" {...props}></div>,
  ResponsiveContainer: ({ children, ...props }: any) => <div data-testid="responsive-container" {...props}>{children}</div>,
}))

const mockDashboardData = {
  totalTeams: 8,
  totalPlayers: 120,
  totalMatches: 28,
  upcomingMatches: 4,
  recentMatches: [
    {
      id: 1,
      home_team: { name: 'Team A' },
      away_team: { name: 'Team B' },
      home_score: 2,
      away_score: 1,
      date: '2025-02-08',
      status: 'completed'
    }
  ],
  topScorers: [
    {
      id: 1,
      name: 'John Doe',
      goals: 15,
      team: { name: 'Team A' }
    }
  ]
}