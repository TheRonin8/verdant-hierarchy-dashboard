
import React from 'react';
import { TreeNodeData } from '@/utils/treeData';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Building2, Cpu, Flower2, Globe, LayoutDashboard } from 'lucide-react';

interface DetailPanelProps {
  selectedNode: TreeNodeData | null;
}

const getNodeIcon = (type: string, className = 'h-5 w-5') => {
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

const getTypeLabel = (type: string) => {
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

const getStatusBadge = (status?: string) => {
  if (!status) return null;
  
  const statusClasses: Record<string, string> = {
    'online': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    'offline': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    'warning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
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

const DetailPanel: React.FC<DetailPanelProps> = ({ selectedNode }) => {
  if (!selectedNode) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p>Select an item from the tree to view details</p>
        </div>
      </div>
    );
  }
  
  const { name, type, details } = selectedNode;
  const icon = getNodeIcon(type, 'h-6 w-6');
  const typeLabel = getTypeLabel(type);
  
  return (
    <div className="h-full overflow-y-auto p-4 animate-in">
      <div className="flex items-center space-x-3 mb-6 animate-fade-in">
        <div className="rounded-full bg-primary/10 p-2 text-primary">
          {icon}
        </div>
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            {name}
            {details?.status && getStatusBadge(details.status)}
          </h1>
          <p className="text-muted-foreground">{typeLabel}</p>
        </div>
      </div>
      
      {details?.lastActive && (
        <p className="mb-4 text-sm text-muted-foreground animate-fade-in">
          Last Active: {details.lastActive}
        </p>
      )}
      
      {details?.description && (
        <Card className="mb-6 backdrop-blur-panel hover:shadow-md transition-all duration-300 animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{details.description}</p>
          </CardContent>
        </Card>
      )}
      
      {details?.metrics && Object.keys(details.metrics).length > 0 && (
        <Card className="mb-6 backdrop-blur-panel hover:shadow-md transition-all duration-300 animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {Object.entries(details.metrics).map(([key, value]) => (
                <div key={key} className="bg-secondary/50 rounded-lg p-4 hover:bg-secondary/70 hover:translate-y-[-2px] transition-all duration-200">
                  <div className="text-muted-foreground text-xs mb-1">{key}</div>
                  <div className="text-lg font-medium">{value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {selectedNode.children && selectedNode.children.length > 0 && (
        <Card className="backdrop-blur-panel hover:shadow-md transition-all duration-300 animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {selectedNode.children.length} {selectedNode.children.length === 1 ? 'Child' : 'Children'}
            </CardTitle>
            <CardDescription>Items contained within this {typeLabel.toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {selectedNode.children.map((child) => (
                <div 
                  key={child.id} 
                  className="flex items-center space-x-2 p-2 rounded-md bg-secondary/50 hover:bg-secondary/70 hover:translate-x-1 cursor-pointer transition-all duration-200"
                >
                  <div className="text-muted-foreground">
                    {getNodeIcon(child.type)}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{child.name}</div>
                    <div className="text-xs text-muted-foreground">{getTypeLabel(child.type)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DetailPanel;
