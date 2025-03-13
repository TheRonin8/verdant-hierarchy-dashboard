
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
    host: 'broker.emqx.io',
    port: 1883,
    clientId: `plant-monitor-${Math.random().toString(16).slice(2)}`,
    protocol: 'mqtt'
  };

  const { isConnected, sensorData, subscribe, unsubscribe } = useMqttConnection(mqttConfig);

  useEffect(() => {
    if (isConnected && selectedNode?.mqttTopic) {
      console.log(`Subscribing to topic ${selectedNode.mqttTopic}`);
      subscribe(selectedNode.mqttTopic);
      
      return () => {
        unsubscribe(selectedNode.mqttTopic!);
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
  
  const { details, type, mqttTopic } = selectedNode;
  const realtimeData = mqttTopic && sensorData[mqttTopic] ? sensorData[mqttTopic] : null;

  // Process metrics based on node type and received data
  let displayMetrics: Record<string, string | number> = {};
  
  // Start with any existing metrics
  if (details?.metrics) {
    displayMetrics = { ...details.metrics };
  }

  // Process MQTT data based on node type
  if (realtimeData) {
    switch (type) {
      case 'sensor':
        if (selectedNode.name.includes('Vibration')) {
          Object.entries(realtimeData).forEach(([key, value]) => {
            if (key !== 'timestamp') {
              displayMetrics[key] = value as string;
            }
          });
        } else if (selectedNode.name.includes('Temperature')) {
          displayMetrics['Temperature'] = `${realtimeData.Temperature}°C`;
        } else if (selectedNode.name.includes('Pressure')) {
          displayMetrics['Pressure'] = `${realtimeData.Pressure} hPa`;
        } else if (selectedNode.name.includes('Current')) {
          Object.entries(realtimeData).forEach(([key, value]) => {
            if (key !== 'timestamp') {
              displayMetrics[key] = `${value}A`;
            }
          });
        }
        break;
      case 'dashboard':
        Object.entries(realtimeData).forEach(([key, value]) => {
          if (key !== 'timestamp') {
            displayMetrics[key] = value as string;
          }
        });
        break;
      case 'planthead':
        Object.entries(realtimeData).forEach(([key, value]) => {
          if (key !== 'timestamp') {
            displayMetrics[key] = value as string;
          }
        });
        break;
      default:
        break;
    }
  }

  return (
    <div className="h-full overflow-y-auto p-4 animate-in">
      <NodeHeader node={selectedNode} />
      
      {isConnected && mqttTopic ? (
        <p className="mb-4 text-sm text-green-600 dark:text-green-400 animate-fade-in">
          {realtimeData ? 
            `Receiving live data from ${mqttTopic} (Last update: ${new Date().toLocaleTimeString()})` : 
            `Waiting for data on topic ${mqttTopic}...`}
        </p>
      ) : (
        <p className="mb-4 text-sm text-yellow-600 dark:text-yellow-400 animate-fade-in">
          Not connected to MQTT broker. Check your connection settings.
        </p>
      )}
      
      {details?.description && (
        <NodeDescription description={details.description} />
      )}
      
      {Object.keys(displayMetrics).length > 0 && (
        <MetricsDisplay 
          title="Metrics" 
          description={realtimeData ? 'Real-time data' : 'Static metrics'}
          metrics={displayMetrics}
          isRealtime={!!realtimeData}
        />
      )}
      
      <ChildNodes node={selectedNode} />
    </div>
  );
};

export default DetailPanel;
