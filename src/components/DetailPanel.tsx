import React, { useEffect } from 'react';
import { TreeNodeData } from '@/utils/treeData';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Building2, Cpu, Flower2, Globe, LayoutDashboard } from 'lucide-react';
import { useMqttConnection } from '@/hooks/useMqttConnection';

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

const getNodeBgColor = (type: string) => {
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

const getNodeTextColor = (type: string) => {
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

const DetailPanel: React.FC<DetailPanelProps> = ({ selectedNode }) => {
  const mqttConfig = {
    host: 'localhost',
    port: 8083,
    clientId: `plant-monitor-${Math.random().toString(16).slice(2)}`,
  };

  const { isConnected, sensorData, subscribe, unsubscribe } = useMqttConnection(mqttConfig);

  useEffect(() => {
    if (isConnected && selectedNode?.type === 'sensor') {
      const topic = `sensors/${selectedNode.id}/data`;
      subscribe(topic);
      
      return () => {
        unsubscribe(topic);
      };
    }
  }, [isConnected, selectedNode, subscribe, unsubscribe]);

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
  const bgGradient = getNodeBgColor(type);
  const textColor = getNodeTextColor(type);

  const sensorTopic = `sensors/${selectedNode.id}/data`;
  const realtimeData = type === 'sensor' ? sensorData[sensorTopic] : null;

  const displayMetrics = realtimeData && type === 'sensor'
    ? {
        ...details?.metrics,
        ...(realtimeData.temperature && { 'Temperature': `${realtimeData.temperature}°C` }),
        ...(realtimeData.humidity && { 'Humidity': `${realtimeData.humidity}%` }),
        ...(realtimeData.co2 && { 'CO2 Level': `${realtimeData.co2}ppm` }),
        ...(realtimeData.lightLevel && { 'Light Level': `${realtimeData.lightLevel}%` }),
      }
    : details?.metrics;

  return (
    <div className="h-full overflow-y-auto p-4 animate-in">
      <div className={`flex items-center space-x-3 mb-6 animate-fade-in p-4 rounded-lg bg-gradient-to-r ${bgGradient}`}>
        <div className={`rounded-full bg-white/80 dark:bg-gray-800/80 p-2 ${textColor}`}>
          {icon}
        </div>
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            {name}
            {details?.status && getStatusBadge(details.status)}
          </h1>
          <p className={`text-sm ${textColor}`}>{typeLabel}</p>
        </div>
      </div>
      
      {details?.lastActive && (
        <p className="mb-4 text-sm text-muted-foreground animate-fade-in">
          Last Active: {realtimeData ? new Date(realtimeData.timestamp).toLocaleString() : details.lastActive}
        </p>
      )}
      
      {details?.description && (
        <Card className="mb-6 backdrop-blur-panel border-green-100/50 dark:border-green-900/30 hover:shadow-md hover:shadow-green-100/20 dark:hover:shadow-green-900/10 transition-all duration-300 animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{details.description}</p>
          </CardContent>
        </Card>
      )}
      
      {displayMetrics && Object.keys(displayMetrics).length > 0 && (
        <Card className="mb-6 backdrop-blur-panel border-blue-100/50 dark:border-blue-900/30 hover:shadow-md hover:shadow-blue-100/20 dark:hover:shadow-blue-900/10 transition-all duration-300 animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Metrics</CardTitle>
            <CardDescription>
              {type === 'sensor' && isConnected ? 'Real-time sensor data' : 'Key performance indicators'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {Object.entries(displayMetrics).map(([key, value], index) => {
                const colors = [
                  'from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/40 text-blue-800 dark:text-blue-300',
                  'from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/40 text-green-800 dark:text-green-300',
                  'from-purple-50 to-purple-100 dark:from-purple-950/40 dark:to-purple-900/40 text-purple-800 dark:text-purple-300',
                  'from-orange-50 to-orange-100 dark:from-orange-950/40 dark:to-orange-900/40 text-orange-800 dark:text-orange-300',
                  'from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/40 text-emerald-800 dark:text-emerald-300',
                  'from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-indigo-900/40 text-indigo-800 dark:text-indigo-300',
                ];
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
      )}
      
      {selectedNode.children && selectedNode.children.length > 0 && (
        <Card className="backdrop-blur-panel border-indigo-100/50 dark:border-indigo-900/30 hover:shadow-md hover:shadow-indigo-100/20 dark:hover:shadow-indigo-900/10 transition-all duration-300 animate-fade-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {selectedNode.children.length} {selectedNode.children.length === 1 ? 'Child' : 'Children'}
            </CardTitle>
            <CardDescription>Items contained within this {typeLabel.toLowerCase()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {selectedNode.children.map((child) => {
                const childTextColor = getNodeTextColor(child.type);
                const childBgColor = getNodeBgColor(child.type);
                
                return (
                  <div 
                    key={child.id} 
                    className={`flex items-center space-x-2 p-3 rounded-md bg-gradient-to-r ${childBgColor} hover:translate-x-1 cursor-pointer transition-all duration-200`}
                  >
                    <div className={childTextColor}>
                      {getNodeIcon(child.type)}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{child.name}</div>
                      <div className={`text-xs ${childTextColor}`}>{getTypeLabel(child.type)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DetailPanel;
