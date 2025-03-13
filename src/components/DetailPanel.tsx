
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
        if (selectedNode?.mqttTopic) {
          unsubscribe(selectedNode.mqttTopic);
        }
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
  
  const { details, mqttTopic, name, type } = selectedNode;
  
  // Get only data specific to the current node's topic
  const nodeData = mqttTopic && sensorData[mqttTopic] ? sensorData[mqttTopic] : null;
  
  // Process metrics based on node type and received data
  let displayMetrics: Record<string, string | number> = {};
  
  // Start with any existing static metrics from the tree data
  if (details?.metrics) {
    displayMetrics = { ...details.metrics };
  }

  // Add the MQTT data if available
  if (nodeData) {
    console.log("Node data received:", nodeData);
    
    // Display only data relevant to this specific node
    if (type === 'planthead' && nodeData.PLANT_HEAD) {
      displayMetrics = { ...displayMetrics, ...nodeData.PLANT_HEAD };
    } 
    else if (type === 'dashboard' && nodeData.Dashboard) {
      displayMetrics = { ...displayMetrics, ...nodeData.Dashboard };
    }
    else if (type === 'sensor' && name.includes('VIBRATION') && nodeData.VIBRATION) {
      displayMetrics = { ...displayMetrics, ...nodeData.VIBRATION };
    }
    else if (type === 'sensor' && name.includes('CURRENT') && nodeData.CURRENT) {
      displayMetrics = { ...displayMetrics, ...nodeData.CURRENT };
    }
    else if (type === 'sensor' && name.includes('TEMPERATURE') && nodeData.TEMPERATURE) {
      displayMetrics = { ...displayMetrics, ...nodeData.TEMPERATURE };
    }
    else if (type === 'sensor' && name.includes('PRESSURE') && nodeData.PRESSURE) {
      displayMetrics = { ...displayMetrics, ...nodeData.PRESSURE };
    }
    // If the node-specific data isn't found, but we have a flat structure
    else if (typeof nodeData === 'object' && nodeData !== null) {
      // For specific node types, only show their relevant data
      if (type === 'sensor' || type === 'planthead' || type === 'dashboard') {
        // Attempt to match the name with data keys
        const nodeName = name.toUpperCase().replace(/\s+/g, '_');
        
        // Direct data display
        displayMetrics = { ...displayMetrics, ...nodeData };
      } 
      // For location and building nodes, show all data
      else if (type === 'location' || type === 'building' || type === 'company') {
        displayMetrics = { ...displayMetrics, ...nodeData };
      }
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
          description={nodeData ? 'Real-time data' : 'Static metrics'}
          metrics={displayMetrics}
          isRealtime={!!nodeData}
        />
      )}
      
      <ChildNodes node={selectedNode} />
    </div>
  );
};

export default DetailPanel;
