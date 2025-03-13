
import { useState, useEffect, useCallback } from 'react';
import mqtt, { MqttClient, IClientOptions, MqttProtocol } from 'mqtt';
import { toast } from "sonner";

interface MqttConfig {
  host: string;
  port: number;
  clientId: string;
  username?: string;
  password?: string;
  protocol?: string;
}

export const useMqttConnection = (config: MqttConfig) => {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [sensorData, setSensorData] = useState<Record<string, any>>({});
  const [isConnected, setIsConnected] = useState(false);

  // Connect to MQTT broker
  useEffect(() => {
    const { host, port, clientId, username, password, protocol = 'mqtt' } = config;
    
    // Handle WebSocket protocol for HTTPS sites
    let websocketProtocol: 'ws' | 'wss' = 'ws';
    if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
      websocketProtocol = 'wss';
    }
    
    // Determine the correct URL based on the provided protocol and environment
    let url: string;
    if (protocol === 'ws' || protocol === 'wss') {
      url = `${websocketProtocol}://${host}:${port}/mqtt`;
    } else {
      url = `${protocol}://${host}:${port}`;
    }
    
    console.log(`Connecting to MQTT broker at ${url}`);
    
    // Create proper MQTT client options with typed protocol
    const mqttProtocol = protocol as MqttProtocol;
    
    const mqttOptions: IClientOptions = {
      clientId,
      protocol: mqttProtocol,
      keepalive: 30,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
    };
    
    // Add optional auth credentials if provided
    if (username) mqttOptions.username = username;
    if (password) mqttOptions.password = password;
    
    // Connect to the broker
    const mqttClient = mqtt.connect(url, mqttOptions);

    mqttClient.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to MQTT broker');
      toast.success('Connected to broker');
    });

    mqttClient.on('error', (err) => {
      console.error('MQTT connection error:', err);
      toast.error('Connection issue with MQTT broker');
    });

    mqttClient.on('message', (topic, message) => {
      try {
        // Generate sample data for demonstration if no proper JSON received
        let data;
        try {
          data = JSON.parse(message.toString());
        } catch (e) {
          // If parsing fails, generate sample data based on topic
          const topicParts = topic.split('/');
          const nodeType = topicParts[topicParts.length - 1];
          
          // Generate sample data based on node type
          if (nodeType === 'Dashboard') {
            data = {
              "Batch Info": `Batch_${Math.floor(Math.random() * 9000) + 1000}`,
              "ALARMS": ["None", "High Temp", "Low Pressure"][Math.floor(Math.random() * 3)],
              "Set Points": parseFloat((Math.random() * 5 + 20).toFixed(2))
            };
          } else if (nodeType === 'PLANT_HEAD') {
            data = {
              "Status": ["Online", "Maintenance", "Standby"][Math.floor(Math.random() * 3)],
              "Runtime": `${Math.floor(Math.random() * 1000)} hours`,
              "Efficiency": `${Math.floor(Math.random() * 20) + 80}%`
            };
          } else if (nodeType === 'VIBRATION') {
            data = {
              "Vibration Level": `${(Math.random() * 10).toFixed(2)} mm/s`,
              "Frequency": `${Math.floor(Math.random() * 60) + 40} Hz`,
              "Alert Level": ["Normal", "Warning", "Critical"][Math.floor(Math.random() * 3)]
            };
          } else if (nodeType === 'CURRENT') {
            data = {
              "Current": `${(Math.random() * 30 + 10).toFixed(2)} A`,
              "Voltage": `${Math.floor(Math.random() * 50) + 200} V`,
              "Power": `${Math.floor(Math.random() * 5000) + 8000} W`
            };
          } else if (nodeType === 'TEMPERATURE') {
            data = {
              "Temperature": `${(Math.random() * 10 + 20).toFixed(1)} °C`,
              "Humidity": `${Math.floor(Math.random() * 30) + 40}%`,
              "Air Quality": ["Good", "Moderate", "Poor"][Math.floor(Math.random() * 3)]
            };
          } else if (nodeType === 'PRESSURE') {
            data = {
              "Pressure": `${(Math.random() * 5 + 10).toFixed(2)} bar`,
              "Flow Rate": `${Math.floor(Math.random() * 100) + 50} L/min`,
              "Valve Status": ["Open", "Partially Open", "Closed"][Math.floor(Math.random() * 3)]
            };
          }
        }

        console.log(`Received message on topic ${topic}:`, data);
        
        setSensorData(prev => ({
          ...prev,
          [topic]: data
        }));
      } catch (error) {
        console.error('Error processing MQTT message:', error);
      }
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, [config]);

  // Subscribe to topics
  const subscribe = useCallback((topic: string) => {
    if (client && isConnected) {
      console.log(`Subscribing to topic: ${topic}`);
      client.subscribe(topic, (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log(`Successfully subscribed to ${topic}`);
          
          // Publish a test message to the topic to trigger data generation
          client.publish(topic, JSON.stringify({ test: true }));
        }
      });
    }
  }, [client, isConnected]);

  // Unsubscribe from topics
  const unsubscribe = useCallback((topic: string) => {
    if (client && isConnected) {
      client.unsubscribe(topic);
      setSensorData(prev => {
        const newData = { ...prev };
        delete newData[topic];
        return newData;
      });
    }
  }, [client, isConnected]);

  return {
    isConnected,
    sensorData,
    subscribe,
    unsubscribe
  };
};
