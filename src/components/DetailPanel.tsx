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
  // Determine if we need to use secure protocols based on the current page protocol
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  
  const mqttConfig = {
    host: 'broker.emqx.io',
    port: isSecure ? 8084 : 1883, // Use WebSocket secure port when on HTTPS
    clientId: `plant-monitor-${Math.random().toString(16).slice(2)}`,
    protocol: isSecure ? 'wss' : 'mqtt' // Use WebSocket secure when on HTTPS
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
  
  const { details, type, mqttTopic, name } = selectedNode;
  const realtimeData = mqttTopic && sensorData[mqttTopic] ? sensorData[mqttTopic] : null;

  // Process metrics based on node type and received data
  let displayMetrics: Record<string, string | number> = {};
  
  // Start with any existing metrics
  if (details?.metrics) {
    displayMetrics = { ...details.metrics };
  }

  // Process MQTT data based on node type and name
  if (realtimeData) {
    // Logic to display only the specific node data
    const nodeName = name.toUpperCase();
    
    // Handle data types based on node name
    if (nodeName.includes('PLANT_HEAD') || nodeName === 'PLANT HEAD') {
      if (realtimeData.PLANT_HEAD) {
        displayMetrics = { ...realtimeData.PLANT_HEAD };
      } else if (typeof realtimeData === 'object') {
        // If the data is directly for plant head
        displayMetrics = { ...realtimeData };
      }
    } 
    else if (nodeName.includes('DASHBOARD')) {
      if (realtimeData.Dashboard) {
        displayMetrics = { ...realtimeData.Dashboard };
      } else if (typeof realtimeData === 'object') {
        // If the data is directly for dashboard
        displayMetrics = { ...realtimeData };
      }
    }
    else if (nodeName.includes('VIBRATION')) {
      if (realtimeData.VIBRATION) {
        displayMetrics = { ...realtimeData.VIBRATION };
      } else if (typeof realtimeData === 'object') {
        // If the data is directly for vibration
        displayMetrics = { ...realtimeData };
      }
    }
    else if (nodeName.includes('CURRENT')) {
      if (realtimeData.CURRENT) {
        displayMetrics = { ...realtimeData.CURRENT };
      } else if (typeof realtimeData === 'object') {
        // If the data is directly for current
        displayMetrics = { ...realtimeData };
      }
    }
    else if (nodeName.includes('TEMPERATURE')) {
      if (realtimeData.TEMPERATURE) {
        displayMetrics = { ...realtimeData.TEMPERATURE };
      } else if (typeof realtimeData === 'object') {
        // If the data is directly for temperature
        displayMetrics = { ...realtimeData };
      }
    }
    else if (nodeName.includes('PRESSURE')) {
      if (realtimeData.PRESSURE) {
        displayMetrics = { ...realtimeData.PRESSURE };
      } else if (typeof realtimeData === 'object') {
        // If the data is directly for pressure
        displayMetrics = { ...realtimeData };
      }
    }
    // For other nodes (location, building), show all combined data
    else if (type === 'location' || type === 'building') {
      // For locations and buildings, keep the full data
      Object.entries(realtimeData).forEach(([key, value]) => {
        if (key !== 'timestamp' && typeof value === 'object' && value !== null) {
          // Skip nested objects since we're at the top level
          // displayMetrics[key] = `Contains data`;
        } else if (key !== 'timestamp') {
          displayMetrics[key] = value as string;
        }
      });
    }
  }

  return (
    <div className="h-full overflow-y-auto p-4 animate-in">
      <NodeHeader node={selectedNode} />
      
      {isConnected ? (
        <div className="mb-4 text-sm text-green-600 dark:text-green-400 animate-fade-in text-center py-1 bg-green-50 dark:bg-green-900/20 rounded-md">
          Connected to broker
        </div>
      ) : (
        <div className="mb-4 text-sm text-yellow-600 dark:text-yellow-400 animate-fade-in text-center py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
          Connecting to broker...
        </div>
      )}
      
      {details?.description && (
        <NodeDescription description={details.description} />
      )}
      
      {Object.keys(displayMetrics).length > 0 && (
        <MetricsDisplay 
          title={`${selectedNode.name} Data`}
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
