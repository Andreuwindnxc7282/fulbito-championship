import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Trophy, Target } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  className = "" 
}) => {
  return (
    <Card className={`transition-all duration-300 hover:shadow-lg hover:scale-105 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <TrendingUp 
              className={`h-4 w-4 ${
                trend.isPositive ? 'text-green-500' : 'text-red-500'
              }`} 
            />
            <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
            <span>vs último mes</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface EnhancedStatsProps {
  stats: {
    totalTeams: number;
    totalMatches: number;
    totalGoals: number;
    activePlayer: number;
  };
}

const EnhancedStats: React.FC<EnhancedStatsProps> = ({ stats }) => {
  const statsConfig = [
    {
      title: "Total de Equipos",
      value: stats.totalTeams,
      icon: <Users className="h-4 w-4" />,
      trend: { value: 12, isPositive: true },
      className: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
    },
    {
      title: "Partidos Jugados",
      value: stats.totalMatches,
      icon: <Trophy className="h-4 w-4" />,
      trend: { value: 8, isPositive: true },
      className: "bg-gradient-to-br from-green-50 to-green-100 border-green-200"
    },
    {
      title: "Goles Anotados",
      value: stats.totalGoals,
      icon: <Target className="h-4 w-4" />,
      trend: { value: 15, isPositive: true },
      className: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
    },
    {
      title: "Jugadores Activos",
      value: stats.activePlayer,
      icon: <Users className="h-4 w-4" />,
      trend: { value: 5, isPositive: true },
      className: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          className={stat.className}
        />
      ))}
    </div>
  );
};

export default EnhancedStats;
