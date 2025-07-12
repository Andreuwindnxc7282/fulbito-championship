import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SimpleChartProps {
  title: string;
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  type?: 'bar' | 'donut';
}

const SimpleChart: React.FC<SimpleChartProps> = ({ 
  title, 
  data, 
  type = 'bar' 
}) => {
  const maxValue = Math.max(...data.map(item => item.value));

  if (type === 'bar') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="min-w-[100px] text-sm font-medium">
                  {item.label}
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        item.color || 'bg-blue-500'
                      }`}
                      style={{
                        width: `${(item.value / maxValue) * 100}%`
                      }}
                    />
                  </div>
                </div>
                <div className="min-w-[40px] text-sm font-bold text-right">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Donut chart implementation
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulatedAngle = 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-6">
          <div className="relative">
            <svg width="120" height="120" className="transform -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="10"
              />
              {data.map((item, index) => {
                const angle = (item.value / total) * 360;
                const strokeDasharray = `${(angle / 360) * 314} 314`;
                const strokeDashoffset = -accumulatedAngle * (314 / 360);
                accumulatedAngle += angle;

                return (
                  <circle
                    key={index}
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={item.color || `hsl(${index * 60}, 70%, 50%)`}
                    strokeWidth="10"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{total}</div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: item.color || `hsl(${index * 60}, 70%, 50%)`
                  }}
                />
                <div className="text-sm">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-gray-500 ml-2">({item.value})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Componente para integrar fácilmente en el dashboard
const DashboardCharts: React.FC = () => {
  // Datos de ejemplo - estos vendrían de tu API
  const topScorerData = [
    { label: "Carlos Ruiz", value: 8, color: "bg-yellow-500" },
    { label: "Diego López", value: 6, color: "bg-blue-500" },
    { label: "Ana García", value: 5, color: "bg-green-500" },
    { label: "Miguel Torres", value: 4, color: "bg-red-500" },
    { label: "Sofia Mendez", value: 3, color: "bg-purple-500" }
  ];

  const teamStatsData = [
    { label: "Victorias", value: 15, color: "#10b981" },
    { label: "Empates", value: 5, color: "#f59e0b" },
    { label: "Derrotas", value: 8, color: "#ef4444" }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <SimpleChart 
        title="Top Goleadores" 
        data={topScorerData} 
        type="bar"
      />
      <SimpleChart 
        title="Resultados del Torneo" 
        data={teamStatsData} 
        type="donut"
      />
    </div>
  );
};

export { SimpleChart, DashboardCharts };
