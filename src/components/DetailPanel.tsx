
import React, { useEffect } from 'react';
import { TreeNodeData } from '@/utils/treeData';
import { useMqttConnection } from '@/hooks/useMqttConnection';
import NodeHeader from './detail-panel/NodeHeader';
import NodeDescription from './detail-panel/NodeDescription';
import MetricsDisplay from './detail-panel/MetricsDisplay';
import ChildNodes from './detail-panel/ChildNodes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface DetailPanelProps {
  selectedNode: TreeNodeData | null;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ selectedNode }) => {
  // Determine if we need to use secure protocols based on the current page protocol
  const isSecure = typeof window !== 'undefined' && window.location.protocol === 'https:';
  
  const mqttConfig = {
    host: 'broker.hivemq.com', // Changed to HiveMQ public broker which is more reliable
    port: isSecure ? 8884 : 1883, // Use WebSocket secure port when on HTTPS
    clientId: `plant-monitor-${Math.random().toString(16).slice(2)}`,
    protocol: isSecure ? 'wss' : 'ws' // Always use WebSocket for browser compatibility
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

  // Extract the relevant data based on node type
  if (nodeData) {
    // Only display the data that's relevant to the current node type
    if (type === 'planthead') {
      displayMetrics = { ...nodeData };
    } 
    else if (type === 'dashboard') {
      displayMetrics = { ...nodeData };
    }
    else if (type === 'sensor' && name.includes('VIBRATION')) {
      displayMetrics = { ...nodeData };
    }
    else if (type === 'sensor' && name.includes('CURRENT')) {
      displayMetrics = { ...nodeData };
    }
    else if (type === 'sensor' && name.includes('TEMPERATURE')) {
      displayMetrics = { ...nodeData };
    }
    else if (type === 'sensor' && name.includes('PRESSURE')) {
      displayMetrics = { ...nodeData };
    }
    else if (type === 'location' || type === 'building' || type === 'company') {
      // For higher-level nodes, we display a summary
      displayMetrics = { ...displayMetrics, ...nodeData };
    }
  }

  return (
    <div className="h-full overflow-y-auto p-4 animate-in">
      <NodeHeader node={selectedNode} />
      
      {isConnected ? (
        <div className="mb-4 text-sm text-green-600 dark:text-green-400 text-center py-1 bg-green-50 dark:bg-green-900/20 rounded-md">
          Connected to broker
        </div>
      ) : (
        <div className="mb-4 text-sm text-yellow-600 dark:text-yellow-400 text-center py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
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
