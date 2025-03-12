
import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  if (!status) return null;
  
  const statusClasses: Record<string, string> = {
    'online': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 ring-1 ring-green-500/20',
    'offline': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 ring-1 ring-red-500/20',
    'warning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 ring-1 ring-yellow-500/20'
  };
  
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      statusClasses[status] || 'bg-gray-100 text-gray-800'
    )}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
