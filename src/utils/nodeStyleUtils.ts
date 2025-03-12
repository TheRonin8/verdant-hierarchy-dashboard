
import { Building, Building2, Cpu, Flower2, Globe, LayoutDashboard } from 'lucide-react';

export const getNodeIcon = (type: string, className = 'h-5 w-5') => {
  switch (type) {
    case 'company':
      return <Building2 className={className} />;
    case 'location':
      return <Globe className={className} />;
    case 'building':
      return <Building className={className} />;
    case 'sensor':
      return <Cpu className={className} />;
    case 'dashboard':
      return <LayoutDashboard className={className} />;
    case 'planthead':
      return <Flower2 className={className} />;
    default:
      return null;
  }
};

export const getTypeLabel = (type: string) => {
  switch (type) {
    case 'company':
      return 'Company';
    case 'location':
      return 'Location';
    case 'building':
      return 'Building';
    case 'sensor':
      return 'Sensor Network';
    case 'dashboard':
      return 'Dashboard';
    case 'planthead':
      return 'Plant Health';
    case 'data':
      return 'Data';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};

export const getNodeBgColor = (type: string) => {
  switch (type) {
    case 'company':
      return 'from-blue-500/5 to-blue-500/10';
    case 'location':
      return 'from-indigo-500/5 to-indigo-500/10';
    case 'building':
      return 'from-purple-500/5 to-purple-500/10';
    case 'sensor':
      return 'from-green-500/5 to-green-500/10';
    case 'dashboard':
      return 'from-orange-500/5 to-orange-500/10';
    case 'planthead':
      return 'from-emerald-500/5 to-emerald-500/10';
    default:
      return 'from-gray-500/5 to-gray-500/10';
  }
};

export const getNodeTextColor = (type: string) => {
  switch (type) {
    case 'company':
      return 'text-blue-600 dark:text-blue-400';
    case 'location':
      return 'text-indigo-600 dark:text-indigo-400';
    case 'building':
      return 'text-purple-600 dark:text-purple-400';
    case 'sensor':
      return 'text-green-600 dark:text-green-400';
    case 'dashboard':
      return 'text-orange-600 dark:text-orange-400';
    case 'planthead':
      return 'text-emerald-600 dark:text-emerald-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};
