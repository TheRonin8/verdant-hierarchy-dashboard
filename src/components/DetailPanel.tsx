
import React, { useEffect } from 'react';
import { TreeNodeData } from '@/utils/treeData';
import { useMqttConnection } from '@/hooks/useMqttConnection';
import NodeHeader from './detail-panel/NodeHeader';
import NodeDescription from './detail-panel/NodeDescription';
import MetricsDisplay from './detail-panel/MetricsDisplay';
import ChildNodes from './detail-panel/ChildNodes';

interface DetailPanelProps {
  selectedNode: TreeNodeData | null;
}

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
  
  const { details, type } = selectedNode;
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
      <NodeHeader node={selectedNode} />
      
      {details?.lastActive && (
        <p className="mb-4 text-sm text-muted-foreground animate-fade-in">
          Last Active: {realtimeData ? new Date(realtimeData.timestamp).toLocaleString() : details.lastActive}
        </p>
      )}
      
      {details?.description && (
        <NodeDescription description={details.description} />
      )}
      
      {displayMetrics && Object.keys(displayMetrics).length > 0 && (
        <MetricsDisplay 
          title="Metrics" 
          description={type === 'sensor' && isConnected ? 'Real-time sensor data' : 'Key performance indicators'}
          metrics={displayMetrics}
          isRealtime={type === 'sensor' && isConnected}
        />
      )}
      
      <ChildNodes node={selectedNode} />
    </div>
  );
};

export default DetailPanel;
