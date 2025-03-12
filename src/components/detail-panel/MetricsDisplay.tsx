
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricsDisplayProps {
  title: string;
  description?: string;
  metrics: Record<string, number | string>;
  isRealtime?: boolean;
}

const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ title, description, metrics, isRealtime }) => {
  if (!metrics || Object.keys(metrics).length === 0) {
    return null;
  }

  const colors = [
    'from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 text-blue-800 dark:text-blue-300',
    'from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/40 text-green-800 dark:text-green-300',
    'from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40 text-purple-800 dark:text-purple-300',
    'from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/40 text-orange-800 dark:text-orange-300',
    'from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/40 text-emerald-800 dark:text-emerald-300',
    'from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-indigo-900/40 text-indigo-800 dark:text-indigo-300',
  ];

  return (
    <Card className="mb-6 backdrop-blur-panel border-blue-100/50 dark:border-blue-900/30 hover:shadow-md hover:shadow-blue-100/20 dark:hover:shadow-blue-900/10 transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Object.entries(metrics).map(([key, value], index) => {
            const colorClass = colors[index % colors.length];
            
            return (
              <div 
                key={key} 
                className={`bg-gradient-to-br ${colorClass} rounded-lg p-4 hover:translate-y-[-2px] transition-all duration-200 hover:shadow-sm`}
              >
                <div className="text-muted-foreground text-xs mb-1">{key}</div>
                <div className="text-lg font-medium">{value}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsDisplay;
